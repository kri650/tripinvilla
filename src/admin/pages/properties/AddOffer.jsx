import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import SearchableDropdown from '../../../components/SearchableDropdown';

export default function AddOffer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    propertyName: '',
    category: '',
    room: '',
    foods: '',
    amenities: '',
    price: '',
    dateFrom: new Date().toISOString().split('T')[0],
    dateTo: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeFrom: '',
    timeTo: '',
    offerPercent: '',
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    const fetchPropertiesAndOffer = async () => {
      setLoadingProperties(true);
      try {
        const resProps = await fetch(`${import.meta.env.VITE_API_BASE}/properties?limit=1000`);
        const dataProps = await resProps.json();
        let propsArray = [];
        if (Array.isArray(dataProps)) {
          propsArray = dataProps;
        } else if (dataProps && Array.isArray(dataProps.properties)) {
          propsArray = dataProps.properties;
        }
        
        // Sort alphabetically by name
        propsArray.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        
        setProperties(propsArray);

        if (isEditMode) {
          const token = localStorage.getItem('admin_token');
          const resOffer = await fetch(`${import.meta.env.VITE_API_BASE}/offers/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (resOffer.ok) {
            const offerData = await resOffer.json();
            setSelectedPropertyId(offerData.property_id || offerData.propertyId || '');
            const offerDate = offerData.offer_date ? new Date(offerData.offer_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            setFormData(prev => ({
              ...prev,
              category: offerData.category || 'Homestay',
              room: offerData.room_type || offerData.room || 'Deluxe Room',
              foods: (() => {
                const fp = offerData.food_type || offerData.foods;
                if (!fp || fp === 'none' || fp === 'None') return 'None';
                const fpLower = fp.toLowerCase();
                if (fpLower === 'veg' || fp === 'Pure Veg') return 'Pure Veg';
                if (fpLower === 'non-veg' || fp === 'Non-Veg') return 'Non-Veg';
                if (fpLower === 'both' || fp === 'Both') return 'Both';
                return fp;
              })(),
              amenities: offerData.amenities ? (Array.isArray(offerData.amenities) ? offerData.amenities.join(', ') : offerData.amenities) : '',
              price: offerData.price ? `₹${offerData.price} per night` : '',
              dateFrom: offerData.dateFrom ? new Date(offerData.dateFrom).toISOString().split('T')[0] : (offerData.offer_date ? new Date(offerData.offer_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
              dateTo: offerData.dateTo ? new Date(offerData.dateTo).toISOString().split('T')[0] : (offerData.offer_date ? new Date(offerData.offer_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
              timeFrom: offerData.offer_time ? offerData.offer_time.split(' to ')[0] : '12:00',
              timeTo: offerData.offer_time && offerData.offer_time.includes(' to ') ? offerData.offer_time.split(' to ')[1] : '11:00',
              offerPercent: offerData.offer_percent || offerData.offerPercent || '20% Off',
              description: offerData.description || '',
              status: offerData.status ? offerData.status.charAt(0).toUpperCase() + offerData.status.slice(1) : 'Active'
            }));
            
            // Re-fetch property details to populate available rooms and missing fields
            if (offerData.property_id || offerData.propertyId) {
              const propId = offerData.property_id || offerData.propertyId;
              const resProp = await fetch(`${import.meta.env.VITE_API_BASE}/properties/${propId}`);
              if (resProp.ok) {
                const prop = await resProp.json();
                const rooms = Array.isArray(prop.rooms) && prop.rooms.length > 0 ? prop.rooms : [{ roomType: 'Deluxe Room' }];
                setAvailableRooms(rooms);
                
                const amenitiesArr = Array.isArray(prop.amenities) ? prop.amenities : (Array.isArray(prop.amenityTypes) ? prop.amenityTypes : []);
                const priceVal = prop.price || prop.propertyPrice || prop.bestRoomRate || '';
                
                const fp = prop.foodPreference || 'both';
                let formattedFood = 'Both';
                if (fp === 'veg') formattedFood = 'Pure Veg';
                if (fp === 'non-veg') formattedFood = 'Non-Veg';
                if (fp === 'both') formattedFood = 'Both';
                if (fp === 'none') formattedFood = 'None';
                
                setFormData(prev => ({
                  ...prev,
                  amenities: prev.amenities || amenitiesArr.join(', '),
                  price: prev.price || (priceVal ? `₹${priceVal} per night` : ''),
                  foods: prev.foods && prev.foods !== 'None' ? prev.foods : formattedFood
                }));
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoadingProperties(false);
      }
    };
    fetchPropertiesAndOffer();
  }, [id, isEditMode]);

  const handlePropertyChange = async (propertyId) => {
    setSelectedPropertyId(propertyId);
    if (!propertyId) {
      setAvailableRooms([]);
      setFormData(prev => ({
        ...prev,
        propertyName: '',
        category: 'Homestay',
        room: 'Deluxe Room',
        amenities: '',
        price: '',
      }));
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/properties/${propertyId}`);
      if (!res.ok) throw new Error('Failed to fetch property details');
      const prop = await res.json();
      
      const rooms = Array.isArray(prop.rooms) && prop.rooms.length > 0 ? prop.rooms : [{ roomType: 'Deluxe Room' }];
      setAvailableRooms(rooms);
      const amenitiesArr = Array.isArray(prop.amenities) ? prop.amenities : (Array.isArray(prop.amenityTypes) ? prop.amenityTypes : []);
      const priceVal = prop.price || prop.propertyPrice || prop.bestRoomRate || '';
      
      const fp = prop.foodPreference || 'none';
      let formattedFood = 'None';
      const fpLower = fp.toLowerCase();
      if (fpLower === 'veg' || fp === 'Pure Veg') formattedFood = 'Pure Veg';
      else if (fpLower === 'non-veg' || fp === 'Non-Veg') formattedFood = 'Non-Veg';
      else if (fpLower === 'both' || fp === 'Both') formattedFood = 'Both';
      else formattedFood = 'None';
      
      setFormData(prev => ({
        ...prev,
        propertyName: prop.name || prop.propertyName || '',
        category: prop.type || prop.propertyType || 'Homestay',
        room: rooms[0]?.roomType || 'Deluxe Room',
        amenities: amenitiesArr.join(', '),
        price: priceVal ? `₹${priceVal} per night` : '',
        foods: formattedFood,
      }));
    } catch (err) {
      console.error('Error fetching full property details:', err);
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
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode 
        ? `${import.meta.env.VITE_API_BASE}/offers/${id}` 
        : `${import.meta.env.VITE_API_BASE}/offers`;
        
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          property_id: selectedPropertyId,
          category: formData.category,
          room_type: formData.room,
          food_type: formData.foods,
          amenities: formData.amenities,
          price: parseFloat(String(formData.price).replace(/[^\d.]/g, '')) || 0,
          offer_date: formData.dateTo,
          dateFrom: formData.dateFrom,
          dateTo: formData.dateTo,
          offer_time: `${formData.timeFrom} to ${formData.timeTo}`,
          offer_percent: formData.offerPercent,
          description: formData.description,
          status: formData.status
        })
      });
      if (res.ok) {
        alert(`Promotional offer ${isEditMode ? 'updated' : 'created'} successfully!`);
        navigate('/admin/properties/offers');
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || 'Failed to save offer');
      }
    } catch (err) {
      console.error('Error adding/updating offer:', err);
      alert('Network error while saving offer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ padding: '4px 39px 8px', margin: 0 }}>
        Property Management &gt; <span onClick={() => navigate('/admin/properties/offers')} style={{ cursor: 'pointer' }}>Offers by Date</span> &gt; <span>{isEditMode ? 'Edit Offer' : 'Add Offer'}</span>
      </div>

      {/* Form Section */}
      <div className="dash-section" style={{ marginBottom: 24 }}>
        <form onSubmit={handleSubmit} className="master-form-card" style={{ margin: 0, width: '100%' }}>
          <div className="master-form-header">
            <div className="master-form-title">{isEditMode ? 'Edit Offer by Date' : 'Add Offer by Date'}</div>
            <div className="master-form-actions">
              <button 
                type="button" 
                className="btn-outline-green" 
                onClick={() => navigate('/admin/properties/offers')}
                style={{ cursor: 'pointer', padding: '8px 24px', marginRight: '12px' }}
              >
                Cancel
              </button>
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
                <SearchableDropdown
                  options={properties.map(p => ({ value: p._id, label: `${p.name || p.propertyName} (${p.location || p.city})` }))}
                  value={selectedPropertyId}
                  onChange={handlePropertyChange}
                  placeholder="Select a property..."
                  searchPlaceholder="Search properties..."
                  disabled={isEditMode}
                />
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
              <label className="form-label">Price (Auto-filled)*</label>
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

          {/* Row 2 */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Foods (Auto-filled)*</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.foods} 
                readOnly 
                disabled 
                placeholder="Select property first"
              />
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
          </div>

          {/* Row 3 */}
          <div className="form-grid-3">
            <div className="form-group" style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Valid From*</label>
                <input 
                  type="date" 
                  required 
                  className="form-input" 
                  value={formData.dateFrom}
                  onChange={e => setFormData({...formData, dateFrom: e.target.value})}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Valid To*</label>
                <input 
                  type="date" 
                  required 
                  className="form-input" 
                  value={formData.dateTo}
                  onChange={e => setFormData({...formData, dateTo: e.target.value})}
                />
              </div>
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
          <div className="form-grid-3">
            <div className="form-group" style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Start Time*</label>
                <input 
                  type="time" 
                  className="form-input" 
                  value={formData.timeFrom} 
                  onChange={(e) => setFormData({...formData, timeFrom: e.target.value})}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">End Time*</label>
                <input 
                  type="time" 
                  className="form-input" 
                  value={formData.timeTo} 
                  onChange={(e) => setFormData({...formData, timeTo: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 5 */}
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
