import { useState, useEffect } from 'react';
import { Compass, Edit2, Trash2, Search, AlertTriangle } from 'lucide-react';

export default function CityMaster() {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    cityName: '',
    stateId: '',
    status: 'Active'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Read stateId from URL to pre-filter
  const queryParams = new URLSearchParams(window.location.search);
  const initialFilterState = queryParams.get('stateId') || 'All';
  const [filterState, setFilterState] = useState(initialFilterState);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchStates = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/states/active');
      const data = await res.json();
      if (Array.isArray(data)) {
        setStates(data);
        if (data.length > 0 && !formData.stateId) {
          setFormData(prev => ({ ...prev, stateId: data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching states:', err);
    }
  };

  const fetchCities = async () => {
    setLoading(true);
    try {
      const url = filterState === 'All' 
        ? 'http://localhost:5000/api/admin/cities' 
        : `http://localhost:5000/api/admin/cities?state_id=${filterState}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) setCities(data);
    } catch (err) {
      console.error('Error fetching cities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    fetchCities();
  }, [filterState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cityName || !formData.stateId) {
      alert('Please fill out all required fields');
      return;
    }

    try {
      if (isEditing) {
        const res = await fetch(`http://localhost:5000/api/admin/cities/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) fetchCities();
        setIsEditing(false);
      } else {
        const res = await fetch('http://localhost:5000/api/admin/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) fetchCities();
      }

      setFormData({
        id: '',
        cityName: '',
        stateId: states.length > 0 ? states[0]._id : '',
        status: 'Active'
      });
    } catch (err) {
      console.error('Error submitting city:', err);
    }
  };

  const handleEdit = (cityObj) => {
    setFormData({
      id: cityObj._id,
      cityName: cityObj.cityName,
      stateId: cityObj.stateId?._id || cityObj.stateId || (states.length > 0 ? states[0]._id : ''),
      status: cityObj.status || 'Active'
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerDelete = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/cities/${deleteTargetId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCities();
      } else {
        const data = await res.json();
        alert(data.message || 'Error deleting city');
      }
    } catch (err) {
      console.error('Error deleting city:', err);
      alert('Error deleting city');
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  const filteredCities = cities.filter(c => {
    const matchesSearch = (c.cityName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (c.stateName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (c.countryName || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const selectedStateObj = states.find(s => s._id === formData.stateId);

  return (
    <div className="fade-in">
      {/* Breadcrumbs */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Masters &gt; <span>City Master</span>
      </div>

      {/* Form Container */}
      <div className="dash-section" style={{ marginBottom: 16 }}>
        <form onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header">
            <div className="master-form-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Compass size={18} style={{ color: 'var(--primary)' }} />
              {isEditing ? 'Modify City' : 'Add New City Entry'}
            </div>
            <div className="master-form-actions">
              <button type="submit" className="btn-solid-green" style={{ cursor: 'pointer' }}>
                {isEditing ? 'Update City' : 'Add City'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label">City Name*</label>
              <input 
                type="text" 
                name="cityName"
                value={formData.cityName}
                onChange={handleChange}
                placeholder="e.g. Mumbai" 
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Select State*</label>
              <select 
                name="stateId"
                value={formData.stateId}
                onChange={handleChange}
                className="form-select"
              >
                {states.map(s => (
                  <option key={s._id} value={s._id}>{s.stateName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Country (Auto-filled)</label>
              <input 
                type="text" 
                value={selectedStateObj ? (selectedStateObj.countryName || selectedStateObj.countryId?.countryName || '') : ''}
                className="form-input"
                style={{ backgroundColor: '#F9FAFB', color: '#9CA3AF', borderColor: '#E5E7EB', cursor: 'not-allowed' }}
                disabled
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

          {isEditing && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ id: '', cityName: '', stateId: states.length > 0 ? states[0]._id : '', status: 'Active' });
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
          <div className="table-title">Existing Cities ({filteredCities.length})</div>
          <div className="table-header-right">
            <div style={{ display: 'flex', gap: '12px' }}>
              <select 
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="select-filter"
                style={{ padding: '8px 12px' }}
              >
                <option value="All">All States</option>
                {states.map(s => (
                  <option key={s._id} value={s._id}>{s.stateName}</option>
                ))}
              </select>

              <div className="props-search-wrap">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search city..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>City Name</th>
                <th>Associated State</th>
                <th>Associated Country</th>
                <th style={{ textAlign: 'center' }}>Properties Count</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>Loading cities...</td></tr>
              ) : filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <tr key={city._id}>
                    <td style={{ fontWeight: 600, color: '#111827' }}>{city.cityName}</td>
                    <td style={{ fontWeight: 500 }}>{city.stateName}</td>
                    <td style={{ color: '#4B5563' }}>{city.countryName || 'N/A'}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--primary)' }}>{city.propertiesCount ?? 0}</td>
                    <td>
                      <span className={`status-pill ${city.status ? city.status.toLowerCase() : 'active'}`}>
                        {city.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button 
                          onClick={() => handleEdit(city)}
                          title="Edit City"
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 4 }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => triggerDelete(city._id)}
                          title="Delete City"
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
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF' }}>
                    No cities found matching your search.
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
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Delete City</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px', lineHeight: 1.5 }}>
                  Are you absolutely sure you want to delete this city? This action is permanent and may affect property listing associations.
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
