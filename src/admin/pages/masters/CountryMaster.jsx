import { useState, useEffect } from 'react';
import { Globe, Edit2, Trash2, Search, AlertTriangle } from 'lucide-react';

import ReadMore from '../../components/ReadMore';
import Pagination from '../../components/Pagination';
export default function CountryMaster() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    id: '',
    countryName: '',
    dialCode: '',
    currencyCode: '',
    currencySymbol: '',
    flagImageUrl: '',
    status: 'Active'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/admin/countries`);
      const data = await res.json();
      if (Array.isArray(data)) setCountries(data);
    } catch (err) {
      console.error('Error fetching countries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.countryName || !formData.dialCode || !formData.currencyCode || !formData.currencySymbol) {
      alert('Please fill out all required fields');
      return;
    }

    try {
      const payload = {
        ...formData,
        flagImageUrl: formData.flagImageUrl || 'https://images.unsplash.com/photo-1526481280693-3bfa75fc170f?auto=format&fit=crop&w=120&q=80'
      };

      if (isEditing) {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/admin/countries/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) fetchCountries();
        setIsEditing(false);
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/admin/countries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) fetchCountries();
      }

      setFormData({
        id: '',
        countryName: '',
        dialCode: '',
        currencyCode: '',
        currencySymbol: '',
        flagImageUrl: '',
        status: 'Active'
      });
    } catch (err) {
      console.error('Error submitting country:', err);
    }
  };

  const handleEdit = (country) => {
    setFormData({
      id: country._id,
      countryName: country.countryName,
      dialCode: country.dialCode,
      currencyCode: country.currencyCode,
      currencySymbol: country.currencySymbol,
      flagImageUrl: country.flagImageUrl,
      status: country.status || 'Active'
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/admin/countries/${deleteTargetId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCountries();
      } else {
        const data = await res.json();
        alert(data.message || 'Error deleting country');
      }
    } catch (err) {
      console.error('Error deleting country:', err);
      alert('Error deleting country');
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

    useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredCountries = countries.filter(c => 
    (c.countryName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.dialCode || '').includes(searchTerm) ||
    (c.currencyCode || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

    const totalItems = filteredCountries.length;
  const paginated = filteredCountries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="fade-in">
      {/* Breadcrumbs */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Masters &gt; <span>Country Master</span>
      </div>

      {/* Form Container */}
      <div className="dash-section" style={{ marginBottom: 16 }}>
        <form onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header">
            <div className="master-form-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={18} style={{ color: 'var(--primary)' }} />
              {isEditing ? 'Modify Country' : 'Add New Country Entry'}
            </div>
            <div className="master-form-actions">
              <button type="submit" className="btn-solid-green" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                {isEditing ? 'Update Country' : 'Add Country'}
              </button>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Country Name*</label>
              <input 
                type="text" 
                name="countryName"
                value={formData.countryName}
                onChange={handleChange}
                placeholder="e.g. India" 
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Country Dial Code*</label>
              <input 
                type="text" 
                name="dialCode"
                value={formData.dialCode}
                onChange={handleChange}
                placeholder="e.g. +91" 
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Currency Code*</label>
              <input 
                type="text" 
                name="currencyCode"
                value={formData.currencyCode}
                onChange={handleChange}
                placeholder="e.g. INR" 
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-grid-3" style={{ marginBottom: 0 }}>
            <div className="form-group">
              <label className="form-label">Currency Symbol*</label>
              <input 
                type="text" 
                name="currencySymbol"
                value={formData.currencySymbol}
                onChange={handleChange}
                placeholder="e.g. ₹" 
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Flag Image URL</label>
              <input 
                type="text" 
                name="flagImageUrl"
                value={formData.flagImageUrl}
                onChange={handleChange}
                placeholder="Paste flag image URL..." 
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

          {isEditing && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ id: '', countryName: '', dialCode: '', currencyCode: '', currencySymbol: '', flagImageUrl: '', status: 'Active' });
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
          <div className="table-title">Existing Countries ({filteredCountries.length})</div>
          <div className="table-header-right">
            <div className="props-search-wrap">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search country name, code, currency..." 
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
                <th style={{ width: '80px' }}>Flag</th>
                <th>Country Name</th>
                <th>Dial Code</th>
                <th>Currency</th>
                <th>Symbol</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>Loading countries...</td></tr>
              ) : filteredCountries.length > 0 ? (
                paginated.map((country) => (
                  <tr key={country._id}>
                    <td>
                      <div style={{ width: 44, height: 30, borderRadius: 4, overflow: 'hidden', border: '1px solid #E5E7EB', background: '#FAFAFA' }}>
                        <img src={country.flagImageUrl} alt={country.countryName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#111827' }}>{country.countryName}</td>
                    <td style={{ fontWeight: 500 }}>{country.dialCode}</td>
                    <td style={{ fontWeight: 600 }}>{country.currencyCode}</td>
                    <td style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>{country.currencySymbol}</td>
                    <td>
                      <span className={`status-pill ${country.status ? country.status.toLowerCase() : 'active'}`}>
                        {country.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button 
                          onClick={() => handleEdit(country)}
                          title="Edit Country"
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 4 }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => triggerDelete(country._id)}
                          title="Delete Country"
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
                    No countries found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage} 
          totalItems={totalItems} 
          itemsPerPage={itemsPerPage} 
          onPageChange={setCurrentPage} 
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', maxWidth: '400px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', margin: 'auto' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', backgroundColor: '#FEE2E2', borderRadius: '50%', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Delete Country</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px', lineHeight: 1.5 }}>
                  Are you absolutely sure you want to delete this country? This action is permanent and may affect state and city records.
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
