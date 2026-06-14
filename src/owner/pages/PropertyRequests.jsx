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

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return `₹${amount.toLocaleString('en-IN')}`;
};

const firstPresent = (...values) => values.find((value) => value !== null && value !== undefined && value !== '');

const emptyRoom = () => ({
  room_type: '',
  bed_type: 'King Size',
  original_price: '',
  price_per_room: '',
  tax_amount: '',
  rulesSections: [{ title: '', text: '' }],
  offer: '',
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
  const selectedAmenities = data.selectedAmenities || [];
  const manualRoomType = data.manualRoomType || false;

  return (
    <div className="room-form-section" style={{ border: isEditMode ? '1px solid #2563EB' : '1px solid #E5E7EB', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <div className="room-form-header">
        <h3 className="room-form-title">
          {isEditMode ? `Room ${idx + 1}: ${data.room_type || 'New Room'}` : 'Configure Room Pricing & Rules'}
        </h3>
        {isEditMode && onRemove && (
          <button type="button" onClick={() => onRemove(idx)} className="btn-remove-room">
            <Trash2 size={14} /> Remove Room
          </button>
        )}
      </div>

      <div className="form-grid-3">
        <div className="form-group">
          <div className="room-type-label-row">
            <label className="form-label">Room Type*</label>
            <button type="button" onClick={() => onUpdate({ ...data, manualRoomType: !manualRoomType, room_type: '' })} className="btn-manual-toggle">
              {manualRoomType ? '← Use Dropdown' : 'Enter Manually'}
            </button>
          </div>
          {manualRoomType ? (
            <input type="text" className="form-input" name="room_type" value={data.room_type} onChange={handleInputChange} placeholder="e.g. Penthouse Suite" required />
          ) : (
            <select className="form-select" name="room_type" value={data.room_type} onChange={handleInputChange} required>
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
          <div className="room-image-input-group">
            <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageChange} className="file-input-minimal" />
            {(data.roomImagePreview || data.room_image_url) && (
              <img src={getFullRoomImageUrl(data.roomImagePreview || data.room_image_url)} alt="preview" className="room-form-preview-img" />
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

      <div className="form-grid-3">
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

      <div className="form-group" style={{ boxSizing: 'border-box', marginBottom: '16px' }}>
        <label className="form-label">Offer / Discount</label>
        <input type="text" className="form-input" 
          name="offer"
          value={data.offer || ''}
          onChange={handleInputChange}
          placeholder="e.g. 20% Off flat" 
        />
      </div>

      <div className="amenities-selection-section" style={{ boxSizing: 'border-box' }}>
        <label className="form-label-bold">Amenities Types</label>
        {amenitiesLoading ? <div className="loading-msg">Loading amenities...</div> : (
          <div className="amenities-pill-cloud">
            {availableAmenities.map(a => (
              <button type="button" key={a} onClick={() => toggleAmenity(a)}
                className={`amenity-btn ${selectedAmenities.includes(a) ? 'active' : ''}`}>
                {a}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="house-rules-config-box" style={{ boxSizing: 'border-box' }}>
        <div className="rules-box-header">
          <label className="form-label-bold">House Rules Sections</label>
          <button type="button" onClick={handleAddRuleSection} className="btn-add-section">
            + Add Section
          </button>
        </div>
        <div className="rules-sections-list">
          {rulesSections.map((sec, rIdx) => (
            <div key={rIdx} className="rule-section-card">
              <button type="button" onClick={() => handleRemoveRuleSection(rIdx)} className="btn-remove-section">&times;</button>
              <div className="form-group">
                <label className="form-label">Section Title*</label>
                <input type="text" className="form-input" value={sec.title} onChange={e => handleRuleSectionChange(rIdx, 'title', e.target.value)} placeholder="e.g. Must Read Rules" required />
              </div>
              <div className="form-group">
                <label className="form-label">Rules Text (one rule per line)*</label>
                <textarea className="form-textarea minimal-textarea" value={sec.text} onChange={e => handleRuleSectionChange(rIdx, 'text', e.target.value)} placeholder="e.g. • Primary Guest should be atleast 18 years of age." required />
              </div>
            </div>
          ))}
          {rulesSections.length === 0 && <div className="empty-rules-msg">No rule sections added.</div>}
        </div>
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
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [rulesSections, setRulesSections] = useState([{ title: '', text: '' }]);

  const [manualRoomType, setManualRoomType] = useState(false);
  const fallbackRoomTypes = ['Standard Room', 'Deluxe Room', 'Super Deluxe Room', 'Executive Suite', 'Presidential Suite', 'Family Suite', 'Dormitory', 'Tent', 'Cottage', 'Villa'];
  const [selectedRoomImage, setSelectedRoomImage] = useState(null);
  const [roomImagePreview, setRoomImagePreview] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [availableAmenities, setAvailableAmenities] = useState([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(false);
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
      const pData = propsRes.data || [];
      pData.sort((a, b) => (b.createdAt && a.createdAt) ? new Date(b.createdAt) - new Date(a.createdAt) : (b._id || '').toString().localeCompare((a._id || '').toString()));
      setProperties(pData);
      if (pData.length > 0) {
        const first = pData[0];
        if (!propertyId) {
          setPropertyId(first._id);
          fetchAmenities(first.type);
        }
      } else {
        fetchAmenities('All');
      }
      const reqsRes = await propertyRequestService.getMine();
      const rData = reqsRes.data || [];
      rData.sort((a, b) => (b.createdAt && a.createdAt) ? new Date(b.createdAt) - new Date(a.createdAt) : (b._id || '').toString().localeCompare((a._id || '').toString()));
      setRequests(rData);
    } catch {
      fetchAmenities('All');
    }

    try {
      const rtRes = await fetch(`${API_BASE}/master/room-types`);
      const rtData = await rtRes.json();
      if (Array.isArray(rtData)) setRoomTypes(rtData);
    } catch { }
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
        offer: formData.offer || '',
        rules: formattedRules,
        _preview_img: roomImageUrl || roomImagePreview,
      };

      if (editingQueueIdx !== null) {
        setRoomQueue(prev => prev.map((item, i) => i === editingQueueIdx ? { ...item, ...roomEntry } : item));
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
      offer: r.offer || (r.offers && r.offers[0]) || '',
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

        const { _preview_img, _selectedFile, rulesSections, selectedAmenities, manualRoomType, roomImagePreview, offers, ...rest } = room;
        return {
          ...rest,
          room_image_url: roomImageUrl,
          rules,
          amenities_types: selectedAmenities || room.amenities_types || [],
          offer: room.offer || '',
          offers: room.offer ? [room.offer] : [],
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
      offer: room.offer || (room.offers && room.offers[0]) || '',
      selectedAmenities: room.amenities_types || [],
      manualRoomType: !fallbackRoomTypes.includes(room.room_type) && !roomTypes.some(rt => rt.name === room.room_type)
    })));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProperty = properties.find(p => p._id === propertyId);
  const categoryValue = selectedProperty ? selectedProperty.type : 'N/A';

  return (
    <div className="fade-in property-requests-page">
      <div style={{ height: '16px' }} />
      <div className="props-breadcrumb">
        Property Management &gt; <span>Property Requests</span>
      </div>

      {properties.length === 0 ? (
        <div className="no-properties-alert">
          <ShieldAlert size={28} color="#D97706" />
          <div>
            <h4 className="alert-title">No Properties Listed Yet</h4>
            <p className="alert-text">Add at least one property under "My Properties" before configuring room pricing.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="property-request-config room-form-section" style={{ marginBottom: '40px' }}>
            <div className="request-header">
              <h3 className="section-title">Configure Property Request</h3>
              <div className="header-actions">
                {editingRequestId && (
                  <button type="button" className="btn-cancel" onClick={() => { setEditingRequestId(null); setRoomQueue([]); resetRoomForm(); }}>Cancel Edit</button>
                )}
                {roomQueue.length > 0 && (
                  <button type="button" className="btn-submit-all" onClick={handleSubmitAll} disabled={loading}>
                    {loading ? 'Submitting...' : `Submit Request (${roomQueue.length} Room(s))`}
                  </button>
                )}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Property Name*</label>
                <select className="form-select" value={propertyId} onChange={handlePropertyChange} required>
                  {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category (Auto-filled)*</label>
                <input type="text" className="form-input category-input" value={categoryValue} disabled />
              </div>
            </div>
          </div>

          {!editingRequestId ? (
            <>
              <RoomForm 
                data={{ ...formData, rulesSections, selectedAmenities, manualRoomType, roomImagePreview }}
                onUpdate={(d) => {
                  setFormData(d);
                  setRulesSections(d.rulesSections || []);
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
              <div className="add-room-actions">
                <button type="button" className="btn-add-queue" onClick={handleAddToQueue} disabled={loading}>
                  <Plus size={16} /> Add Room to Queue
                </button>
              </div>

              {roomQueue.length > 0 && (
                <div className="dash-section room-queue-section">
                  <h3 className="section-title">Rooms in Queue ({roomQueue.length})</h3>
                  <div className="room-queue-grid">
                    {roomQueue.map((room, idx) => (
                      <div key={idx} className="queue-item">
                        <img src={room._preview_img || 'https://via.placeholder.com/48'} alt={room.room_type} className="queue-item-img" />
                        <div className="queue-item-info">
                          <div className="queue-item-name">{room.room_type}</div>
                          <div className="queue-item-price">₹{room.price_per_room}/night</div>
                        </div>
                        <div className="queue-item-actions">
                          <button type="button" onClick={() => handleEditFromQueue(idx)} className="btn-edit-queue"><Plus size={14} /></button>
                          <button type="button" onClick={() => handleRemoveFromQueue(idx)} className="btn-remove-queue"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="editing-rooms-container">
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
              <div className="editing-actions">
                <button type="button" className="btn-add-another" onClick={() => setRoomQueue(prev => [...prev, emptyRoom()])}>
                  + Add Another Room
                </button>
              </div>
            </div>
          )}

          {/* ─── SUBMITTED REQUESTS TABLE ─── */}
          <div className="dash-section requests-table-section">
            <div className="chart-card table-container">
              <div className="table-responsive" style={{ overflowX: 'auto', width: '100%' }}>
                <table className="data-table" style={{ minWidth: 800 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                      {['Property', 'Category', 'Room Type', 'Bed', 'Amenities', 'Price', 'Rules', 'Offers', 'Status', 'Actions'].map((h, i) => (
                        <th key={i} style={{ minWidth: { 'Property': 150, 'Category': 90, 'Room Type': 90, 'Bed': 70, 'Amenities': 100, 'Price': 80, 'Rules': 70, 'Offers': 70, 'Status': 80, 'Actions': 80 }[h], color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px', fontFamily: '"Outfit", sans-serif', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length > 0 ? requests.map((r, i) => {
                      const statusLabel = r.admin_status || 'pending';
                      const statusClass = statusLabel.toLowerCase();
                      return (
                        <React.Fragment key={i}>
                          <tr className="request-row" style={{ borderBottom: '1px solid #F3F4F6' }}>
                            <td style={{ color: '#111827', fontWeight: 500, padding: '14px', fontSize: '13px', whiteSpace: 'normal', minWidth: '150px', maxWidth: '200px' }}><ReadMore lines={2}>{r.propertyName}</ReadMore></td>
                            <td style={{ padding: '14px' }}>
                              <span className="category-pill" style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 500, background: '#DCFCE7', color: '#58A429' }}>{r.category}</span>
                            </td>
                            <td style={{ color: '#4B5563', padding: '14px', fontSize: '13px' }}>
                              <div className="room-type-cell">
                                {r.room_image_url && <img src={getFullRoomImageUrl(r.room_image_url)} alt={r.room_type} className="cell-img" />}
                                <span>
                                  {getRequestRooms(r).length > 1
                                    ? `${getRequestRooms(r).length} Rooms`
                                    : (r.room_type || getRequestRooms(r)[0]?.room_type)}
                                </span>
                              </div>
                            </td>
                            <td style={{ color: '#374151', fontWeight: 500, padding: '14px', fontSize: '13px' }}>
                              {getRequestRooms(r).length > 1
                                ? `${getRequestRooms(r).length} Types`
                                : (r.bed_type || getRequestRooms(r)[0]?.bed_type)}
                            </td>
                            <td style={{ color: '#4B5563', padding: '14px', fontSize: '13px', whiteSpace: 'normal', maxWidth: '160px' }}>
                              <ReadMore lines={2}>
                              {getRequestRooms(r).length > 1
                                ? 'Multiple'
                                : (r.amenities_types?.length > 0 ? r.amenities_types.join(', ') : 'None')}
                              </ReadMore>
                            </td>
                            <td style={{ color: '#111827', fontWeight: 600, padding: '14px', fontSize: '13px' }}>
                              {getRequestRooms(r).length > 1
                                ? `From ${formatCurrency(Math.min(...getRequestRooms(r).map((room) => Number(room.price_per_room || 0)).filter(Boolean)))}`
                                : formatCurrency(firstPresent(r.price_per_room, getRequestRooms(r)[0]?.price_per_room, r.priceByOwner))}
                            </td>
                            <td style={{ color: '#4B5563', padding: '14px', fontSize: '13px', whiteSpace: 'normal', maxWidth: '160px' }}><ReadMore lines={2}>{Array.isArray(r.rules) ? `${r.rules.length} sections` : 'None'}</ReadMore></td>
                            <td style={{ color: '#4B5563', padding: '14px', fontSize: '13px', whiteSpace: 'normal', maxWidth: '160px' }}>{r.offer || (r.offers && r.offers[0]) || 'None'}</td>
                            <td style={{ padding: '14px' }}>
                              <span className={`status-badge ${statusClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, userSelect: 'none', background: statusLabel.toLowerCase() === 'approved' ? '#DCFCE7' : statusLabel.toLowerCase() === 'pending' ? '#FEF3C7' : '#FEE2E2', color: statusLabel.toLowerCase() === 'approved' ? '#58A429' : statusLabel.toLowerCase() === 'pending' ? '#D97706' : '#EF4444' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} /> {statusLabel.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: '14px' }}>
                              <div className="action-btns" style={{ display: 'flex', gap: '8px' }}>
                                <button type="button" onClick={() => setViewingRequest(viewingRequest === r._id ? null : r._id)} className="btn-action view" title="View Details" style={{ color: '#58A429', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                </button>
                                <button type="button" onClick={() => handleEditRoom(r)} className="btn-action edit" title="Edit Room" style={{ color: '#58A429', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button type="button" onClick={() => handleDelete(r._id)} className="btn-action delete" title="Delete" style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {viewingRequest === r._id && (
                            <tr className="detail-expanded-row">
                              <td colSpan="10" className="detail-td">
                                <div className="detail-container">
                                  <div className="detail-header">
                                    <div className="header-info">
                                      <h2 className="detail-title">{r.propertyName || 'Property'} Request Details</h2>
                                      <div className="detail-meta">
                                        <span className="meta-dot"></span>
                                        <span className="meta-location">{r.location || 'Location N/A'}</span>
                                        <span className="meta-sep">•</span>
                                        <span className="meta-category">{r.category}</span>
                                      </div>
                                    </div>
                                    <button onClick={() => setViewingRequest(null)} className="btn-close-detail">Close Details</button>
                                  </div>

                                  <div className="room-details-list">
                                    {getRequestRooms(r).map((room, roomIdx) => (
                                      <div key={roomIdx} className="room-detail-card">
                                        
                                        {/* ══ Left Half: Image ══ */}
                                        <div className="room-hero-img-wrap">
                                          <img
                                            src={getFullRoomImageUrl(room.room_image_url || r.room_image_url) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'}
                                            alt={room.room_type}
                                            className="room-hero-img"
                                          />
                                          {getRequestRooms(r).length > 1 && (
                                            <div className="room-badge">Room {roomIdx + 1}</div>
                                          )}
                                        </div>

                                        {/* ══ Right Half: All Details ══ */}
                                        <div className="room-hero-details">
                                          
                                          {/* Top Info (Name/Bed vs Prices/Tags) */}
                                          <div className="room-info-header">
                                            <div className="info-left">
                                              <h3 className="room-name">{room.room_type || r.room_type}</h3>
                                              <div className="room-bed-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                Bed: {room.bed_type || r.bed_type}
                                                {(room.offer || r.offer || (r.offers && r.offers[0])) && (
                                                  <span className="info-pill top-offer-tag" style={{ margin: 0 }}>{room.offer || r.offer || (r.offers && r.offers[0])}</span>
                                                )}
                                              </div>
                                            </div>
                                            <div className="info-right">
                                              <div className="price-val">
                                                {formatCurrency(firstPresent(room.price_per_room, r.price_per_room, r.priceByOwner))}
                                                <span className="price-unit">/night</span>
                                              </div>
                                              {firstPresent(room.original_price, r.original_price) && (
                                                <div className="info-pill original-price">
                                                  Original {formatCurrency(firstPresent(room.original_price, r.original_price))}
                                                </div>
                                              )}
                                              <div className="tag-row">
                                                {firstPresent(room.tax_amount, r.tax_amount) && (
                                                  <span className="info-pill tax-info">Tax {formatCurrency(firstPresent(room.tax_amount, r.tax_amount))}</span>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="room-divider" />

                                          {/* Amenities */}
                                          <div className="room-section">
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                              {(room.amenities_types || r.amenities_types)?.length > 0 ? (
                                                (room.amenities_types || r.amenities_types).map((a, j) => (
                                                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151', fontWeight: 500 }}>
                                                    <CheckCircle size={14} color="#3B82F6" /> {a}
                                                  </div>
                                                ))
                                              ) : <span className="empty-val">None</span>}
                                            </div>
                                          </div>


                                          {/* House Rules & Policies */}
                                          <div className="room-section" style={{ borderBottom: 'none' }}>
                                            <div className="section-label">HOUSE RULES &amp; POLICIES</div>
                                            {Array.isArray(room.rules || r.rules) && (room.rules || r.rules).length > 0 ? (
                                              <div className="rules-grid">
                                                {(room.rules || r.rules).map((rule, j) => (
                                                  <div key={j} className="rule-box">
                                                    <div className="rule-title">{rule.title}</div>
                                                    <div className="rule-points">
                                                      {Array.isArray(rule.points) ? (
                                                        rule.points.map((p, pIdx) => <span key={pIdx} className="point-item">• {p}</span>)
                                                      ) : <span className="point-item">{rule.points}</span>}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            ) : <span className="empty-val">None</span>}
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
                      <tr><td colSpan="10" className="td-empty">No property requests submitted yet.</td></tr>
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
