import React, { useState, useEffect, useRef } from 'react';
import { Trash2, ShieldAlert, Plus, CheckCircle, Star } from 'lucide-react';
import { propertyService, propertyRequestService } from '../services/api';
import ReadMore from '../../admin/components/ReadMore';

const API_BASE = `${import.meta.env.VITE_API_BASE}`;

const getFullRoomImageUrl = (url) => {
  if (!url) return '';
  if (typeof url !== 'string') return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const base = API_BASE.replace('/api', '');
  return `${base}${url}`;
};

const defaultRules = [];

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return `₹${amount.toLocaleString('en-IN')}`;
};

const firstPresent = (...values) => values.find((value) => value !== null && value !== undefined && value !== '');

const getDiscountText = (originalValue, priceValue, offers = []) => {
  const offerText = Array.isArray(offers) && offers.length > 0 ? offers.join(', ') : '';
  const original = Number(originalValue);
  const price = Number(priceValue);
  if (Number.isFinite(original) && Number.isFinite(price) && original > price) {
    const discountAmount = original - price;
    return offerText ? `${offerText} · Save ${formatCurrency(discountAmount)}` : `Save ${formatCurrency(discountAmount)}`;
  }
  return offerText || '—';
};

const emptyRoom = () => ({
  room_type: '',
  bed_type: 'King Size',
  original_price: '',
  price_per_room: '',
  tax_amount: '',
  rulesSections: [{ title: '', text: '' }],
  offersList: [],
  selectedAmenities: [],
  manualRoomType: false,
  roomImagePreview: ''
});

