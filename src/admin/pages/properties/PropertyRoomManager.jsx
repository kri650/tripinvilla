import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check, Image, Tag } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE;

const ROOM_TYPES = ['Deluxe Room', 'Super Deluxe Room', 'Suite', 'Premium Suite', 'Standard Room', 'Family Room', 'Studio', 'Penthouse', 'Cottage', 'Villa Wing', 'Other'];
const BED_TYPES = ['King Bed', 'Queen Bed', 'Twin Beds', 'Double Bed', 'Bunk Beds', 'Single Bed', 'Sofa Bed'];
const COMMON_AMENITIES = ['WiFi', 'AC', 'TV', 'Parking', 'Swimming Pool', 'Breakfast', 'Kitchen', 'Barbeque', 'Gym', 'Spa', 'Balcony', 'Garden View', 'Sea View', 'Mountain View', 'Jacuzzi', 'Room Service', 'Mini Bar', 'Safe', 'Desk', 'Wardrobe'];

const emptyRoom = {
  room_type: '',
  bed_type: '',
  price_per_room: '',
  original_price: '',
  checkin_time: '3:00 PM',
  checkout_time: '12:00 PM',
  amenities_types: [],
  offers: [],
  room_images: [''],
};

export default function PropertyRoomManager({ property, onClose }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyRoom);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [offerInput, setOfferInput] = useState('');
  const [amenitySearch, setAmenitySearch] = useState('');
  const [customAmenity, setCustomAmenity] = useState('');

  const token = localStorage.getItem('admin_token');

  const authHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

  useEffect(() => {
    fetchRooms();
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

  const handleSave = async () => {
    if (!form.room_type) { alert('Room Type is required'); return; }
    if (!form.price_per_room) { alert('Price per night is required'); return; }

    const imgs = form.room_images.filter(u => u.trim());
    const payload = {
      property_id: property._id,
      room_type: form.room_type,
      bed_type: form.bed_type,
      price_per_room: Number(form.price_per_room),
      original_price: form.original_price ? Number(form.original_price) : undefined,
      checkin_time: form.checkin_time,
      checkout_time: form.checkout_time,
      amenities_types: form.amenities_types,
      offers: form.offers,
      room_images: imgs,
      room_image_url: imgs[0] || '',
    };

    setSaving(true);
    try {
      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/property-requests/admin-direct/${editingId}`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/property-requests/admin-direct`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setForm(emptyRoom);
        setEditingId(null);
        setOfferInput('');
        fetchRooms();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to save room');
      }
    } catch (err) {
      console.error(err);
      alert('Network error saving room');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (room) => {
    setForm({
      room_type: room.title || room.room_type || '',
      bed_type: room.beds || room.bed_type || '',
      price_per_room: room.price || room.price_per_room || '',
      original_price: room.originalPrice || room.original_price || '',
      checkin_time: room.checkIn || room.checkin_time || '3:00 PM',
      checkout_time: room.checkOut || room.checkout_time || '12:00 PM',
      amenities_types: room.features || room.amenities_types || [],
      offers: room.offers || [],
      room_images: room.images && room.images.length > 0 ? room.images : (room.img ? [room.img] : ['']),
    });
    setEditingId(room._id);
    window.scrollTo({ top: document.getElementById('room-form-section')?.offsetTop || 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room? It will be removed from the property detail page.')) return;
    try {
      const res = await fetch(`${API_BASE}/property-requests/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.ok) fetchRooms();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setForm(emptyRoom);
    setEditingId(null);
    setOfferInput('');
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
          <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6B7280' }}>
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
                  {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Bed Type</label>
                <select value={form.bed_type} onChange={e => setForm(p => ({ ...p, bed_type: e.target.value }))} style={inputStyle}>
                  <option value="">Select bed type</option>
                  {BED_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {/* Row 2: Price + Original Price + Check-In + Check-Out */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Price / Night (₹) *</label>
                <input type="number" value={form.price_per_room} onChange={e => setForm(p => ({ ...p, price_per_room: e.target.value }))} placeholder="e.g. 4500" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Original Price (₹)</label>
                <input type="number" value={form.original_price} onChange={e => setForm(p => ({ ...p, original_price: e.target.value }))} placeholder="e.g. 6000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Check-In Time</label>
                <input type="text" value={form.checkin_time} onChange={e => setForm(p => ({ ...p, checkin_time: e.target.value }))} placeholder="3:00 PM" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Check-Out Time</label>
                <input type="text" value={form.checkout_time} onChange={e => setForm(p => ({ ...p, checkout_time: e.target.value }))} placeholder="12:00 PM" style={inputStyle} />
              </div>
            </div>

            {/* Room Images */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Room Images (URLs)</label>
              {form.room_images.map((url, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 34, borderRadius: 6, overflow: 'hidden', background: '#E5E7EB', flexShrink: 0 }}>
                    {url.trim() ? (
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image size={16} color="#9CA3AF" />
                      </div>
                    )}
                  </div>
                  <input type="text" value={url} onChange={e => handleImageChange(idx, e.target.value)} placeholder={`Image URL ${idx + 1}`} style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
                  {form.room_images.length > 1 && (
                    <button type="button" onClick={() => removeImageRow(idx)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addImageRow} style={{ fontSize: 12, color: '#58A429', background: 'none', border: '1px dashed #58A429', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', marginTop: 4 }}>
                + Add Another Image URL
              </button>
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
              {rooms.map(room => (
                <div key={room._id} style={{ border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s' }}>
                  {/* Room image */}
                  <div style={{ width: '100%', height: 150, background: '#E5E7EB', position: 'relative', overflow: 'hidden' }}>
                    <img src={room.img} alt={room.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80'; }} />
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
                        <button onClick={() => handleEdit(room)} style={{ background: '#EFF6FF', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', color: '#2563EB', display: 'flex' }}><Edit2 size={13} /></button>
                        <button onClick={() => handleDelete(room._id)} style={{ background: '#FEE2E2', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', color: '#EF4444', display: 'flex' }}><Trash2 size={13} /></button>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>🛏 {room.beds}</div>
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
