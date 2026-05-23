import { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddOffer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    propertyName: '',
    category: 'Homestay',
    room: 'Deluxe Room',
    foods: 'Pure - Veg',
    amenities: 'Barbeque, WiFi',
    price: '₹2,500 per night',
    date: '2026-06-15',
    time: '12:00 PM',
    offerPercent: 20,
    description: 'Special early bird discount offer',
    status: 'Active'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyName: formData.propertyName,
          location: 'Goa, India',
          category: formData.category,
          room: formData.room,
          foods: formData.foods,
          amenities: formData.amenities.split(',').map(s => s.trim()),
          offerPercent: Number(formData.offerPercent),
          description: formData.description,
          status: formData.status,
          dateTo: new Date(formData.date)
        })
      });
      if (res.ok) {
        navigate('/admin/properties/offers');
      }
    } catch (err) {
      console.error('Error adding offer:', err);
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
              <button type="submit" className="btn-solid-green" style={{ cursor: 'pointer', padding: '8px 24px' }}>Save Offer</button>
            </div>
          </div>

          {/* Row 1 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Property Name*</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder="e.g. Whispering Palms Villa"
                value={formData.propertyName}
                onChange={e => setFormData({...formData, propertyName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category*</label>
              <div style={{ position: 'relative' }}>
                <select 
                  className="form-select" 
                  style={{ appearance: 'none' }}
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Homestay">Homestay</option>
                  <option value="Villa">Villa</option>
                  <option value="Resort">Resort</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Hotel">Hotel</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Room Type*</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder="e.g. Deluxe Suite"
                value={formData.room}
                onChange={e => setFormData({...formData, room: e.target.value})}
              />
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
                  <option value="Pure - Veg">Pure - Veg</option>
                  <option value="Non - Veg">Non - Veg</option>
                  <option value="All Meals Included">All Meals Included</option>
                  <option value="Breakfast Included">Breakfast Included</option>
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: 16, top: 14, color: '#6B7280', pointerEvents: 'none' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Amenities Types*</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder="e.g. Private Pool, WiFi, BBQ"
                value={formData.amenities}
                onChange={e => setFormData({...formData, amenities: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price for Room*</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder="e.g. ₹5,000 per night"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Valid Until Date*</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="date" 
                  required 
                  className="form-input" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Offer Discount (%)*</label>
              <input 
                type="number" 
                min="1" 
                max="99" 
                required 
                className="form-input" 
                placeholder="e.g. 20"
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
