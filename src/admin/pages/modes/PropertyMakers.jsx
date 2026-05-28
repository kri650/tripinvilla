import React, { useState, useEffect } from "react";
import { ChevronDown, Edit2, Trash2, MoreVertical, BedDouble } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropertyRoomManager from "../properties/PropertyRoomManager";

const parseNumber = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return '';
  const parsed = parseFloat(String(val).replace(/[^\d.-]/g, ''));
  return isNaN(parsed) ? '' : parsed;
};

export default function PropertyMakers() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const paginatedProperties = properties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const [formData, setFormData] = useState({
    id: "",
    propertyType: "Homestay",
    propertyName: "",
    ownerName: "",
    ownerContact: "",
    ownerId: "",
    amenities: [],
    location: "",
    full_address: "",
    latitude: "",
    longitude: "",
    propertyPrice: "",
    originalPrice: "",
    taxAmount: "",
    imagesUrl: "",
    videosUrl: "",
    aboutProperty: "",
    status: "Active",
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    area: "31 sq. ft.",
    bedRooms: 1,
    beds: 2,
    capacity: 3,
    bathRooms: 1,
    rules:
      "• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s).",
    highlights: {
      breakfastIncluded: false,
      parkingAvailable: false,
      freeCancellation: false,
      freeCancellationHours: "24",
    },
    privatePool: false, gardenArea: false, chefAvailable: false, entirePropertyOnly: false, securityCCTV: false, numberOfFloors: "", plotSize: "",
    restaurantOnSite: false, spaWellness: false, conferenceRoom: false, roomService: false, receptionAllDay: false, liftElevator: false, starRating: "", totalRooms: "", totalFloors: "", activities: [],
    floorNumber: "", totalFloorsBuilding: "", furnishedStatus: "Fully Furnished", washingMachine: false, societyAmenities: [],
    bonfireArea: false, viewType: "Mountain", outdoorSeating: false, nearestHikingTrail: "", distanceFromCity: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [managingRoomsProperty, setManagingRoomsProperty] = useState(null);

  // Owners Data
  const [ownersList, setOwnersList] = useState([]);

  // Upload/images state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const [roomForm, setRoomForm] = useState({ roomType: 'Deluxe', roomName: '', imageUrl: '', pricePerNight: '', maxGuests: 2, bedType: 'Double', count: 1, amenities: [], checkIn: '3:00 PM', checkOut: '12:00 PM', offer: '', rules: '• Primary Guest should be atleast 18 years of age.' });
  const fileInputRef = React.useRef(null);

  // Amenities list
  const [selectedAmenitiesList, setSelectedAmenitiesList] = useState([]);
  const [availableAmenitiesList, setAvailableAmenitiesList] = useState([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(false);

  // Experiences list
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [availableExperiences, setAvailableExperiences] = useState([]);
  const [experiencesLoading, setExperiencesLoading] = useState(false);
  const [newCustomExp, setNewCustomExp] = useState("");

  // Location dropdowns state
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [allLocations, setAllLocations] = useState([]); // All LocationMaster entries as fallback
  const [selectedCountry, setSelectedCountry] = useState({ id: '', name: '' });
  const [selectedState, setSelectedState] = useState({ id: '', name: '' });
  const [selectedCity, setSelectedCity] = useState({ id: '', name: '' });
  const [selectedArea, setSelectedArea] = useState({ id: '', name: '' });
  // Manual input mode for each location level
  const [manualLocation, setManualLocation] = useState({ country: false, state: false, city: false, area: false });
  const [manualValues, setManualValues] = useState({ country: '', state: '', city: '', area: '' });

  // Landmarks state
  const [landmarksList, setLandmarksList] = useState([]);
  const [landmarkName, setLandmarkName] = useState("");
  const [landmarkType, setLandmarkType] = useState("Tourist Popular");
  const [landmarkImageFile, setLandmarkImageFile] = useState(null);
  const [landmarkImagePreview, setLandmarkImagePreview] = useState("");
  const [landmarkImageUploading, setLandmarkImageUploading] = useState(false);
  const landmarkImageRef = React.useRef(null);

  // Room Image state
  const [roomImageFile, setRoomImageFile] = useState(null);
  const [roomImagePreview, setRoomImagePreview] = useState("");
  const [roomImageUploading, setRoomImageUploading] = useState(false);
  const roomImageRef = React.useRef(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/properties`);
      const data = await res.json();
      if (Array.isArray(data)) setProperties(data);
    } catch (err) {
      console.error("Error fetching property masters:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/owners`);
      const data = await res.json();
      if (data && data.owners) setOwnersList(data.owners);
      else if (Array.isArray(data)) setOwnersList(data);
    } catch (err) {
      console.error("Error fetching owners:", err);
    }
  };

  const fetchAmenitiesForType = async (type) => {
    setAmenitiesLoading(true);
    try {
      const scope = type || "All";
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/admin/amenities/active?scope=${scope}`,
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setAvailableAmenitiesList(data.map((a) => a.amenitiesName));
      }
    } catch (err) {
      console.error(err);
      setAvailableAmenitiesList([
        "WiFi",
        "Parking",
        "Pool",
        "AC",
        "Kitchen",
        "Barbeque",
        "Gym",
      ]);
    } finally {
      setAmenitiesLoading(false);
    }
  };

  const handleAddCustomExperience = async () => {
    if (!newCustomExp.trim()) return;
    try {
      const API_ENDPOINT =
        typeof API !== "undefined" ? API : `${import.meta.env.VITE_API_BASE}`;
      const res = await fetch(`${API_ENDPOINT}/admin/experiences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceName: newCustomExp.trim(),
          representingIcon: "✨",
          status: "Active",
        }),
      });
      const data = await res.json();
      setAvailableExperiences((prev) => [...prev, data]);
      setSelectedExperiences((prev) => [
        ...prev,
        data._id || data.experienceName || data.name,
      ]);
      setNewCustomExp("");
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExperiences = async () => {
    setExperiencesLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/admin/experiences/active`,
      );
      const data = await res.json();
      if (Array.isArray(data)) setAvailableExperiences(data);
    } catch (err) {
      console.error(err);
      setAvailableExperiences([]);
    } finally {
      setExperiencesLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/masters/countries`);
      const data = await res.json();
      setCountries(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStates = async (countryId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/masters/states/active?country_id=${countryId}`,
      );
      const data = await res.json();
      setStates(data);
      setCities([]);
      setAreas([]);
      setSelectedState({ id: "", name: "" });
      setSelectedCity({ id: "", name: "" });
      setSelectedArea({ id: "", name: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/masters/cities/active?state_id=${stateId}`,
      );
      const data = await res.json();
      setCities(data);
      setAreas([]);
      setSelectedCity({ id: "", name: "" });
      setSelectedArea({ id: "", name: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAreas = async (cityId, cityName) => {
    try {
      // Pass city_name so the backend can match by parentLocation (stored as name, not ID)
      const params = new URLSearchParams();
      if (cityId) params.set('city_id', cityId);
      if (cityName) params.set('city_name', cityName);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/masters/locations/active?${params.toString()}`,
      );
      const data = await res.json();
      // If no matching areas found, fallback to ALL locations from LocationMaster
      if (Array.isArray(data) && data.length === 0) {
        setAreas(allLocations);
      } else {
        setAreas(Array.isArray(data) ? data : []);
      }
      setSelectedArea({ id: '', name: '' });
    } catch (err) {
      console.error(err);
      setAreas(allLocations); // Always show all on error
    }
  };

  const fetchAllLocations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/masters/locations/active`);
      const data = await res.json();
      if (Array.isArray(data)) setAllLocations(data);
    } catch (err) {
      console.error('Error fetching all locations:', err);
    }
  };


  useEffect(() => {
    fetchProperties();
    fetchOwners();
    fetchCountries();
    fetchExperiences();
    fetchAmenitiesForType("Homestay");
    fetchAllLocations();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "propertyType") {
      setSelectedAmenitiesList([]);
      fetchAmenitiesForType(value);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleOwnerSelect = (e) => {
    const ownerId = e.target.value;
    const selectedOwner = ownersList.find((o) => o._id === ownerId);
    if (selectedOwner) {
      setFormData((prev) => ({
        ...prev,
        ownerId: ownerId,
        ownerName: selectedOwner.ownerName || selectedOwner.name,
        ownerContact: selectedOwner.phone || "",
      }));
    } else {
      const adminUserStr = localStorage.getItem("admin_user");
      if (adminUserStr) {
        try {
          const adminUser = JSON.parse(adminUserStr);
          const adminId = String(adminUser.id || adminUser._id);
          if (adminId === String(ownerId)) {
            setFormData((prev) => ({
              ...prev,
              ownerId: ownerId,
              ownerName: adminUser.name || "Admin",
              ownerContact: adminUser.phone || "",
            }));
            return;
          }
        } catch (err) { }
      }
      setFormData((prev) => ({
        ...prev,
        ownerId: "",
        ownerName: "",
        ownerContact: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const totalAllowed = 30 - existingImages.length;
    const combined = [...selectedFiles, ...newFiles].slice(0, totalAllowed);
    setSelectedFiles(combined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveNewFile = (idx) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddLandmark = async () => {
    if (!landmarkName.trim()) return;
    setLandmarkImageUploading(true);
    let imageUrl = "";
    try {
      if (landmarkImageFile) {
        const uploadData = new FormData();
        uploadData.append("images", landmarkImageFile);
        const token = localStorage.getItem("admin_token");
        const uploadRes = await fetch(
          `${import.meta.env.VITE_API_BASE}/properties/upload`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: uploadData,
          },
        );
        const uploadDataJson = await uploadRes.json();
        if (
          uploadDataJson &&
          uploadDataJson.urls &&
          uploadDataJson.urls.length > 0
        ) {
          imageUrl = uploadDataJson.urls[0];
        }
      }
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setLandmarkImageUploading(false);
    }

    const lmData = {
      landmark_name: landmarkName.trim(),
      landmark_type: landmarkType,
      landmark_image_url: imageUrl,
    };
    setLandmarksList((prev) => [...prev, lmData]);
    setLandmarkName("");
    setLandmarkImageFile(null);
    setLandmarkImagePreview("");
    if (landmarkImageRef.current) landmarkImageRef.current.value = "";
  };

  const resetForm = () => {
    setFormData({
      id: "", propertyType: "Homestay", propertyName: "", ownerName: "", ownerContact: "", ownerId: "",
      amenities: [], location: "", full_address: "", latitude: "", longitude: "",
      propertyPrice: "", originalPrice: "", taxAmount: "", imagesUrl: "", videosUrl: "",
      aboutProperty: "", status: "Active", checkIn: "3:00 PM", checkOut: "12:00 PM",
      area: "31 sq. ft.", bedRooms: 1, beds: 2, capacity: 3, bathRooms: 1,
      rules: "• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s).",
      highlights: { breakfastIncluded: false, parkingAvailable: false, freeCancellation: false, freeCancellationHours: "24" },
    });
    setSelectedExperiences([]);
    setSelectedAmenitiesList([]);
    setCountries([]); setStates([]); setCities([]); setAreas([]);
    setSelectedCountry({ id: "", name: "" }); setSelectedState({ id: "", name: "" });
    setSelectedCity({ id: "", name: "" }); setSelectedArea({ id: "", name: "" });
    setManualLocation({ country: false, state: false, city: false, area: false });
    setManualValues({ country: '', state: '', city: '', area: '' });
    setExistingImages([]); setRoomsList([]);
    setRoomForm({ roomType: 'Deluxe', roomName: '', imageUrl: '', pricePerNight: '', maxGuests: 2, bedType: 'Double', count: 1, amenities: [], checkIn: '3:00 PM', checkOut: '12:00 PM', offer: '', rules: '• Primary Guest should be atleast 18 years of age.' });
    setSelectedFiles([]); setLandmarksList([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.propertyName) { alert('Property Name is required.'); return; }
    if (!formData.propertyPrice) { alert('Property Price is required.'); return; }
    try {
      const payload = {
        ...formData,
        countryId: selectedCountry.id || undefined,
        countryName: selectedCountry.name || undefined,
        stateId: selectedState.id || undefined,
        stateName: selectedState.name || undefined,
        cityId: selectedCity.id || undefined,
        cityName: selectedCity.name || undefined,
        locationId: selectedArea.id || undefined,
        locationName: selectedArea.name || undefined,
        address: selectedArea.name ? [selectedArea.name, selectedCity.name, selectedState.name, selectedCountry.name].filter(Boolean).join(', ') : formData.location,
        location: selectedArea.name ? [selectedArea.name, selectedCity.name, selectedState.name, selectedCountry.name].filter(Boolean).join(', ') : formData.location,
        city: selectedCity.name || undefined,
        state: selectedState.name || undefined,
        country: selectedCountry.name || undefined,
        full_address: formData.full_address || (selectedArea.name ? [selectedArea.name, selectedCity.name, selectedState.name, selectedCountry.name].filter(Boolean).join(', ') : formData.location),
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        owner: formData.ownerId || undefined,
        amenities: selectedAmenitiesList,
        experiences: selectedExperiences,
        price_per_night: Number(formData.propertyPrice),
        price: Number(formData.propertyPrice),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        taxAmount: formData.taxAmount ? Number(formData.taxAmount) : undefined,
        highlights: formData.highlights,
        landmarks: landmarksList,
        privatePool: formData.privatePool, gardenArea: formData.gardenArea, chefAvailable: formData.chefAvailable, entirePropertyOnly: formData.entirePropertyOnly, securityCCTV: formData.securityCCTV, numberOfFloors: formData.numberOfFloors, plotSize: formData.plotSize,
        restaurantOnSite: formData.restaurantOnSite, spaWellness: formData.spaWellness, conferenceRoom: formData.conferenceRoom, roomService: formData.roomService, receptionAllDay: formData.receptionAllDay, liftElevator: formData.liftElevator, starRating: formData.starRating, totalRooms: formData.totalRooms, totalFloors: formData.totalFloors, activities: formData.activities,
        floorNumber: formData.floorNumber, totalFloorsBuilding: formData.totalFloorsBuilding, furnishedStatus: formData.furnishedStatus, washingMachine: formData.washingMachine, societyAmenities: formData.societyAmenities,
        bonfireArea: formData.bonfireArea, viewType: formData.viewType, outdoorSeating: formData.outdoorSeating, nearestHikingTrail: formData.nearestHikingTrail, distanceFromCity: formData.distanceFromCity,
        images: existingImages.filter(u => u && !u.startsWith('blob:')),
        rooms: roomsList,
      };

      const submitData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value) || typeof value === 'object') {
          submitData.append(key, JSON.stringify(value));
        } else {
          submitData.append(key, value);
        }
      });
      selectedFiles.forEach((file) => {
        submitData.append("images", file);
      });

      if (isEditing) {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE}/master/properties/${formData.id}`,
          { method: "PUT", body: submitData },
        );
        if (res.ok) {
          alert('Property updated successfully!');
          fetchProperties();
          resetForm();
        } else {
          const d = await res.json().catch(() => ({}));
          alert(d.message || 'Failed to update property. Please try again.');
        }
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/properties`, {
          method: "POST",
          body: submitData,
        });
        if (res.ok) {
          alert('Property added successfully! It is now visible on the guest website.');
          fetchProperties();
          resetForm();
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        } else {
          const d = await res.json().catch(() => ({}));
          alert(d.message || 'Failed to add property. Please try again.');
        }
      }
    } catch (err) {
      console.error("Error submitting property master:", err);
      alert('Network error. Please check your connection and try again.');
    }
  };

  const handleEdit = (p) => {
    setFormData({
      id: p._id,
      propertyType: p.propertyType || "Homestay",
      propertyName: p.propertyName || "",
      ownerName: p.ownerName || "",
      ownerContact: p.ownerContact || "",
      ownerId: p.owner || "",
      amenities: Array.isArray(p.amenities) ? p.amenities : [],
      location: p.location || "",
      full_address: p.full_address || p.location || "",
      latitude: parseNumber(p.latitude),
      longitude: parseNumber(p.longitude),
      propertyPrice: parseNumber(p.price || p.propertyPrice),
      originalPrice: parseNumber(p.originalPrice),
      taxAmount: parseNumber(p.taxAmount),
      imagesUrl: "",
      videosUrl: "",
      aboutProperty: p.aboutProperty || p.description || "",
      status: p.status || "Active",
      checkIn: p.checkIn || "3:00 PM",
      checkOut: p.checkOut || "12:00 PM",
      area: p.area || "31 sq. ft.",
      bedRooms: p.bedRooms || 1,
      beds: p.beds || 2,
      capacity: p.capacity || 3,
      bathRooms: p.bathRooms || 1,
      rules:
        p.rules ||
        "• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s).",
      highlights: p.highlights || {
        breakfastIncluded: false,
        parkingAvailable: false,
        freeCancellation: false,
        freeCancellationHours: "24",
      },
    });
    setRoomsList(Array.isArray(p.rooms) ? p.rooms : []);
    setSelectedAmenitiesList(Array.isArray(p.amenities) ? p.amenities : []);
    setSelectedExperiences(
      Array.isArray(p.experiences) ? p.experiences.map((e) => e._id || e) : [],
    );
    setExistingImages(Array.isArray(p.images) ? p.images : []);
    setLandmarksList(Array.isArray(p.landmarks) ? p.landmarks : []);
    if (p.countryId) {
      setSelectedCountry({ id: p.countryId, name: p.countryName || p.country });
      fetchStates(p.countryId);
    }
    if (p.stateId) {
      setSelectedState({ id: p.stateId, name: p.stateName || p.state });
      fetchCities(p.stateId);
    }
    if (p.cityId) {
      setSelectedCity({ id: p.cityId, name: p.cityName || p.city });
      fetchAreas(p.cityId, p.cityName || p.city);
    }
    if (p.locationId) {
      setSelectedArea({ id: p.locationId, name: p.locationName || p.address });
    }
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this property master?"))
      return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/master/properties/${id}`,
        { method: "DELETE" },
      );
      if (res.ok) fetchProperties();
    } catch (err) {
      console.error("Error deleting property master:", err);
    }
  };

  return (
    <>
      <div className="fade-in">
        {/* Breadcrumb */}
        <div className="props-breadcrumb" style={{ margin: "0 39px 12px" }}>
          Masters &gt; <span>Property Masters</span>
        </div>

        {/* Form Section */}
        <div className="dash-section" style={{ marginBottom: 16 }}>
          <form
            onSubmit={handleSubmit}
            className="master-form-card"
            style={{ margin: 0 }}
          >
            <div className="master-form-header">
              <div className="master-form-title">
                {isEditing ? "Modify Property Master" : "Add New Property Master"}
              </div>
              <div className="master-form-actions">
                <button
                  type="submit"
                  className="btn-solid-green"
                  style={{ cursor: "pointer" }}
                >
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Property Type*</label>
                <div style={{ position: "relative" }}>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="form-select"
                    style={{ appearance: "none" }}
                  >
                    <option value="Homestay">Homestay</option>
                    <option value="Villa">Villa</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Resort">Resort</option>
                  </select>
                  <ChevronDown
                    size={16}
                    style={{
                      position: "absolute",
                      right: 16,
                      top: 14,
                      color: "#6B7280",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Property Name*</label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  placeholder="e.g. Bodhi Roots Homestay"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Owner Name*</label>
                <div style={{ position: "relative" }}>
                  <select
                    name="ownerId"
                    value={formData.ownerId}
                    onChange={handleOwnerSelect}
                    className="form-select"
                    required
                  >
                    <option value="">Select an Owner</option>
                    {(() => {
                      const adminUserStr = localStorage.getItem("admin_user");
                      if (adminUserStr) {
                        try {
                          const adminUser = JSON.parse(adminUserStr);
                          const adminId = adminUser.id || adminUser._id;
                          if (adminId) {
                            return (
                              <option value={adminId}>
                                {adminUser.name || "Admin"} ({adminUser.email || "admin@tripinvilla.com"}) — Admin/Self
                              </option>
                            );
                          }
                        } catch (e) { }
                      }
                      return null;
                    })()}
                    {ownersList.map((o) => (
                      <option key={o._id} value={o._id}>
                        {o.ownerName || o.name} ({o.email || o.phone})
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    style={{
                      position: "absolute",
                      right: 16,
                      top: 14,
                      color: "#6B7280",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Owner Contact*</label>
                <input
                  type="text"
                  name="ownerContact"
                  value={formData.ownerContact}
                  onChange={handleChange}
                  placeholder="e.g. +91 9988776655"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">
                  Amenities Types *
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 11,
                      color: "#9CA3AF",
                      fontWeight: 400,
                    }}
                  >
                    Showing amenities for:{" "}
                    <strong style={{ color: "#58A429" }}>
                      {formData.propertyType}
                    </strong>
                  </span>
                </label>
                {amenitiesLoading ? (
                  <div style={{ color: "#9CA3AF", fontSize: 13 }}>
                    Loading amenities...
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    {availableAmenitiesList.map((am) => {
                      const isSelected = selectedAmenitiesList.includes(am);
                      return (
                        <button
                          key={am}
                          type="button"
                          onClick={() =>
                            setSelectedAmenitiesList((prev) =>
                              prev.includes(am)
                                ? prev.filter((a) => a !== am)
                                : [...prev, am],
                            )
                          }
                          style={{
                            padding: "5px 13px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 500,
                            border: isSelected
                              ? "1.5px solid #58A429"
                              : "1px solid #D1D5DB",
                            background: isSelected ? "#ECFDF5" : "#fff",
                            color: isSelected ? "#58A429" : "#374151",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {am}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="form-grid-1" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Unique Experiences</label>
                {experiencesLoading ? (
                  <div style={{ color: "#9CA3AF", fontSize: 13 }}>
                    Loading experiences...
                  </div>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {availableExperiences.map((exp) => {
                      const id = exp._id || exp.experienceName || exp.name;
                      const isSelected = selectedExperiences.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() =>
                            setSelectedExperiences((prev) =>
                              prev.includes(id)
                                ? prev.filter((x) => x !== id)
                                : [...prev, id],
                            )
                          }
                          style={{
                            padding: "6px 14px",
                            borderRadius: 20,
                            fontSize: 13,
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            border: isSelected
                              ? "1.5px solid #58A429"
                              : "1px solid #D1D5DB",
                            background: isSelected ? "#ECFDF5" : "#fff",
                            color: isSelected ? "#58A429" : "#374151",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          <span>{exp.representingIcon || exp.icon || "✨"}</span>
                          <span>{exp.experienceName || exp.name}</span>
                        </button>
                      );
                    })}
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 12,
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        value={newCustomExp}
                        onChange={(e) => setNewCustomExp(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomExperience();
                          }
                        }}
                        placeholder="Add custom experience"
                        style={{
                          padding: "6px 12px",
                          fontSize: 13,
                          border: "1px solid #D1D5DB",
                          borderRadius: 6,
                          flex: 1,
                          maxWidth: 200,
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomExperience}
                        style={{
                          padding: "6px 12px",
                          background: "#58A429",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div
              className="form-group"
              style={{
                border: "1px solid #E5E7EB",
                padding: "16px",
                borderRadius: "8px",
                background: "#F9FAFB",
                marginBottom: 16,
              }}
            >
              <label
                className="form-label"
                style={{
                  fontSize: "15px",
                  color: "#111827",
                  display: "block",
                  marginBottom: "12px",
                }}
              >
                Location Details
              </label>

              {/* Toggle: Use Dropdowns vs Type Manually */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: '#6B7280' }}>Location not in list?</span>
                <button type="button"
                  onClick={() => setManualLocation(p => ({ country: !p.country, state: !p.state, city: !p.city, area: !p.area }))}
                  style={{ fontSize: 12, color: '#58A429', background: 'none', border: '1px solid #58A429', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontWeight: 600 }}>
                  {manualLocation.country ? '← Use Dropdowns' : 'Type Manually →'}
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                {/* Country */}
                <div>
                  <label className="form-label" style={{ fontSize: "12px", color: "#4B5563" }}>Country*</label>
                  {manualLocation.country ? (
                    <input type="text" className="form-input" placeholder="e.g. India"
                      value={manualValues.country}
                      onChange={e => { setManualValues(p => ({ ...p, country: e.target.value })); setSelectedCountry({ id: '', name: e.target.value }); }} />
                  ) : (
                    <select className="form-select" value={selectedCountry.id}
                      onChange={(e) => {
                        const c = countries.find((x) => x._id === e.target.value);
                        setSelectedCountry(c ? { id: c._id, name: c.countryName } : { id: '', name: '' });
                        if (c) fetchStates(c._id);
                      }}>
                      <option value="">Select Country</option>
                      {countries.map((c) => <option key={c._id} value={c._id}>{c.countryName}</option>)}
                    </select>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="form-label" style={{ fontSize: "12px", color: "#4B5563" }}>State*</label>
                  {manualLocation.state ? (
                    <input type="text" className="form-input" placeholder="e.g. Himachal Pradesh"
                      value={manualValues.state}
                      onChange={e => { setManualValues(p => ({ ...p, state: e.target.value })); setSelectedState({ id: '', name: e.target.value }); }} />
                  ) : (
                    <select className="form-select" value={selectedState.id}
                      onChange={(e) => {
                        const s = states.find((x) => x._id === e.target.value);
                        setSelectedState(s ? { id: s._id, name: s.stateName } : { id: '', name: '' });
                        if (s) fetchCities(s._id);
                      }}
                      disabled={!manualLocation.state && !selectedCountry.id}>
                      <option value="">Select State</option>
                      {states.map((s) => <option key={s._id} value={s._id}>{s.stateName}</option>)}
                    </select>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="form-label" style={{ fontSize: "12px", color: "#4B5563" }}>City*</label>
                  {manualLocation.city ? (
                    <input type="text" className="form-input" placeholder="e.g. Kasol"
                      value={manualValues.city}
                      onChange={e => { setManualValues(p => ({ ...p, city: e.target.value })); setSelectedCity({ id: '', name: e.target.value }); }} />
                  ) : (
                    <select className="form-select" value={selectedCity.id}
                      onChange={(e) => {
                        const c = cities.find((x) => x._id === e.target.value);
                        setSelectedCity(c ? { id: c._id, name: c.cityName } : { id: '', name: '' });
                        if (c) fetchAreas(c._id, c.cityName);
                      }}
                      disabled={!manualLocation.city && !selectedState.id}>
                      <option value="">Select City</option>
                      {cities.map((c) => <option key={c._id} value={c._id}>{c.cityName}</option>)}
                    </select>
                  )}
                </div>

                {/* Area / Location */}
                <div>
                  <label className="form-label" style={{ fontSize: "12px", color: "#4B5563" }}>
                    Area/Location*
                    {!manualLocation.area && areas.length === 0 && allLocations.length > 0 && (
                      <span style={{ color: '#F59E0B', fontSize: 11, marginLeft: 6 }}>Showing all locations</span>
                    )}
                  </label>
                  {manualLocation.area ? (
                    <input type="text" className="form-input" placeholder="e.g. Kheerganga, Parvati Valley"
                      value={manualValues.area}
                      onChange={e => { setManualValues(p => ({ ...p, area: e.target.value })); setSelectedArea({ id: '', name: e.target.value }); }} />
                  ) : (
                    <select className="form-select" value={selectedArea.id}
                      onChange={(e) => {
                        const displayList = areas.length > 0 ? areas : allLocations;
                        const a = displayList.find((x) => x._id === e.target.value);
                        setSelectedArea(a ? { id: a._id, name: a.locationName } : { id: '', name: '' });
                        if (a && a.landmarks && a.landmarks.length > 0) {
                          const mappedLandmarks = a.landmarks.map(l => ({
                            landmark_name: l.landmarkName || l.name,
                            landmark_type: l.landmarkPopularity || l.popularity || 'Tourist Popular',
                            landmark_image_url: l.landmarkImageUrl || (l.images && l.images[0]) || ''
                          }));
                          // Auto-populate the landmarks from the selected location
                          setLandmarksList(mappedLandmarks);
                        } else if (a) {
                          setLandmarksList([]); // Clear if the location has no landmarks
                        }
                      }}>
                      <option value="">Select Area</option>
                      {(areas.length > 0 ? areas : allLocations).map((a) => (
                        <option key={a._id} value={a._id}>{a.locationName}</option>
                      ))}
                    </select>
                  )}
                  {!manualLocation.area && (
                    <button type="button" onClick={() => setManualLocation(p => ({ ...p, area: true }))}
                      style={{ fontSize: 11, color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', textDecoration: 'underline' }}>
                      Not in list? Type manually
                    </button>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "16px",
                }}
              >
                <div style={{ gridColumn: "span 2" }}>
                  <label
                    className="form-label"
                    style={{ fontSize: "12px", color: "#4B5563" }}
                  >
                    Full Address / Location String*
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    name="full_address"
                    value={formData.full_address}
                    onChange={(e) => {
                      handleChange(e);
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                        full_address: e.target.value,
                      }));
                    }}
                    placeholder="e.g. Near Market, Kasol"
                    required
                  />
                </div>
                <div>
                  <label
                    className="form-label"
                    style={{ fontSize: "12px", color: "#4B5563" }}
                  >
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="e.g. 32.0100"
                  />
                </div>
                <div>
                  <label
                    className="form-label"
                    style={{ fontSize: "12px", color: "#4B5563" }}
                  >
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="e.g. 77.2970"
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Property Price (₹)*</label>
                <input
                  type="number"
                  name="propertyPrice"
                  value={formData.propertyPrice}
                  onChange={handleChange}
                  placeholder="e.g. 3500"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Original Price (Strikethrough)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tax Amount (₹)</label>
                <input
                  type="number"
                  name="taxAmount"
                  value={formData.taxAmount}
                  onChange={handleChange}
                  placeholder="e.g. 212"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-grid-1" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">
                  Upload Property Images*{" "}
                  <span
                    style={{
                      fontWeight: 400,
                      color: "#9CA3AF",
                      fontSize: "11px",
                    }}
                  >
                    (Min 1, Max 30)
                  </span>
                </label>
                {(existingImages.length > 0 || selectedFiles.length > 0) && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    {existingImages.map((url, idx) => (
                      <div
                        key={`ex-${idx}`}
                        style={{
                          position: "relative",
                          width: "60px",
                          height: "60px",
                        }}
                      >
                        <img
                          src={url}
                          alt={`img-${idx}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #D1D5DB",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(idx)}
                          style={{
                            position: "absolute",
                            top: "-6px",
                            right: "-6px",
                            background: "#EF4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                            fontSize: "11px",
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={`new-${idx}`}
                        style={{
                          position: "relative",
                          width: "60px",
                          height: "60px",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "2px solid #58A429",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewFile(idx)}
                          style={{
                            position: "absolute",
                            top: "-6px",
                            right: "-6px",
                            background: "#EF4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                            fontSize: "11px",
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {existingImages.length + selectedFiles.length < 30 && (
                  <div
                    className="file-upload-wrapper"
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <input
                      type="text"
                      className="file-upload-input"
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        padding: "8px 12px",
                        fontSize: "13px",
                      }}
                      value={
                        existingImages.length + selectedFiles.length > 0
                          ? `${existingImages.length + selectedFiles.length} image(s)`
                          : "Browse images"
                      }
                      readOnly
                    />
                    <button
                      type="button"
                      style={{
                        background: "#58A429",
                        color: "#fff",
                        border: "none",
                        padding: "8px 16px",
                        cursor: "pointer",
                      }}
                    >
                      Upload
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      hidden
                      accept="image/*"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Check-In Time*</label>
                <input
                  type="text"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  placeholder="e.g. 3:00 PM"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Check-Out Time*</label>
                <input
                  type="text"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  placeholder="e.g. 12:00 PM"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Area Size*</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. 31 sq. ft."
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
                marginBottom: 16,
              }}
            >
              <div className="form-group">
                <label className="form-label">Bed Rooms*</label>
                <input
                  type="number"
                  name="bedRooms"
                  value={formData.bedRooms}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Beds Count*</label>
                <input
                  type="number"
                  name="beds"
                  value={formData.beds}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Guests Capacity*</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bath Rooms*</label>
                <input
                  type="number"
                  name="bathRooms"
                  value={formData.bathRooms}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ gridColumn: "span 3", marginTop: "16px", marginBottom: "16px", padding: "16px", border: "1px solid #E5E7EB", borderRadius: "8px", background: "#F9FAFB" }}>
              <label className="form-label" style={{ fontSize: "15px", color: "#111827", display: "block", marginBottom: "12px" }}>
                Type-Specific Details ({formData.propertyType || "Select a type"})
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                {formData.propertyType === 'Villa' && (
                  <>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13 }}><input type="checkbox" name="privatePool" checked={formData.privatePool} onChange={handleChangeCheckbox} style={{ accentColor: '#58A429' }} /> Private Pool</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13 }}><input type="checkbox" name="gardenArea" checked={formData.gardenArea} onChange={handleChangeCheckbox} style={{ accentColor: '#58A429' }} /> Garden / Outdoor Area</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13 }}><input type="checkbox" name="chefAvailable" checked={formData.chefAvailable} onChange={handleChangeCheckbox} style={{ accentColor: '#58A429' }} /> Chef / Caretaker Available</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13 }}><input type="checkbox" name="entirePropertyOnly" checked={formData.entirePropertyOnly} onChange={handleChangeCheckbox} style={{ accentColor: '#58A429' }} /> Entire Property Booking Only</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13 }}><input type="checkbox" name="securityCCTV" checked={formData.securityCCTV} onChange={handleChangeCheckbox} style={{ accentColor: '#58A429' }} /> Security / CCTV</label>
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Number of Floors</label>
                      <input className="form-input" type="number" name="numberOfFloors" value={formData.numberOfFloors} onChange={handleChange} placeholder="e.g. 2" />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Plot Size (sq ft)</label>
                      <input className="form-input" type="number" name="plotSize" value={formData.plotSize} onChange={handleChange} placeholder="e.g. 4000" />
                    </div>
                  </>
                )}
                {(formData.propertyType === 'Resort' || formData.propertyType === 'Hotel') && (
                  <>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13 }}><input type="checkbox" name="restaurantOnSite" checked={formData.restaurantOnSite} onChange={handleChangeCheckbox} style={{ accentColor: '#58A429' }} /> Restaurant on-site</label>
                    {formData.propertyType === 'Resort' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13 }}><input type="checkbox" name="spaWellness" checked={formData.spaWellness} onChange={handleChangeCheckbox} style={{ accentColor: '#58A429' }} /> Spa / Wellness Center</label>
                    )}
                    {formData.propertyType === 'Resort' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13 }}><input type="checkbox" name="conferenceRoom" checked={formData.conferenceRoom} onChange={handleChangeCheckbox} style={{ accentColor: '#58A429' }} /> Conference Room</label>
                    )}
                    {formData.propertyType === 'Hotel' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13 }}><input type="checkbox" name="receptionAllDay" checked={formData.receptionAllDay} onChange={handleChangeCheckbox} style={{ accentColor: '#58A429' }} /> Reception 24/7</label>
                    )}
                    {formData.propertyType === 'Hotel' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13 }}><input type="checkbox" name="roomService" checked={formData.roomService} onChange={handleChangeCheckbox} style={{ accentColor: '#58A429' }} /> Room Service Available</label>
                    )}
                    {formData.propertyType === 'Hotel' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13 }}><input type="checkbox" name="liftElevator" checked={formData.liftElevator} onChange={handleChangeCheckbox} style={{ accentColor: '#58A429' }} /> Lift / Elevator</label>
                    )}
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Star Rating (1-5)</label>
                      <input className="form-input" type="number" min="1" max="5" name="starRating" value={formData.starRating} onChange={handleChange} placeholder="e.g. 4" />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Total Rooms</label>
                      <input className="form-input" type="number" name="totalRooms" value={formData.totalRooms} onChange={handleChange} placeholder="e.g. 24" />
                    </div>
                    {formData.propertyType === 'Hotel' && (
                      <div>
                        <label className="form-label" style={{ fontSize: 12 }}>Total Floors</label>
                        <input className="form-input" type="number" name="totalFloors" value={formData.totalFloors} onChange={handleChange} placeholder="e.g. 5" />
                      </div>
                    )}
                    {formData.propertyType === 'Resort' && (
                      <div style={{ gridColumn: 'span 3' }}>
                        <label className="form-label" style={{ fontSize: 12 }}>Activities Offered</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {['Swimming', 'Trekking', 'Cycling', 'Yoga', 'Bonfire', 'Wildlife Safari'].map(act => (
                            <button key={act} type="button" onClick={() => {
                              const curr = formData.activities || [];
                              setFormData(p => ({ ...p, activities: curr.includes(act) ? curr.filter(a => a !== act) : [...curr, act] }));
                            }} style={{ padding: '6px 12px', borderRadius: '16px', fontSize: '12px', border: (formData.activities || []).includes(act) ? '1px solid #58A429' : '1px solid #D1D5DB', background: (formData.activities || []).includes(act) ? '#ECFDF5' : '#fff', color: (formData.activities || []).includes(act) ? '#58A429' : '#374151', cursor: 'pointer' }}>{act}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
                {formData.propertyType === 'Apartment' && (
                  <>
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Floor Number</label>
                      <input className="form-input" type="number" name="floorNumber" value={formData.floorNumber} onChange={handleChange} placeholder="e.g. 3" />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Total Floors in Building</label>
                      <input className="form-input" type="number" name="totalFloorsBuilding" value={formData.totalFloorsBuilding} onChange={handleChange} placeholder="e.g. 10" />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Furnished Status</label>
                      <select className="form-select" name="furnishedStatus" value={formData.furnishedStatus} onChange={handleChange}>
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Semi Furnished">Semi Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13 }}><input type="checkbox" name="washingMachine" checked={formData.washingMachine} onChange={handleChangeCheckbox} style={{ accentColor: '#58A429' }} /> Washing Machine</label>
                    <div style={{ gridColumn: 'span 3' }}>
                      <label className="form-label" style={{ fontSize: 12 }}>Society Amenities</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['Gym', 'Pool', 'Security', 'Clubhouse', 'Power Backup'].map(act => (
                          <button key={act} type="button" onClick={() => {
                            const curr = formData.societyAmenities || [];
                            setFormData(p => ({ ...p, societyAmenities: curr.includes(act) ? curr.filter(a => a !== act) : [...curr, act] }));
                          }} style={{ padding: '6px 12px', borderRadius: '16px', fontSize: '12px', border: (formData.societyAmenities || []).includes(act) ? '1px solid #58A429' : '1px solid #D1D5DB', background: (formData.societyAmenities || []).includes(act) ? '#ECFDF5' : '#fff', color: (formData.societyAmenities || []).includes(act) ? '#58A429' : '#374151', cursor: 'pointer' }}>{act}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {formData.propertyType === 'Cottage' && (
                  <>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13 }}><input type="checkbox" name="bonfireArea" checked={formData.bonfireArea} onChange={handleChangeCheckbox} style={{ accentColor: '#58A429' }} /> Bonfire Area</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 13 }}><input type="checkbox" name="outdoorSeating" checked={formData.outdoorSeating} onChange={handleChangeCheckbox} style={{ accentColor: '#58A429' }} /> Outdoor Seating</label>
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>View Type</label>
                      <select className="form-select" name="viewType" value={formData.viewType} onChange={handleChange}>
                        <option value="Mountain">Mountain</option>
                        <option value="Forest">Forest</option>
                        <option value="River">River</option>
                        <option value="Valley">Valley</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Nearest Hiking Trail</label>
                      <input className="form-input" type="text" name="nearestHikingTrail" value={formData.nearestHikingTrail} onChange={handleChange} placeholder="e.g. Pine Ridge Trail" />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Distance from City (km)</label>
                      <input className="form-input" type="number" name="distanceFromCity" value={formData.distanceFromCity} onChange={handleChange} placeholder="e.g. 15" />
                    </div>
                  </>
                )}
                {formData.propertyType === 'Homestay' && (
                  <div style={{ gridColumn: 'span 3', color: '#6B7280', fontSize: '13px' }}>
                    All required Homestay fields are covered in other sections.
                  </div>
                )}
              </div>
            </div>

            {/* Rooms / Pricing — for ALL property types */}
            <div style={{ border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px', background: '#F9FAFB', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif', fontSize: 15, color: '#111827', margin: 0 }}>
                  Add Rooms / Pricing &amp; Rules
                </label>
              </div>

              {/* Row 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 12 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Room Type*</label>
                  <select className="form-select" value={roomForm.roomType} onChange={e => setRoomForm(p => ({ ...p, roomType: e.target.value }))}>
                    {['Standard', 'Deluxe', 'Suite', 'Executive', 'Premium', 'Presidential', 'Family Room', 'Double', 'Single', 'Twin'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Room Name*</label>
                  <input type="text" className="form-input" value={roomForm.roomName} onChange={e => setRoomForm(p => ({ ...p, roomName: e.target.value }))} placeholder="e.g. Sea View Deluxe" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Bed Type*</label>
                  <select className="form-select" value={roomForm.bedType} onChange={e => setRoomForm(p => ({ ...p, bedType: e.target.value }))}>
                    {['Single Bed', 'Double Bed', 'Queen Size', 'King Size', 'King Size 1', 'Twin Beds', 'Bunk Beds'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Room Image*</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      ref={roomImageRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setRoomImageFile(file);
                          setRoomImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => roomImageRef.current.click()}
                      style={{
                        padding: '8px 16px',
                        background: '#F3F4F6',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 500,
                        height: '38px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {roomImagePreview ? 'Change Image' : 'Choose Image'}
                    </button>
                    {roomImagePreview && (
                      <img
                        src={roomImagePreview}
                        alt="Room Preview"
                        style={{ width: 38, height: 38, borderRadius: 6, objectFit: 'cover', border: '1px solid #E5E7EB' }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="form-grid-3" style={{ marginBottom: 12 }}>
                <div className="form-group">
                  <label className="form-label">Amenities Types*</label>
                  <input type="text" className="form-input" value={roomForm.amenitiesText || ''} onChange={e => setRoomForm(p => ({ ...p, amenitiesText: e.target.value }))} placeholder="e.g. Barbeque, WiFi, AC" />
                </div>
                <div className="form-group">
                  <label className="form-label">Price for Room*</label>
                  <input type="number" className="form-input" value={roomForm.pricePerNight} onChange={e => setRoomForm(p => ({ ...p, pricePerNight: e.target.value }))} placeholder="₹ per night" />
                </div>
                <div className="form-group">
                  <label className="form-label">Offer</label>
                  <input type="text" className="form-input" value={roomForm.offer || ''} onChange={e => setRoomForm(p => ({ ...p, offer: e.target.value }))} placeholder="e.g. 20% Off" />
                </div>
              </div>

              {/* Row 3 */}
              <div className="form-grid-3" style={{ marginBottom: 12 }}>
                <div className="form-group">
                  <label className="form-label">Check-in*</label>
                  <select className="form-select" value={roomForm.checkIn} onChange={e => setRoomForm(p => ({ ...p, checkIn: e.target.value }))}>
                    {['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '9:00 AM', '10:00 AM', '11:00 AM'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Check-out*</label>
                  <select className="form-select" value={roomForm.checkOut} onChange={e => setRoomForm(p => ({ ...p, checkOut: e.target.value }))}>
                    {['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Max Guests &amp; Count</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input type="number" className="form-input" min={1} value={roomForm.maxGuests} onChange={e => setRoomForm(p => ({ ...p, maxGuests: e.target.value }))} placeholder="Guests" />
                    <input type="number" className="form-input" min={1} value={roomForm.count} onChange={e => setRoomForm(p => ({ ...p, count: e.target.value }))} placeholder="Count" />
                  </div>
                </div>
              </div>

              {/* Rules removed as requested */}

              {/* Add Room button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
                {roomImageUploading && <span style={{ fontSize: 13, color: '#6B7280' }}>Uploading room image...</span>}
                <button type="button"
                  disabled={roomImageUploading}
                  onClick={async () => {
                    if (!roomForm.roomName.trim() || !roomForm.pricePerNight) { alert('Please fill Room Name and Price.'); return; }

                    let uploadedUrl = "";
                    if (roomImageFile) {
                      setRoomImageUploading(true);
                      try {
                        const uploadData = new FormData();
                        uploadData.append("images", roomImageFile);
                        const token = localStorage.getItem("admin_token");
                        const uploadRes = await fetch(
                          `${import.meta.env.VITE_API_BASE}/properties/upload`,
                          {
                            method: "POST",
                            headers: { Authorization: `Bearer ${token}` },
                            body: uploadData,
                          },
                        );
                        const uploadDataJson = await uploadRes.json();
                        if (uploadDataJson && uploadDataJson.urls && uploadDataJson.urls.length > 0) {
                          uploadedUrl = uploadDataJson.urls[0];
                        }
                      } catch (err) {
                        console.error("Room image upload failed", err);
                      } finally {
                        setRoomImageUploading(false);
                      }
                    }

                    const amenArr = (roomForm.amenitiesText || '').split(',').map(a => a.trim()).filter(Boolean);
                    setRoomsList(prev => [...prev, {
                      ...roomForm,
                      imageUrl: uploadedUrl || roomForm.imageUrl,
                      room_image_url: uploadedUrl || roomForm.imageUrl,
                      amenities: amenArr,
                      pricePerNight: Number(roomForm.pricePerNight),
                      maxGuests: Number(roomForm.maxGuests),
                      count: Number(roomForm.count)
                    }]);
                    setRoomForm({ roomType: 'Deluxe', roomName: '', imageUrl: '', pricePerNight: '', maxGuests: 2, bedType: 'Double', count: 1, amenities: [], amenitiesText: '', checkIn: '3:00 PM', checkOut: '12:00 PM', offer: '', rules: '• Primary Guest should be atleast 18 years of age.' });
                    setRoomImageFile(null);
                    setRoomImagePreview("");
                    if (roomImageRef.current) roomImageRef.current.value = "";
                  }}
                  style={{ padding: '10px 32px', background: roomImageUploading ? '#9CA3AF' : '#58A429', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: roomImageUploading ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
                  + Add Room
                </button>
              </div>

              {/* Added Rooms Table */}
              {roomsList.length > 0 && (
                <div style={{ marginTop: 16, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#F3F4F6' }}>
                        {['Room Image', 'Room Name', 'Type', 'Bed', 'Amenities', 'Price/Night', 'Check-in', 'Check-out', 'Offer', 'Guests', 'Count', ''].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#6B7280', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {roomsList.map((room, idx) => (
                        <tr key={idx} style={{ borderTop: '1px solid #E5E7EB' }}>
                          <td style={{ padding: '8px 12px' }}>
                            {room.imageUrl ? <img src={room.imageUrl} alt="Room" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : <span style={{ color: '#9CA3AF', fontSize: 11 }}>No Image</span>}
                          </td>
                          <td style={{ padding: '8px 12px', fontWeight: 600, color: '#58A429' }}>{room.roomName || room.roomType}</td>
                          <td style={{ padding: '8px 12px', color: '#374151' }}>{room.roomType}</td>
                          <td style={{ padding: '8px 12px', color: '#6B7280' }}>{room.bedType}</td>
                          <td style={{ padding: '8px 12px', color: '#6B7280' }}>{Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenitiesText || '—'}</td>
                          <td style={{ padding: '8px 12px', color: '#111827', fontWeight: 600 }}>₹{room.pricePerNight}/night</td>
                          <td style={{ padding: '8px 12px', color: '#6B7280' }}>{room.checkIn}</td>
                          <td style={{ padding: '8px 12px', color: '#6B7280' }}>{room.checkOut}</td>
                          <td style={{ padding: '8px 12px', color: '#6B7280' }}>{room.offer || '—'}</td>
                          <td style={{ padding: '8px 12px', color: '#6B7280' }}>{room.maxGuests}</td>
                          <td style={{ padding: '8px 12px', color: '#6B7280' }}>{room.count}</td>
                          <td style={{ padding: '8px 12px' }}>
                            <button type="button" onClick={() => setRoomsList(prev => prev.filter((_, i) => i !== idx))}
                              style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 18 }}>×</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {roomsList.length === 0 && <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 12 }}>No rooms added yet. Fill the form above and click "+ Add Room".</p>}
            </div>

            <div className="form-grid-3">
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Video URL (Optional)</label>
                <input
                  type="text"
                  name="videosUrl"
                  value={formData.videosUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status*</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div
              className="form-group"
              style={{
                border: "1px solid #E5E7EB",
                padding: "16px",
                borderRadius: "8px",
                background: "#F9FAFB",
                marginBottom: 16,
              }}
            >
              <label
                className="form-label"
                style={{
                  fontSize: "15px",
                  color: "#111827",
                  display: "block",
                  marginBottom: "12px",
                }}
              >
                Highlights
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.highlights.breakfastIncluded}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        highlights: {
                          ...p.highlights,
                          breakfastIncluded: e.target.checked,
                        },
                      }))
                    }
                    style={{ accentColor: "#58A429" }}
                  />
                  Breakfast Included
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.highlights.parkingAvailable}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        highlights: {
                          ...p.highlights,
                          parkingAvailable: e.target.checked,
                        },
                      }))
                    }
                    style={{ accentColor: "#58A429" }}
                  />
                  Parking Available
                </label>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "13px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.highlights.freeCancellation}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          highlights: {
                            ...p.highlights,
                            freeCancellation: e.target.checked,
                          },
                        }))
                      }
                      style={{ accentColor: "#58A429" }}
                    />
                    Free Cancellation
                  </label>
                  {formData.highlights.freeCancellation && (
                    <input
                      type="text"
                      value={formData.highlights.freeCancellationHours}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          highlights: {
                            ...p.highlights,
                            freeCancellationHours: e.target.value,
                          },
                        }))
                      }
                      placeholder="hrs"
                      style={{
                        width: "40px",
                        padding: "2px 4px",
                        fontSize: "12px",
                        border: "1px solid #D1D5DB",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Nearby Landmarks</label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    className="form-input"
                    value={landmarkName}
                    onChange={(e) => setLandmarkName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddLandmark();
                      }
                    }}
                    placeholder="e.g. Anjuna Flea Market"
                    style={{ flex: 1 }}
                  />
                  <select
                    className="form-select"
                    value={landmarkType}
                    onChange={(e) => setLandmarkType(e.target.value)}
                    style={{ width: "180px" }}
                  >
                    <option value="Tourist Popular">Tourist Popular</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Airport">Airport</option>
                    <option value="Railway Station">Railway Station</option>
                    <option value="Bus Stand">Bus Stand</option>
                  </select>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="file"
                      ref={landmarkImageRef}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setLandmarkImageFile(file);
                          setLandmarkImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      hidden
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => landmarkImageRef.current.click()}
                      style={{
                        padding: "8px",
                        background: "#F3F4F6",
                        border: "1px solid #D1D5DB",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      {landmarkImagePreview ? "Change Image" : "Image (Opt)"}
                    </button>
                    <button
                      type="button"
                      onClick={handleAddLandmark}
                      disabled={landmarkImageUploading}
                      className="btn-solid-green"
                      style={{ padding: "8px 16px" }}
                    >
                      {landmarkImageUploading ? "..." : "Add"}
                    </button>
                  </div>
                </div>
              </div>
              {landmarksList.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {landmarksList.map((lm, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "4px 10px",
                        background: "#F9FAFB",
                        border: "1px solid #E5E7EB",
                        borderRadius: "16px",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{lm.landmark_name}</span>{" "}
                      <span style={{ color: "#6B7280", fontSize: "11px" }}>
                        ({lm.landmark_type})
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setLandmarksList((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                        style={{
                          color: "#EF4444",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          marginLeft: 4,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-grid-1" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Property Rules*</label>
                <textarea
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  placeholder="Enter rules separated by newlines"
                  className="form-textarea"
                  required
                ></textarea>
              </div>
            </div>

            <div className="form-grid-1" style={{ marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">About Property*</label>
                <textarea
                  name="aboutProperty"
                  value={formData.aboutProperty}
                  onChange={handleChange}
                  placeholder="Provide a detailed description..."
                  className="form-textarea"
                  required
                ></textarea>
              </div>
            </div>

            {isEditing && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 16,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      id: "",
                      propertyType: "Homestay",
                      propertyName: "",
                      ownerName: "",
                      ownerContact: "",
                      amenityTypes: "",
                      location: "",
                      propertyPrice: "",
                      imagesUrl: "",
                      videosUrl: "",
                      aboutProperty: "",
                      status: "Active",
                    });
                  }}
                  className="btn-outline-green"
                  style={{ cursor: "pointer", padding: "8px 16px", fontSize: 12 }}
                >
                  Cancel Edit
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Table Section */}
        <div className="dash-section" style={{ marginBottom: 24 }}>
          <div className="chart-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table" style={{ whiteSpace: "nowrap" }}>
                <thead>
                  <tr>
                    <th>Property No</th>
                    <th>Property Type</th>
                    <th>Image</th>
                    <th>Property Name</th>
                    <th>Owner Name</th>
                    <th>Owner Contact</th>
                    <th>Amenities</th>
                    <th>Experiences</th>
                    <th>Location</th>
                    <th>Address</th>
                    <th>About Property</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right", paddingRight: 24 }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="11"
                        style={{
                          textAlign: "center",
                          padding: "32px",
                          color: "#6B7280",
                        }}
                      >
                        Loading properties...
                      </td>
                    </tr>
                  ) : paginatedProperties.length > 0 ? (
                    paginatedProperties.map((p) => (
                      <tr key={p._id}>
                        <td style={{ color: "#58A429", fontWeight: 600 }}>
                          {p.propertyNo}
                        </td>
                        <td style={{ color: "#6B7280" }}>{p.propertyType}</td>
                        <td>
                          <div
                            style={{
                              width: 40,
                              height: 30,
                              background: "#E5E7EB",
                              borderRadius: 6,
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={
                                Array.isArray(p.images) && p.images[0]
                                  ? p.images[0]
                                  : "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=100&q=80"
                              }
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              alt="property"
                            />
                          </div>
                        </td>
                        <td style={{ color: "#111827", fontWeight: 600 }}>
                          {p.propertyName}
                        </td>
                        <td style={{ color: "#6B7280" }}>{p.ownerName}</td>
                        <td style={{ color: "#6B7280" }}>{p.ownerContact}</td>
                        <td style={{ color: "#6B7280" }}>
                          {Array.isArray(p.amenities)
                            ? p.amenities.slice(0, 2).join(", ") +
                            (p.amenities.length > 2 ? "..." : "")
                            : ""}
                        </td>
                        <td style={{ color: "#6B7280" }}>
                          {Array.isArray(p.experiences)
                            ? p.experiences
                              .map((e) => e.experienceName || e.name || e)
                              .slice(0, 2)
                              .join(", ") +
                            (p.experiences.length > 2 ? "..." : "")
                            : ""}
                        </td>
                        <td style={{ color: "#6B7280" }}>{p.location}</td>
                        <td
                          style={{
                            color: "#6B7280",
                            maxWidth: 150,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {p.full_address || p.location}
                        </td>
                        <td
                          style={{
                            color: "#6B7280",
                            maxWidth: 150,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {p.aboutProperty || p.description}
                        </td>
                        <td>
                          <span
                            className={`status-pill ${p.status ? p.status.toLowerCase() : "active"}`}
                          >
                            {p.status || "Active"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right", paddingRight: 24 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 8,
                            }}
                          >
                            <button
                              onClick={() => setManagingRoomsProperty(p)}
                              title="Manage Rooms"
                              style={{
                                color: "#2563EB",
                                background: "#DBEAFE",
                                border: "none",
                                borderRadius: 6,
                                cursor: "pointer",
                                padding: "5px 7px",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              <BedDouble size={13} strokeWidth={2} />
                              Rooms
                            </button>
                            <button
                              onClick={() => handleEdit(p)}
                              style={{
                                color: "#58A429",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 4,
                              }}
                            >
                              <Edit2 size={15} strokeWidth={2} />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              style={{
                                color: "#EF4444",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 4,
                              }}
                            >
                              <Trash2 size={15} strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="13" style={{ textAlign: "center", padding: "32px", color: "#6B7280" }}>No properties found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', padding: '16px' }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{ background: '#F3F4F6', color: currentPage === 1 ? '#9CA3AF' : '#374151', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 600 }}
                >
                  Previous
                </button>
                <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{ background: '#F3F4F6', color: currentPage === totalPages ? '#9CA3AF' : '#374151', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 600 }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {managingRoomsProperty && (
        <PropertyRoomManager
          property={managingRoomsProperty}
          onClose={() => setManagingRoomsProperty(null)}
        />
      )}
    </>
  );
}
