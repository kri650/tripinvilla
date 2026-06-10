import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Edit2, X, Check, Image, Tag } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE;

const ROOM_TYPES = ['Deluxe Room', 'Super Deluxe Room', 'Suite', 'Premium Suite', 'Standard Room', 'Family Room', 'Studio', 'Penthouse', 'Cottage', 'Villa Wing', 'Other'];
const BED_TYPES = ['King Size', 'Queen Size', 'Twin Beds', 'Double Bed', 'Bunk Beds', 'Single Bed', 'Sofa Bed', 'King Size 1', 'King Size Bed', 'Queen Size Bed', 'Twin Bed'];
const COMMON_AMENITIES = ['WiFi', 'AC', 'TV', 'Parking', 'Swimming Pool', 'Breakfast', 'Kitchen', 'Barbeque', 'Gym', 'Spa', 'Balcony', 'Garden View', 'Sea View', 'Mountain View', 'Jacuzzi', 'Room Service', 'Mini Bar', 'Safe', 'Desk', 'Wardrobe'];

const emptyRoom = {
  room_type: '',
  bed_type: '',
  price_per_room: '',
  original_price: '',
  amenities_types: [],
  offers: [],
  room_images: [''],
};

export default function PropertyRoomManager({ property, onClose }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyRoom);
  const [editingId, setEditingId] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [offerInput, setOfferInput] = useState('');
  const [amenitySearch, setAmenitySearch] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [customAmenity, setCustomAmenity] = useState('');

  const token = localStorage.getItem('admin_token');

  const authHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const getFullRoomImageUrl = (url) => {
    if (!url) return '';
    if (typeof url !== 'string') return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }
    const base = (API_BASE || 'http://localhost:8000/api').replace('/api', '');
    return `${base}${url}`;
  };

  const fetchRooms = async () => {
    if (!property?._id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/property-requests/property/${property._id}`);
      const data = await res.json();
      if (Array.isArray(data)) setRooms(data);
      else setRooms([]);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const [roomTypesMaster, setRoomTypesMaster] = useState([]);

  useEffect(() => {
    fetchRooms();
    fetch(`${API_BASE}/master/room-types`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setRoomTypesMaster(data); })
      .catch(console.error);
  }, [property?._id]);

  const handleImageChange = (idx, val) => {
    setForm(prev => {
      const imgs = [...prev.room_images];
      imgs[idx] = val;
      return { ...prev, room_images: imgs };
    });
  };

  const addImageRow = () => setForm(prev => ({ ...prev, room_images: [...prev.room_images, ''] }));
  const removeImageRow = (idx) => setForm(prev => ({ ...prev, room_images: prev.room_images.filter((_, i) => i !== idx) }));

  const toggleAmenity = (a) => {
    setForm(prev => ({
      ...prev,
      amenities_types: prev.amenities_types.includes(a)
        ? prev.amenities_types.filter(x => x !== a)
        : [...prev.amenities_types, a]
    }));
  };

  const addOffer = () => {
    if (!offerInput.trim()) return;
    setForm(prev => ({ ...prev, offers: [...prev.offers, offerInput.trim()] }));
    setOfferInput('');
  };

  const removeOffer = (idx) => setForm(prev => ({ ...prev, offers: prev.offers.filter((_, i) => i !== idx) }));

  const addCustomAmenity = () => {
    if (!customAmenity.trim()) return;
    if (!form.amenities_types.includes(customAmenity.trim())) {
      setForm(prev => ({ ...prev, amenities_types: [...prev.amenities_types, customAmenity.trim()] }));
    }
    setCustomAmenity('');
  };

  const [newImageFiles, setNewImageFiles] = useState([]);
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFiles(prev => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeNewFile = (idx) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (idx) => {
    setForm(prev => ({ ...prev, room_images: prev.room_images.filter((_, i) => i !== idx) }));
  };

  // Reset new image files when switching modes
  const resetImageFiles = () => {
    setNewImageFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!form.room_type) { toast.error('Room Type is required'); return; }
    if (!form.price_per_room) { toast.error('Price per night is required'); return; }

    const formData = new FormData();
    formData.append('property_id', property._id);
    if (editingIndex !== null) formData.append('room_index', editingIndex);
    formData.append('room_type', form.room_type);
    formData.append('bed_type', form.bed_type);
    formData.append('price_per_room', form.price_per_room);
    if (form.original_price) formData.append('original_price', form.original_price);
    if (form.tax_amount) formData.append('tax_amount', form.tax_amount);

    formData.append('amenities_types', JSON.stringify(form.amenities_types));
    formData.append('offers', JSON.stringify(form.offers));

    // Existing URLs
    const existingImgs = form.room_images.filter(u => u && u.trim());
    formData.append('room_images', JSON.stringify(existingImgs));

    // New Files
    newImageFiles.forEach(file => {
      formData.append('images', file);
    });

    const token = localStorage.getItem('admin_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    setSaving(true);
    try {
      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/property-requests/admin-direct/${editingId}`, {
          method: 'PUT',
          headers, // No Content-Type for FormData
          body: formData,
        });
      } else {
        res = await fetch(`${API_BASE}/property-requests/admin-direct`, {
          method: 'POST',
          headers, // No Content-Type for FormData
          body: formData,
        });
      }

      if (res.ok) {
        toast.success(editingId ? 'Room updated successfully!' : 'Room added successfully!');
        setForm(emptyRoom);
        setNewImageFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setEditingId(null);
        setEditingIndex(null);
        setOfferInput('');
        setHasChanges(true);
        fetchRooms();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to save room');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error saving room');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (room, index) => {
    // Build existing images array from all possible fields
    let existingImgs = [];
    if (Array.isArray(room.images) && room.images.length > 0) {
      existingImgs = room.images.filter(u => u && u.trim());
    } else if (Array.isArray(room.room_images) && room.room_images.length > 0) {
      existingImgs = room.room_images.filter(u => u && u.trim());
    } else if (room.imageUrl || room.room_image_url || room.img) {
      existingImgs = [room.imageUrl || room.room_image_url || room.img].filter(Boolean);
    }

    setForm({
      room_type: room.title || room.room_type || '',
      bed_type: room.beds || room.bed_type || '',
      price_per_room: room.price || room.price_per_room || '',
      original_price: room.originalPrice || room.original_price || '',
      tax_amount: room.taxAmount || room.tax_amount || '',
      amenities_types: room.features || room.amenities_types || [],
      offers: room.offers || [],
      room_images: existingImgs.length > 0 ? existingImgs : [''],
    });
    setNewImageFiles([]);  // Clear any pending new files
    if (fileInputRef.current) fileInputRef.current.value = '';
    setEditingId(room._id);
    setEditingIndex(room.roomIndex !== undefined ? room.roomIndex : index);
    window.scrollTo({ top: document.getElementById('room-form-section')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room? It will be removed from the property detail page.')) return;
    try {
      const res = await fetch(`${API_BASE}/property-requests/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.ok) {
        toast.success('Room deleted successfully!');
        fetchRooms();
      } else {
        toast.error('Failed to delete room');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting room');
    }
  };

  const cancelEdit = () => {
    setForm(emptyRoom);
    setEditingId(null);
    setEditingIndex(null);
    setOfferInput('');
    resetImageFiles();
  };

  const filteredAmenities = COMMON_AMENITIES.filter(a =>
    a.toLowerCase().includes(amenitySearch.toLowerCase()) && !form.amenities_types.includes(a)
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '24px 16px' }}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 900, boxShadow: '0 25px 60px rgba(0,0,0,0.2)', position: 'relative' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #E5E7EB', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius: '20px 20px 0 0' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>Room Management</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>
              <strong style={{ color: '#58A429' }}>{property?.propertyName || property?.name || 'Property'}</strong> — Rooms visible on the detail page
            </p>
          </div>
          <button onClick={() => onClose(hasChanges)} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6B7280' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* ── FORM ── */}
          <div id="room-form-section" style={{ background: '#FAFDF7', border: '1px solid #D1FAE5', borderRadius: 14, padding: 24, marginBottom: 28 }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#111827' }}>
              {editingId ? '✏️ Edit Room' : '+ Add New Room'}
            </h3>

            {/* Row 1: Room Type + Bed Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Room Type *</label>
                <select value={form.room_type} onChange={e => setForm(p => ({ ...p, room_type: e.target.value }))} style={inputStyle}>
                  <option value="">Select room type</option>
                  {roomTypesMaster.map(t => <option key={t._id} value={t.name}>{t.name}</option>)}
                  {roomTypesMaster.length === 0 && ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  {form.room_type && !roomTypesMaster.some(t => t.name === form.room_type) && (roomTypesMaster.length > 0 || !ROOM_TYPES.includes(form.room_type)) && (
                    <option value={form.room_type}>{form.room_type}</option>
                  )}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Bed Type</label>
                <select value={form.bed_type} onChange={e => setForm(p => ({ ...p, bed_type: e.target.value }))} style={inputStyle}>
                  <option value="">Select bed type</option>
                  {BED_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                  {form.bed_type && !BED_TYPES.includes(form.bed_type) && (
                    <option value={form.bed_type}>{form.bed_type}</option>
                  )}
                </select>
              </div>
            </div>

            {/* Row 2: Price + Original Price + Tax Amount */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Price / Night (₹) *</label>
                <input type="number" value={form.price_per_room} onChange={e => setForm(p => ({ ...p, price_per_room: e.target.value }))} placeholder="e.g. 4500" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Original Price (₹)</label>
                <input type="number" value={form.original_price} onChange={e => setForm(p => ({ ...p, original_price: e.target.value }))} placeholder="e.g. 6000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tax Amount (₹)</label>
                <input type="number" value={form.tax_amount} onChange={e => setForm(p => ({ ...p, tax_amount: e.target.value }))} placeholder="e.g. 500" style={inputStyle} />
              </div>
            </div>

            {/* Room Images */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Room Images</label>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
                {form.room_images.filter(u => u && u.trim()).map((url, idx) => (
                  <div key={`exist-${idx}`} style={{ position: 'relative', width: 60, height: 60 }}>
                    <img src={getFullRoomImageUrl(url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6, border: '1px solid #E5E7EB' }} />
                    <button type="button" onClick={() => removeExistingImage(idx)} style={{ position: 'absolute', top: -6, right: -6, background: '#EF4444', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, padding: 0 }}>×</button>
                  </div>
                ))}

                {newImageFiles.map((file, idx) => (
                  <div key={`new-${idx}`} style={{ position: 'relative', width: 60, height: 60 }}>
                    <img src={URL.createObjectURL(file)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6, border: '2px solid #58A429' }} />
                    <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(88,164,41,0.85)', color: '#fff', fontSize: '8px', textAlign: 'center', borderRadius: '0 0 6px 6px', padding: '1px' }}>New</span>
                    <button type="button" onClick={() => removeNewFile(idx)} style={{ position: 'absolute', top: -6, right: -6, background: '#EF4444', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, padding: 0 }}>×</button>
                  </div>
                ))}

                <div
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  style={{ width: 60, height: 60, border: '1px dashed #D1D5DB', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#F9FAFB' }}
                >
                  <Plus size={20} color="#9CA3AF" />
                </div>
              </div>

              <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple hidden accept="image/*" />
              {editingId && <span style={{ fontSize: '11px', color: '#6B7280' }}>✏️ Editing mode — existing images shown above. Add new ones with the + button.</span>}
            </div>

            {/* Amenities */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Room Amenities</label>
              {/* Selected amenities */}
              {form.amenities_types.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {form.amenities_types.map(a => (
                    <span key={a} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: '#DCFCE7', color: '#15803D', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {a}
                      <button type="button" onClick={() => toggleAmenity(a)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803D', padding: 0, lineHeight: 1 }}>×</button>
                    </span>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input type="text" placeholder="Search amenities..." value={amenitySearch} onChange={e => setAmenitySearch(e.target.value)} style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
                <input type="text" placeholder="Add custom..." value={customAmenity} onChange={e => setCustomAmenity(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())} style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
                <button type="button" onClick={addCustomAmenity} style={{ background: '#58A429', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {filteredAmenities.slice(0, 12).map(a => (
                  <button type="button" key={a} onClick={() => toggleAmenity(a)} style={{ padding: '4px 10px', background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: 20, fontSize: 12, cursor: 'pointer' }}>
                    + {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Offers */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Offers / Inclusions</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input type="text" placeholder="e.g. Free breakfast included" value={offerInput} onChange={e => setOfferInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addOffer())} style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
                <button type="button" onClick={addOffer} style={{ background: '#58A429', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {form.offers.map((o, idx) => (
                  <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: '#FEF9C3', color: '#854D0E', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                    ✓ {o}
                    <button type="button" onClick={() => removeOffer(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#854D0E', padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Save buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={handleSave} disabled={saving} style={{ background: '#58A429', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}>
                <Check size={16} />
                {saving ? 'Saving...' : editingId ? 'Update Room' : 'Add Room'}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} style={{ background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* ── ROOMS LIST ── */}
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#111827' }}>
            Existing Rooms ({rooms.length})
          </h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>Loading rooms...</div>
          ) : rooms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280', background: '#F9FAFB', borderRadius: 12, border: '1px dashed #D1D5DB' }}>
              <p style={{ fontSize: 14 }}>No rooms added yet. Add the first room above.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {rooms.map((room, i) => (
                <div key={room._id} style={{ border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s' }}>
                  {/* Room image */}
                  <div style={{ width: '100%', height: 150, background: '#E5E7EB', position: 'relative', overflow: 'hidden' }}>
                    <img src={getFullRoomImageUrl(room.img)} alt={room.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80'; }} />
                    {room.images && room.images.length > 1 && (
                      <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, borderRadius: 20, padding: '2px 8px' }}>
                        +{room.images.length - 1} more
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>{room.title}</h4>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleEdit(room, i)} style={{ background: '#EFF6FF', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', color: '#2563EB', display: 'flex' }}><Edit2 size={13} /></button>
                        <button onClick={() => handleDelete(room._id)} style={{ background: '#FEE2E2', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', color: '#EF4444', display: 'flex' }}><Trash2 size={13} /></button>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span>🛏 {room.beds}</span>
                      <span>· {room.guests || '2 Guests'}</span>
                      <span>· {room.rooms || '1 Room'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#58A429' }}>₹{Number(room.price).toLocaleString()}</span>
                        {room.originalPrice && (
                          <span style={{ fontSize: 11, color: '#9CA3AF', textDecoration: 'line-through', marginLeft: 6 }}>₹{Number(room.originalPrice).toLocaleString()}</span>
                        )}
                        <span style={{ fontSize: 11, color: '#6B7280' }}>/night</span>
                      </div>
                    </div>
                    {room.features && room.features.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                        {room.features.slice(0, 3).map((f, i) => (
                          <span key={i} style={{ fontSize: 10, padding: '2px 7px', background: '#F0FDF4', color: '#15803D', borderRadius: 20, border: '1px solid #BBF7D0' }}>{f}</span>
                        ))}
                        {room.features.length > 3 && <span style={{ fontSize: 10, color: '#6B7280' }}>+{room.features.length - 3} more</span>}
                      </div>
                    )}
                    {room.offers && room.offers.length > 0 && (
                      <div style={{ fontSize: 11, color: '#92400E', background: '#FEF9C3', borderRadius: 6, padding: '4px 8px' }}>
                        ✓ {room.offers[0]} {room.offers.length > 1 ? `& ${room.offers.length - 1} more` : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#374151',
  marginBottom: 6,
};

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid #D1D5DB',
  borderRadius: 8,
  fontSize: 13,
  outline: 'none',
  background: '#fff',
  boxSizing: 'border-box',
  marginBottom: 0,
  fontFamily: '"Outfit", sans-serif',
};
