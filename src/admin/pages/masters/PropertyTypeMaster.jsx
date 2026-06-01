import { useState, useEffect } from 'react';
import { Home, Edit2, Trash2, Search, AlertTriangle } from 'lucide-react';
import Pagination from '../../components/Pagination';

export default function PropertyTypeMaster() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({ id: '', name: '', status: 'Active' });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/property-types`);
      const data = await res.json();
      if (Array.isArray(data)) setTypes(data);
    } catch (err) {
      console.error('Error fetching property types:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTypes(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return alert('Please enter property type name');
    try {
      if (isEditing) {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/property-types/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) fetchTypes();
        setIsEditing(false);
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/property-types`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) fetchTypes();
      }
      setFormData({ id: '', name: '', status: 'Active' });
    } catch (err) {
      console.error('Error submitting property type:', err);
    }
  };

  const handleEdit = (type) => {
    setFormData({ id: type._id, name: type.name, status: type.status || 'Active' });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerDelete = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/property-types/${deleteTargetId}`, { method: 'DELETE' });
      if (res.ok) fetchTypes();
      else alert('Error deleting property type');
    } catch (err) {
      console.error('Error deleting property type:', err);
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const filteredTypes = types.filter(t => (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
  const totalItems = filteredTypes.length;
  const paginated = filteredTypes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="fade-in">
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Masters &gt; <span>Property Type Master</span>
      </div>

      <div className="dash-section" style={{ marginBottom: 16 }}>
        <form onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header">
            <div className="master-form-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Home size={18} style={{ color: 'var(--primary)' }} />
              {isEditing ? 'Modify Property Type' : 'Add New Property Type'}
            </div>
            <div className="master-form-actions">
              <button type="submit" className="btn-solid-green" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                {isEditing ? 'Update Type' : 'Add Type'}
              </button>
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Property Type Name*</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Villa" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Status*</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-select">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          {isEditing && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="button" onClick={() => { setIsEditing(false); setFormData({ id: '', name: '', status: 'Active' }); }} className="btn-outline-green" style={{ cursor: 'pointer', padding: '8px 16px', fontSize: 12 }}>
                Cancel Edit
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="table-section">
        <div className="table-header">
          <div className="table-title">Existing Types ({filteredTypes.length})</div>
          <div className="table-header-right">
            <div className="props-search-wrap">
              <Search size={16} />
              <input type="text" placeholder="Search type..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Type Name</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>Loading types...</td></tr>
              ) : filteredTypes.length > 0 ? (
                paginated.map((type) => (
                  <tr key={type._id}>
                    <td style={{ fontWeight: 600, color: '#111827' }}>{type.name}</td>
                    <td>
                      <span className={`status-pill ${type.status ? type.status.toLowerCase() : 'active'}`}>
                        {type.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button onClick={() => handleEdit(type)} title="Edit Type" style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 4 }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => triggerDelete(type._id)} title="Delete Type" style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF' }}>No property types found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
      </div>

      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', maxWidth: '400px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', margin: 'auto' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', backgroundColor: '#FEE2E2', borderRadius: '50%', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Delete Property Type</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px', lineHeight: 1.5 }}>
                  Are you absolutely sure you want to delete this property type?
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setShowDeleteModal(false)} className="btn-outline-green" style={{ cursor: 'pointer', padding: '8px 16px', fontSize: 13 }}>Cancel</button>
              <button onClick={confirmDelete} style={{ cursor: 'pointer', backgroundColor: '#EF4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: 13, fontWeight: 600 }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
