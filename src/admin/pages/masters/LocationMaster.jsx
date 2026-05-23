import { useState, useEffect } from 'react';
import { MapPin, Edit2, Trash2, Search, Plus, X, AlertTriangle } from 'lucide-react';

export default function LocationMaster() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    locationName: '',
    locationType: 'City',
    parentLocationHierarchy: '',
    aboutLocation: '',
    status: 'Active'
  });

  const [landmarks, setLandmarks] = useState([
    { landmarkName: 'Anjuna Flea Market', landmarkPopularity: 'Tourist Popular', landmarkImageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=100&q=80' }
  ]);

  const [currentLandmarkName, setCurrentLandmarkName] = useState('');
  const [currentLandmarkPop, setCurrentLandmarkPop] = useState('Tourist Popular');
  const [currentLandmarkImg, setCurrentLandmarkImg] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/locations');
      const data = await res.json();
      if (Array.isArray(data)) setLocations(data);
    } catch (err) {
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddLandmark = async () => {
    if (!currentLandmarkName) {
      alert('Please provide a landmark name.');
      return;
    }
    const newL = {
      landmarkName: currentLandmarkName,
      landmarkPopularity: currentLandmarkPop,
      landmarkImageUrl: currentLandmarkImg || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=100&q=80'
    };
    
    if (isEditing && formData.id) {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/locations/${formData.id}/landmarks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newL)
        });
        if (res.ok) {
          const addedL = await res.json();
          setLandmarks(prev => [...prev, addedL]);
          fetchLocations(); // Refresh data table
        }
      } catch (err) {
        console.error('Error adding landmark directly:', err);
      }
    } else {
      setLandmarks(prev => [...prev, newL]);
    }
    
    setCurrentLandmarkName('');
    setCurrentLandmarkImg('');
  };

  const handleRemoveLandmark = async (index) => {
    const land = landmarks[index];
    if (isEditing && formData.id && land._id) {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/landmarks/${land._id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchLocations();
        }
      } catch (err) {
        console.error('Error removing landmark directly:', err);
      }
    }
    setLandmarks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.locationName || !formData.parentLocationHierarchy) {
      alert('Please fill out Location Name and Parent Location.');
      return;
    }

    try {
      const payload = { ...formData, landmarks };

      if (isEditing) {
        const res = await fetch(`http://localhost:5000/api/admin/locations/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) fetchLocations();
        setIsEditing(false);
      } else {
        const res = await fetch('http://localhost:5000/api/admin/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) fetchLocations();
      }

      setFormData({
        id: '',
        locationName: '',
        locationType: 'City',
        parentLocationHierarchy: '',
        aboutLocation: '',
        status: 'Active'
      });
      setLandmarks([]);
    } catch (err) {
      console.error('Error submitting location:', err);
    }
  };

  const handleEdit = (locObj) => {
    setFormData({
      id: locObj._id,
      locationName: locObj.locationName,
      locationType: locObj.locationType || 'City',
      parentLocationHierarchy: locObj.parentLocationHierarchy || '',
      aboutLocation: locObj.aboutLocation || '',
      status: locObj.status || 'Active'
    });
    setLandmarks(locObj.landmarks ? [...locObj.landmarks] : []);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerDelete = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/locations/${deleteTargetId}`, { method: 'DELETE' });
      if (res.ok) fetchLocations();
    } catch (err) {
      console.error('Error deleting location:', err);
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  const filteredLocations = locations.filter(l => 
    (l.locationName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.locationType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.parentLocationHierarchy || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      {/* Breadcrumbs */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Masters &gt; <span>Location Master</span>
      </div>

      {/* Form Container */}
      <div className="dash-section" style={{ marginBottom: 16 }}>
        <form onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header">
            <div className="master-form-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={18} style={{ color: 'var(--primary)' }} />
              {isEditing ? 'Modify Location' : 'Add New Location Context'}
            </div>
            <div className="master-form-actions">
              <button type="submit" className="btn-solid-green" style={{ cursor: 'pointer' }}>
                {isEditing ? 'Update Location' : 'Add Location'}
              </button>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Location Name*</label>
              <input 
                type="text" 
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                placeholder="e.g. Goa, India" 
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location Type*</label>
              <select 
                name="locationType"
                value={formData.locationType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Country">Country</option>
                <option value="State">State</option>
                <option value="City">City</option>
                <option value="Sub-Location">Sub-Location</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Parent Location Hierarchy*</label>
              <input 
                type="text" 
                name="parentLocationHierarchy"
                value={formData.parentLocationHierarchy}
                onChange={handleChange}
                placeholder="e.g. Candolim -> North Goa -> Goa -> India" 
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Landmarks setup matching Figma Screenshot 2 exactly */}
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Key Landmark*</label>
                <input 
                  type="text" 
                  value={currentLandmarkName} 
                  onChange={(e) => setCurrentLandmarkName(e.target.value)}
                  placeholder="e.g. Anjuna Flea Market"
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Landmark Popularity*</label>
                <input 
                  type="text" 
                  value={currentLandmarkPop} 
                  onChange={(e) => setCurrentLandmarkPop(e.target.value)}
                  placeholder="e.g. Tourist Popular"
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Landmark Images* <span style={{ color: '#EF4444', fontSize: 11, fontWeight: 400, marginLeft: 4 }}>Supported File: .jpg / max. 5mb</span>
                </label>
                <div className="file-upload-wrapper">
                  <input 
                    type="text" 
                    value={currentLandmarkImg || "image.jpg image.jpg"} 
                    onChange={(e) => setCurrentLandmarkImg(e.target.value)}
                    placeholder="Paste image URL..." 
                    className="file-upload-input" 
                  />
                  <button type="button" className="btn-browse" style={{ cursor: 'pointer' }}>Browse</button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', marginTop: 12 }}>
              <button 
                type="button" 
                onClick={handleAddLandmark}
                className="btn-outline-green"
                style={{ cursor: 'pointer', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}
              >
                Add Landmark
              </button>
            </div>

            {/* Added landmarks chip listing */}
            {landmarks.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
                {landmarks.map((land, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                    <div style={{ width: 24, height: 24, borderRadius: 4, overflow: 'hidden' }}>
                      <img src={land.landmarkImageUrl} alt="land" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: '#111827', margin: 0 }}>{land.landmarkName}</p>
                      <span style={{ fontSize: '9px', color: '#9CA3AF' }}>{land.landmarkPopularity}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveLandmark(idx)}
                      style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-grid-3" style={{ marginBottom: 0 }}>
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

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">About Location</label>
              <textarea 
                name="aboutLocation"
                value={formData.aboutLocation}
                onChange={handleChange}
                placeholder="Write beautiful details for this physical location..." 
                className="form-textarea"
                style={{ minHeight: 46, padding: '10px 14px' }}
              />
            </div>
          </div>

          {isEditing && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ id: '', locationName: '', locationType: 'City', parentLocationHierarchy: '', aboutLocation: '', status: 'Active' });
                  setLandmarks([]);
                }}
                className="btn-outline-green"
                style={{ cursor: 'pointer', padding: '8px 16px', fontSize: 12 }}
              >
                Cancel Edit
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Table Section */}
      <div className="table-section">
        <div className="table-header">
          <div className="table-title">Existing Location Contexts ({filteredLocations.length})</div>
          <div className="table-header-right">
            <div className="props-search-wrap">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search location type, name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Location Name</th>
                <th>Type</th>
                <th>Parent Location Hierarchy</th>
                <th>Landmarks</th>
                <th>About Brief</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>Loading locations...</td></tr>
              ) : filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => (
                  <tr key={loc._id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{loc.locationName}</td>
                    <td style={{ fontWeight: 500 }}>{loc.locationType}</td>
                    <td style={{ fontSize: '11px', color: '#6B7280', whiteSpace: 'normal', maxW: '160px', lineHeight: 1.4 }}>{loc.parentLocationHierarchy}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {loc.landmarks && loc.landmarks.map((l, i) => (
                          <div 
                            key={i} 
                            style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginLeft: i > 0 ? -8 : 0 }}
                            title={`${l.landmarkName} (${l.landmarkPopularity})`}
                          >
                            <img src={l.landmarkImageUrl} alt={l.landmarkName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                        <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 'bold', marginLeft: 6 }}>({loc.landmarks?.length || 0})</span>
                      </div>
                    </td>
                    <td style={{ color: '#9CA3AF', fontSize: '11px', whiteSpace: 'normal', maxW: '180px' }}>{loc.aboutLocation || 'N/A'}</td>
                    <td>
                      <span className={`status-pill ${loc.status ? loc.status.toLowerCase() : 'active'}`}>
                        {loc.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button 
                          onClick={() => handleEdit(loc)}
                          title="Edit Location"
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 4 }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => triggerDelete(loc._id)}
                          title="Delete Location"
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF' }}>
                    No location masters found matching search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', items: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', maxWidth: '400px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', margin: 'auto' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', backgroundColor: '#FEE2E2', borderRadius: '50%', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Delete Location</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px', lineHeight: 1.5 }}>
                  Are you absolutely sure you want to delete this location context? This action cannot be undone.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="btn-outline-green"
                style={{ cursor: 'pointer', padding: '8px 16px', fontSize: 13 }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                style={{ cursor: 'pointer', backgroundColor: '#EF4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
