import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Calendar, ChevronDown, CheckCircle2, XCircle, MoreVertical, Edit2, Trash2, ArrowUpRight, Upload, TrendingUp, TrendingDown, MessageSquare, Building2, Users, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { propertyService, dashboardService } from '../services/api';
import PropertyViewModal from '../../admin/pages/properties/PropertyViewModal';
import ReadMore from '../../admin/components/ReadMore';
import DateRangeDropdown from '../../components/DateRangeDropdown';
import Pagination from '../../admin/components/Pagination';

const TIME_SLOTS = (() => {
  const slots = [];
  const periods = ['AM', 'PM'];
  for (let p = 0; p < 2; p++) {
    for (let h = 0; h < 12; h++) {
      const hour = h === 0 ? 12 : h;
      slots.push(`${hour}:00 ${periods[p]}`);
      slots.push(`${hour}:30 ${periods[p]}`);
    }
  }
  return slots;
})();

const parseNumber = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return '';
  const parsed = parseFloat(String(val).replace(/[^\d.-]/g, ''));
  return isNaN(parsed) ? '' : parsed;
};

const getEntityId = (value) => {
  if (!value) return '';
  if (typeof value === 'object') return String(value._id || value.id || '');
  return String(value);
};

const getLocationName = (value, keys = []) => {
  if (!value || typeof value !== 'object') return '';
  for (const key of keys) {
    if (value[key]) return value[key];
  }
  return value.name || '';
};

const isValidExperience = (exp) => {
  const name = String(exp?.experienceName || exp?.name || '').trim();
  return name && !/^\d+$/.test(name);
};

const sanitizeCoordinateInput = (val, isLat) => {
  if (val === null || val === undefined || val === '') return undefined;
  let num = Number(val);
  if (isNaN(num)) return undefined;
  
  const limit = isLat ? 90 : 180;
  if (Math.abs(num) > limit) {
    let temp = num;
    while (Math.abs(temp) > limit) {
      temp = temp / 10;
    }
    num = temp;
  }
  return num;
};

const formatCoordinateInput = (val, isLat) => {
  const normalized = sanitizeCoordinateInput(val, isLat);
  if (normalized === undefined) return '';
  return String(Number(normalized.toFixed(7))).replace(/\.0$/, '');
};

const API_BASE = import.meta.env.VITE_API_BASE || `${import.meta.env.VITE_API_BASE}`;

