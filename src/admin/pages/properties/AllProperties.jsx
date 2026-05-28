import { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
  ClipboardList,
  Clock,
  XCircle,
  CheckCircle2,
  MoreVertical,
  Plus,
  X,
  Upload,
} from "lucide-react";

const API = `${import.meta.env.VITE_API_BASE}`;
import PropertyViewModal from './PropertyViewModal';

const parseNumber = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return '';
  const parsed = parseFloat(String(val).replace(/[^\d.-]/g, ''));
  return isNaN(parsed) ? '' : parsed;
};

export default function AllProperties() {
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    inactiveAdmin: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [loading, setLoading] = useState(false); // Add Panel State
  const [showPanel, setShowPanel] = useState(false);
  const [owners, setOwners] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);

  // Form State matching owner's dashboard + owner selection
  const [form, setForm] = useState({
    type: "Homestay",
    name: "",
    roomType: "1 Deluxe 4 Normal",
    ownerContact: "",
    ownerId: "",
    location: "",
    full_address: "",
    latitude: "",
    longitude: "",
    price: "",
    status: "Active",
    description: "",
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    rules:
      "• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s).",
    area: "31 sq. ft.",
    bedRooms: 1,
    beds: 2,
    capacity: 3,
    bathRooms: 1,
    originalPrice: "",
    taxAmount: "",
    highlights: {
      breakfastIncluded: false,
      parkingAvailable: false,
      freeCancellation: false,
      freeCancellationHours: "24",
    },
  });

  // Upload/images state matching MyProperties.jsx
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const fileInputRef = useRef(null);

  // ─── Rooms (for Hotel / Resort) ──────────────────────
  const [roomsList, setRoomsList] = useState([]);
  const [roomForm, setRoomForm] = useState({ roomType: 'Deluxe', roomName: '', pricePerNight: '', maxGuests: 2, bedType: 'Double', count: 1, amenities: [] });

  // Amenities list matching MyProperties.jsx
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

  const [selectedCountry, setSelectedCountry] = useState({ id: "", name: "" });
  const [selectedState, setSelectedState] = useState({ id: "", name: "" });
  const [selectedCity, setSelectedCity] = useState({ id: "", name: "" });
  const [selectedArea, setSelectedArea] = useState({ id: "", name: "" });

  // Landmarks state matching MyProperties.jsx
  const [landmarksList, setLandmarksList] = useState([]);
  const [landmarkName, setLandmarkName] = useState("");
  const [landmarkType, setLandmarkType] = useState("Tourist Popular");
  const [landmarkImageFile, setLandmarkImageFile] = useState(null);
  const [landmarkImagePreview, setLandmarkImagePreview] = useState("");
  const [landmarkImageUploading, setLandmarkImageUploading] = useState(false);
  const landmarkImageRef = useRef(null);

  // Dropdown menu state


  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (propertyType) params.append("type", propertyType);
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      // Fetch Active properties (default when no status is passed)
      const resActive = await fetch(`${API}/properties?${params.toString()}`);
      const dataActive = await resActive.json();

      // Fetch Inactive Admin properties
      params.append("status", "Inactive Admin");
      const resInactive = await fetch(`${API}/properties?${params.toString()}`);
      const dataInactive = await resInactive.json();

      let combinedProperties = [];
      if (dataActive?.properties) combinedProperties = [...dataActive.properties];
      if (dataInactive?.properties) combinedProperties = [...combinedProperties, ...dataInactive.properties];

      setProperties(combinedProperties);
      if (dataActive?.stats) setStats(dataActive.stats);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await fetch(`${API}/owners`);
      const data = await res.json();
      if (data && data.owners) {
        setOwners(data.owners);
      } else if (Array.isArray(data)) {
        setOwners(data);
      }
    } catch (err) {
      console.error("Error fetching owners:", err);
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
      const res = await fetch(`${API}/admin/experiences/active`);
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
      const res = await fetch(`${API}/masters/countries`);
      const data = await res.json();
      setCountries(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStates = async (countryId) => {
    try {
      const res = await fetch(`${API}/masters/states/active?country_id=${countryId}`);
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
      const res = await fetch(`${API}/masters/cities/active?state_id=${stateId}`);
      const data = await res.json();
      setCities(data);
      setAreas([]);
      setSelectedCity({ id: "", name: "" });
      setSelectedArea({ id: "", name: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAreas = async (cityId) => {
    try {
      const res = await fetch(`${API}/masters/locations/active?city_id=${cityId}`);
      const data = await res.json();
      setAreas(data);
      setSelectedArea({ id: "", name: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAmenitiesForType = async (type) => {
    setAmenitiesLoading(true);
    try {
      const scope = type || "All";
      const res = await fetch(`${API}/admin/amenities/active?scope=${scope}`);
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

  useEffect(() => {
    fetchProperties();
    fetchOwners();
  }, []);

  const openPanel = () => {
    fetchOwners();
    fetchExperiences();
    fetchCountries();
    fetchAmenitiesForType(form.type);
    setShowPanel(true);
  };

  const closePanel = () => {
    setShowPanel(false);
    setEditingPropertyId(null);
    resetForm();
  };

  const openEditPanel = (p) => {
    setEditingPropertyId(p._id);
    fetchOwners();
    fetchExperiences();
    fetchCountries();
    fetchAmenitiesForType(p.type || p.category || "Homestay");

    setForm({
      type: p.type || p.category || "Homestay",
      name: p.name || "",
      roomType: p.roomType || "",
      ownerContact: p.ownerContact || "",
      ownerId: typeof p.owner === 'object' ? (p.owner?._id || "") : (p.owner || ""),
      location: p.location || "",
      full_address: p.full_address || p.location || "",
      latitude: parseNumber(p.latitude),
      longitude: parseNumber(p.longitude),
      price: parseNumber(p.price_per_night !== undefined ? p.price_per_night : p.price),
      status: p.status || "Active",
      description: p.description || "",
      checkIn: p.checkIn || "3:00 PM",
      checkOut: p.checkOut || "12:00 PM",
      rules: p.rules || "• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s).",
      area: p.area || "31 sq. ft.",
      bedRooms: p.bedRooms || 1,
      beds: p.beds || 2,
      capacity: p.capacity || 3,
      bathRooms: p.bathRooms || 1,
      originalPrice: parseNumber(p.originalPrice),
      taxAmount: parseNumber(p.taxAmount),
      highlights: p.highlights || {
        breakfastIncluded: false,
        parkingAvailable: false,
        freeCancellation: false,
        freeCancellationHours: "24",
      },
    });

    setExistingImages(p.images || []);
    setSelectedFiles([]);
    setRoomsList(Array.isArray(p.rooms) ? p.rooms : []);
    setSelectedAmenitiesList(p.amenities || []);
    setSelectedExperiences(p.experiences || []);
    setLandmarksList([]); // Will need separate fetch if editing landmarks

    if (p.countryId) setSelectedCountry({ id: p.countryId, name: p.countryName || "" });
    if (p.stateId) setSelectedState({ id: p.stateId, name: p.stateName || "" });
    if (p.cityId) setSelectedCity({ id: p.cityId, name: p.cityName || "" });
    if (p.locationId) setSelectedArea({ id: p.locationId, name: p.locationName || "" });

    setShowPanel(true);
  };

  const resetForm = () => {
    setForm({
      type: "Homestay",
      name: "",
      roomType: "1 Deluxe 4 Normal",
      ownerContact: "",
      ownerId: "",
      location: "",
      full_address: "",
      latitude: "",
      longitude: "",
      price: "",
      status: "Active",
      description: "",
      checkIn: "3:00 PM",
      checkOut: "12:00 PM",
      rules:
        "• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s).",
      area: "31 sq. ft.",
      bedRooms: 1,
      beds: 2,
      capacity: 3,
      bathRooms: 1,
    });
    setSelectedFiles([]);
    setExistingImages([]);
    setRoomsList([]);
    setRoomForm({ roomType: 'Deluxe', roomName: '', pricePerNight: '', maxGuests: 2, bedType: 'Double', count: 1, amenities: [] });
    setSelectedAmenitiesList([]);
    setLandmarksList([]);
    setLandmarkName("");
    setLandmarkType("Tourist Popular");
    setLandmarkImageFile(null);
    setLandmarkImagePreview("");
    setSelectedExperiences([]);
    setCountries([]);
    setStates([]);
    setCities([]);
    setAreas([]);
    setSelectedCountry({ id: "", name: "" });
    setSelectedState({ id: "", name: "" });
    setSelectedCity({ id: "", name: "" });
    setSelectedArea({ id: "", name: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (landmarkImageRef.current) landmarkImageRef.current.value = "";
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setSelectedAmenitiesList([]);
      fetchAmenitiesForType(value);
    }
    if (name === "ownerId") {
      const adminUserStr = localStorage.getItem("admin_user");
      let adminId = "";
      let adminContact = "";
      if (adminUserStr) {
        try {
          const adminUser = JSON.parse(adminUserStr);
          adminId = adminUser.id || adminUser._id;
          adminContact = adminUser.phone || adminUser.email || "N/A";
        } catch { }
      }
      if (adminId && value === adminId) {
        setForm((prev) => ({
          ...prev,
          ownerId: value,
          ownerContact: adminContact,
        }));
        return;
      }
      const selectedOwner = owners.find((o) => o._id === value);
      if (selectedOwner) {
        setForm((prev) => ({
          ...prev,
          ownerId: value,
          ownerContact: selectedOwner.phone || selectedOwner.email || "",
        }));
        return;
      }
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const totalAllowed = 10 - existingImages.length;
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
        const uploadRes = await fetch(`${API}/properties/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadData,
        });
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

  const handleRemoveLandmark = (idx) => {
    setLandmarksList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.ownerId) {
      alert("Property name and owner are required.");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("admin_token");
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        const uploadData = new FormData();
        selectedFiles.forEach((file) => uploadData.append("images", file));
        const uploadRes = await fetch(`${API}/properties/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();
        if (uploadJson && uploadJson.urls) {
          imageUrls = uploadJson.urls;
        }
      }

      const allImages = [...existingImages, ...imageUrls];
      if (allImages.length < 1) {
        alert("Please add at least 1 property image.");
        setSubmitting(false);
        return;
      }

      const payload = {
        type: form.type,
        name: form.name,
        roomType: form.roomType,
        ownerContact: form.ownerContact,
        owner: form.ownerId,
        countryId: selectedCountry.id || undefined,
        countryName: selectedCountry.name || undefined,
        stateId: selectedState.id || undefined,
        stateName: selectedState.name || undefined,
        cityId: selectedCity.id || undefined,
        cityName: selectedCity.name || undefined,
        locationId: selectedArea.id || undefined,
        locationName: selectedArea.name || undefined,
        address: selectedArea.name
          ? `${selectedArea.name}, ${selectedCity.name}`
          : form.location,
        location: selectedArea.name
          ? `${selectedArea.name}, ${selectedCity.name}`
          : form.location,
        city: selectedCity.name || undefined,
        state: selectedState.name || undefined,
        country: selectedCountry.name || undefined,
        full_address: form.full_address || form.location,
        latitude: form.latitude ? Number(form.latitude) : undefined,
        longitude: form.longitude ? Number(form.longitude) : undefined,
        amenities: selectedAmenitiesList,
        experiences: selectedExperiences,
        price_per_night: Number(form.price),
        price: Number(form.price),
        originalPrice: form.originalPrice
          ? Number(form.originalPrice)
          : undefined,
        taxAmount: form.taxAmount ? Number(form.taxAmount) : undefined,
        highlights: form.highlights,
        status: form.status,
        description: form.description,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        rules: form.rules,
        area: form.area,
        bedRooms: Number(form.bedRooms),
        beds: Number(form.beds),
        capacity: Number(form.capacity),
        bathRooms: Number(form.bathRooms),
        images: allImages,
        rooms: roomsList,
      };

      const url = editingPropertyId ? `${API}/properties/${editingPropertyId}` : `${API}/properties`;
      const method = editingPropertyId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const createdProp = await res.json();
        const newId = createdProp.id || createdProp._id || editingPropertyId;
        for (const lm of landmarksList) {
          await fetch(`${API}/properties/${newId}/landmarks`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(lm),
          });
        }
        closePanel();
        fetchProperties();
      } else {
        const d = await res.json();
        alert(d.message || (editingPropertyId ? "Failed to update property" : "Failed to add property"));
      }
    } catch (err) {
      console.error(err);
      alert("Error adding property");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Inactive Admin" : "Active";
    try {
      const token = localStorage.getItem("admin_token");
      await fetch(`${API}/properties/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchProperties();
    } catch (err) {
      console.error(err);
    }
    setActionMenu(null);
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API}/properties/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchProperties();
      } else {
        const d = await res.json();
        alert(d.message || "Failed to delete property");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting property");
    }
    setActionMenu(null);
  };
  return (
    <div className="fade-in" onClick={() => setActionMenu(null)}>
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: "0 39px 12px" }}>
        Property Management &gt; <span>All Properties</span>
      </div>

      {/* Stats */}
      <div
        className="dash-section"
        style={{
          minHeight: 162,
          boxSizing: "border-box",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          <div
            className="props-stat-card"
            style={{ margin: 0, borderRadius: 12 }}
          >
            <div className="props-stat-icon-wrap blue">
              <ClipboardList strokeWidth={2.5} />
            </div>
            <div className="props-stat-content">
              <div className="props-stat-label">Total Properties</div>
              <div className="props-stat-value">{stats.totalProperties}</div>
            </div>
          </div>
          <div
            className="props-stat-card"
            style={{ margin: 0, borderRadius: 12 }}
          >
            <div className="props-stat-icon-wrap green">
              <Clock strokeWidth={2.5} />
            </div>
            <div className="props-stat-content">
              <div className="props-stat-label">Active Properties</div>
              <div className="props-stat-value">{stats.activeProperties}</div>
            </div>
          </div>
          <div
            className="props-stat-card"
            style={{ margin: 0, borderRadius: 12 }}
          >
            <div className="props-stat-icon-wrap red">
              <XCircle strokeWidth={2.5} />
            </div>
            <div className="props-stat-content">
              <div className="props-stat-label">Inactive (Admin)</div>
              <div className="props-stat-value">{stats.inactiveAdmin}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar + Table */}
      <div className="dash-section" style={{ marginBottom: 24, gap: 16 }}>
        <div
          className="chart-card"
          style={{ padding: "16px 20px", borderRadius: 12 }}
        >
          <div
            className="props-table-toolbar"
            style={{ margin: 0, borderBottom: "none" }}
          >
            <div className="props-table-title">All Properties</div>
            <div className="props-table-actions">
              <div
                className="props-filter-select"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                }}
              >
                <Calendar size={14} style={{ color: "#6B7280" }} />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    color: "#374151",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                />
              </div>
              <div
                className="props-filter-select"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                }}
              >
                <Calendar size={14} style={{ color: "#6B7280" }} />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    color: "#374151",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                />
              </div>
              <div
                className="props-filter-select"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                }}
              >
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    color: "#374151",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  <option value="">All Types</option>
                  {[
                    "Villa",
                    "Homestay",
                    "Resort",
                    "Apartment",
                    "Cottage",
                    "Others",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="props-btn-filter"
                onClick={fetchProperties}
                style={{ cursor: "pointer" }}
              >
                <Filter size={14} /> Filter
              </button>
              <div className="props-search-wrap">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchProperties()}
                />
              </div>

            </div>
          </div>
        </div>

        <div
          className="chart-card"
          style={{ padding: 0, overflow: "hidden", borderRadius: 12 }}
        >
          <div style={{ overflowX: "auto" }}>
            <table className="data-table" style={{ whiteSpace: "nowrap" }}>
              <thead>
                <tr>
                  {[
                    "Property No",
                    "Image",
                    "Property Name",
                    "Location",
                    "Category",
                    "Best Room Rate",
                    "Rooms",
                    "Total Enquiries",
                    "Rating",
                    "Status",
                    "",
                  ].map((h, i) => (
                    <th key={i} style={{ color: "#9CA3AF", fontWeight: 500 }}>
                      {h}
                      {h && i < 10 && (
                        <ChevronDown
                          size={11}
                          style={{ display: "inline", marginLeft: 3 }}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="11"
                      style={{
                        textAlign: "center",
                        padding: "30px 0",
                        color: "#6B7280",
                      }}
                    >
                      Loading properties...
                    </td>
                  </tr>
                ) : properties.length === 0 ? (
                  <tr>
                    <td
                      colSpan="11"
                      style={{
                        textAlign: "center",
                        padding: "30px 0",
                        color: "#6B7280",
                      }}
                    >
                      No properties found
                    </td>
                  </tr>
                ) : (
                  properties.map((p, i) => (
                    <tr key={p._id || i}>
                      <td style={{ color: "#58A429", fontWeight: 600 }}>
                        {p.propertyNo || `PR-${1000 + i}`}
                      </td>
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
                              p.image ||
                              (p.images && p.images[0]) ||
                              "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=100&q=80"
                            }
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            alt=""
                          />
                        </div>
                      </td>
                      <td style={{ color: "#111827", fontWeight: 500 }}>
                        {p.propertyName || p.name}
                      </td>
                      <td style={{ color: "#6B7280" }}>
                        {p.city}
                        {p.state ? `, ${p.state}` : ""}
                      </td>
                      <td>
                        <span className="category-pill">
                          {p.category || p.type}
                        </span>
                      </td>
                      <td style={{ color: "#111827", fontWeight: 600 }}>
                        ₹{(p.bestRoomRate || p.price || 0).toLocaleString()}
                      </td>
                      <td style={{ color: "#6B7280" }}>
                        {p.rooms || p.bedRooms || "—"}
                      </td>
                      <td style={{ color: "#6B7280" }}>
                        {p.totalEnquiries ?? 0}
                      </td>
                      <td style={{ color: "#6B7280" }}>{p.rating || "—"}</td>
                      <td>
                        <button
                          onClick={() => toggleStatus(p._id, p.status)}
                          style={{
                            border: "none",
                            background: "transparent",
                            padding: 0,
                            cursor: "pointer",
                          }}
                        >
                          {p.status === "Active" ? (
                            <span className="status-pill active">
                              <CheckCircle2 size={11} /> Active
                            </span>
                          ) : (
                            <span className="status-pill inactive">
                              <XCircle size={11} /> Inactive
                            </span>
                          )}
                        </button>
                      </td>
                      <td
                        style={{ position: "relative" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="action-dots"
                          onClick={() =>
                            setActionMenu(actionMenu === p._id ? null : p._id)
                          }
                        >
                          <MoreVertical size={14} />
                        </button>
                        {actionMenu === p._id && (
                          <div
                            style={{
                              position: "absolute",
                              right: 8,
                              top: 32,
                              background: "#fff",
                              border: "1px solid #E5E7EB",
                              borderRadius: 8,
                              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                              zIndex: 100,
                              minWidth: 140,
                            }}
                          >
                            <button
                              onClick={() => toggleStatus(p._id, p.status)}
                              style={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                padding: "9px 16px",
                                fontSize: 13,
                                color:
                                  p.status === "Active" ? "#EF4444" : "#58A429",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                borderBottom: "1px solid #F3F4F6",
                              }}
                            >
                              {p.status === "Active"
                                ? "⊘ Deactivate"
                                : "✓ Activate"}
                            </button>
                            <button
                              onClick={() => { setActionMenu(null); setViewingProperty(p); }}
                              style={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                padding: "9px 16px",
                                fontSize: 13,
                                color: "#374151",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                borderBottom: "1px solid #F3F4F6",
                              }}
                            >
                              👁 View Details
                            </button>
                            <button
                              onClick={() => deleteProperty(p._id)}
                              style={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                padding: "9px 16px",
                                fontSize: 13,
                                color: "#EF4444",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                borderBottom: "1px solid #F3F4F6",
                              }}
                            >
                              ⊘ Delete
                            </button>
                            <button
                              onClick={() => setActionMenu(null)}
                              style={{
                                display: "block",
                                width: "100%",
                                textAlign: "left",
                                padding: "9px 16px",
                                fontSize: 13,
                                color: "#374151",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              ✕ Close
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PropertyViewModal property={viewingProperty} onClose={() => setViewingProperty(null)} />

      {/* Add Property Side Panel */}
      {showPanel && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 9000, display: "flex" }}
        >
          <div
            style={{ flex: 1, background: "rgba(0,0,0,0.4)" }}
            onClick={closePanel}
          />
          <div
            style={{
              width: 680,
              background: "#fff",
              height: "100vh",
              overflowY: "auto",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Panel Header */}
            <div
              style={{
                padding: "20px 28px",
                borderBottom: "1px solid #E5E7EB",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 10,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {editingPropertyId ? "Edit Property Details" : "Add New Property"}
                </h2>
                <p
                  style={{ margin: "2px 0 0", fontSize: 12, color: "#6B7280" }}
                >
                  {editingPropertyId ? "View and update property information" : "Fill all details to list a property under an owner"}
                </p>
              </div>
              <button
                onClick={closePanel}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                <X size={22} color="#6B7280" />
              </button>
            </div>

            {/* Panel Form */}
            <form
              onSubmit={handleSubmit}
              className="master-form-card"
              style={{
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                flex: 1,
                boxShadow: "none",
                background: "transparent",
                margin: 0,
              }}
            >
              {/* Row 0: Assign to Owner */}
              <div className="form-group">
                <label
                  className="form-label"
                  style={{ fontFamily: '"Outfit", sans-serif' }}
                >
                  Assign to Owner*
                </label>
                <select
                  className="form-select"
                  name="ownerId"
                  required
                  value={form.ownerId}
                  onChange={handleFormChange}
                >
                  <option value="">— Select Owner —</option>
                  {(() => {
                    const adminUserStr = localStorage.getItem("admin_user");
                    if (adminUserStr) {
                      try {
                        const adminUser = JSON.parse(adminUserStr);
                        const adminId = adminUser.id || adminUser._id;
                        if (adminId) {
                          return (
                            <option value={adminId}>
                              {adminUser.name || "Admin"} (
                              {adminUser.email || "admin@tripinvilla.com"}) —
                              Admin/Self
                            </option>
                          );
                        }
                      } catch (e) { }
                    }
                    return null;
                  })()}
                  {owners.map((o) => (
                    <option key={o._id} value={o._id}>
                      {o.ownerName || o.name} ({o.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 1: Property Type, Property Name, Room Type */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label
                    className="form-label"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    Property Type*
                  </label>
                  <select
                    className="form-select"
                    name="type"
                    value={form.type}
                    onChange={handleFormChange}
                  >
                    <option value="Homestay">Homestay</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Resort">Resort</option>
                  </select>
                </div>
                <div className="form-group">
                  <label
                    className="form-label"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    Property Name*
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Enter property name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    className="form-label"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    Room Type*
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    name="roomType"
                    value={form.roomType}
                    onChange={handleFormChange}
                    placeholder="e.g. 1 Deluxe 4 Normal"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Owner Contact & Amenities */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label
                    className="form-label"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    Owner Contact*
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    name="ownerContact"
                    value={form.ownerContact}
                    onChange={handleFormChange}
                    placeholder="Owner contact number"
                    required
                  />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label
                    className="form-label"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
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
                      <strong style={{ color: "#58A429" }}>{form.type}</strong>
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
                      {availableAmenitiesList.length === 0 && (
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                          No amenities found for this property type.
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {/* Experiences */}
                <div
                  className="form-group"
                  style={{
                    gridColumn: "span 3",
                    borderTop: "1px solid #E5E7EB",
                    paddingTop: 16,
                  }}
                >
                  <label
                    className="form-label"
                    style={{
                      fontFamily: '"Outfit", sans-serif',
                      marginBottom: 8,
                    }}
                  >
                    Unique Experiences
                  </label>
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
                            <span>
                              {exp.representingIcon || exp.icon || "✨"}
                            </span>
                            <span>{exp.experienceName || exp.name}</span>
                          </button>
                        );
                      })}
                      {availableExperiences.length === 0 && (
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                          No experiences found.
                        </span>
                      )}
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

              {/* Rooms (for Hotel / Resort) */}
              {(form.type === 'Hotel' || form.type === 'Resort') && (
                <div className="form-group" style={{ borderTop: "1px solid #E5E7EB", paddingTop: 16, paddingBottom: 16 }}>
                  <label className="form-label" style={{ fontFamily: '"Outfit", sans-serif', marginBottom: 8, fontSize: 15, color: '#111827' }}>
                    Room Types (Hotel / Resort)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 12, alignItems: 'flex-end' }}>
                    <div>
                      <label style={{ fontSize: 12, color: '#4B5563', marginBottom: 4, display: 'block' }}>Room Type</label>
                      <select className="form-control" value={roomForm.roomType} onChange={e => setRoomForm(p => ({ ...p, roomType: e.target.value }))}>
                        {['Standard', 'Deluxe', 'Suite', 'Executive', 'Premium', 'Presidential', 'Family Room', 'Double', 'Single', 'Twin'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#4B5563', marginBottom: 4, display: 'block' }}>Room Name</label>
                      <input type="text" className="form-control" value={roomForm.roomName} onChange={e => setRoomForm(p => ({ ...p, roomName: e.target.value }))} placeholder="e.g. Sea View Suite" />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#4B5563', marginBottom: 4, display: 'block' }}>Price/Night (₹)</label>
                      <input type="number" className="form-control" value={roomForm.pricePerNight} onChange={e => setRoomForm(p => ({ ...p, pricePerNight: e.target.value }))} placeholder="e.g. 3500" />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#4B5563', marginBottom: 4, display: 'block' }}>Bed Type</label>
                      <select className="form-control" value={roomForm.bedType} onChange={e => setRoomForm(p => ({ ...p, bedType: e.target.value }))}>
                        {['Single', 'Double', 'Queen', 'King', 'Twin', 'Bunk'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div>
                        <label style={{ fontSize: 12, color: '#4B5563', marginBottom: 4, display: 'block' }}>Guests</label>
                        <input type="number" className="form-control" min={1} value={roomForm.maxGuests} onChange={e => setRoomForm(p => ({ ...p, maxGuests: e.target.value }))} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: '#4B5563', marginBottom: 4, display: 'block' }}>Count</label>
                        <input type="number" className="form-control" min={1} value={roomForm.count} onChange={e => setRoomForm(p => ({ ...p, count: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                  <button type="button"
                    onClick={() => {
                      if (!roomForm.roomName.trim() || !roomForm.pricePerNight) { alert('Please fill Room Name and Price.'); return; }
                      setRoomsList(prev => [...prev, { ...roomForm, pricePerNight: Number(roomForm.pricePerNight), maxGuests: Number(roomForm.maxGuests), count: Number(roomForm.count) }]);
                      setRoomForm({ roomType: 'Deluxe', roomName: '', pricePerNight: '', maxGuests: 2, bedType: 'Double', count: 1, amenities: [] });
                    }}
                    style={{ padding: '8px 20px', background: '#58A429', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: 600, marginBottom: 12 }}>
                    + Add Room Type
                  </button>
                  {roomsList.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {roomsList.map((room, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '10px 14px' }}>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>{room.roomName || room.roomType}</span>
                            <span style={{ color: '#6B7280', fontSize: 12, marginLeft: 8 }}>{room.roomType} · {room.bedType} bed · {room.maxGuests} guests · {room.count} rooms</span>
                            <span style={{ color: '#58A429', fontWeight: 600, fontSize: 13, marginLeft: 8 }}>₹{room.pricePerNight}/night</span>
                          </div>
                          <button type="button" onClick={() => setRoomsList(prev => prev.filter((_, i) => i !== idx))}
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  {roomsList.length === 0 && <p style={{ fontSize: 12, color: '#9CA3AF' }}>No room types added yet.</p>}
                </div>
              )}

              {/* Location & Pricing */}
              <div
                className="form-group"
                style={{
                  border: "1px solid #E5E7EB",
                  padding: "16px",
                  borderRadius: "8px",
                  background: "#F9FAFB",
                }}
              >
                <label
                  className="form-label"
                  style={{
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "15px",
                    color: "#111827",
                    display: "block",
                    marginBottom: "12px",
                  }}
                >
                  Location & Extra Pricing Details
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <label
                      className="form-label"
                      style={{ fontSize: "12px", color: "#4B5563" }}
                    >
                      Country*
                    </label>
                    <select
                      className="form-select"
                      required
                      value={selectedCountry.id}
                      onChange={(e) => {
                        const c = countries.find(
                          (x) => x._id === e.target.value,
                        );
                        setSelectedCountry(
                          c
                            ? { id: c._id, name: c.countryName }
                            : { id: "", name: "" },
                        );
                        if (c) fetchStates(c._id);
                      }}
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.countryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="form-label"
                      style={{ fontSize: "12px", color: "#4B5563" }}
                    >
                      State*
                    </label>
                    <select
                      className="form-select"
                      required
                      value={selectedState.id}
                      onChange={(e) => {
                        const s = states.find((x) => x._id === e.target.value);
                        setSelectedState(
                          s
                            ? { id: s._id, name: s.stateName }
                            : { id: "", name: "" },
                        );
                        if (s) fetchCities(s._id);
                      }}
                      disabled={!selectedCountry.id}
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.stateName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="form-label"
                      style={{ fontSize: "12px", color: "#4B5563" }}
                    >
                      City*
                    </label>
                    <select
                      className="form-select"
                      required
                      value={selectedCity.id}
                      onChange={(e) => {
                        const c = cities.find((x) => x._id === e.target.value);
                        setSelectedCity(
                          c
                            ? { id: c._id, name: c.cityName }
                            : { id: "", name: "" },
                        );
                        if (c) fetchAreas(c._id);
                      }}
                      disabled={!selectedState.id}
                    >
                      <option value="">Select City</option>
                      {cities.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.cityName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="form-label"
                      style={{ fontSize: "12px", color: "#4B5563" }}
                    >
                      Area/Location*
                    </label>
                    <select
                      className="form-select"
                      required
                      value={selectedArea.id}
                      onChange={(e) => {
                        const a = areas.find((x) => x._id === e.target.value);
                        setSelectedArea(
                          a
                            ? { id: a._id, name: a.locationName }
                            : { id: "", name: "" },
                        );
                      }}
                      disabled={!selectedCity.id}
                    >
                      <option value="">Select Area</option>
                      {areas.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.locationName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "16px",
                    marginBottom: "16px",
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
                      value={form.full_address}
                      onChange={(e) => {
                        handleFormChange(e);
                        setForm((prev) => ({
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
                      value={form.latitude}
                      onChange={handleFormChange}
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
                      value={form.longitude}
                      onChange={handleFormChange}
                      placeholder="e.g. 77.2970"
                    />
                  </div>
                </div>

                {/* Original Price & Tax */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    paddingTop: "16px",
                    paddingBottom: "16px",
                    borderTop: "1px solid #E5E7EB",
                  }}
                >
                  <div>
                    <label
                      className="form-label"
                      style={{ fontSize: "12px", color: "#4B5563" }}
                    >
                      Original Price (Strikethrough)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      name="originalPrice"
                      value={form.originalPrice}
                      onChange={handleFormChange}
                      placeholder="e.g. 5000"
                    />
                  </div>
                  <div>
                    <label
                      className="form-label"
                      style={{ fontSize: "12px", color: "#4B5563" }}
                    >
                      Tax Amount
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      name="taxAmount"
                      value={form.taxAmount}
                      onChange={handleFormChange}
                      placeholder="e.g. 212"
                    />
                  </div>
                </div>
                {form.latitude && form.longitude && (
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #D1D5DB",
                      marginBottom: 12,
                    }}
                  >
                    <iframe
                      title="Property Map Preview"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      src={`https://www.google.com/maps?q=${form.latitude},${form.longitude}&z=14&output=embed`}
                    />
                  </div>
                )}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            setForm((prev) => ({
                              ...prev,
                              latitude: position.coords.latitude,
                              longitude: position.coords.longitude,
                            }));
                          },
                          (error) => {
                            alert(
                              "Unable to retrieve your location. Please check browser permissions or enter manually.",
                            );
                          },
                        );
                      } else {
                        alert("Geolocation is not supported by your browser.");
                      }
                    }}
                    style={{
                      padding: "8px 16px",
                      background: "#FFFFFF",
                      color: "#4B5563",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    📍 Locate on Map
                  </button>
                </div>
              </div>

              {/* Row 4: Price, Image Upload, Status */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label
                    className="form-label"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    Property Price*
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    name="price"
                    value={form.price}
                    onChange={handleFormChange}
                    placeholder="₹ Amount"
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    className="form-label"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    Upload Property Images*{" "}
                    <span
                      style={{
                        fontWeight: 400,
                        color: "#9CA3AF",
                        fontSize: "11px",
                      }}
                    >
                      (Min 1, Max 10)
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
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              lineHeight: 1,
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
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              lineHeight: 1,
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {existingImages.length + selectedFiles.length < 10 && (
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
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Upload size={14} />
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
                <div className="form-group">
                  <label
                    className="form-label"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    Status*
                  </label>
                  <select
                    className="form-select"
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Check-in, Check-out, Area */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label
                    className="form-label"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    Check-In Time*
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    name="checkIn"
                    value={form.checkIn}
                    onChange={handleFormChange}
                    placeholder="e.g. 3:00 PM"
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    className="form-label"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    Check-Out Time*
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    name="checkOut"
                    value={form.checkOut}
                    onChange={handleFormChange}
                    placeholder="e.g. 12:00 PM"
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    className="form-label"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    Area Size*
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    name="area"
                    value={form.area}
                    onChange={handleFormChange}
                    placeholder="e.g. 31 sq. ft."
                    required
                  />
                </div>
              </div>

              {/* Row 6: Bedrooms, Beds, Capacity, Bathrooms */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "16px",
                }}
              >
                <div className="form-group">
                  <label
                    className="form-label"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    Bed Rooms*
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    name="bedRooms"
                    value={form.bedRooms}
                    onChange={handleFormChange}
                    placeholder="Rooms"
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    className="form-label"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    Beds Count*
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    name="beds"
                    value={form.beds}
                    onChange={handleFormChange}
                    placeholder="Beds"
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    className="form-label"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    Guests Capacity*
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleFormChange}
                    placeholder="Guests"
                    required
                  />
                </div>
                <div className="form-group">
                  <label
                    className="form-label"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                  >
                    Bath Rooms*
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    name="bathRooms"
                    value={form.bathRooms}
                    onChange={handleFormChange}
                    placeholder="Baths"
                    required
                  />
                </div>
              </div>

              {/* Highlights */}
              <div
                className="form-group"
                style={{
                  border: "1px solid #E5E7EB",
                  padding: "16px",
                  borderRadius: "8px",
                  background: "#F9FAFB",
                }}
              >
                <label
                  className="form-label"
                  style={{
                    fontFamily: '"Outfit", sans-serif',
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
                      checked={form.highlights.breakfastIncluded}
                      onChange={(e) =>
                        setForm((p) => ({
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
                      checked={form.highlights.parkingAvailable}
                      onChange={(e) =>
                        setForm((p) => ({
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
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
                        checked={form.highlights.freeCancellation}
                        onChange={(e) =>
                          setForm((p) => ({
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
                    {form.highlights.freeCancellation && (
                      <input
                        type="text"
                        value={form.highlights.freeCancellationHours}
                        onChange={(e) =>
                          setForm((p) => ({
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

              {/* Row 7: Landmarks */}
              <div className="form-group">
                <label
                  className="form-label"
                  style={{ fontFamily: '"Outfit", sans-serif' }}
                >
                  Nearby Landmarks
                </label>
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
                      <option value="Beach">Beach</option>
                      <option value="Market">Market</option>
                      <option value="Temple">Temple</option>
                      <option value="Airport">Airport</option>
                      <option value="Railway Station">Railway Station</option>
                      <option value="Bus Stand">Bus Stand</option>
                      <option value="Restaurant">Restaurant</option>
                    </select>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                        color: "#4B5563",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Landmark Image:
                    </label>
                    <input
                      type="file"
                      ref={landmarkImageRef}
                      accept="image/jpg,image/jpeg,image/png"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          alert("Max 5MB allowed");
                          return;
                        }
                        setLandmarkImageFile(file);
                        setLandmarkImagePreview(URL.createObjectURL(file));
                      }}
                      style={{ flex: 1, fontSize: "12px" }}
                    />
                    {landmarkImagePreview && (
                      <img
                        src={landmarkImagePreview}
                        alt="preview"
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "1px solid #D1D5DB",
                        }}
                      />
                    )}
                    <button
                      type="button"
                      onClick={handleAddLandmark}
                      disabled={landmarkImageUploading}
                      style={{
                        padding: "8px 16px",
                        background: landmarkImageUploading
                          ? "#9CA3AF"
                          : "#58A429",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: landmarkImageUploading
                          ? "not-allowed"
                          : "pointer",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {landmarkImageUploading ? "Uploading..." : "Add Landmark"}
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {landmarksList.map((lm, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "#F3F4F6",
                        color: "#1F2937",
                        padding: "6px 10px 6px 6px",
                        borderRadius: "16px",
                        fontSize: "13px",
                        fontWeight: 500,
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      {lm.landmark_image_url ? (
                        <img
                          src={lm.landmark_image_url}
                          alt={lm.landmark_name}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "10px",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <span>📍</span>
                      )}
                      <span>
                        {lm.landmark_name} —{" "}
                        <span style={{ color: "#6B7280", fontSize: "12px" }}>
                          {lm.landmark_type}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLandmark(idx)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#EF4444",
                          cursor: "pointer",
                          padding: 0,
                          display: "flex",
                          marginLeft: "2px",
                        }}
                      >
                        <span style={{ fontSize: "16px", lineHeight: "14px" }}>
                          &times;
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 8: Rules */}
              <div className="form-group">
                <label
                  className="form-label"
                  style={{ fontFamily: '"Outfit", sans-serif' }}
                >
                  Property Rules (New line per rule)*
                </label>
                <textarea
                  className="form-textarea"
                  name="rules"
                  rows={3}
                  value={form.rules}
                  onChange={handleFormChange}
                  placeholder="e.g. • Primary Guest should be atleast 18 years of age."
                  required
                />
              </div>

              {/* Row 9: Description / About */}
              <div className="form-group">
                <label
                  className="form-label"
                  style={{ fontFamily: '"Outfit", sans-serif' }}
                >
                  About Property*
                </label>
                <textarea
                  className="form-textarea"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Write description about property..."
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "flex-end",
                  paddingTop: 12,
                  borderTop: "1px solid #E5E7EB",
                }}
              >
                <button
                  type="button"
                  onClick={closePanel}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #D1D5DB",
                    background: "#fff",
                    color: "#374151",
                    borderRadius: 8,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "10px 24px",
                    border: "none",
                    background: "#58A429",
                    color: "#fff",
                    borderRadius: 8,
                    fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontSize: 14,
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? "Saving..." : "Save Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
