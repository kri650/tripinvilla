import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddPropertyOwner() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    contactNo: '',
    properties: [''],
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60'
  });

  const handlePropChange = (index, value) => {
    const updated = [...formData.properties];
    updated[index] = value;
    setFormData({ ...formData, properties: updated });
  };

  const addPropField = () => {
    setFormData({ ...formData, properties: [...formData.properties, ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerName: formData.ownerName,
          email: formData.email,
          contactNo: formData.contactNo,
          properties: formData.properties.filter(Boolean),
          status: formData.status,
          image: formData.image
        })
      });
      if (res.ok) {
        navigate('/admin/properties/owned');
      }
    } catch (err) {
      console.error('Error adding owner:', err);
    }
  };

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Property Management &gt; <span>Property Owners</span>
      </div>

      {/* Form Card */}
      <div className="dash-section" style={{ marginBottom: 24 }}>
        <form onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0, width: '100%' }}>
          <div className="master-form-header">
            <div className="master-form-title">Add Property Owner</div>
            <div className="master-form-actions">
              <button type="submit" className="btn-solid-green" style={{ cursor: 'pointer', padding: '8px 24px' }}>Save Owner</button>
            </div>
          </div>

          {/* Row 1 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Owner Name*</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder="e.g. Vikram Malhotra"
                value={formData.ownerName}
                onChange={e => setFormData({...formData, ownerName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email*</label>
              <input 
                type="email" 
                required 
                className="form-input" 
                placeholder="e.g. vikram@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Number*</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder="e.g. +91 9822012345"
                value={formData.contactNo}
                onChange={e => setFormData({...formData, contactNo: e.target.value})}
              />
            </div>
          </div>

          {/* Dynamic Properties */}
          {formData.properties.map((prop, index) => (
            <div className="form-grid-3" key={index} style={{ marginBottom: 16 }}>
              <div className="form-group" style={{ gridColumn: 'span 3' }}>
                <label className="form-label">Property {index + 1} Name*</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="e.g. Whispering Palms Villa, Goa"
                  value={prop}
                  onChange={e => handlePropChange(index, e.target.value)}
                />
              </div>
            </div>
          ))}

          {/* Add More Property Button */}
          <div style={{ marginBottom: 24 }}>
            <button 
              type="button"
              onClick={addPropField}
              style={{ background: 'none', border: 'none', color: '#58A429', fontSize: '14px', fontWeight: 600, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Plus size={16} /> Add More Property
            </button>
          </div>

          {/* Row 4 */}
          <div className="form-grid-3" style={{ marginBottom: 0 }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Upload Owner Profile Image URL*</span>
                <span style={{ color: '#EF4444', fontSize: 11, fontWeight: 400 }}>Direct Image URL (.jpg/.png)</span>
              </label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.image} 
                onChange={e => setFormData({...formData, image: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status*</label>
              <div style={{ position: 'relative' }}>
                <select 
                  className="form-select" 
                  style={{ appearance: 'none' }} 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