function RoomForm({ 
  data, 
  idx, 
  onUpdate, 
  roomTypes, 
  fallbackRoomTypes, 
  availableAmenities, 
  amenitiesLoading, 
  getFullRoomImageUrl,
  onRemove,
  isEditMode = false
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ ...data, [name]: value });
  };

  const toggleAmenity = (a) => {
    const amenities = data.selectedAmenities || [];
    const updated = amenities.includes(a) ? amenities.filter(x => x !== a) : [...amenities, a];
    onUpdate({ ...data, selectedAmenities: updated });
  };

  const handleAddRuleSection = () => {
    const rules = data.rulesSections || [];
    onUpdate({ ...data, rulesSections: [...rules, { title: '', text: '' }] });
  };

  const handleRemoveRuleSection = (rIdx) => {
    const rules = data.rulesSections || [];
    onUpdate({ ...data, rulesSections: rules.filter((_, i) => i !== rIdx) });
  };

  const handleRuleSectionChange = (rIdx, field, value) => {
    const rules = data.rulesSections || [];
    const updated = rules.map((s, i) => i === rIdx ? { ...s, [field]: value } : s);
    onUpdate({ ...data, rulesSections: updated });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return; }
    onUpdate({ 
      ...data, 
      _selectedFile: file, 
      roomImagePreview: URL.createObjectURL(file) 
    });
  };

  const rulesSections = data.rulesSections || [];
  const offersList = data.offersList || [];
  const selectedAmenities = data.selectedAmenities || [];
  const manualRoomType = data.manualRoomType || false;

  return (
    <div className="dash-section" style={{ marginBottom: 24, border: isEditMode ? '1px solid #2563EB' : 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', fontFamily: '"Outfit", sans-serif', margin: 0 }}>
          {isEditMode ? `Room ${idx + 1}: ${data.room_type || 'New Room'}` : 'Configure Room Pricing & Rules'}
        </h3>
        {isEditMode && onRemove && (
          <button type="button" onClick={() => onRemove(idx)} style={{ color: '#EF4444', background: '#FEE2E2', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Trash2 size={14} /> Remove Room
          </button>
        )}
      </div>

      <div className="form-grid-3" style={{ marginBottom: '16px' }}>
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Room Type*</label>
            <button type="button" onClick={() => onUpdate({ ...data, manualRoomType: !manualRoomType, room_type: '' })} style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
              {manualRoomType ? '← Use Dropdown' : 'Enter Manually'}
            </button>
          </div>
          {manualRoomType ? (
            <input type="text" className="form-input" name="room_type" value={data.room_type} onChange={handleInputChange} placeholder="e.g. Penthouse Suite" required style={{ marginTop: '6px' }} />
          ) : (
            <select className="form-select" name="room_type" value={data.room_type} onChange={handleInputChange} required style={{ marginTop: '6px' }}>
              <option value="">Select Room Type</option>
              {roomTypes.length > 0
                ? roomTypes.map(rt => <option key={rt._id || rt.name} value={rt.name}>{rt.name}</option>)
                : fallbackRoomTypes.map(t => <option key={t} value={t}>{t}</option>)
              }
            </select>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Upload Room Image (Max 5MB)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageChange}
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', background: '#fff' }} />
            {(data.roomImagePreview || data.room_image_url) && (
              <img src={getFullRoomImageUrl(data.roomImagePreview || data.room_image_url)} alt="preview" style={{ width: '100%', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E5E7EB' }} />
            )}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Bed Type*</label>
          <select className="form-select" name="bed_type" value={data.bed_type} onChange={handleInputChange} required>
            <option value="King Size">King Size</option>
            <option value="Queen Size">Queen Size</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
          </select>
        </div>
      </div>

      <div className="form-grid-3" style={{ marginBottom: '16px' }}>
        <div className="form-group">
          <label className="form-label">Original Price (₹)</label>
          <input type="number" className="form-input" name="original_price" value={data.original_price} onChange={handleInputChange} placeholder="e.g. 118350" />
        </div>
        <div className="form-group">
          <label className="form-label">Price per Room (₹/night)*</label>
          <input type="number" className="form-input" name="price_per_room" value={data.price_per_room} onChange={handleInputChange} placeholder="₹ Amount" required />
        </div>
        <div className="form-group">
          <label className="form-label">Tax Amount (₹)</label>
          <input type="number" className="form-input" name="tax_amount" value={data.tax_amount} onChange={handleInputChange} placeholder="e.g. 212" />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label className="form-label">Multiple Offers/Discounts</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <input type="text" className="form-input" 
            placeholder="e.g. 20% Off flat, Breakfast Included" style={{ flex: 1 }} 
            onKeyDown={e => { 
              if (e.key === 'Enter') { 
                e.preventDefault(); 
                if (e.target.value.trim()) { 
                  onUpdate({ ...data, offersList: [...offersList, e.target.value.trim()] });
                  e.target.value = '';
                } 
              } 
            }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {offersList.map((off, oIdx) => (
            <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', color: '#065F46', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', border: '1px solid #A7F3D0' }}>
              <span>{off}</span>
              <button type="button" onClick={() => onUpdate({ ...data, offersList: offersList.filter((_, i) => i !== oIdx) })} style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer', padding: 0 }}>&times;</button>
            </div>
          ))}
          {offersList.length === 0 && <span style={{ fontSize: '13px', color: '#6B7280' }}>No offers added.</span>}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Amenities Types</label>
        {amenitiesLoading ? <div style={{ color: '#9CA3AF', fontSize: 13 }}>Loading amenities...</div> : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {availableAmenities.map(a => (
              <button type="button" key={a} onClick={() => toggleAmenity(a)}
                style={{ padding: '5px 13px', borderRadius: '20px', border: selectedAmenities.includes(a) ? '1px solid #58A429' : '1px solid #D1D5DB', background: selectedAmenities.includes(a) ? '#ECFDF5' : '#fff', color: selectedAmenities.includes(a) ? '#58A429' : '#374151', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
                {a}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px', padding: '16px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>House Rules Sections</label>
          <button type="button" onClick={handleAddRuleSection} style={{ padding: '6px 12px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
            + Add Section
          </button>
        </div>
        {rulesSections.map((sec, rIdx) => (
          <div key={rIdx} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '12px', marginBottom: '10px', position: 'relative' }}>
            <button type="button" onClick={() => handleRemoveRuleSection(rIdx)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>&times;</button>
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label className="form-label">Section Title*</label>
              <input type="text" className="form-input" value={sec.title} onChange={e => handleRuleSectionChange(rIdx, 'title', e.target.value)} placeholder="e.g. Must Read Rules" required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Rules Text (one rule per line)*</label>
              <textarea className="form-textarea" value={sec.text} onChange={e => handleRuleSectionChange(rIdx, 'text', e.target.value)} placeholder="e.g. • Primary Guest should be atleast 18 years of age." style={{ minHeight: '60px', padding: '8px 12px', width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px' }} required />
            </div>
          </div>
        ))}
        {rulesSections.length === 0 && <div style={{ fontSize: '13px', color: '#6B7280', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>No rule sections added.</div>}
      </div>
    </div>
  );
}

export default function PropertyRequests() {
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [propertyId, setPropertyId] = useState('');
  const [formData, setFormData] = useState(emptyRoom());
  const [roomTypes, setRoomTypes] = useState([]);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [rulesSections, setRulesSections] = useState([{ title: '', text: '' }]);
  const [currentOffer, setCurrentOffer] = useState('');
  const [offersList, setOffersList] = useState(['20% Off']);
  const [manualRoomType, setManualRoomType] = useState(false);
  const fallbackRoomTypes = ['Standard Room', 'Deluxe Room', 'Super Deluxe Room', 'Executive Suite', 'Presidential Suite', 'Family Suite', 'Dormitory', 'Tent', 'Cottage', 'Villa'];
  const [selectedRoomImage, setSelectedRoomImage] = useState(null);
  const [roomImagePreview, setRoomImagePreview] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [availableAmenities, setAvailableAmenities] = useState([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(false);
  // Multi-room queue
  const [roomQueue, setRoomQueue] = useState([]);
  const [editingQueueIdx, setEditingQueueIdx] = useState(null);
  const imageInputRef = useRef(null);

  const fetchAmenities = async (propertyType) => {
    setAmenitiesLoading(true);
    try {
      const scope = propertyType || 'All';
      const res = await fetch(`${API_BASE}/admin/amenities/active?scope=${scope}`);
      const data = await res.json();
      if (Array.isArray(data)) setAvailableAmenities(data.map(a => a.amenitiesName));
    } catch {
      setAvailableAmenities(['WiFi', 'Parking', 'Pool', 'AC', 'Kitchen', 'Barbeque', 'Gym', 'Breakfast']);
    } finally {
      setAmenitiesLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const propsRes = await propertyService.getMine();
      setProperties(propsRes.data);
      if (propsRes.data.length > 0) {
        const first = propsRes.data[0];
        if (!propertyId) {
          setPropertyId(first._id);
          fetchAmenities(first.type);
        }
      } else {
        fetchAmenities('All');
      }
      const reqsRes = await propertyRequestService.getMine();
      setRequests(reqsRes.data);
    } catch {
      fetchAmenities('All');
    }

    try {
      const rtRes = await fetch(`${API_BASE}/master/room-types`);
      const rtData = await rtRes.json();
      if (Array.isArray(rtData)) setRoomTypes(rtData);
    } catch {
      // fallback handled in render
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePropertyChange = (e) => {
    const propId = e.target.value;
    const sel = properties.find(p => p._id === propId);
    setPropertyId(propId);
    if (sel) { setSelectedAmenities([]); fetchAmenities(sel.type); }
  };

  const resetRoomForm = () => {
    setFormData(emptyRoom());
    setRulesSections([{ title: '', text: '' }]);
    setOffersList([]);
    setSelectedRoomImage(null);
    setRoomImagePreview('');
    setSelectedAmenities([]);
    setEditingQueueIdx(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleAddToQueue = async () => {
    if (!propertyId) { alert('Select a property first.'); return; }
    if (!formData.room_type.trim()) { alert('Room Type is required.'); return; }
    if (!formData.price_per_room) { alert('Price per room is required.'); return; }

    setLoading(true);
    try {
      let roomImageUrl = roomImagePreview || '';
      if (selectedRoomImage) {
        const fd = new FormData();
        fd.append('images', selectedRoomImage);
        const res = await propertyService.uploadImages(fd);
        if (res.data?.urls?.length > 0) roomImageUrl = res.data.urls[0];
      }

      const formattedRules = rulesSections.map(sec => ({
        title: sec.title,
        points: (typeof sec.text === 'string' ? sec.text : '').split('\n').filter(p => p.trim()).map(p => p.replace(/^[•\-\*]\s*/, '').trim())
      }));

      const roomEntry = {
        property_id: propertyId,
        room_type: formData.room_type,
        bed_type: formData.bed_type,
        original_price: formData.original_price ? Number(formData.original_price) : undefined,
        price_per_room: Number(formData.price_per_room),
        tax_amount: formData.tax_amount ? Number(formData.tax_amount) : undefined,
        room_image_url: roomImageUrl,
        amenities_types: [...selectedAmenities],
        offers: [...offersList],
        rules: formattedRules,
        _preview_img: roomImageUrl || roomImagePreview,
      };

      if (editingQueueIdx !== null) {
        setRoomQueue(prev => prev.map((item, i) => i === editingQueueIdx ? roomEntry : item));
        setEditingQueueIdx(null);
      } else {
        setRoomQueue(prev => [...prev, roomEntry]);
      }
      resetRoomForm();
    } catch (err) {
      alert('Error preparing room: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromQueue = (idx) => setRoomQueue(prev => prev.filter((_, i) => i !== idx));

  const handleEditFromQueue = (idx) => {
    const r = roomQueue[idx];
    setEditingQueueIdx(idx);
    setPropertyId(r.property_id);
    setManualRoomType(!fallbackRoomTypes.includes(r.room_type) && !roomTypes.some(rt => rt.name === r.room_type));
    setFormData({
      room_type: r.room_type || '',
      bed_type: r.bed_type || '',
      original_price: r.original_price || '',
      price_per_room: r.price_per_room || '',
      tax_amount: r.tax_amount || '',
    });
    setRoomImagePreview(r.room_image_url || r._preview_img || '');
    setSelectedAmenities(r.amenities_types || []);
    setOffersList(r.offers || []);
    if (Array.isArray(r.rules) && r.rules.length > 0) {
      setRulesSections(r.rules.map(rule => ({
        title: rule.title || '',
        text: Array.isArray(rule.points) ? rule.points.join('\n') : (rule.points || '')
      })));
    } else {
      setRulesSections([{ title: '', text: '' }]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitAll = async (e) => {
    e.preventDefault();
    if (roomQueue.length === 0) { alert('Add at least one room to the queue first.'); return; }
    
    setLoading(true);
    try {
      const finalRooms = await Promise.all(roomQueue.map(async (room) => {
        let roomImageUrl = room.room_image_url || '';
        if (room._selectedFile) {
          const fd = new FormData();
          fd.append('images', room._selectedFile);
          const res = await propertyService.uploadImages(fd);
          if (res.data?.urls?.length > 0) roomImageUrl = res.data.urls[0];
        }

        const rules = room.rulesSections ? room.rulesSections.map(sec => ({
          title: sec.title,
          points: (typeof sec.text === 'string' ? sec.text : '').split('\n').filter(p => p.trim()).map(p => p.replace(/^[•\-\*]\s*/, '').trim())
        })) : room.rules;

        const { _preview_img, _selectedFile, rulesSections, offersList, selectedAmenities, manualRoomType, roomImagePreview, ...rest } = room;
        return {
          ...rest,
          room_image_url: roomImageUrl,
          rules,
          offers: offersList || room.offers || [],
          amenities_types: selectedAmenities || room.amenities_types || []
        };
      }));

      if (editingRequestId) {
        await propertyRequestService.update(editingRequestId, { property_id: propertyId, rooms: finalRooms });
        alert('Property request updated successfully!');
        setEditingRequestId(null);
      } else {
        await propertyRequestService.add({ property_id: propertyId, rooms: finalRooms });
        alert(`${finalRooms.length} room(s) submitted!`);
      }
      
      setRoomQueue([]);
      fetchData();
    } catch (err) {
      alert('Error submitting: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getRequestRooms = (request) => {
    if (Array.isArray(request?.rooms) && request.rooms.length > 0) return request.rooms;
    return [request];
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    try { await propertyRequestService.delete(id); fetchData(); }
    catch { alert('Error deleting'); }
  };

  const handleEditRoom = (r) => {
    setEditingRequestId(r._id);
    setPropertyId(r.property_id || r.property?._id);
    
    const rooms = getRequestRooms(r);
    setRoomQueue(rooms.map(room => ({
      ...room,
      property_id: r.property_id || r.property?._id,
      _preview_img: room.room_image_url || room.image || '',
      rulesSections: Array.isArray(room.rules) ? room.rules.map(rule => ({
        title: rule.title || '',
        text: Array.isArray(rule.points) ? rule.points.join('\n') : (rule.points || '')
      })) : [{ title: '', text: '' }],
      offersList: room.offers || [],
      selectedAmenities: room.amenities_types || [],
      manualRoomType: !fallbackRoomTypes.includes(room.room_type) && !roomTypes.some(rt => rt.name === room.room_type)
    })));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProperty = properties.find(p => p._id === propertyId);
  const categoryValue = selectedProperty ? selectedProperty.type : 'N/A';

  return (
    <div className="fade-in">
      <div style={{ height: '16px' }} />
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Property Management &gt; <span>Property Requests</span>
      </div>

      {properties.length === 0 ? (
        <div style={{ margin: '20px 39px', padding: '32px', background: '#FFFBEB', border: '1px solid #F59E0B', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <ShieldAlert size={28} color="#D97706" />
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#92400E', margin: '0 0 4px 0' }}>No Properties Listed Yet</h4>
            <p style={{ fontSize: '13px', color: '#B45309', margin: 0 }}>Add at least one property under "My Properties" before configuring room pricing.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="dash-section" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Configure Property Request</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                {editingRequestId && (
                  <button type="button" onClick={() => { setEditingRequestId(null); setRoomQueue([]); resetRoomForm(); }} style={{ padding: '8px 16px', background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '12.5px' }}>Cancel Edit</button>
                )}
                {roomQueue.length > 0 && (
                  <button type="button" onClick={handleSubmitAll} disabled={loading} style={{ cursor: 'pointer', padding: '8px 20px', fontSize: '12.5px', background: '#58A429', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600 }}>
                    {loading ? 'Submitting...' : `Submit Request (${roomQueue.length} Room(s))`}
                  </button>
                )}
              </div>
            </div>

            <div className="form-grid-3" style={{ marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Property Name*</label>
                <select className="form-select" value={propertyId} onChange={handlePropertyChange} required>
                  {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category (Auto-filled)*</label>
                <input type="text" className="form-input" value={categoryValue} disabled style={{ background: '#F3F4F6', color: '#4B5563', cursor: 'not-allowed' }} />
              </div>
            </div>
          </div>

          {!editingRequestId ? (
            <>
              <RoomForm 
                data={{ ...formData, rulesSections, offersList, selectedAmenities, manualRoomType, roomImagePreview }}
                onUpdate={(d) => {
                  setFormData(d);
                  setRulesSections(d.rulesSections || []);
                  setOffersList(d.offersList || []);
                  setSelectedAmenities(d.selectedAmenities || []);
                  setManualRoomType(d.manualRoomType || false);
                  setRoomImagePreview(d.roomImagePreview || '');
                  if (d._selectedFile) setSelectedRoomImage(d._selectedFile);
                }}
                roomTypes={roomTypes}
                fallbackRoomTypes={fallbackRoomTypes}
                availableAmenities={availableAmenities}
                amenitiesLoading={amenitiesLoading}
                getFullRoomImageUrl={getFullRoomImageUrl}
              />
              <div style={{ textAlign: 'right', marginBottom: 24, padding: '0 39px' }}>
                <button type="button" onClick={handleAddToQueue} disabled={loading} style={{ cursor: 'pointer', padding: '10px 24px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={16} /> Add Room to Queue
                </button>
              </div>

              {roomQueue.length > 0 && (
                <div className="dash-section" style={{ marginBottom: 16 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Rooms in Queue ({roomQueue.length})</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {roomQueue.map((room, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '10px 16px', minWidth: '220px' }}>
                        <img src={room._preview_img || 'https://via.placeholder.com/48'} alt={room.room_type} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: '#065F46' }}>{room.room_type}</div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>₹{room.price_per_room}/night</div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button type="button" onClick={() => handleEditFromQueue(idx)} style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer' }}><Plus size={14} /></button>
                          <button type="button" onClick={() => handleRemoveFromQueue(idx)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {roomQueue.map((room, idx) => (
                <RoomForm 
                  key={idx}
                  idx={idx}
                  data={room}
                  onUpdate={(updated) => setRoomQueue(prev => prev.map((r, i) => i === idx ? updated : r))}
                  onRemove={(i) => setRoomQueue(prev => prev.filter((_, idx) => idx !== i))}
                  isEditMode={true}
                  roomTypes={roomTypes}
                  fallbackRoomTypes={fallbackRoomTypes}
                  availableAmenities={availableAmenities}
                  amenitiesLoading={amenitiesLoading}
                  getFullRoomImageUrl={getFullRoomImageUrl}
                />
              ))}
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <button type="button" onClick={() => setRoomQueue(prev => [...prev, emptyRoom()])} style={{ padding: '10px 24px', background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  + Add Another Room
                </button>
              </div>
            </div>
          )}

          {/* ─── SUBMITTED REQUESTS TABLE ─── */}
          <div className="dash-section" style={{ marginBottom: 24 }}>
            <div className="chart-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12, border: 'none', boxShadow: 'none' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ whiteSpace: 'nowrap' }}>
                  <thead>
                    <tr>
                      {['Property', 'Category', 'Room Type', 'Bed', 'Amenities', 'Price', 'Rules', 'Offers', 'Status', 'Actions'].map((h, i) => (
                        <th key={i} style={{ color: '#374151', fontWeight: 600, padding: '14px 16px', textAlign: 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length > 0 ? requests.map((r, i) => {
                      const statusLabel = r.admin_status || 'pending';
                      const statusBg = statusLabel === 'approved' ? '#DCFCE7' : statusLabel === 'rejected' ? '#FEE2E2' : '#FEF3C7';
                      const statusColor = statusLabel === 'approved' ? '#58A429' : statusLabel === 'rejected' ? '#EF4444' : '#D97706';
                      return (
                        <React.Fragment key={i}>
                          <tr>
                            <td style={{ color: '#111827', fontWeight: 500, padding: '14px 16px' }}><ReadMore maxWords={6}>{r.propertyName}</ReadMore></td>
                            <td style={{ color: '#6B7280', padding: '14px 16px' }}>{r.category}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {r.room_image_url && <img src={getFullRoomImageUrl(r.room_image_url)} alt={r.room_type} style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />}
                                <span style={{ color: '#6B7280' }}>
                                  {getRequestRooms(r).length > 1
                                    ? `${getRequestRooms(r).length} Rooms: ${getRequestRooms(r).map((room) => room.room_type).join(', ')}`
                                    : (r.room_type || getRequestRooms(r)[0]?.room_type)}
                                </span>
                              </div>
                            </td>
                            <td style={{ color: '#6B7280', padding: '14px 16px' }}>
                              {getRequestRooms(r).length > 1
                                ? `${getRequestRooms(r).length} room types`
                                : (r.bed_type || getRequestRooms(r)[0]?.bed_type)}
                            </td>
                            <td style={{ color: '#6B7280', padding: '14px 16px' }}>
                              {getRequestRooms(r).length > 1
                                ? 'See view for details'
                                : (r.amenities_types?.length > 0 ? r.amenities_types.join(', ') : 'None')}
                            </td>
                            <td style={{ color: '#111827', fontWeight: 600, padding: '14px 16px' }}>
                              {getRequestRooms(r).length > 1
                                ? `From ${formatCurrency(Math.min(...getRequestRooms(r).map((room) => Number(room.price_per_room || 0)).filter(Boolean)))}`
                                : formatCurrency(firstPresent(r.price_per_room, getRequestRooms(r)[0]?.price_per_room, r.priceByOwner))}
                            </td>
                            <td style={{ color: '#6B7280', padding: '14px 16px' }}>{Array.isArray(r.rules) ? `${r.rules.length} section(s)` : (r.rules?.length > 35 ? `${r.rules.substring(0, 35)}...` : r.rules)}</td>
                            <td style={{ color: '#111827', fontWeight: 600, padding: '14px 16px' }}>{r.offers?.length > 0 ? r.offers.join(', ') : 'None'}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: statusBg, color: statusColor }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} /> {statusLabel.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button type="button" onClick={() => setViewingRequest(viewingRequest === r._id ? null : r._id)} style={{ color: '#0C6DC4', background: '#EFF6FF', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer' }} title="View Details">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                </button>
                                <button type="button" onClick={() => handleEditRoom(r)} style={{ color: '#2563EB', background: '#EFF6FF', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer' }} title="Edit Room">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button type="button" onClick={() => handleDelete(r._id)} style={{ color: '#EF4444', background: '#FEE2E2', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer' }} title="Delete">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {viewingRequest === r._id && (
                            <tr>
                              <td colSpan="10" style={{ padding: 0, borderBottom: 'none' }}>
                                <div style={{ background: '#F9FAFB', padding: '12px', borderBottom: '1px solid #E5E7EB', borderTop: '1px dashed #D1D5DB' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '12px' }}>
                                    <div>
                                      <h2 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#111827' }}>{r.propertyName || 'Property'} Request Details</h2>
                                      <div style={{ fontSize: '11.5px', color: '#58A429', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                        <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#58A429' }}></span>
                                        <span>{r.location || 'Location N/A'}</span>
                                        <span style={{ color: '#9CA3AF' }}>•</span>
                                        <span style={{ color: '#4B5563', fontWeight: 600 }}>{r.category}</span>
                                      </div>
                                    </div>
                                    <button onClick={() => setViewingRequest(null)} style={{ background: '#E5E7EB', border: 'none', cursor: 'pointer', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: '#374151' }}>Close Details</button>
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {getRequestRooms(r).map((room, roomIdx) => (
                                      <div key={roomIdx} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        {/* Row 1: Image and Primary Details */}
                                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                          <div style={{ position: 'relative', flex: '0 0 160px' }}>
                                            <img src={getFullRoomImageUrl(room.room_image_url || r.room_image_url) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60'} alt={room.room_type} style={{ width: '160px', height: '110px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #E5E7EB' }} />
                                            {getRequestRooms(r).length > 1 && (
                                              <div style={{ position: 'absolute', top: -6, left: -6, background: '#2563EB', color: 'white', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', boxShadow: '0 2px 4px rgba(37,99,235,0.3)' }}>Room {roomIdx + 1}</div>
                                            )}
                                          </div>
                                          
                                          <div style={{ flex: '1 1 300px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
                                              <div>
                                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111827' }}>{room.room_type || r.room_type}</h3>
                                                <div style={{ fontSize: '14px', color: '#4B5563', marginTop: '4px' }}>Bed Type: <strong>{room.bed_type || r.bed_type}</strong></div>
                                              </div>
                                              <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                                <div style={{ fontSize: '20px', fontWeight: 800, color: '#58A429' }}>{formatCurrency(firstPresent(room.price_per_room, r.price_per_room, r.priceByOwner))}<span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}> /night</span></div>
                                                <div style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Discounted Rate</div>
                                              </div>
                                            </div>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                              {firstPresent(room.original_price, r.original_price) && (
                                                <div style={{ background: '#F9FAFB', padding: '4px 10px', borderRadius: '6px', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                  <span style={{ fontSize: '9px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 700 }}>Original</span>
                                                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B7280', textDecoration: 'line-through' }}>{formatCurrency(firstPresent(room.original_price, r.original_price))}</span>
                                                </div>
                                              )}
                                              {firstPresent(room.tax_amount, r.tax_amount) && (
                                                <div style={{ background: '#F9FAFB', padding: '4px 10px', borderRadius: '6px', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                  <span style={{ fontSize: '9px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 700 }}>Tax</span>
                                                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563' }}>{formatCurrency(firstPresent(room.tax_amount, r.tax_amount))}</span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Row 2: Amenities & Offers (Compact) */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                          <div>
                                            <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                              <CheckCircle size={14} color="#58A429" /> Amenities
                                            </h4>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                              {(room.amenities_types || r.amenities_types)?.length > 0 ? (room.amenities_types || r.amenities_types).map((a, j) => (
                                                <span key={j} style={{ padding: '2px 8px', background: '#ECFDF5', color: '#065F46', borderRadius: '4px', fontSize: '11px', fontWeight: 500, border: '1px solid #A7F3D0' }}>{a}</span>
                                              )) : <span style={{ fontSize: '11px', color: '#9CA3AF' }}>None</span>}
                                            </div>
                                          </div>
                                          <div>
                                            <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                              <Star size={14} color="#F59E0B" /> Offers
                                            </h4>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                              {(room.offers || r.offers)?.length > 0 ? (room.offers || r.offers).map((o, j) => (
                                                <span key={j} style={{ padding: '2px 8px', background: '#EFF6FF', color: '#1E40AF', borderRadius: '4px', fontSize: '11px', fontWeight: 500, border: '1px solid #BFDBFE' }}>{o}</span>
                                              )) : <span style={{ fontSize: '11px', color: '#9CA3AF' }}>None</span>}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Row 3: House Rules (Compact Grid) */}
                                        <div style={{ background: '#F9FAFB', borderRadius: '8px', padding: '10px', border: '1px solid #F3F4F6' }}>
                                          <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '8px', textTransform: 'uppercase' }}>Rules & Policies</h4>
                                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                                            {Array.isArray(room.rules || r.rules) && (room.rules || r.rules).length > 0 ? (room.rules || r.rules).map((rule, j) => (
                                              <div key={j} style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '6px 10px' }}>
                                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#B45309', marginBottom: '2px' }}>{rule.title}</div>
                                                <div style={{ fontSize: '11px', color: '#4B5563', lineHeight: '1.4' }}>
                                                  {Array.isArray(rule.points) ? (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '12px' }}>
                                                      {rule.points.map((p, pIdx) => <span key={pIdx}>• {p}</span>)}
                                                    </div>
                                                  ) : rule.points}
                                                </div>
                                              </div>
                                            )) : <span style={{ fontSize: '11px', color: '#9CA3AF' }}>None</span>}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    }) : (
                      <tr><td colSpan="10" style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>No property requests submitted yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