export default function MyProperties({ autoOpenForm = false }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ─── Form State ───────────────────────────────────────────
  const [formData, setFormData] = useState({
    type: 'Homestay',
    name: '',
    ownerContact: '',
    // Location - cascading
    countryId: '',
    countryName: '',
    stateId: '',
    stateName: '',
    cityId: '',
    cityName: '',
    locationId: '',
    locationName: '',
    full_address: '',
    latitude: '',
    longitude: '',
    // Pricing
    originalPrice: '',
    price: '',
    taxAmount: '',
    // Details
    area: '31 sq. ft.',
    bedRooms: 1,
    beds: 2,
    capacity: 3,
    bathRooms: 1,
    // Times & Rules
    checkIn: '3:00 PM',
    checkOut: '12:00 PM',
    rules: '',
    description: '',
    status: 'Active',
    // --- Type-Specific Details ---
    privatePool: false, gardenArea: false, chefAvailable: false, entirePropertyOnly: false, securityCCTV: false, numberOfFloors: '', plotSize: '',
    restaurantOnSite: false, spaWellness: false, conferenceRoom: false, roomService: false, receptionAllDay: false, liftElevator: false, starRating: '', totalRooms: '', totalFloors: '', activities: [],
    floorNumber: '', totalFloorsBuilding: '', furnishedStatus: '', washingMachine: false, societyAmenities: [],
    bonfireArea: false, viewType: '', outdoorSeating: false, nearestHikingTrail: '', distanceFromCity: '',
    foodPreference: 'both',
  });

  const currentType = (formData.type || '').toLowerCase();

  // ─── Highlights / Quick info ──────────────────────────────
  const [highlights, setHighlights] = useState({
    breakfastIncluded: false,
    freeCancellation: false,
    freeCancellationHours: '24',
    parkingAvailable: false,
  });

  // ─── Images ───────────────────────────────────────────────
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const replaceInputRef = useRef(null);
  const [replaceTarget, setReplaceTarget] = useState(null);

  // ─── Rooms (for Hotel / Resort) ──────────────────────
  const [roomsList, setRoomsList] = useState([]);
  const [roomForm, setRoomForm] = useState({ roomType: 'Deluxe', roomName: '', pricePerNight: '', maxGuests: 2, bedType: 'Double', count: 1, amenities: [], checkIn: '3:00 PM', checkOut: '12:00 PM' });
  const [customRoomType, setCustomRoomType] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);

  // ─── Amenities ────────────────────────────────────────────
  const [selectedAmenitiesList, setSelectedAmenitiesList] = useState([]);
  const [availableAmenitiesList, setAvailableAmenitiesList] = useState([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(false);

  // ─── Unique Experiences ───────────────────────────────────
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [availableExperiences, setAvailableExperiences] = useState([]);
  const [experiencesLoading, setExperiencesLoading] = useState(false);
  const [newCustomExp, setNewCustomExp] = useState("");

  // ─── Location Masters (cascading dropdowns) ───────────────
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [locLoading, setLocLoading] = useState(false);

  // ─── Manual Location Input ────────────────────────────────
  const [manualLocation, setManualLocation] = useState({ country: false, state: false, city: false, area: false });
  const [manualValues, setManualValues] = useState({ country: '', state: '', city: '', area: '' });

  // ─── Landmarks ────────────────────────────────────────────
  const [landmarksList, setLandmarksList] = useState([]);
  const [landmarkName, setLandmarkName] = useState('');
  const [landmarkType, setLandmarkType] = useState('Tourist Popular');
  const [landmarkImageFile, setLandmarkImageFile] = useState(null);
  const [landmarkImagePreview, setLandmarkImagePreview] = useState('');
  const [landmarkImageUploading, setLandmarkImageUploading] = useState(false);
  const landmarkImageRef = useRef(null);

  // ─── UI State ─────────────────────────────────────────────
  const [editId, setEditId] = useState(null);
  const [formStep, setFormStep] = useState(1);
  // Auto-open form if coming from sidebar "Add Property" link
  const [showForm, setShowForm] = useState(() => {
    if (autoOpenForm) return true;
    const flag = sessionStorage.getItem('owner_open_add_form');
    if (flag) { sessionStorage.removeItem('owner_open_add_form'); return true; }
    return false;
  });
  const [myProps, setMyProps] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [enquiryCounts, setEnquiryCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionMenu, setActionMenu] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [customPropertyType, setCustomPropertyType] = useState('');

  // ─── Filters ──────────────────────────────────────────────
  const [filterType, setFilterType] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  useEffect(() => {
    const handleDateChange = (e) => {
      setFilterDateFrom(e.detail.dateFrom);
      setFilterDateTo(e.detail.dateTo);
    };
    window.addEventListener('dashboard_date_changed', handleDateChange);
    return () => {
      window.removeEventListener('dashboard_date_changed', handleDateChange);
    };
  }, []);

  // ─── Fetch helpers ────────────────────────────────────────
  const fetchMyProperties = async () => {
    try {
      const params = {};
      if (filterDateFrom) params.dateFrom = filterDateFrom;
      if (filterDateTo) params.dateTo = filterDateTo;
      const res = await propertyService.getMine(params);
      setMyProps(res.data);
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const params = {};
      if (filterDateFrom) params.dateFrom = filterDateFrom;
      if (filterDateTo) params.dateTo = filterDateTo;
      const res = await dashboardService.getStats(params);
      setStatsData(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchPropertyTypes = async () => {
    try {
      const res = await fetch(`${API_BASE}/master/property-types`);
      const data = await res.json();
      if (Array.isArray(data)) setPropertyTypes(data);
    } catch (err) {
      console.error('Error fetching property types:', err);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const res = await fetch(`${API_BASE}/master/room-types`);
      const data = await res.json();
      if (Array.isArray(data)) setRoomTypes(data);
    } catch (err) {
      console.error('Error fetching room types:', err);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const params = new URLSearchParams();
      if (filterDateFrom) params.append('dateFrom', filterDateFrom);
      if (filterDateTo) params.append('dateTo', filterDateTo);
      const queryString = params.toString();
      const res = await fetch(`${API_BASE}/owner-dashboard/enquiries${queryString ? `?${queryString}` : ''}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const counts = {};
        data.forEach(e => {
          const propId = e.property?._id || e.property;
          if (propId) counts[propId] = (counts[propId] || 0) + 1;
        });
        setEnquiryCounts(counts);
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    }
  };

  const fetchAmenitiesForType = async (propertyType) => {
    setAmenitiesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/amenities/active?scope=${propertyType || 'All'}`);
      const data = await res.json();
      if (Array.isArray(data)) setAvailableAmenitiesList(data.map(a => a.amenitiesName));
    } catch {
      setAvailableAmenitiesList(['WiFi', 'Parking', 'Pool', 'AC', 'Kitchen', 'Barbeque', 'Gym']);
    } finally {
      setAmenitiesLoading(false);
    }
  };

  
  const handleAddCustomExperience = async () => {
    if (!newCustomExp.trim()) return;
    try {
      const API_ENDPOINT = typeof API !== 'undefined' ? API : `${import.meta.env.VITE_API_BASE}`;
      const res = await fetch(`${API_ENDPOINT}/master/experiences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experienceName: newCustomExp.trim(), representingIcon: '', status: 'Active' })
      });
      const data = await res.json();
      setAvailableExperiences(prev => [...prev, data]);
      setSelectedExperiences(prev => [...prev, data._id || data.experienceName || data.name]);
      setNewCustomExp('');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExperiences = async () => {
    setExperiencesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/master/experiences/active`);
      const data = await res.json();
      if (Array.isArray(data)) setAvailableExperiences(data.filter(isValidExperience));
    } catch {
      // fallback
      setAvailableExperiences([
        { _id: 'e1', experienceName: 'Jungle Stay', representingIcon: '🌿' },
        { _id: 'e2', experienceName: 'Beachfront', representingIcon: '🏖️' },
        { _id: 'e3', experienceName: 'Mountain View', representingIcon: '🏔️' },
        { _id: 'e4', experienceName: 'Heritage Property', representingIcon: '🏛️' },
        { _id: 'e5', experienceName: 'Pet Friendly', representingIcon: '🐾' },
        { _id: 'e6', experienceName: 'Treehouse Stay', representingIcon: '🌳' },
      ]);
    } finally {
      setExperiencesLoading(false);
    }
  };

  // ─── Cascading location fetches ───────────────────────────
  const fetchCountries = async () => {
    setLocLoading(true);
    try {
      const res = await fetch(`${API_BASE}/masters/countries/active`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.countries || [];
      setCountries(list);
      return list;
    } catch {
      const fallbackCountries = [
        { _id: 'c1', countryName: 'India' },
        { _id: 'c2', countryName: 'United States' },
        { _id: 'c3', countryName: 'United Kingdom' },
        { _id: 'c4', countryName: 'Canada' },
        { _id: 'c5', countryName: 'Australia' }
      ];
      setCountries(fallbackCountries);
      return fallbackCountries;
    } finally {
      setLocLoading(false);
    }
  };

  const fetchStates = async (countryId) => {
    if (!countryId) { setStates([]); return; }
    try {
      const res = await fetch(`${API_BASE}/masters/states/active?country_id=${countryId}`);
      const data = await res.json();
      setStates(Array.isArray(data) ? data : data.states || []);
    } catch {
      setStates([]);
    }
  };

  const fetchCities = async (stateId) => {
    if (!stateId) { setCities([]); return; }
    try {
      const res = await fetch(`${API_BASE}/masters/cities/active?state_id=${stateId}`);
      const data = await res.json();
      setCities(Array.isArray(data) ? data : data.cities || []);
    } catch {
      setCities([]);
    }
  };

  const fetchLocations = async (cityId) => {
    if (!cityId) { setLocations([]); return; }
    try {
      const res = await fetch(`${API_BASE}/masters/locations/active?city_id=${cityId}`);
      const data = await res.json();
      const locs = Array.isArray(data) ? data : data.locations || [];
      if (locs.length === 0) setLocations(allLocations);
      else setLocations(locs);
    } catch {
      setLocations(allLocations);
    }
  };

  useEffect(() => {
    fetchMyProperties();
    fetchStats();
    fetchEnquiries();
    fetchCountries();
    fetchAmenitiesForType();
    fetchExperiences();
    fetchPropertyTypes();
    fetchRoomTypes();
    const fetchAllLocs = async () => {
      try {
        const res = await fetch(`${API_BASE}/masters/locations/active`);
        const data = await res.json();
        setAllLocations(Array.isArray(data) ? data : data.locations || []);
      } catch {}
    };
    fetchAllLocs();
  }, []);

  useEffect(() => {
    fetchMyProperties();
    fetchStats();
    fetchEnquiries();
  }, [filterDateFrom, filterDateTo]);

  // ─── Handlers ─────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setSelectedAmenitiesList([]);
      fetchAmenitiesForType(value);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e) => {
    const selected = countries.find(c => c._id === e.target.value);
    setFormData(prev => ({
      ...prev,
      countryId: e.target.value,
      countryName: selected?.countryName || '',
      stateId: '', stateName: '',
      cityId: '', cityName: '',
      locationId: '', locationName: ''
    }));
    setStates([]); setCities([]); setLocations([]);
    fetchStates(e.target.value);
  };

  const handleStateChange = (e) => {
    const selected = states.find(s => s._id === e.target.value);
    setFormData(prev => ({
      ...prev,
      stateId: e.target.value,
      stateName: selected?.stateName || '',
      cityId: '', cityName: '',
      locationId: '', locationName: ''
    }));
    setCities([]); setLocations([]);
    fetchCities(e.target.value);
  };

  const handleCityChange = (e) => {
    const selected = cities.find(c => c._id === e.target.value);
    setFormData(prev => ({
      ...prev,
      cityId: e.target.value,
      cityName: selected?.cityName || '',
      locationId: '', locationName: ''
    }));
    setLocations([]);
    fetchLocations(e.target.value);
  };

  const handleLocationChange = (e) => {
    const locList = locations.length > 0 ? locations : allLocations;
    const selected = locList.find(l => l._id === e.target.value);
    setFormData(prev => ({
      ...prev,
      locationId: e.target.value,
      locationName: selected?.locationName || ''
    }));
    
    // Auto-fetch landmarks if location has them
    if (selected && selected.landmarks && selected.landmarks.length > 0) {
      const mapped = selected.landmarks.map(l => ({
        landmark_name: l.landmarkName || l.name,
        landmark_type: l.landmarkType || l.type || 'Other',
        landmark_image_url: l.image || l.landmark_image_url || ''
      }));
      setLandmarksList(prev => [...prev, ...mapped]);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const totalAllowed = 30 - existingImages.length;
    const combined = [...selectedFiles, ...newFiles].slice(0, totalAllowed);
    setSelectedFiles(combined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReplaceClick = (type, index) => {
    setReplaceTarget({ type, index });
    if (replaceInputRef.current) replaceInputRef.current.click();
  };

  const handleReplaceFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit");
      return;
    }
    
    if (replaceTarget) {
      if (replaceTarget.type === 'new') {
        setSelectedFiles(prev => prev.map((f, i) => i === replaceTarget.index ? file : f));
      } else if (replaceTarget.type === 'existing') {
        const removedImage = existingImages[replaceTarget.index];
        setFormData(prev => ({ ...prev, removedImages: [...(prev.removedImages || []), removedImage] }));
        setExistingImages(prev => prev.filter((_, i) => i !== replaceTarget.index));
        setSelectedFiles(prev => [...prev, file]);
      }
    }
    setReplaceTarget(null);
    if (replaceInputRef.current) replaceInputRef.current.value = '';
  };

  const handleRemoveNewFile = (idx) => setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  const handleRemoveExistingImage = (idx) => setExistingImages(prev => prev.filter((_, i) => i !== idx));

  const handleEdit = async (p) => {
    // First, fetch the full property details from backend to get all fields
    let fullP = p;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/properties/${p._id || p.id}`);
      if (res.ok) {
        const data = await res.json();
        fullP = { ...p, ...data }; // merge — backend single property has all fields
      }
    } catch { /* use local data */ }

    setEditId(fullP._id);
    setShowForm(true);
    setFormStep(1); // Always start at step 1 when editing

    const pType = fullP.type || 'Homestay';
    const amenitiesArr = Array.isArray(fullP.amenities)
      ? fullP.amenities
      : (fullP.amenities || '').split(',').map(a => a.trim()).filter(Boolean);
    setSelectedAmenitiesList(amenitiesArr);
    setSelectedExperiences(Array.isArray(fullP.experiences) ? fullP.experiences.map(e => e._id || e) : []);
    fetchAmenitiesForType(pType);

    // Load landmarks
    try {
      const lmRes = await propertyService.getLandmarks(fullP._id);
      setLandmarksList(lmRes.data || []);
    } catch { setLandmarksList([]); }

    setExistingImages(Array.isArray(fullP.images) ? fullP.images : []);
    setSelectedFiles([]);
    setRoomsList(Array.isArray(fullP.rooms) && typeof fullP.rooms[0] === 'object' ? fullP.rooms : []);

    const countryOptions = countries.length > 0 ? countries : await fetchCountries();

    // Load cascading location
    const countryId = getEntityId(fullP.countryId);
    const stateId = getEntityId(fullP.stateId);
    const cityId = getEntityId(fullP.cityId);
    const locationId = getEntityId(fullP.locationId);
    const countryName = fullP.countryName || getLocationName(fullP.countryId, ['countryName']) || fullP.country || countryOptions.find(c => String(c._id) === String(countryId))?.countryName || '';
    const stateName = fullP.stateName || getLocationName(fullP.stateId, ['stateName']) || fullP.state || '';
    const cityName = fullP.cityName || getLocationName(fullP.cityId, ['cityName']) || fullP.city || '';
    const locationName = fullP.locationName || getLocationName(fullP.locationId, ['locationName']) || '';

    var manualLoc = { country: false, state: false, city: false, area: false };
    var manualVals = { country: '', state: '', city: '', area: '' };

    if (countryId) {
      await fetchStates(countryId);
      if (stateId) {
        await fetchCities(stateId);
        if (cityId) await fetchLocations(cityId);
      }
    } else {
      if (countryName) {
        manualLoc.country = true;
        manualVals.country = countryName;
      }
    }

    if (!stateId && stateName) {
      manualLoc.state = true;
      manualVals.state = stateName;
    }

    if (!cityId && cityName) {
      manualLoc.city = true;
      manualVals.city = cityName;
    }

    if (!locationId && (locationName || fullP.location)) {
      manualLoc.area = true;
      manualVals.area = locationName || fullP.location;
    }

    setHighlights({
      breakfastIncluded: fullP.highlights?.breakfastIncluded || false,
      freeCancellation: fullP.highlights?.freeCancellation || false,
      freeCancellationHours: fullP.highlights?.freeCancellationHours || '24',
      parkingAvailable: fullP.highlights?.parkingAvailable || false,
    });

    setFormData({
      type: pType,
      name: fullP.name || fullP.propertyName || '',
      ownerContact: fullP.ownerContact || '',
      countryId,
      countryName,
      stateId,
      stateName,
      cityId,
      cityName,
      locationId,
      locationName,
      full_address: fullP.full_address || fullP.location || '',
      latitude: formatCoordinateInput(fullP.latitude, true),
      longitude: formatCoordinateInput(fullP.longitude, false),
      originalPrice: parseNumber(fullP.originalPrice),
      price: parseNumber(fullP.price_per_night !== undefined ? fullP.price_per_night : fullP.price),
      taxAmount: parseNumber(fullP.taxAmount),
      area: fullP.area || '31 sq. ft.',
      bedRooms: fullP.bedRooms !== undefined ? fullP.bedRooms : 1,
      beds: fullP.beds !== undefined ? fullP.beds : 2,
      capacity: fullP.capacity !== undefined ? fullP.capacity : 3,
      bathRooms: fullP.bathRooms !== undefined ? fullP.bathRooms : 1,
      checkIn: fullP.checkIn || '3:00 PM',
      checkOut: fullP.checkOut || '12:00 PM',
      rules: fullP.rules || '',
      description: fullP.description || '',
      status: fullP.status || 'Active',
      privatePool: fullP.privatePool || false, gardenArea: fullP.gardenArea || false, chefAvailable: fullP.chefAvailable || false, entirePropertyOnly: fullP.entirePropertyOnly || false, securityCCTV: fullP.securityCCTV || false, numberOfFloors: fullP.numberOfFloors || '', plotSize: fullP.plotSize || '',
      restaurantOnSite: fullP.restaurantOnSite || false, spaWellness: fullP.spaWellness || false, conferenceRoom: fullP.conferenceRoom || false, roomService: fullP.roomService || false, receptionAllDay: fullP.receptionAllDay || false, liftElevator: fullP.liftElevator || false, starRating: fullP.starRating || '', totalRooms: fullP.totalRooms || '', totalFloors: fullP.totalFloors || '', activities: fullP.activities || [],
      floorNumber: fullP.floorNumber || '', totalFloorsBuilding: fullP.totalFloorsBuilding || '', furnishedStatus: fullP.furnishedStatus || '', washingMachine: fullP.washingMachine || false, societyAmenities: fullP.societyAmenities || [],
      bonfireArea: fullP.bonfireArea || false, viewType: fullP.viewType || '', outdoorSeating: fullP.outdoorSeating || false, nearestHikingTrail: fullP.nearestHikingTrail || '', distanceFromCity: fullP.distanceFromCity || '',
      foodPreference: fullP.foodPreference || 'none',
    });
    setManualLocation(manualLoc);
    setManualValues(manualVals);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await propertyService.delete(id);
      fetchMyProperties(); fetchStats();
    } catch { alert('Error deleting property'); }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await propertyService.updateStatus(id, newStatus);
      fetchMyProperties(); fetchStats();
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Upload new images
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        const uploadData = new FormData();
        selectedFiles.forEach(file => uploadData.append('images', file));
        try {
          const uploadRes = await propertyService.uploadImages(uploadData);
          imageUrls = uploadRes.data.urls;
        } catch (imgErr) {
          console.error('❌ Image upload failed:', imgErr.response?.data?.message || imgErr.message);
          alert('Image upload failed: ' + (imgErr.response?.data?.message || imgErr.message));
          setLoading(false);
          return;
        }
      }

      const allImages = [...existingImages, ...imageUrls];
      if (allImages.length < 1) {
        alert('Please add at least 1 property image.');
        setLoading(false);
        return;
      }

      const propertyData = {
        type: formData.type === 'Other' ? customPropertyType : formData.type,
        name: formData.name,
        ownerContact: formData.ownerContact,
        // Location
        countryId: formData.countryId,
        countryName: formData.countryName,
        stateId: formData.stateId,
        state: formData.stateName,
        cityId: formData.cityId,
        city: formData.cityName,
        locationId: formData.locationId,
        locationName: formData.locationName,
        location: formData.full_address || `${formData.cityName}${formData.stateName ? ', ' + formData.stateName : ''}${formData.countryName ? ', ' + formData.countryName : ''}`,
        full_address: formData.full_address,
        latitude: sanitizeCoordinateInput(formData.latitude, true),
        longitude: sanitizeCoordinateInput(formData.longitude, false),
        // Pricing
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        price_per_night: Number(formData.price),
        price: Number(formData.price),
        taxAmount: formData.taxAmount ? Number(formData.taxAmount) : undefined,
        // Highlights
        highlights,
        // Amenities & Experiences
        amenities: selectedAmenitiesList,
        experiences: selectedExperiences,
        landmarks: landmarksList,
        // Details
        area: formData.area,
        bedRooms: Number(formData.bedRooms),
        beds: Number(formData.beds),
        capacity: Number(formData.capacity),
        bathRooms: Number(formData.bathRooms),
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        rules: formData.rules,
        description: formData.description,
        status: formData.status,
        images: allImages,
        rooms: roomsList,
        privatePool: formData.privatePool, gardenArea: formData.gardenArea, chefAvailable: formData.chefAvailable, entirePropertyOnly: formData.entirePropertyOnly, securityCCTV: formData.securityCCTV, numberOfFloors: formData.numberOfFloors, plotSize: formData.plotSize,
        restaurantOnSite: formData.restaurantOnSite, spaWellness: formData.spaWellness, conferenceRoom: formData.conferenceRoom, roomService: formData.roomService, receptionAllDay: formData.receptionAllDay, liftElevator: formData.liftElevator, starRating: formData.starRating, totalRooms: formData.totalRooms, totalFloors: formData.totalFloors, activities: formData.activities,
        floorNumber: formData.floorNumber, totalFloorsBuilding: formData.totalFloorsBuilding, furnishedStatus: formData.furnishedStatus, washingMachine: formData.washingMachine, societyAmenities: formData.societyAmenities,
        bonfireArea: formData.bonfireArea, viewType: formData.viewType, outdoorSeating: formData.outdoorSeating, nearestHikingTrail: formData.nearestHikingTrail, distanceFromCity: formData.distanceFromCity,
        foodPreference: formData.foodPreference,
      };

      console.log('📤 Sending property data to backend:', propertyData);

      if (editId) {
        console.log('🔄 Updating property:', editId);
        await propertyService.update(editId, propertyData);
        alert('Property updated successfully!');
      } else {
        console.log('✨ Creating new property...');
        const createdProp = await propertyService.add(propertyData);
        console.log('✅ Property created:', createdProp.data);
        const newId = createdProp.data.id || createdProp.data._id;
        for (const lm of landmarksList) {
          try {
            await propertyService.addLandmark(newId, lm);
          } catch (lmErr) {
            console.error('⚠️  Landmark add failed:', lmErr);
          }
        }
        alert('Property added successfully!\n\nNext step: Go to "Property Requests" from the sidebar, add your rooms, and submit a request. Your property will go live after admin approval of the room request.');
      }

      fetchMyProperties(); fetchStats();
      resetForm();
    } catch (err) {
      console.error('❌ Error saving property:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: errorMsg,
        data: err.response?.data
      });
      alert('Error saving property: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLandmark = async () => {
    if (!landmarkName.trim()) return;
    setLandmarkImageUploading(true);
    let imageUrl = '';
    try {
      if (landmarkImageFile) {
        const uploadData = new FormData();
        uploadData.append('images', landmarkImageFile);
        const uploadRes = await propertyService.uploadImages(uploadData);
        if (uploadRes.data?.urls?.length > 0) imageUrl = uploadRes.data.urls[0];
      }
    } catch { console.error('Image upload failed'); }
    finally { setLandmarkImageUploading(false); }

    const lmData = { landmark_name: landmarkName.trim(), landmark_type: landmarkType, landmark_image_url: imageUrl };
    if (editId) {
      try {
        const res = await propertyService.addLandmark(editId, lmData);
        setLandmarksList(prev => [...prev, res.data]);
      } catch { alert('Failed to add landmark'); }
    } else {
      setLandmarksList(prev => [...prev, lmData]);
    }
    setLandmarkName('');
    setLandmarkImageFile(null);
    setLandmarkImagePreview('');
    if (landmarkImageRef.current) landmarkImageRef.current.value = '';
  };

  const handleRemoveLandmark = async (idx, lm) => {
    if (editId && lm._id) {
      try {
        await propertyService.deleteLandmark(lm._id);
        setLandmarksList(prev => prev.filter((_, i) => i !== idx));
      } catch { alert('Failed to remove landmark'); }
    } else {
      setLandmarksList(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const resetForm = () => {
    setFormStep(1);
    setEditId(null);
    setShowForm(false);
    setSelectedAmenitiesList([]);
    setSelectedExperiences([]);
    setLandmarksList([]);
    setLandmarkName('');
    setLandmarkType('Tourist Popular');
    setHighlights({ breakfastIncluded: false, freeCancellation: false, freeCancellationHours: '24', parkingAvailable: false });
    setFormData({
      type: 'Homestay', name: '', ownerContact: '',
      countryId: '', countryName: '', stateId: '', stateName: '',
      cityId: '', cityName: '', locationId: '', locationName: '',
      full_address: '', latitude: '', longitude: '',
      originalPrice: '', price: '', taxAmount: '',
      area: '31 sq. ft.', bedRooms: 1, beds: 2, capacity: 3, bathRooms: 1,
      checkIn: '3:00 PM', checkOut: '12:00 PM',
      rules: '',
      description: '', status: 'Active',
      privatePool: false, gardenArea: false, chefAvailable: false, entirePropertyOnly: false, securityCCTV: false, numberOfFloors: '', plotSize: '',
      restaurantOnSite: false, spaWellness: false, conferenceRoom: false, roomService: false, receptionAllDay: false, liftElevator: false, starRating: '', totalRooms: '', totalFloors: '', activities: [],
      floorNumber: '', totalFloorsBuilding: '', furnishedStatus: '', washingMachine: false, societyAmenities: [],
      bonfireArea: false, viewType: '', outdoorSeating: false, nearestHikingTrail: '', distanceFromCity: '',
    });
    setSelectedFiles([]);
    setExistingImages([]);
    setRoomsList([]);
    setRoomForm({ roomType: 'Deluxe', roomName: '', pricePerNight: '', maxGuests: 2, bedType: 'Double', count: 1, amenities: [] });
    setStates([]); setCities([]); setLocations([]);
    setManualLocation({ country: false, state: false, city: false, area: false });
    setManualValues({ country: '', state: '', city: '', area: '' });
  };

  const filteredProps = myProps.filter(p => {
    const matchesSearch = filterSearch.trim() === '' ||
      p.name?.toLowerCase().includes(filterSearch.toLowerCase()) ||
      p.city?.toLowerCase().includes(filterSearch.toLowerCase()) ||
      (p.address || p.location || '').toLowerCase().includes(filterSearch.toLowerCase()) ||
      p.propertyNo?.toString()?.includes(filterSearch);
    const matchesType = filterType === '' || p.type === filterType;
    let matchesDate = true;
    if (p.createdAt) {
      const pDate = new Date(p.createdAt); pDate.setHours(0, 0, 0, 0);
      if (filterDateFrom) { const d = new Date(filterDateFrom); d.setHours(0,0,0,0); if (pDate < d) matchesDate = false; }
      if (filterDateTo) { const d = new Date(filterDateTo); d.setHours(0,0,0,0); if (pDate > d) matchesDate = false; }
    } else if (filterDateFrom || filterDateTo) matchesDate = false;
    return matchesSearch && matchesType && matchesDate;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProps.length / itemsPerPage);
  const paginatedProps = filteredProps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  useEffect(() => {
    const handleToggle = () => {
      if (showForm && !editId) {
        resetForm();
      } else {
        resetForm();
        setShowForm(true);
      }
    };
    window.addEventListener('owner_toggle_add_form', handleToggle);
    return () => window.removeEventListener('owner_toggle_add_form', handleToggle);
  }, [showForm, editId]);

  // ─── Styles helpers ───────────────────────────────────────
  const sectionHeader = (title, subtitle) => (
    <div style={{ marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #F0FDF4' }}>
      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: '"Outfit", sans-serif' }}>{title}</h4>
      {subtitle && <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0', fontFamily: '"Outfit", sans-serif' }}>{subtitle}</p>}
    </div>
  );

  const sectionWrap = (children, extraStyle = {}) => (
    <div style={{ background: '#F9FFF5', border: '1px solid #E8F5E0', borderRadius: '12px', padding: '20px', marginBottom: '20px', ...extraStyle }}>
      {children}
    </div>
  );

  const labelStyle = { fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: '"Outfit", sans-serif', marginBottom: '6px', display: 'block' };
  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', fontFamily: '"Outfit", sans-serif', outline: 'none', background: '#fff', boxSizing: 'border-box', color: '#111827' };
  const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'auto' };

  return (
    <div className="fade-in" onClick={() => setActionMenu(null)}>
      <div style={{ height: '16px' }} />
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px', fontSize: '13px', color: '#6B7280', fontFamily: '"Outfit", sans-serif' }}>
        Property Management &gt; <span style={{ color: '#111827', fontWeight: 600 }}>My Properties</span>
      </div>

      <div className="dash-section" style={{ marginBottom: 16 }}>
        {/* ══ Stats Cards ════════ */}
        <div className="props-stats-row">
          <div className="props-stat-card" style={{ margin: 0, borderRadius: 12 }}>
            <div className="props-stat-icon-wrap blue">
              <MessageSquare strokeWidth={2.5} />
            </div>
            <div className="props-stat-content">
              <div className="props-stat-label">Total Enquiries (Today)</div>
              <div className="props-stat-value">{statsData?.totalEnquiries || 0}</div>
              <div className="stat-card-meta" style={{ marginTop: 4 }}>
                <span className="stat-badge up">
                  <TrendingUp size={10} /> +04.6%
                </span>
                <span className="stat-card-sub">Compared to yesterday</span>
              </div>
            </div>
          </div>
          <div className="props-stat-card" style={{ margin: 0, borderRadius: 12 }}>
            <div className="props-stat-icon-wrap green">
              <Building2 strokeWidth={2.5} />
            </div>
            <div className="props-stat-content">
              <div className="props-stat-label">Active Properties</div>
              <div className="props-stat-value">{myProps.filter(p => p.status === 'Active').length}</div>
              <div className="stat-card-meta" style={{ marginTop: 4 }}>
                <span className="stat-badge down">
                  <TrendingDown size={10} /> -16.6%
                </span>
                <span className="stat-card-sub">Compared to yesterday</span>
              </div>
            </div>
          </div>
          <div className="props-stat-card" style={{ margin: 0, borderRadius: 12 }}>
            <div className="props-stat-icon-wrap" style={{ background: '#F5F3FF', color: '#7C3AED', width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users strokeWidth={2.5} style={{ width: 32, height: 32 }} />
            </div>
            <div className="props-stat-content">
              <div className="props-stat-label">Response Rate</div>
              <div className="props-stat-value">95%</div>
              <div className="stat-card-meta" style={{ marginTop: 4 }}>
                <span className="stat-badge up">
                  <TrendingUp size={10} /> +16.6%
                </span>
                <span className="stat-card-sub">Compared to yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Section 2: Add Property Form ════════ */}
      {showForm && (
        <div className="dash-section" style={{ marginBottom: 16 }}>
          <div style={{ padding: '21px', background: '#ffffff', border: '1.5px dashed #58A429', borderRadius: '16px' }}>
            
            {/* Form Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: '"Outfit", sans-serif' }}>
                  {editId ? '✏️ Edit Property' : '🏡 Add New Property'} <span style={{ fontSize: '14px', color: '#58A429', marginLeft: '8px' }}>(Step {formStep} of 2)</span>
                </h3>
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0', fontFamily: '"Outfit", sans-serif' }}>
                  Fill all details carefully — this is what customers will see
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {formStep === 2 && (
                  <button type="button" onClick={() => setFormStep(1)}
                    style={{ background: '#fff', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: '24px', padding: '8px 24px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: '"Outfit", sans-serif' }}>
                    Back to Step 1
                  </button>
                )}
                {formStep === 1 ? (
                  <button type="button" onClick={() => { setFormStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{ background: '#58A429', color: '#ffffff', border: 'none', borderRadius: '24px', padding: '8px 32px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 2px 8px rgba(88,164,41,0.2)' }}>
                    Next Step →
                  </button>
                ) : (
                  <button type="button" onClick={handleSubmit} disabled={loading}
                    style={{ background: '#58A429', color: '#ffffff', border: 'none', borderRadius: '24px', padding: '8px 32px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 2px 8px rgba(88,164,41,0.2)' }}>
                    {loading ? 'Saving...' : (editId ? 'Update Property' : 'Add Property')}
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: formStep === 1 ? 'block' : 'none' }}>
            {/* ── SECTION 1: Basic Details ──────────────────── */}
            {sectionWrap(<>
              {sectionHeader('1. Basic Property Details', 'Core information about your property')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Property Type *</label>
                  <select style={selectStyle} name="type" value={formData.type} onChange={handleChange}>
                    <option value="">Select Property Type</option>
                    {propertyTypes.map(pt => (
                      <option key={pt._id} value={pt.name}>{pt.name}</option>
                    ))}
                    {/* Fallbacks if API is empty */}
                    {propertyTypes.length === 0 && (
                      <>
                        <option value="Homestay">Homestay</option>
                        <option value="Villa">Villa</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Resort">Resort</option>
                        <option value="Cottage">Cottage</option>
                        <option value="Hotel">Hotel</option>
                      </>
                    )}
                    {/* Fallback for existing value not in list */}
                    {formData.type && formData.type !== 'Other' && !propertyTypes.some(pt => pt.name === formData.type) && propertyTypes.length > 0 && (
                      <option value={formData.type}>{formData.type}</option>
                    )}
                    <option value="Other">Other (Add Manually)</option>
                  </select>
                  {formData.type === 'Other' && (
                    <input 
                      style={{ ...inputStyle, marginTop: '8px' }} 
                      type="text" 
                      placeholder="Enter custom property type"
                      value={customPropertyType}
                      onChange={(e) => setCustomPropertyType(e.target.value)}
                      required
                    />
                  )}
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Property Name *</label>
                  <input style={inputStyle} type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Aparahotel Stare Miasto" required />
                </div>
                <div>
                  <label style={labelStyle}>Owner Contact *</label>
                  <input style={inputStyle} type="text" name="ownerContact" value={formData.ownerContact} onChange={handleChange} placeholder="e.g. +91 9988776655" required />
                </div>
                <div>
                  <label style={labelStyle}>Status *</label>
                  <select style={selectStyle} name="status" value={formData.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </>)}

            {/* ── SECTION 2: Location ───────────────────────── */}
            {sectionWrap(<>
              {sectionHeader('2. Property Location', 'Select country → state → city → area for accurate listing')}
              


              {/* Cascading dropdowns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={labelStyle}>Country *</label>
                    <button type="button" onClick={() => setManualLocation(p => ({ ...p, country: !p.country }))}
                      style={{ fontSize: '10px', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                      {manualLocation.country ? '← Use Dropdown' : 'Enter Manually'}
                    </button>
                  </div>
                  {manualLocation.country ? (
                    <input type="text" style={inputStyle} placeholder="e.g. India"
                      value={manualValues.country}
                      onChange={e => { setManualValues(p => ({ ...p, country: e.target.value })); setFormData(p => ({ ...p, countryId: '', countryName: e.target.value })); }} />
                  ) : (
                    <select style={selectStyle} value={formData.countryId} onChange={handleCountryChange} required>
                      <option value="">Select Country</option>
                      {formData.countryId && formData.countryName && !countries.some(c => String(c._id) === String(formData.countryId)) && (
                        <option value={formData.countryId}>{formData.countryName}</option>
                      )}
                      {countries.map(c => <option key={c._id} value={c._id}>{c.countryName}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={labelStyle}>State *</label>
                    <button type="button" onClick={() => setManualLocation(p => ({ ...p, state: !p.state }))}
                      style={{ fontSize: '10px', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                      {manualLocation.state ? '← Use Dropdown' : 'Enter Manually'}
                    </button>
                  </div>
                  {manualLocation.state ? (
                    <input type="text" style={inputStyle} placeholder="e.g. Himachal Pradesh"
                      value={manualValues.state}
                      onChange={e => { setManualValues(p => ({ ...p, state: e.target.value })); setFormData(p => ({ ...p, stateId: '', stateName: e.target.value })); }} />
                  ) : (
                    <select style={{ ...selectStyle, background: !formData.countryId ? '#F9FAFB' : '#fff', cursor: !formData.countryId ? 'not-allowed' : 'pointer' }}
                      value={formData.stateId} onChange={handleStateChange} required disabled={!formData.countryId}>
                      <option value="">Select State</option>
                      {formData.stateId && formData.stateName && !states.some(s => String(s._id) === String(formData.stateId)) && (
                        <option value={formData.stateId}>{formData.stateName}</option>
                      )}
                      {states.map(s => <option key={s._id} value={s._id}>{s.stateName}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={labelStyle}>City *</label>
                    <button type="button" onClick={() => setManualLocation(p => ({ ...p, city: !p.city }))}
                      style={{ fontSize: '10px', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                      {manualLocation.city ? '← Use Dropdown' : 'Enter Manually'}
                    </button>
                  </div>
                  {manualLocation.city ? (
                    <input type="text" style={inputStyle} placeholder="e.g. Kasol"
                      value={manualValues.city}
                      onChange={e => { setManualValues(p => ({ ...p, city: e.target.value })); setFormData(p => ({ ...p, cityId: '', cityName: e.target.value })); }} />
                  ) : (
                    <select style={{ ...selectStyle, background: !formData.stateId ? '#F9FAFB' : '#fff', cursor: !formData.stateId ? 'not-allowed' : 'pointer' }}
                      value={formData.cityId} onChange={handleCityChange} required disabled={!formData.stateId}>
                      <option value="">Select City</option>
                      {formData.cityId && formData.cityName && !cities.some(c => String(c._id) === String(formData.cityId)) && (
                        <option value={formData.cityId}>{formData.cityName}</option>
                      )}
                      {cities.map(c => <option key={c._id} value={c._id}>{c.cityName}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={labelStyle}>
                      Area / Location
                      {!manualLocation.area && locations.length === 0 && allLocations.length > 0 && formData.cityId && (
                        <span style={{ color: '#F59E0B', fontSize: 11, marginLeft: 6 }}>Showing all locations</span>
                      )}
                    </label>
                    <button type="button" onClick={() => setManualLocation(p => ({ ...p, area: !p.area }))}
                      style={{ fontSize: '10px', color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                      {manualLocation.area ? '← Use Dropdown' : 'Enter Manually'}
                    </button>
                  </div>
                  {manualLocation.area ? (
                    <input type="text" style={inputStyle} placeholder="e.g. Parvati Valley"
                      value={manualValues.area}
                      onChange={e => { setManualValues(p => ({ ...p, area: e.target.value })); setFormData(p => ({ ...p, locationId: '', locationName: e.target.value })); }} />
                  ) : (
                    <select style={{ ...selectStyle, background: !formData.cityId ? '#F9FAFB' : '#fff', cursor: !formData.cityId ? 'not-allowed' : 'pointer' }}
                      value={formData.locationId} onChange={handleLocationChange} disabled={!formData.cityId}>
                      <option value="">Select Area</option>
                      {formData.locationId && formData.locationName && !(locations.length > 0 ? locations : allLocations).some(l => String(l._id) === String(formData.locationId)) && (
                        <option value={formData.locationId}>{formData.locationName}</option>
                      )}
                      {(locations.length > 0 ? locations : allLocations).map(l => <option key={l._id} value={l._id}>{l.locationName}</option>)}
                    </select>
                  )}
                </div>
              </div>

              {/* Full address + coordinates */}
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '16px' }}>
                <label style={{ ...labelStyle, marginBottom: '12px' }}>📍 Exact Address & Map Coordinates</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div style={{ gridColumn: 'span 3' }}>
                    <label style={{ ...labelStyle, fontWeight: 400, color: '#6B7280' }}>Full Address *</label>
                    <input style={inputStyle} type="text" name="full_address" value={formData.full_address}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_address: e.target.value, location: e.target.value }))}
                      placeholder="e.g. Near Anjuna Beach, Goa 403509, India" />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontWeight: 400, color: '#6B7280' }}>Latitude</label>
                    <input style={inputStyle} type="text" inputMode="decimal" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="e.g. 15.5736" />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontWeight: 400, color: '#6B7280' }}>Longitude</label>
                    <input style={inputStyle} type="text" inputMode="decimal" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="e.g. 73.7397" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button type="button" onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          pos => setFormData(prev => ({ ...prev, latitude: formatCoordinateInput(pos.coords.latitude, true), longitude: formatCoordinateInput(pos.coords.longitude, false) })),
                          () => alert('Location access denied. Please enter manually.')
                        );
                      }
                    }} style={{ padding: '9px 16px', background: '#fff', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', width: '100%' }}>
                      📍 Use My Location
                    </button>
                  </div>
                </div>
                {(() => {
                  const lat = sanitizeCoordinateInput(formData.latitude, true);
                  const lng = sanitizeCoordinateInput(formData.longitude, false);
                  if (lat !== undefined && lng !== undefined) {
                    return (
                      <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #D1D5DB', height: '180px' }}>
                        <iframe title="Map Preview" width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                          src={`https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`} />
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </>)}

            {/* ── SECTION 3: Pricing ───────────────────────── */}
            {sectionWrap(<>
              {sectionHeader('3. Pricing', 'Set your nightly rate, original price and tax')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Original Price / night (₹)</label>
                  <input style={inputStyle} type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="e.g. 2140 (shown strikethrough)" />
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Shown as ₹2140 ~~strikethrough~~ on listing</span>
                </div>
                <div>
                  <label style={labelStyle}>Discounted Price / night (₹) *</label>
                  <input style={inputStyle} type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 140 (actual price)" required />
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>This is the big green price shown to customer</span>
                </div>
                <div>
                  <label style={labelStyle}>Tax Amount (₹)</label>
                  <input style={inputStyle} type="number" name="taxAmount" value={formData.taxAmount} onChange={handleChange} placeholder="e.g. 212" />
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Shown as "+₹212 taxes & fees per room per night"</span>
                </div>
              </div>
            </>)}

            {/* ── SECTION 4: Images ────────────────────────── */}
            {sectionWrap(<>
              {sectionHeader('4. Property Images', 'Upload minimum 4 images, maximum 10. First image becomes cover photo.')}
              {(existingImages.length > 0 || selectedFiles.length > 0) && (
                <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px', gap: '10px', marginBottom: '14px' }}>
                  {existingImages.map((url, idx) => (
                    <div key={`ex-${idx}`} style={{ position: 'relative', width: '80px', height: '80px' }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', border: idx === 0 ? '2px solid #58A429' : '1px solid #D1D5DB' }} />
                      {idx === 0 && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(88,164,41,0.85)', color: '#fff', fontSize: '9px', textAlign: 'center', borderRadius: '0 0 10px 10px', padding: '2px' }}>Cover</span>}
                      <button
                        type="button"
                        onClick={() => handleReplaceClick('existing', idx)}
                        style={{
                          position: "absolute",
                          bottom: "-6px",
                          right: "-6px",
                          background: "#3B82F6",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: "18px",
                          height: "18px",
                          fontSize: "10px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Replace image"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                      <button type="button" onClick={() => handleRemoveExistingImage(idx)} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                  {selectedFiles.map((file, idx) => (
                    <div key={`new-${idx}`} style={{ position: 'relative', width: '80px', height: '80px' }}>
                      <img src={URL.createObjectURL(file)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', border: '2px solid #58A429' }} />
                      <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '9px', textAlign: 'center', borderRadius: '0 0 10px 10px', padding: '2px' }}>New</span>
                      <button
                        type="button"
                        onClick={() => handleReplaceClick('new', idx)}
                        style={{
                          position: "absolute",
                          bottom: "-6px",
                          right: "-6px",
                          background: "#3B82F6",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: "18px",
                          height: "18px",
                          fontSize: "10px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Replace image"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                      <button type="button" onClick={() => handleRemoveNewFile(idx)} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                    </div>
                  )}
              {(existingImages.length + selectedFiles.length) < 30 ? (
                <div onClick={() => fileInputRef.current.click()} style={{ border: '2px dashed #D1D5DB', borderRadius: '10px', padding: '24px', textAlign: 'center', cursor: 'pointer', background: '#FAFAFA' }}>
                  <Upload size={24} style={{ color: '#9CA3AF', marginBottom: '8px' }} />
                  <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', fontFamily: '"Outfit", sans-serif' }}>Click to upload images (JPG, PNG — max 5MB each)</p>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple hidden accept="image/*" />
                  <input type="file" ref={replaceInputRef} onChange={handleReplaceFileChange} hidden accept="image/*" />
                </div>
              ) : (
                <p style={{ color: '#EF4444', fontSize: '12px' }}>Maximum 30 images reached.</p>
              )}
            </>)}
            </div>

            <div style={{ display: formStep === 2 ? 'block' : 'none' }}>
            {/* ── SECTION 5: Property Details ───────────────── */}
            {sectionWrap(<>
              {sectionHeader('5. Property Details', 'Size, capacity and timing information')}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
                {[
                  { label: 'Bedrooms *', name: 'bedRooms', placeholder: '1' },
                  { label: 'Beds Count *', name: 'beds', placeholder: '2' },
                  { label: 'Max Guests *', name: 'capacity', placeholder: '3' },
                  { label: 'Bathrooms *', name: 'bathRooms', placeholder: '1' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={labelStyle}>{f.label}</label>
                    <input style={inputStyle} type="number" name={f.name} value={formData[f.name]} onChange={handleChange} placeholder={f.placeholder} required />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Area Size *</label>
                  <input style={inputStyle} type="text" name="area" value={formData.area} onChange={handleChange} placeholder="e.g. 31 sq. ft." required />
                </div>
                <div>
                  <label style={labelStyle}>Check-In Time *</label>
                  <select style={selectStyle} name="checkIn" value={formData.checkIn} onChange={handleChange} required>
                    {TIME_SLOTS.map(t => <option key={`in-${t}`} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Check-Out Time *</label>
                  <select style={selectStyle} name="checkOut" value={formData.checkOut} onChange={handleChange} required>
                    {TIME_SLOTS.map(t => <option key={`out-${t}`} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Food Preference</label>
                  <select style={selectStyle} name="foodPreference" value={formData.foodPreference || 'none'} onChange={handleChange}>
                    <option value="none">None</option>
                    <option value="veg">Pure Veg</option>
                    <option value="non-veg">Non-Veg</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <label style={labelStyle}>House Rules / Special Policies</label>
                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} name="rules" value={formData.rules} onChange={handleChange}
                  placeholder="e.g. No smoking inside the house. Keep noise down after 10 PM. No pets allowed." />
              </div>
            </>)}

            {/* ── SECTION 5b: Type-Specific Details ─────────── */}
            {sectionWrap(<>
              {sectionHeader('5b. Type-Specific Details', `Extra details specific to ${formData.type} properties`)}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                {currentType === 'villa' && (
                  <>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" name="privatePool" checked={formData.privatePool} onChange={e => setFormData(p => ({...p, privatePool: e.target.checked}))} style={{ accentColor: '#58A429' }} /> Private Pool</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" name="gardenArea" checked={formData.gardenArea} onChange={e => setFormData(p => ({...p, gardenArea: e.target.checked}))} style={{ accentColor: '#58A429' }} /> Garden / Outdoor Area</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" name="chefAvailable" checked={formData.chefAvailable} onChange={e => setFormData(p => ({...p, chefAvailable: e.target.checked}))} style={{ accentColor: '#58A429' }} /> Chef / Caretaker Available</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" name="entirePropertyOnly" checked={formData.entirePropertyOnly} onChange={e => setFormData(p => ({...p, entirePropertyOnly: e.target.checked}))} style={{ accentColor: '#58A429' }} /> Entire Property Booking Only</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" name="securityCCTV" checked={formData.securityCCTV} onChange={e => setFormData(p => ({...p, securityCCTV: e.target.checked}))} style={{ accentColor: '#58A429' }} /> Security / CCTV</label>
                    <div>
                      <label style={labelStyle}>Number of Floors</label>
                      <input style={inputStyle} type="number" name="numberOfFloors" value={formData.numberOfFloors} onChange={handleChange} placeholder="e.g. 2" />
                    </div>
                    <div>
                      <label style={labelStyle}>Plot Size (sq ft)</label>
                      <input style={inputStyle} type="number" name="plotSize" value={formData.plotSize} onChange={handleChange} placeholder="e.g. 4000" />
                    </div>
                  </>
                )}
                {(currentType === 'resort' || currentType === 'hotel') && (
                  <>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" name="restaurantOnSite" checked={formData.restaurantOnSite} onChange={e => setFormData(p => ({...p, restaurantOnSite: e.target.checked}))} style={{ accentColor: '#58A429' }} /> Restaurant on-site</label>
                    {currentType === 'resort' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" name="spaWellness" checked={formData.spaWellness} onChange={e => setFormData(p => ({...p, spaWellness: e.target.checked}))} style={{ accentColor: '#58A429' }} /> Spa / Wellness Center</label>
                    )}
                    {currentType === 'resort' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" name="conferenceRoom" checked={formData.conferenceRoom} onChange={e => setFormData(p => ({...p, conferenceRoom: e.target.checked}))} style={{ accentColor: '#58A429' }} /> Conference Room</label>
                    )}
                    {currentType === 'hotel' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" name="receptionAllDay" checked={formData.receptionAllDay} onChange={e => setFormData(p => ({...p, receptionAllDay: e.target.checked}))} style={{ accentColor: '#58A429' }} /> Reception 24/7</label>
                    )}
                    {currentType === 'hotel' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" name="roomService" checked={formData.roomService} onChange={e => setFormData(p => ({...p, roomService: e.target.checked}))} style={{ accentColor: '#58A429' }} /> Room Service Available</label>
                    )}
                    {currentType === 'hotel' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" name="liftElevator" checked={formData.liftElevator} onChange={e => setFormData(p => ({...p, liftElevator: e.target.checked}))} style={{ accentColor: '#58A429' }} /> Lift / Elevator</label>
                    )}
                    <div>
                      <label style={labelStyle}>Star Rating (1-5)</label>
                      <input style={inputStyle} type="number" min="1" max="5" name="starRating" value={formData.starRating} onChange={handleChange} placeholder="e.g. 4" />
                    </div>
                    <div>
                      <label style={labelStyle}>Total Rooms</label>
                      <input style={inputStyle} type="number" name="totalRooms" value={formData.totalRooms} onChange={handleChange} placeholder="e.g. 24" />
                    </div>
                    {currentType === 'hotel' && (
                      <div>
                        <label style={labelStyle}>Total Floors</label>
                        <input style={inputStyle} type="number" name="totalFloors" value={formData.totalFloors} onChange={handleChange} placeholder="e.g. 5" />
                    </div>
                  )}
                    {currentType === 'resort' && (
                      <div style={{ gridColumn: 'span 3' }}>
                        <label style={labelStyle}>Activities Offered</label>
                        <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px', gap: '8px' }}>
                          {['Swimming', 'Trekking', 'Cycling', 'Yoga', 'Bonfire', 'Wildlife Safari'].map(act => (
                            <button key={act} type="button" onClick={() => {
                              const curr = formData.activities || [];
                              setFormData(p => ({...p, activities: curr.includes(act) ? curr.filter(a => a !== act) : [...curr, act]}));
                            }} style={{ padding: '6px 12px', borderRadius: '16px', fontSize: '12px', border: (formData.activities || []).includes(act) ? '1px solid #58A429' : '1px solid #D1D5DB', background: (formData.activities || []).includes(act) ? '#ECFDF5' : '#fff', color: (formData.activities || []).includes(act) ? '#58A429' : '#374151', cursor: 'pointer' }}>{act}</button>
                          ))}
                        </div>
                    </div>
                  )}
                  </>
                )}
                {currentType === 'apartment' && (
                  <>
                    <div>
                      <label style={labelStyle}>Floor Number</label>
                      <input style={inputStyle} type="number" name="floorNumber" value={formData.floorNumber} onChange={handleChange} placeholder="e.g. 3" />
                    </div>
                    <div>
                      <label style={labelStyle}>Total Floors in Building</label>
                      <input style={inputStyle} type="number" name="totalFloorsBuilding" value={formData.totalFloorsBuilding} onChange={handleChange} placeholder="e.g. 10" />
                    </div>
                    <div>
                      <label style={labelStyle}>Furnished Status</label>
                      <select style={selectStyle} name="furnishedStatus" value={formData.furnishedStatus} onChange={handleChange}>
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Semi Furnished">Semi Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" name="washingMachine" checked={formData.washingMachine} onChange={e => setFormData(p => ({...p, washingMachine: e.target.checked}))} style={{ accentColor: '#58A429' }} /> Washing Machine</label>
                    <div style={{ gridColumn: 'span 3' }}>
                      <label style={labelStyle}>Society Amenities</label>
                      <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px', gap: '8px' }}>
                        {['Gym', 'Pool', 'Security', 'Clubhouse', 'Power Backup'].map(act => (
                          <button key={act} type="button" onClick={() => {
                            const curr = formData.societyAmenities || [];
                            setFormData(p => ({...p, societyAmenities: curr.includes(act) ? curr.filter(a => a !== act) : [...curr, act]}));
                          }} style={{ padding: '6px 12px', borderRadius: '16px', fontSize: '12px', border: (formData.societyAmenities || []).includes(act) ? '1px solid #58A429' : '1px solid #D1D5DB', background: (formData.societyAmenities || []).includes(act) ? '#ECFDF5' : '#fff', color: (formData.societyAmenities || []).includes(act) ? '#58A429' : '#374151', cursor: 'pointer' }}>{act}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {currentType === 'cottage' && (
                  <>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" name="bonfireArea" checked={formData.bonfireArea} onChange={e => setFormData(p => ({...p, bonfireArea: e.target.checked}))} style={{ accentColor: '#58A429' }} /> Bonfire Area</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" name="outdoorSeating" checked={formData.outdoorSeating} onChange={e => setFormData(p => ({...p, outdoorSeating: e.target.checked}))} style={{ accentColor: '#58A429' }} /> Outdoor Seating</label>
                    <div>
                      <label style={labelStyle}>View Type</label>
                      <select style={selectStyle} name="viewType" value={formData.viewType} onChange={handleChange}>
                        <option value="Mountain">Mountain</option>
                        <option value="Forest">Forest</option>
                        <option value="River">River</option>
                        <option value="Valley">Valley</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Nearest Hiking Trail</label>
                      <input style={inputStyle} type="text" name="nearestHikingTrail" value={formData.nearestHikingTrail} onChange={handleChange} placeholder="e.g. Pine Ridge Trail" />
                    </div>
                    <div>
                      <label style={labelStyle}>Distance from City (km)</label>
                      <input style={inputStyle} type="number" name="distanceFromCity" value={formData.distanceFromCity} onChange={handleChange} placeholder="e.g. 15" />
                    </div>
                  </>
                )}
                {currentType === 'homestay' && (
                  <div style={{ gridColumn: 'span 3', color: '#6B7280', fontSize: '13px' }}>
                    All required Homestay fields are covered in other sections.
                    </div>
                  )}
              </div>
            </>)}

            {/* ── SECTION 5c: Rooms (Hotel / Resort only) ──────── */}
            {(currentType === 'hotel' || currentType === 'resort') && sectionWrap(<>
              {sectionHeader('5c. Room Types', 'Add different room types for your Hotel/Resort (e.g., Deluxe, Suite, Standard)')}
              {/* Room form row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px', alignItems: 'flex-end' }}>
                <div>
                  <label style={labelStyle}>Room Type</label>
                  <select style={selectStyle} value={roomForm.roomType} onChange={e => setRoomForm(p => ({ ...p, roomType: e.target.value }))}>
                    {roomTypes.map(rt => <option key={rt._id} value={rt.name}>{rt.name}</option>)}
                    {roomTypes.length === 0 && ['Standard', 'Deluxe', 'Suite', 'Executive', 'Premium', 'Presidential', 'Family Room', 'Double', 'Single', 'Twin'].map(t => <option key={t} value={t}>{t}</option>)}
                    <option value="Other">Other (Add Manually)</option>
                  </select>
                  {roomForm.roomType === 'Other' && (
                    <input style={{ ...inputStyle, marginTop: '8px' }} type="text" value={customRoomType} onChange={e => setCustomRoomType(e.target.value)} placeholder="e.g. Penthouse" required />
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Room Name / Label</label>
                  <input style={inputStyle} type="text" value={roomForm.roomName} onChange={e => setRoomForm(p => ({ ...p, roomName: e.target.value }))} placeholder="e.g. Sea View Suite" />
                </div>
                <div>
                  <label style={labelStyle}>Price/Night (₹)</label>
                  <input style={inputStyle} type="number" value={roomForm.pricePerNight} onChange={e => setRoomForm(p => ({ ...p, pricePerNight: e.target.value }))} placeholder="e.g. 3500" />
                </div>
                <div>
                  <label style={labelStyle}>Bed Type</label>
                  <select style={selectStyle} value={roomForm.bedType} onChange={e => setRoomForm(p => ({ ...p, bedType: e.target.value }))}>
                    {['Single', 'Double', 'Queen', 'King', 'Twin', 'Bunk'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={labelStyle}>Max Guests</label>
                    <input style={inputStyle} type="number" min={1} value={roomForm.maxGuests} onChange={e => setRoomForm(p => ({ ...p, maxGuests: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Count</label>
                    <input style={inputStyle} type="number" min={1} value={roomForm.count} onChange={e => setRoomForm(p => ({ ...p, count: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', Math: 'flex-end', marginBottom: '12px', width: '40%' }}>
              </div>
              <button type="button"
                onClick={() => {
                  if (!roomForm.roomName.trim() || !roomForm.pricePerNight) { alert('Please fill Room Name and Price.'); return; }
                  const finalRoomType = roomForm.roomType === 'Other' ? customRoomType : roomForm.roomType;
                  if (roomForm.roomType === 'Other' && !finalRoomType.trim()) { alert('Please enter custom room type.'); return; }
                  setRoomsList(prev => [...prev, { ...roomForm, roomType: finalRoomType, pricePerNight: Number(roomForm.pricePerNight), maxGuests: Number(roomForm.maxGuests), count: Number(roomForm.count) }]);
                  setRoomForm({ roomType: 'Deluxe', roomName: '', pricePerNight: '', maxGuests: 2, bedType: 'Double', count: 1, amenities: [] });
                  setCustomRoomType('');
                }}
                style={{ padding: '8px 20px', background: '#58A429', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: 600, marginBottom: 12 }}>
                + Add Room Type
              </button>
              {/* Room list */}
              {roomsList.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {roomsList.map((room, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '10px 14px' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>{room.roomName || room.roomType}</span>
                        <span style={{ color: '#6B7280', fontSize: 12, marginLeft: 8 }}>{room.roomType} · {room.bedType} bed · {room.maxGuests} guests · {room.count} rooms</span>
                        <span style={{ color: '#6B7280', fontSize: 12, marginLeft: 8 }}>{room.roomType} · {room.bedType} bed · {room.maxGuests} guests · {room.count} rooms</span>
                        <span style={{ color: '#58A429', fontWeight: 600, fontSize: 13, marginTop: 4, display: 'block' }}>₹{room.pricePerNight}/night</span>
                      </div>
                      <button type="button" onClick={() => setRoomsList(prev => prev.filter((_, i) => i !== idx))}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
                    </div>
                  ))}
                </div>
              )}
              {roomsList.length === 0 && <p style={{ fontSize: 12, color: '#9CA3AF' }}>No room types added yet. Add at least one room type for guests to see.</p>}
            </>)}

            {/* ── SECTION 6: Highlights ─────────────────────── */}
            {sectionWrap(<>
              {sectionHeader('6. Property Highlights', 'These appear as quick info bullets on the property listing page')}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { key: 'breakfastIncluded', label: '🍳 Breakfast Included', desc: 'Shown as "Breakfast Included" on listing' },
                  { key: 'parkingAvailable', label: '🚗 Parking Available', desc: 'Shown as "Parking Available" on listing' },
                ].map(h => (
                  <label key={h.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={highlights[h.key]}
                      onChange={e => setHighlights(prev => ({ ...prev, [h.key]: e.target.checked }))}
                      style={{ width: '18px', height: '18px', accentColor: '#58A429', cursor: 'pointer' }} />
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>{h.label}</span>
                      <span style={{ fontSize: '11px', color: '#9CA3AF', marginLeft: '8px' }}>{h.desc}</span>
                    </div>
                  </label>
                ))}
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={highlights.freeCancellation}
                    onChange={e => setHighlights(prev => ({ ...prev, freeCancellation: e.target.checked }))}
                    style={{ width: '18px', height: '18px', accentColor: '#58A429', cursor: 'pointer' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>❌ Free Cancellation till</span>
                    <input type="number" value={highlights.freeCancellationHours} disabled={!highlights.freeCancellation}
                      onChange={e => setHighlights(prev => ({ ...prev, freeCancellationHours: e.target.value }))}
                      style={{ ...inputStyle, width: '70px', display: 'inline-block', padding: '4px 8px' }} />
                    <span style={{ fontSize: '13px', color: '#374151', fontFamily: '"Outfit", sans-serif' }}>hrs before check-in</span>
                  </div>
                </label>
              </div>
            </>)}

            {/* ── SECTION 7: Amenities ─────────────────────── */}
            {sectionWrap(<>
              {sectionHeader('7. Amenities', `Showing amenities for: ${formData.type} — select all that your property has`)}
              {amenitiesLoading ? (
                <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Loading amenities...</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px', gap: '8px' }}>
                  {availableAmenitiesList.map(am => {
                    const isSelected = selectedAmenitiesList.includes(am);
                    return (
                      <button key={am} type="button"
                        onClick={() => setSelectedAmenitiesList(prev => prev.includes(am) ? prev.filter(a => a !== am) : [...prev, am])}
                        style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, border: isSelected ? '1.5px solid #58A429' : '1px solid #D1D5DB', background: isSelected ? '#ECFDF5' : '#fff', color: isSelected ? '#58A429' : '#374151', cursor: 'pointer', transition: 'all 0.15s', fontFamily: '"Outfit", sans-serif' }}>
                        {am}
                      </button>
                    );
                  })}
                  {availableAmenitiesList.length === 0 && <span style={{ fontSize: '12px', color: '#9CA3AF' }}>No amenities found for this property type.</span>}
                    </div>
                  )}
              {selectedAmenitiesList.length > 0 && (
                <p style={{ marginTop: '10px', fontSize: '12px', color: '#6B7280', fontFamily: '"Outfit", sans-serif' }}>
                  ✅ Selected: <strong style={{ color: '#58A429' }}>{selectedAmenitiesList.join(', ')}</strong>
                </p>
              )}
            </>)}

            {/* ── SECTION 8: Unique Experiences ────────────── */}
            {sectionWrap(<>
              {sectionHeader('8. Unique Experiences', 'Tag your property with special experiences — customers use these to filter listings')}
              {experiencesLoading ? (
                <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Loading experiences...</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px', gap: '10px' }}>
                  {availableExperiences.map(exp => {
                    const id = exp._id || exp.experienceName || exp.name;
                    const isSelected = selectedExperiences.includes(id);
                    return (
                      <button key={id} type="button"
                        onClick={() => !isSelected && setSelectedExperiences(prev => [...prev, id])}
                        style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, border: isSelected ? '1.5px solid #58A429' : '1px solid #D1D5DB', background: isSelected ? '#ECFDF5' : '#fff', color: isSelected ? '#58A429' : '#374151', cursor: 'pointer', transition: 'all 0.15s', fontFamily: '"Outfit", sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>

                        <span>{exp.experienceName || exp.name}</span>
                        {isSelected && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedExperiences(prev => prev.filter(e => e !== id));
                            }}
                            style={{ fontSize: '16px', marginLeft: '4px' }}
                          >
                            &times;
                          </span>
                        )}
                      </button>
                    );
                  })}
                  {availableExperiences.length === 0 && (
                    <p style={{ fontSize: '12px', color: '#9CA3AF' }}>No experiences available. Ask admin to add them in Unique Experience Master.</p>
                  )}
                      <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
                        <input type="text" value={newCustomExp} onChange={e => setNewCustomExp(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomExperience(); } }} placeholder="Add custom experience" style={{ padding: '6px 12px', fontSize: 13, border: '1px solid #D1D5DB', borderRadius: 6, flex: 1, maxWidth: 200 }} />
                        <button type="button" onClick={handleAddCustomExperience} style={{ padding: '6px 12px', background: '#58A429', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Add</button>
                      </div>
                    </div>
                  )}
            </>)}

            {/* ── SECTION 9: Nearby Landmarks ───────────────── */}
            {sectionWrap(<>
              {sectionHeader('9. Nearby Landmarks', 'Add nearby tourist spots, beaches, markets etc — shown on the Location tab of your property')}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" style={{ ...inputStyle, flex: 1 }} value={landmarkName} onChange={e => setLandmarkName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddLandmark(); } }}
                    placeholder="e.g. Anjuna Flea Market, Candolim Beach" />
                  <select style={{ ...selectStyle, width: '180px' }} value={landmarkType} onChange={e => setLandmarkType(e.target.value)}>
                    {['Tourist Popular','Beach','Market','Temple','Airport','Railway Station','Bus Stand','Restaurant','Waterfall','Forest'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '12px', color: '#4B5563', fontWeight: 500, whiteSpace: 'nowrap' }}>Landmark Photo:</label>
                  <input type="file" ref={landmarkImageRef} accept="image/jpg,image/jpeg,image/png"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return; }
                      setLandmarkImageFile(file);
                      setLandmarkImagePreview(URL.createObjectURL(file));
                    }}
                    style={{ flex: 1, fontSize: '12px' }} />
                  {landmarkImagePreview && <img src={landmarkImagePreview} alt="preview" style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #D1D5DB' }} />}
                  <button type="button" onClick={handleAddLandmark} disabled={landmarkImageUploading}
                    style={{ padding: '8px 16px', background: landmarkImageUploading ? '#9CA3AF' : '#58A429', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap', fontFamily: '"Outfit", sans-serif' }}>
                    {landmarkImageUploading ? 'Uploading...' : '+ Add Landmark'}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px', gap: '8px' }}>
                {landmarksList.map((lm, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F3F4F6', padding: '6px 10px 6px 6px', borderRadius: '16px', fontSize: '13px', border: '1px solid #E5E7EB' }}>
                    {lm.landmark_image_url ? <img src={lm.landmark_image_url} alt="" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} /> : <span>📍</span>}
                    <span>{lm.landmark_name} <span style={{ color: '#9CA3AF', fontSize: '11px' }}>— {lm.landmark_type}</span></span>
                    <button type="button" onClick={() => handleRemoveLandmark(idx, lm)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '16px', lineHeight: '14px' }}>&times;</button>
                  </div>
                ))}
                {landmarksList.length === 0 && <span style={{ fontSize: '13px', color: '#9CA3AF' }}>No landmarks added yet.</span>}
              </div>
            </>)}

            {/* ── SECTION 10: About Property ───────────────── */}
            {sectionWrap(<>
              {sectionHeader('10. About Property', 'Detailed description shown on the property listing — make it compelling!')}
                  <textarea style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} name="description" value={formData.description} onChange={handleChange}
                placeholder="Experience a comfortable and refined stay at... describe your property in detail, mention nearby attractions, what makes it special..." required />
            </>)}

            {/* Submit Button Bottom */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              {formStep === 2 && (
                <button type="button" onClick={() => setFormStep(1)}
                  style={{ padding: '10px 28px', background: '#fff', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: '24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' }}>
                  Back
                </button>
              )}
              <button type="button" onClick={resetForm}
                style={{ padding: '10px 28px', background: '#fff', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: '24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' }}>
                Cancel
              </button>
              {formStep === 1 ? (
                <button type="button" onClick={() => { setFormStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ padding: '10px 36px', background: '#58A429', color: '#fff', border: 'none', borderRadius: '24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 2px 8px rgba(88,164,41,0.2)' }}>
                  Next Step →
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={loading}
                  style={{ padding: '10px 36px', background: '#58A429', color: '#fff', border: 'none', borderRadius: '24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 2px 8px rgba(88,164,41,0.2)' }}>
                  {loading ? 'Saving...' : (editId ? '✅ Update Property' : '✅ Add Property')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )}

      {/* ── Property List Table ───────────────────────────────── */}
      <div style={{ margin: '0 24px 24px' }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', width: '100%' }}>
          <div className="table-header" style={{ padding: '14px 20px', display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="table-title" style={{ whiteSpace: 'nowrap' }}>My Property List</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px', paddingBottom: '4px', maxWidth: '100%' }}>
              <DateRangeDropdown 
                startDate={filterDateFrom}
                endDate={filterDateTo}
                onChange={(start, end) => {
                  setFilterDateFrom(start);
                  setFilterDateTo(end);
                }}
              />
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '5px 8px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '11px', color: '#374151', outline: 'none', background: '#ffffff', cursor: 'pointer', flexShrink: 0, maxWidth: '100px' }}>
                <option value="">Property Type</option>
                {['Homestay','Villa','Apartment','Resort','Cottage','Hotel'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <button onClick={() => { setFilterType(''); setFilterSearch(''); setFilterDateFrom(''); setFilterDateTo(''); }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', border: '1px solid #58A429', color: '#58A429', borderRadius: '8px', fontWeight: 600, fontSize: '11px', background: '#FAFDF2', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
                <Filter size={12} /> Clear
              </button>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 1, minWidth: '80px', maxWidth: '140px' }}>
                <Search size={14} style={{ position: 'absolute', left: '8px', color: '#9CA3AF' }} />
                <input type="text" value={filterSearch} onChange={e => setFilterSearch(e.target.value)} placeholder="Search"
                  style={{ padding: '6px 8px 6px 26px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '11px', width: '100%', outline: 'none', background: '#ffffff' }} />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto', width: '100%', display: 'block' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1050px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  {['Property No','Image','Property Name','Location','Category','Price/Night','Rooms','Enquiries','Rating','Status','Actions'].map(h => (
                    <th key={h} style={{ minWidth: { 'Property No': 100, 'Image': 80, 'Property Name': 200, 'Location': 180, 'Category': 100, 'Price/Night': 100, 'Rooms': 80, 'Enquiries': 90, 'Rating': 80, 'Status': 90, 'Actions': 80 }[h], color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px', fontFamily: '"Outfit", sans-serif', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedProps.length > 0 ? paginatedProps.map((p, i) => (
                  <tr key={p._id || i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ color: '#58A429', fontWeight: 600, padding: '14px', fontSize: '13px' }}>{p.propertyNo}</td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ width: 44, height: 34, background: '#E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                        <img src={p.images?.[0] || 'https://via.placeholder.com/44x34'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                      </div>
                    </td>
                    <td style={{ color: '#111827', fontWeight: 500, padding: '14px', fontSize: '13px', whiteSpace: 'normal', maxWidth: '200px' }}>
                      <ReadMore lines={2}>{p.name}</ReadMore>
                    </td>
                    <td style={{ padding: '14px', whiteSpace: 'normal', maxWidth: '180px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <ReadMore lines={2}>
                          <span style={{ fontWeight: 400, color: '#4B5563', fontSize: '13px' }}>
                            {p.full_address || p.location || (p.cityName || p.city)}
                          </span>
                          <span style={{ fontSize: '11px', color: '#9CA3AF', marginLeft: '4px' }}>
                            {!p.full_address && !p.location ? (p.stateName || p.state) : ''}
                          </span>
                        </ReadMore>
                      </div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className="category-pill" style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 500, background: '#DCFCE7', color: '#58A429' }}>{p.type}</span>
                    </td>
                    <td style={{ color: '#111827', fontWeight: 600, padding: '14px', fontSize: '13px' }}>₹{(p.price_per_night !== undefined ? p.price_per_night : p.price)?.toLocaleString()}</td>
                    <td style={{ color: '#374151', fontWeight: 500, padding: '14px', fontSize: '13px' }}>{p.bedRooms || 1}</td>
                    <td style={{ color: '#374151', fontWeight: 500, padding: '14px', fontSize: '13px' }}>{enquiryCounts[p._id] || 0}</td>
                    <td style={{ color: '#D97706', fontWeight: 600, padding: '14px', fontSize: '13px' }}>{p.rating || '—'}</td>
                    <td style={{ padding: '14px' }}>
                      <span onClick={() => handleStatusToggle(p._id, p.status)} title="Click to toggle"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', userSelect: 'none', background: p.status === 'Active' ? '#DCFCE7' : p.status === 'Pending' ? '#FEF3C7' : '#FEE2E2', color: p.status === 'Active' ? '#58A429' : p.status === 'Pending' ? '#D97706' : '#EF4444' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} /> {p.status}
                      </span>
                    </td>
                      <td style={{ padding: '14px', position: 'relative', overflow: 'visible' }} onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={() => setActionMenu(actionMenu === p._id ? null : p._id)} style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}>
                          <MoreVertical size={16} />
                        </button>
                        {actionMenu === p._id && (
                          <div style={{ position: 'absolute', right: 16, top: (paginatedProps.length <= 3 || i < paginatedProps.length - 2) ? 36 : 'auto', bottom: (paginatedProps.length <= 3 || i < paginatedProps.length - 2) ? 'auto' : 36, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 100, minWidth: 140 }}>
                            <button type="button" onClick={() => { 
                              setActionMenu(null); 
                              setViewingProperty(p); 
                              setTimeout(() => document.getElementById('property-detail-div')?.scrollIntoView({ behavior: 'smooth' }), 100);
                            }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 13, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }}>
                              👁 View Details
                            </button>
                            <button type="button" onClick={() => { setActionMenu(null); handleEdit(p); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 13, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }}>
                              ✎ Edit Property
                            </button>
                            <button type="button" onClick={() => { setActionMenu(null); handleDelete(p._id); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 13, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                              ⊘ Delete
                            </button>
                          </div>
                        )}
                      </td>
                  </tr>
                )) : (
                  <tr><td colSpan="11" style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: '13px' }}>No properties found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {properties.length > 0 && (
            <div style={{ margin: '0 -24px -24px' }}>
              <Pagination 
                currentPage={currentPage} 
                totalItems={properties.length} 
                itemsPerPage={itemsPerPage} 
                onPageChange={setCurrentPage} 
              />
            </div>
          )}
        </div>
      </div>

      {viewingProperty && (
        <div style={{ margin: '0 39px 24px' }}>
          <PropertyViewModal property={viewingProperty} onClose={() => setViewingProperty(null)} inline={true} />
        </div>
      )}
    </div>
  );
}
