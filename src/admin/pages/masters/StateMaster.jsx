import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Edit2, Trash2, Search, AlertTriangle } from 'lucide-react';

export default function StateMaster() {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    stateName: '',
    countryId: '',
    status: 'Active'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchCountries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/countries/active');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCountries(data);
        if (data.length > 0 && !formData.countryId) {
          setFormData(prev => ({ ...prev, countryId: data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error fetching countries:', err);
    }
  };

  const fetchStates = async () => {
    setLoading(true);
    try {
      const url = filterCountry === 'All' 
        ? 'http://localhost:5000/api/admin/states' 
        : `http://localhost:5000/api/admin/states?country_id=${filterCountry}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) setStates(data);
    } catch (err) {
      console.error('Error fetching states:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchStates();
  }, [filterCountry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.stateName || !formData.countryId) {
      alert('Please fill out all required fields');
      return;
    }

    try {
      if (isEditing) {
        const res = await fetch(`http://localhost:5000/api/admin/states/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) fetchStates();
        setIsEditing(false);
      } else {
        const res = await fetch('http://localhost:5000/api/admin/states', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) fetchStates();
      }

      setFormData({
        id: '',
        stateName: '',
        countryId: countries.length > 0 ? countries[0]._id : '',
        status: 'Active'
      });
    } catch (err) {
      console.error('Error submitting state:', err);
    }
  };

  const handleEdit = (stateObj) => {
    setFormData({
      id: stateObj._id,
      stateName: stateObj.stateName,
      countryId: stateObj.countryId?._id || stateObj.countryId || (countries.length > 0 ? countries[0]._id : ''),
      status: stateObj.status || 'Active'
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
      const res = await fetch(`http://localhost:5000/api/admin/states/${deleteTargetId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchStates();
      } else {
        const data = await res.json();
        alert(data.message || 'Error deleting state');
      }
    } catch (err) {
      console.error('Error deleting state:', err);
      alert('Error deleting state');
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  const filteredStates = states.filter(s => {
    const matchesSearch = (s.stateName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.countryName || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="fade-in">
      {/* Breadcrumbs */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Masters &gt; <span>State Master</span>
      </div>

      {/* Form Container */}
      <div className="dash-section" style={{ marginBottom: 16 }}>
        <form onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header">
            <div className="master-form-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Map size={18} style={{ color: 'var(--primary)' }} />
              {isEditing ? 'Modify State' : 'Add New State Entry'}
            </div>
            <div className="master-form-actions">
              <button type="submit" className="btn-solid-green" style={{ cursor: 'pointer' }}>
                {isEditing ? 'Update State' : 'Add State'}
              </button>
            </div>
          </div>

          <div className="form-grid-3" style={{ marginBottom: 0 }}>
            <div className="form-group">
              <label className="form-label">State Name*</label>
              <input 
                type="text" 
                name="stateName"
                value={formData.stateName}
                onChange={handleChange}
                placeholder="e.g. Maharashtra" 
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Associated Country*</label>
              <select 
                name="countryId"
                value={formData.countryId}
                onChange={handleChange}
                className="form-select"
              >
                {countries.map(c => (
                  <option key={c._id} value={c._id}>{c.countryName}</option>
                ))}
              </select>
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
                  setFormData({ id: '', stateName: '', countryId: countries.length > 0 ? countries[0]._id : '', status: 'Active' });
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
          <div className="table-title">Existing States ({filteredStates.length})</div>
          <div className="table-header-right">
            <div style={{ display: 'flex', gap: '12px' }}>
              <select 
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="select-filter"
                style={{ padding: '8px 12px' }}
              >
                <option value="All">All Countries</option>
                {countries.map(c => (
                  <option key={c._id} value={c._id}>{c.countryName}</option>
                ))}
              </select>

              <div className="props-search-wrap">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search state..." 
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
                <th>State Name</th>
                <th>Associated Country</th>
                <th style={{ textAlign: 'center' }}>Cities Count</th>
                <th style={{ textAlign: 'center' }}>Owners Count</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>Loading states...</td></tr>
              ) : filteredStates.length > 0 ? (
                filteredStates.map((stateObj) => (
                  <tr key={stateObj._id}>
                    <td style={{ fontWeight: 600, color: '#111827' }}>{stateObj.stateName}</td>
                    <td style={{ fontWeight: 500 }}>{stateObj.countryName || stateObj.countryId?.countryName || 'N/A'}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>
                      <span 
                        onClick={() => navigate(`/masters/city?stateId=${stateObj._id}`)}
                        style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                        title="View Cities in this State"
                      >
                        {stateObj.citiesCount ?? 0}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 500 }}>{stateObj.ownersCount ?? 0}</td>
                    <td>
                      <span className={`status-pill ${stateObj.status ? stateObj.status.toLowerCase() : 'active'}`}>
                        {stateObj.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button 
                          onClick={() => handleEdit(stateObj)}
                          title="Edit State"
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 4 }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => triggerDelete(stateObj._id)}
                          title="Delete State"
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
                    No states found matching your filters.
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
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Delete State</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px', lineHeight: 1.5 }}>
                  Are you absolutely sure you want to delete this state? This action is permanent and will remove associated city listings.
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
