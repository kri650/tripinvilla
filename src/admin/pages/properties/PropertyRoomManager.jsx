import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import './RoomManager.css';

const API_BASE = import.meta.env.VITE_API_BASE;

const ROOM_TYPES = ['Deluxe Room','Super Deluxe Room','Suite','Premium Suite','Standard Room','Family Room','Studio','Penthouse','Cottage','Villa Wing','Other'];
const BED_TYPES = ['King Size','Queen Size','Twin Beds','Double Bed','Bunk Beds','Single Bed','Sofa Bed'];
const COMMON_AMENITIES = ['WiFi','AC','TV','Parking','Swimming Pool','Breakfast','Kitchen','Barbeque','Gym','Spa','Balcony','Garden View','Sea View','Mountain View','Jacuzzi','Room Service','Mini Bar','Safe','Desk','Wardrobe'];

const emptyRoom = { room_type:'', bed_type:'', price_per_room:'', original_price:'', tax_amount:'', amenities_types:[], offers:[], room_images:[''] };

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
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [roomTypesMaster, setRoomTypesMaster] = useState([]);
  const fileInputRef = React.useRef(null);

  const token = localStorage.getItem('admin_token');
  const authHeaders = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };

  const getFullUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url;
    return `${(API_BASE||'http://localhost:8000/api').replace('/api','')}${url}`;
  };

  const fetchRooms = async () => {
    if (!property?._id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/property-requests/property/${property._id}`);
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch { setRooms([]); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchRooms();
    fetch(`${API_BASE}/master/room-types`).then(r=>r.json()).then(d=>{ if(Array.isArray(d)) setRoomTypesMaster(d); }).catch(()=>{});
  }, [property?._id]);

  const toggleAmenity = (a) => setForm(p => ({ ...p, amenities_types: p.amenities_types.includes(a) ? p.amenities_types.filter(x=>x!==a) : [...p.amenities_types,a] }));
  const addOffer = () => { if(!offerInput.trim()) return; setForm(p=>({...p,offers:[...p.offers,offerInput.trim()]})); setOfferInput(''); };
  const removeOffer = (i) => setForm(p=>({...p,offers:p.offers.filter((_,j)=>j!==i)}));
  const addCustomAmenity = () => { if(!customAmenity.trim()) return; if(!form.amenities_types.includes(customAmenity.trim())) setForm(p=>({...p,amenities_types:[...p.amenities_types,customAmenity.trim()]})); setCustomAmenity(''); };
  const handleFileChange = (e) => { setNewImageFiles(p=>[...p,...Array.from(e.target.files)]); if(fileInputRef.current) fileInputRef.current.value=''; };
  const removeNewFile = (i) => setNewImageFiles(p=>p.filter((_,j)=>j!==i));
  const removeExistingImage = (i) => setForm(p=>({...p,room_images:p.room_images.filter((_,j)=>j!==i)}));
  const cancelEdit = () => { setForm(emptyRoom); setEditingId(null); setEditingIndex(null); setOfferInput(''); setNewImageFiles([]); if(fileInputRef.current) fileInputRef.current.value=''; };

  const filteredAmenities = COMMON_AMENITIES.filter(a => a.toLowerCase().includes(amenitySearch.toLowerCase()) && !form.amenities_types.includes(a));

  const handleSave = async () => {
    if (!form.room_type) { toast.error('Room Type is required'); return; }
    if (!form.price_per_room) { toast.error('Price per night is required'); return; }
    const fd = new FormData();
    fd.append('property_id', property._id);
    if (editingIndex !== null) fd.append('room_index', editingIndex);
    fd.append('room_type', form.room_type);
    fd.append('bed_type', form.bed_type);
    fd.append('price_per_room', form.price_per_room);
    if (form.original_price) fd.append('original_price', form.original_price);
    if (form.tax_amount) fd.append('tax_amount', form.tax_amount);
    fd.append('amenities_types', JSON.stringify(form.amenities_types));
    fd.append('offers', JSON.stringify(form.offers));
    fd.append('room_images', JSON.stringify(form.room_images.filter(u=>u&&u.trim())));
    newImageFiles.forEach(f => fd.append('images', f));
    const hdrs = token ? { Authorization: `Bearer ${token}` } : {};
    setSaving(true);
    try {
      const res = await fetch(
        editingId ? `${API_BASE}/property-requests/admin-direct/${editingId}` : `${API_BASE}/property-requests/admin-direct`,
        { method: editingId ? 'PUT' : 'POST', headers: hdrs, body: fd }
      );
      if (res.ok) {
        toast.success(editingId ? 'Room updated!' : 'Room added!');
        cancelEdit();
        setHasChanges(true);
        fetchRooms();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to save room');
      }
    } catch { toast.error('Network error'); }
    finally { setSaving(false); }
  };

  const handleEdit = (room, index) => {
    try {
      let imgs = [];
      const extractImgs = (arr) => Array.isArray(arr) ? arr.map(u => typeof u === 'string' ? u : u?.url || '').filter(u => u && u.trim()) : [];
      if (Array.isArray(room.images) && room.images.length > 0) imgs = extractImgs(room.images);
      else if (Array.isArray(room.room_images) && room.room_images.length > 0) imgs = extractImgs(room.room_images);
      else if (room.imageUrl || room.room_image_url) imgs = [room.imageUrl||room.room_image_url].filter(Boolean);
      
      setForm({ 
        room_type: room.title || room.room_type || room.roomName || '', 
        bed_type: room.beds || room.bed_type || room.bedType || '', 
        price_per_room: room.price || room.price_per_room || room.pricePerNight || '', 
        original_price: room.originalPrice || room.original_price || '', 
        tax_amount: room.taxAmount || room.tax_amount || '', 
        amenities_types: Array.isArray(room.features) ? room.features : (Array.isArray(room.amenities_types) ? room.amenities_types : []), 
        offers: Array.isArray(room.offers) ? room.offers : [], 
        room_images: imgs.length > 0 ? imgs : [''] 
      });
      setNewImageFiles([]);
      setEditingId(room._id || room.requestId || room.id);
      setEditingIndex(room.roomIndex !== undefined ? room.roomIndex : index);
      document.getElementById('prm-form-top')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Error in handleEdit:', err);
      toast.error('Failed to edit room data');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      const res = await fetch(`${API_BASE}/property-requests/${id}`, { method: 'DELETE', headers: authHeaders });
      if (res.ok) { toast.success('Room deleted!'); fetchRooms(); }
      else toast.error('Failed to delete room');
    } catch { toast.error('Error deleting room'); }
  };

  return (
    <div className="prm-overlay" onClick={e => e.target === e.currentTarget && onClose(hasChanges)}>
      <div className="prm-modal">

        {/* Header */}
        <div className="prm-header">
          <div>
            <h2>🏠 Room Management</h2>
            <p><strong style={{color:'#58A429'}}>{property?.propertyName||property?.name||'Property'}</strong> — manage rooms visible on detail page</p>
          </div>
          <button className="prm-close-btn" onClick={() => onClose(hasChanges)}><X size={18}/></button>
        </div>

        <div className="prm-body">

          {/* ── FORM ── */}
          <div className="prm-form-card" id="prm-form-top">
            <h3>{editingId ? '✏️ Edit Room' : '＋ Add New Room'}</h3>

            {/* Row 1 */}
            <div className="prm-grid-2">
              <div>
                <label className="prm-label">Room Type *</label>
                <select className="prm-select" value={form.room_type} onChange={e=>setForm(p=>({...p,room_type:e.target.value}))}>
                  <option value="">Select room type</option>
                  {roomTypesMaster.map(t=><option key={t._id} value={t.name}>{t.name}</option>)}
                  {roomTypesMaster.length===0 && ROOM_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                  {form.room_type && !roomTypesMaster.some(t=>t.name===form.room_type) && !ROOM_TYPES.includes(form.room_type) && <option value={form.room_type}>{form.room_type}</option>}
                </select>
              </div>
              <div>
                <label className="prm-label">Bed Type</label>
                <select className="prm-select" value={form.bed_type} onChange={e=>setForm(p=>({...p,bed_type:e.target.value}))}>
                  <option value="">Select bed type</option>
                  {BED_TYPES.map(b=><option key={b} value={b}>{b}</option>)}
                  {form.bed_type && !BED_TYPES.includes(form.bed_type) && <option value={form.bed_type}>{form.bed_type}</option>}
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="prm-grid-3">
              <div>
                <label className="prm-label">Price / Night (₹) *</label>
                <input className="prm-input" type="number" value={form.price_per_room} onChange={e=>setForm(p=>({...p,price_per_room:e.target.value}))} placeholder="e.g. 4500"/>
              </div>
              <div>
                <label className="prm-label">Original Price (₹)</label>
                <input className="prm-input" type="number" value={form.original_price} onChange={e=>setForm(p=>({...p,original_price:e.target.value}))} placeholder="e.g. 6000"/>
              </div>
              <div>
                <label className="prm-label">Tax Amount (₹)</label>
                <input className="prm-input" type="number" value={form.tax_amount} onChange={e=>setForm(p=>({...p,tax_amount:e.target.value}))} placeholder="e.g. 500"/>
              </div>
            </div>

            {/* Images */}
            <div className="prm-section">
              <label className="prm-label">Room Images</label>
              <div className="prm-images-grid">
                {form.room_images.filter(u=>u&&u.trim()).map((url,idx)=>(
                  <div key={`e-${idx}`} className="prm-img-thumb">
                    <img src={getFullUrl(url)} alt="" onError={e=>{e.target.src='https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&q=60';}}/>
                    <button className="prm-img-remove" type="button" onClick={()=>removeExistingImage(idx)}>×</button>
                  </div>
                ))}
                {newImageFiles.map((file,idx)=>(
                  <div key={`n-${idx}`} className="prm-img-thumb">
                    <img src={URL.createObjectURL(file)} alt=""/>
                    <span className="new-badge">New</span>
                    <button className="prm-img-remove" type="button" onClick={()=>removeNewFile(idx)}>×</button>
                  </div>
                ))}
                <div className="prm-add-img-btn" onClick={()=>fileInputRef.current&&fileInputRef.current.click()}>
                  <Plus size={20} color="#9CA3AF"/>
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple hidden accept="image/*"/>
              {editingId && <p style={{fontSize:11,color:'#6B7280',margin:'6px 0 0'}}>✏️ Editing — existing images shown. Add new ones with +</p>}
            </div>

            {/* Amenities */}
            <div className="prm-section">
              <label className="prm-label">Room Amenities</label>
              {form.amenities_types.length > 0 && (
                <div className="prm-tags" style={{marginBottom:10}}>
                  {form.amenities_types.map(a=>(
                    <span key={a} className="prm-amenity-tag">{a}<button onClick={()=>toggleAmenity(a)}>×</button></span>
                  ))}
                </div>
              )}
              <div className="prm-input-row">
                <input className="prm-input" type="text" placeholder="Search amenities..." value={amenitySearch} onChange={e=>setAmenitySearch(e.target.value)}/>
                <input className="prm-input" type="text" placeholder="Add custom..." value={customAmenity} onChange={e=>setCustomAmenity(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addCustomAmenity())}/>
                <button className="prm-btn-add" type="button" onClick={addCustomAmenity}>Add</button>
              </div>
              <div className="prm-tags" style={{marginTop:8}}>
                {filteredAmenities.slice(0,12).map(a=>(
                  <button key={a} className="prm-amenity-pill" type="button" onClick={()=>toggleAmenity(a)}>+ {a}</button>
                ))}
              </div>
            </div>

            {/* Offers */}
            <div className="prm-section">
              <label className="prm-label">Offers / Inclusions</label>
              <div className="prm-input-row">
                <input className="prm-input" type="text" placeholder="e.g. Free breakfast included" value={offerInput} onChange={e=>setOfferInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addOffer())}/>
                <button className="prm-btn-add" type="button" onClick={addOffer}>Add</button>
              </div>
              <div className="prm-tags" style={{marginTop:8}}>
                {form.offers.map((o,idx)=>(
                  <span key={idx} className="prm-offer-tag">✓ {o}<button onClick={()=>removeOffer(idx)}>×</button></span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:4}}>
              <button className="prm-btn-primary" type="button" onClick={handleSave} disabled={saving}>
                <Check size={15}/>{saving ? 'Saving...' : editingId ? 'Update Room' : 'Add Room'}
              </button>
              {editingId && <button className="prm-btn-secondary" type="button" onClick={cancelEdit}>Cancel</button>}
            </div>
          </div>

          {/* ── ROOMS LIST ── */}
          <div className="prm-rooms-section">
            <h3>Existing Rooms <span style={{background:'#F0FDF4',color:'#15803D',borderRadius:20,padding:'2px 10px',fontSize:12,fontWeight:700}}>{rooms.length}</span></h3>

            {loading ? (
              <div className="prm-empty"><p>⏳ Loading rooms...</p></div>
            ) : rooms.length === 0 ? (
              <div className="prm-empty">
                <p style={{fontSize:28,marginBottom:8}}>🛏️</p>
                <p>No rooms added yet. Add your first room above.</p>
              </div>
            ) : (
              <div className="prm-rooms-grid">
                {rooms.map((room, i) => (
                  <div key={room._id} className="prm-room-card">
                    <div className="prm-room-img">
                      <img src={getFullUrl(room.img)} alt={room.title} onError={e=>{e.target.src='https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=70';}}/>
                      {room.images && room.images.length > 1 && <span className="more-badge">+{room.images.length-1} more</span>}
                    </div>
                    <div className="prm-room-body">
                      <div className="prm-room-header">
                        <h4>{room.title}</h4>
                        <div className="prm-room-actions">
                          <button className="prm-btn-edit" onClick={()=>handleEdit(room,i)}><Edit2 size={13}/></button>
                          <button className="prm-btn-del" onClick={()=>handleDelete(room._id)}><Trash2 size={13}/></button>
                        </div>
                      </div>
                      <div className="prm-room-meta">
                        <span>🛏 {room.beds}</span>
                        <span>· {room.guests||'2 Guests'}</span>
                        <span>· {room.rooms||'1 Room'}</span>
                      </div>
                      <div style={{marginBottom:8}}>
                        <span className="prm-room-price">₹{Number(room.price).toLocaleString()}</span>
                        {room.originalPrice && <span className="prm-room-orig">₹{Number(room.originalPrice).toLocaleString()}</span>}
                        <span className="prm-room-per">/night</span>
                      </div>
                      {room.features && room.features.length > 0 && (
                        <div className="prm-tags">
                          {room.features.slice(0,3).map((f,j)=><span key={j} className="prm-feature-tag">{f}</span>)}
                          {room.features.length>3 && <span style={{fontSize:10,color:'#6B7280'}}>+{room.features.length-3}</span>}
                        </div>
                      )}
                      {room.offers && room.offers.length > 0 && (
                        <div className="prm-offer-display">✓ {room.offers[0]}{room.offers.length>1?` & ${room.offers.length-1} more`:''}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
