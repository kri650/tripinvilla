import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddOffer() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    propertyName: '',
    category: 'Homestay',
    room: 'Deluxe Room',
    foods: 'Pure Veg',
    amenities: 'Barbeque, WiFi',
    price: '₹2,500 per night',
    date: new Date().toISOString().split('T')[0],
    time: '9:00 AM',
    offerPercent: '20% Off',
    description: 'Special early bird discount offer',
    status: 'Active'
  });

  useEffect(() => {
    const fetchProperties = async () => {
      setLoadingProperties(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/properties`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProperties(data);
        } else if (data && Array.isArray(data.properties)) {
          setProperties(data.properties);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoadingProperties(false);
      }
    };
    fetchProperties();
  }, []);

  const handlePropertyChange = (propertyId) => {
    setSelectedPropertyId(propertyId);
    const prop = properties.find(p => p._id === propertyId);
    if (prop) {
      const rooms = Array.isArray(prop.rooms) ? prop.rooms : [];
      setAvailableRooms(rooms);
      setFormData(prev => ({
        ...prev,
        propertyName: prop.name || prop.propertyName || '',
        category: prop.type || prop.propertyType || 'Homestay',
        room: rooms[0]?.roomType || 'Deluxe Room',
        amenities: Array.isArray(prop.amenities) ? prop.amenities.join(', ') : '',
        price: prop.price ? `₹${prop.price} per night` : '',
      }));
    } else {
      setAvailableRooms([]);
      setFormData(prev => ({
        ...prev,
        propertyName: '',
        category: 'Homestay',
        room: 'Deluxe Room',
        amenities: '',
        price: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPropertyId) {
      alert('Please select a property.');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/offers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          property_id: selectedPropertyId,
          food_type: formData.foods,
          offer_date: formData.date,
          offer_time: formData.time,
          offer_percent: formData.offerPercent,
          description: formData.description
        })
      });
      if (res.ok) {
        alert('Promotional offer created successfully!');
        navigate('/admin/properties/offers');
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || 'Failed to save offer');
      }
    } catch (err) {
      console.error('Error adding offer:', err);
      alert('Network error while saving offer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Property Management &gt; <span>Offers by Date</span>
      </div>

      {/* Form Section */}
      <div className="dash-section" style={{ marginBottom: 24 }}>
        <form onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0, width: '100%' }}>
          <div className="master-form-header">
            <div className="master-form-title">Add Offer by Date</div>
            <div className="master-form-actions">
              <button 
                type="submit" 
                className="btn-solid-green" 
                disabled={submitting || loadingProperties}
                style={{ cursor: 'pointer', padding: '8px 24px', opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? 'Saving...' : 'Save Offer'}
              </button>
            </div>
          </div>

          {/* Row 1 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Property Name*</label>
              <div style={{ position: 'relative' }}>
                <select 
                  className="form-select" 
                  style={{ appearance: 'none' }}
                  required
                  value={selectedPropertyId}
                  onChange={e => handlePropertyChange(e.target.value)}
                >
                  <option value="">Select a property...</option>
                  {properties.map(p => (
                    <option key={p._id} value={p._id}>{p.name || p.propertyName} ({p.location || p.city})</option>
                  ))}
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Category (Auto-filled)*</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.category} 
                readOnly 
                disabled 
                placeholder="Select property first"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Room Type*</label>
              {availableRooms.length > 0 ? (
                <div style={{ position: 'relative' }}>
                  <select 
                    className="form-select" 
                    style={{ appearance: 'none' }}
                    value={formData.room}
                    onChange={e => setFormData({...formData, room: e.target.value})}
                  >
                    {availableRooms.map(r => (
                      <option key={r.roomType || r._id} value={r.roomType}>{r.roomType}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
                </div>
              ) : (
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.room} 
                  readOnly 
                  disabled 
                  placeholder="Select property first"
                />
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Foods*</label>
              <div style={{ position: 'relative' }}>
                <select 
                  className="form-select" 
                  style={{ appearance: 'none' }}
                  value={formData.foods}
                  onChange={e => setFormData({...formData, foods: e.target.value})}
                >
                  <option value="Pure Veg">Pure Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Both">Both</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Amenities Types (Auto-filled)*</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.amenities} 
                readOnly 
                disabled 
                placeholder="Select property first"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price for Room (Auto-filled)*</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.price} 
                readOnly 
                disabled 
                placeholder="Select property first"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Valid Until Date*</label>
              <input 
                type="date" 
                required 
                className="form-input" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Offer Discount (e.g. 20% Off)*</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder="e.g. 20% Off"
                value={formData.offerPercent}
                onChange={e => setFormData({...formData, offerPercent: e.target.value})}
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
                  <option value="Expired">Expired</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* Row 4 */}
          <div className="form-grid-1" style={{ marginBottom: 0 }}>
            <div className="form-group">
              <label className="form-label">Description*</label>
              <textarea 
                className="form-textarea" 
                required 
                style={{ minHeight: '80px' }} 
                placeholder="Offer details and applicable terms..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
