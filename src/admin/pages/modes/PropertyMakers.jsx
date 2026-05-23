import { useState, useEffect } from 'react';
import { ChevronDown, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PropertyMakers() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    propertyType: 'Homestay',
    propertyName: '',
    ownerName: '',
    ownerContact: '',
    amenityTypes: '',
    location: '',
    propertyPrice: '',
    imagesUrl: '',
    videosUrl: '',
    aboutProperty: '',
    status: 'Active'
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/master/properties');
      const data = await res.json();
      if (Array.isArray(data)) setProperties(data);
    } catch (err) {
      console.error('Error fetching property masters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amenityTypes: formData.amenityTypes.split(',').map(s => s.trim()),
        images: formData.imagesUrl ? [formData.imagesUrl] : ['https://images.unsplash.com/photo-1580587722351-9d9b788c0784?w=500&auto=format&fit=crop&q=60']
      };

      if (isEditing) {
        const res = await fetch(`http://localhost:5000/api/master/properties/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) fetchProperties();
        setIsEditing(false);
      } else {
        const res = await fetch('http://localhost:5000/api/master/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) fetchProperties();
      }

      setFormData({
        id: '',
        propertyType: 'Homestay',
        propertyName: '',
        ownerName: '',
        ownerContact: '',
        amenityTypes: '',
        location: '',
        propertyPrice: '',
        imagesUrl: '',
        videosUrl: '',
        aboutProperty: '',
        status: 'Active'
      });
    } catch (err) {
      console.error('Error submitting property master:', err);
    }
  };

  const handleEdit = (p) => {
    setFormData({
      id: p._id,
      propertyType: p.propertyType || 'Homestay',
      propertyName: p.propertyName || '',
      ownerName: p.ownerName || '',
      ownerContact: p.ownerContact || '',
      amenityTypes: Array.isArray(p.amenityTypes) ? p.amenityTypes.join(', ') : (p.amenityTypes || ''),
      location: p.location || '',
      propertyPrice: p.propertyPrice || '',
      imagesUrl: Array.isArray(p.images) && p.images[0] ? p.images[0] : '',
      videosUrl: '',
      aboutProperty: p.aboutProperty || '',
      status: p.status || 'Active'
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property master?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/master/properties/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProperties();
    } catch (err) {
      console.error('Error deleting property master:', err);
    }
  };

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Masters &gt; <span>Property Masters</span>
      </div>

      {/* Form Section */}
      <div className="dash-section" style={{ marginBottom: 16 }}>
        <form onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0 }}>
          <div className="master-form-header">
            <div className="master-form-title">{isEditing ? 'Modify Property Master' : 'Add New Property Master'}</div>
            <div className="master-form-actions">
              <button type="button" className="btn-outline-green" onClick={() => navigate('/admin/modes/pricing-rules')}>Edit Pricing &amp; Rules</button>
              <button type="submit" className="btn-solid-green" style={{ cursor: 'pointer' }}>{isEditing ? 'Update' : 'Add'}</button>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Property Type*</label>
              <div style={{ position: 'relative' }}>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="form-select" style={{ appearance: 'none' }}>
                  <option value="Homestay">Homestay</option>
                  <option value="Villa">Villa</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Resort">Resort</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Property Name*</label>
              <input type="text" name="propertyName" value={formData.propertyName} onChange={handleChange} placeholder="e.g. Bodhi Roots Homestay" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Owner Name*</label>
              <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="e.g. Navin Kumar" className="form-input" required />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Owner Contact*</label>
              <input type="text" name="ownerContact" value={formData.ownerContact} onChange={handleChange} placeholder="e.g. +91 9988776655" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Amenities Types* (comma separated)</label>
              <input type="text" name="amenityTypes" value={formData.amenityTypes} onChange={handleChange} placeholder="e.g. Barbeque, Pub, WiFi" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Location*</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Kasol, Himachal Pradesh, India" className="form-input" required />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Property Price (₹)*</label>
              <input type="number" name="propertyPrice" value={formData.propertyPrice} onChange={handleChange} placeholder="e.g. 3500" className="form-input" required />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Image URL*</label>
              <input type="text" name="imagesUrl" value={formData.imagesUrl} onChange={handleChange} placeholder="https://images.unsplash.com/..." className="form-input" />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Video URL (Optional)</label>
              <input type="text" name="videosUrl" value={formData.videosUrl} onChange={handleChange} placeholder="https://..." className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Status*</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-select">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-grid-1" style={{ marginBottom: 0 }}>
            <div className="form-group">
              <label className="form-label">About Property*</label>
              <textarea name="aboutProperty" value={formData.aboutProperty} onChange={handleChange} placeholder="Provide a detailed description..." className="form-textarea" required></textarea>
            </div>
          </div>

          {isEditing && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="button" onClick={() => { setIsEditing(false); setFormData({ id: '', propertyType: 'Homestay', propertyName: '', ownerName: '', ownerContact: '', amenityTypes: '', location: '', propertyPrice: '', imagesUrl: '', videosUrl: '', aboutProperty: '', status: 'Active' }); }} className="btn-outline-green" style={{ cursor: 'pointer', padding: '8px 16px', fontSize: 12 }}>Cancel Edit</button>
            </div>
          )}
        </form>
      </div>

      {/* Table Section */}
      <div className="dash-section" style={{ marginBottom: 24 }}>
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ whiteSpace: 'nowrap' }}>
              <thead>
                <tr>
                  <th>Property No</th>
                  <th>Property Type</th>
                  <th>Image</th>
                  <th>Property Name</th>
                  <th>Owner Name</th>
                  <th>Owner Contact</th>
                  <th>Amenities Types</th>
                  <th>Location</th>
                  <th>About Property</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: 24 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="11" style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>Loading properties...</td></tr>
                ) : properties.map((p) => (
                  <tr key={p._id}>
                    <td style={{ color: '#58A429', fontWeight: 600 }}>{p.propertyNo}</td>
                    <td style={{ color: '#6B7280' }}>{p.propertyType}</td>
                    <td>
                      <div style={{ width: 40, height: 30, background: '#E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                        <img src={Array.isArray(p.images) && p.images[0] ? p.images[0] : "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=100&q=80"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="property" />
                      </div>
                    </td>
                    <td style={{ color: '#111827', fontWeight: 600 }}>{p.propertyName}</td>
                    <td style={{ color: '#6B7280' }}>{p.ownerName}</td>
                    <td style={{ color: '#6B7280' }}>{p.ownerContact}</td>
                    <td style={{ color: '#6B7280' }}>{Array.isArray(p.amenityTypes) ? p.amenityTypes.join(', ') : p.amenityTypes}</td>
                    <td style={{ color: '#6B7280' }}>{p.location}</td>
                    <td style={{ color: '#6B7280', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.aboutProperty}</td>
                    <td><span className={`status-pill ${p.status ? p.status.toLowerCase() : 'active'}`}>{p.status || 'Active'}</span></td>
                    <td style={{ textAlign: 'right', paddingRight: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button onClick={() => handleEdit(p)} style={{ color: '#58A429', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><Edit2 size={15} strokeWidth={2} /></button>
                        <button onClick={() => handleDelete(p._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><Trash2 size={15} strokeWidth={2} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
