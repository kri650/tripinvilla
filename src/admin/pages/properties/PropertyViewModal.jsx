import React from 'react';
import { X, MapPin, Bed, Bath, Users, IndianRupee, Clock, CheckCircle2, Home, Phone, Mail, Hash, Building2, Eye, ChevronDown, ChevronUp, Star, Shield, Calendar, Wifi, Car, Coffee, Dumbbell, Waves, Trees, ChefHat, Sparkles } from 'lucide-react';

export default function PropertyViewModal({ property, onClose, inline = false }) {
const [dynamicRooms, setDynamicRooms] = React.useState(() => []);
  const [allExperiences, setAllExperiences] = React.useState([]);
  const [showRooms, setShowRooms] = React.useState(false);

  React.useEffect(() => {
    if (property && property._id) {
      const fetchRooms = async () => {
        try {
          const token = localStorage.getItem("admin_token") || localStorage.getItem("owner_token");
          const res = await fetch(`${import.meta.env.VITE_API_BASE}/property-requests/property/${property._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setDynamicRooms(Array.isArray(data) ? data : []);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchRooms();

      const fetchExperiences = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/experiences/active`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) setAllExperiences(data);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchExperiences();
    }
  }, [property]);

  if (!property) return null;

  const name        = property.name || property.propertyName || 'Property Details';
  const city        = property.city || property.location || '';
  const type        = property.type || property.category || '';
  const status      = property.status || 'Unknown';
  const images      = Array.isArray(property.images) && property.images.length > 0
                        ? property.images
                        : (property.image ? [property.image] : []);
  const description = property.description || property.aboutProperty || '';
  const amenities   = Array.isArray(property.amenities) && property.amenities.length > 0
                        ? property.amenities
                        : (Array.isArray(property.amenityTypes) ? property.amenityTypes : []);

  // FIX 1: No hardcoded fallback — show nothing if property has no rules
  const rules       = property.rules && property.rules.trim() !== '' ? property.rules : '';

  const checkIn     = property.checkIn || '3:00 PM';
  const checkOut    = property.checkOut || '12:00 PM';
  const bedRooms    = property.bedRooms || property.bedrooms || 1;
  const bathRooms   = property.bathRooms || property.bathrooms || 1;
  const capacity    = property.capacity || property.guests || 2;
  // Compute price from rooms array if available (lowest room price)
  let computedPrice = property.price || property.price_per_night || property.bestRoomRate || 0;
  let computedOriginalPrice = property.originalPrice || 0;
  if (Array.isArray(property.rooms) && property.rooms.length > 0) {
    const roomPrices = property.rooms.map(r => Number(r.pricePerNight || r.price || 0)).filter(Boolean);
    if (roomPrices.length > 0) computedPrice = Math.min(...roomPrices);
    const roomOrigPrices = property.rooms.map(r => Number(r.originalPrice || 0)).filter(Boolean);
    if (roomOrigPrices.length > 0) computedOriginalPrice = Math.max(...roomOrigPrices);
  }
  const price       = computedPrice;
  const originalPrice = computedOriginalPrice;
  const taxAmount   = property.taxAmount || 0;

  const getOwnerName = () => {
    if (property.ownerName && property.ownerName.trim() !== '') return property.ownerName;
    if (property.owner && typeof property.owner === 'object' && property.owner.name) return property.owner.name;
    return 'Unknown';
  };
  const getOwnerPhone = () => {
    if (property.ownerContact && property.ownerContact.trim() !== '') return property.ownerContact;
    if (property.owner && typeof property.owner === 'object' && property.owner.phone) return property.owner.phone;
    return '';
  };
  const getOwnerEmail = () => {
    if (property.owner && typeof property.owner === 'object' && property.owner.email) return property.owner.email;
    return '';
  };

  const ownerName  = getOwnerName();
  const ownerPhone = getOwnerPhone();
  const ownerEmail = getOwnerEmail();
  const location   = property.location || property.full_address || city;
  const propertyNo = property.propertyNo || property._id?.toString().slice(-6).toUpperCase() || '';

  // FIX 2: Use ONLY dynamicRooms fetched by property._id — never merge with embedded property.rooms
const rooms = (Array.isArray(dynamicRooms) && dynamicRooms.length > 0)
  ? dynamicRooms
  : (Array.isArray(property.rooms) && property.rooms.length > 0 ? property.rooms : []);
  const experiences = Array.isArray(property.experiences) ? property.experiences : [];

  const parseCoordinate = (val, isLat) => {
    if (val === null || val === undefined) return null;
    let num = Number(val);
    if (isNaN(num)) return null;
    const limit = isLat ? 90 : 180;
    if (Math.abs(num) > limit) {
      let temp = num;
      while (Math.abs(temp) > limit) { temp = temp / 10; }
      num = temp;
    }
    return num;
  };

  const lat = parseCoordinate(property.latitude, true);
  const lng = parseCoordinate(property.longitude, false);
  const hasValidCoords = lat !== null && lng !== null && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && (lat !== 0 || lng !== 0);
  const latitude  = hasValidCoords ? lat : null;
  const longitude = hasValidCoords ? lng : null;

  const pill = (color, bg, text) => ({
    padding: '3px 12px', background: bg, color, fontSize: '11px',
    fontWeight: 600, borderRadius: '20px', display: 'inline-block', letterSpacing: '0.3px'
  });

  const containerStyle = inline
    ? { position: 'relative', width: '100%', background: '#fff', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginTop: '24px' }
    : { position: 'relative', width: '100%', maxWidth: '860px', maxHeight: '90vh', background: '#fff', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' };

  const content = (
    <div id={inline ? "property-detail-div" : ""} style={containerStyle}>

      {/* ── Header ── */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'linear-gradient(135deg, #F9FAFB 0%, #F0FDF4 100%)', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            {propertyNo && (
              <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, background: '#E5E7EB', padding: '2px 8px', borderRadius: '6px' }}>
                <Hash size={10} style={{ display: 'inline', marginRight: 3, transform: 'translateY(1px)' }} />{propertyNo}
              </span>
            )}
            <span style={pill(status === 'Active' ? '#059669' : '#DC2626', status === 'Active' ? '#D1FAE5' : '#FEE2E2', status)}>{status}</span>
            {type && <span style={pill('#58A429', '#E8F5E0', type)}>{type}</span>}
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>{name}</h2>
          {location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: '13px', color: '#6B7280' }}>
              <MapPin size={14} color="#58A429" /> {location}
            </div>
          )}
        </div>
        <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.04)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', flexShrink: 0, transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.background = '#E5E7EB'; }} onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}>
          <X size={18} color="#4B5563" />
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ overflowY: 'auto', padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Images gallery */}
        {images.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', flexShrink: 0, minHeight: '168px', scrollbarWidth: 'thin' }}>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img.startsWith('http') ? img : `${window.location.origin}${img}`}
                alt={`img-${idx}`}
                onError={e => { e.target.style.display = 'none'; }}
                style={{ height: '160px', width: '240px', objectFit: 'cover', borderRadius: '12px', flexShrink: 0, border: '2px solid #E5E7EB', transition: 'transform 0.2s', cursor: 'pointer' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = '#58A429'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
              />
            ))}
          </div>
        )}
        {images.length === 0 && (
          <div style={{ height: '140px', background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '13px', gap: '8px', border: '2px dashed #D1D5DB' }}>
            <Eye size={20} /> No images uploaded for this property
          </div>
        )}

        {/* Key info cards - nicer grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>

          {/* Owner */}
          {ownerName !== 'Unknown' && (
            <div style={{ padding: '16px 18px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={13} /> Owner Details</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>{ownerName}</div>
              {ownerPhone && <div style={{ fontSize: '13px', color: '#4B5563', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}><Phone size={12} color="#6B7280" />{ownerPhone}</div>}
              {ownerEmail && <div style={{ fontSize: '13px', color: '#4B5563', display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={12} color="#6B7280" />{ownerEmail}</div>}
              {!ownerPhone && !ownerEmail && (
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>—</div>
              )}
            </div>
          )}

          {/* Pricing */}
          <div style={{ padding: '16px 18px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}><IndianRupee size={13} /> Pricing</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#58A429', display: 'flex', alignItems: 'center', gap: 2 }}>
              <IndianRupee size={18} />{Number(price).toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: 2 }}>per night / room</div>
            {originalPrice > 0 && <div style={{ fontSize: '12px', color: '#9CA3AF', textDecoration: 'line-through', marginTop: 2 }}>₹{Number(originalPrice).toLocaleString()}</div>}
            {taxAmount > 0 && <div style={{ fontSize: '12px', color: '#6B7280' }}>+₹{taxAmount} tax & fees</div>}
            {price === 0 && (
              <div style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>Price not set</div>
            )}
          </div>

          {/* Timings */}
          <div style={{ padding: '16px 18px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}><Clock size={13} /> Check-In / Out</div>
            <div style={{ fontSize: '14px', color: '#111827', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Calendar size={14} color="#58A429" /> In: <strong>{checkIn}</strong>
            </div>
            <div style={{ fontSize: '14px', color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} color="#6B7280" /> Out: <strong>{checkOut}</strong>
            </div>
          </div>

          {/* Capacity */}
          <div style={{ padding: '16px 18px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}><Users size={13} /> Capacity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingBottom: '6px', borderBottom: '1px solid #E5E7EB' }}>
                <span style={{ color: '#6B7280', display: 'flex', alignItems: 'center', gap: 5 }}><Bed size={14} /> Bedrooms</span>
                <strong>{bedRooms}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingBottom: '6px', borderBottom: '1px solid #E5E7EB' }}>
                <span style={{ color: '#6B7280', display: 'flex', alignItems: 'center', gap: 5 }}><Bath size={14} /> Bathrooms</span>
                <strong>{bathRooms}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#6B7280', display: 'flex', alignItems: 'center', gap: 5 }}><Users size={14} /> Max Guests</span>
                <strong>{capacity}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {description && (
          <div style={{ background: '#F9FAFB', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 6 }}><Sparkles size={16} color="#58A429" /> About Property</h3>
            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>{description}</p>
          </div>
        )}

        {/* Amenities */}
        {amenities.length > 0 && (
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={16} color="#58A429" /> Amenities</h3>
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {amenities.map((am, i) => (
                <li key={i} style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{am}</li>
              ))}
            </ul>
          </div>
        )}
        {amenities.length === 0 && (
          <div style={{ background: '#F9FAFB', padding: '14px 18px', borderRadius: '10px', border: '1px dashed #D1D5DB', color: '#9CA3AF', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={16} /> No amenities listed for this property
          </div>
        )}

        {/* Unique Experiences */}
        {experiences.length > 0 && (
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: 6 }}><Star size={16} color="#58A429" /> Unique Experiences</h3>
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {experiences.map((exp, i) => {
                let expName = exp.experienceName || exp.name;
                if (!expName && typeof exp === 'string') {
                  const matched = allExperiences.find(x => x._id === exp || x.id === exp);
                  expName = matched ? matched.experienceName : exp;
                } else if (!expName) {
                  expName = exp;
                }
                if (expName && typeof expName === 'string' && /^[0-9a-fA-F]{24}$/.test(expName)) {
                  const matched = allExperiences.find(x => String(x._id) === expName || String(x.id) === expName);
                  if (matched) { expName = matched.experienceName; } else { return null; }
                }
                if (!expName) return null;
                return (
                  <li key={i} style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{expName}</li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Room Types */}
        {rooms.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => setShowRooms(!showRooms)}
              style={{ width: '100%', padding: '12px 18px', background: 'linear-gradient(135deg, #58A429 0%, #4A8F20 100%)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '15px', boxShadow: '0 4px 12px rgba(88,164,41,0.25)', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(88,164,41,0.35)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(88,164,41,0.25)'; }}
            >
              <Bed size={18} /> {showRooms ? <><ChevronUp size={16} /> Hide Room Details</> : <><ChevronDown size={16} /> View Room Details ({rooms.length} Room{rooms.length !== 1 ? 's' : ''})</>}
            </button>

            {showRooms && (
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {rooms.map((room, idx) => {
                  const getValid = (arr, fallback) => arr.find(v => v && String(v).trim() !== '' && String(v) !== '·') || fallback;
                  const fallbackImg = images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80';
                  const roomImg       = getValid([room.imageUrl, room.room_image_url, room.img, Array.isArray(room.room_images) ? room.room_images[0] : null, Array.isArray(room.images) ? room.images[0] : null], fallbackImg);
                  const roomTitle     = getValid([room.roomName, room.room_type, room.roomType, room.title], 'Standard Room');
                  const roomBedType   = getValid([room.bedType, room.bed_type, room.beds], 'King Size');
                  const roomGuests    = getValid([room.maxGuests, room.capacity, room.guests], 2);
                  const roomCount     = getValid([room.count, room.rooms], 1);
                  const roomPrice     = Number(getValid([room.pricePerNight, room.price_per_room, room.price], price || 0));
                  const roomAmenities = Array.isArray(room.amenities) && room.amenities.length > 0
                    ? room.amenities
                    : (Array.isArray(room.amenities_types) && room.amenities_types.length > 0
                        ? room.amenities_types
                        : (Array.isArray(room.features) && room.features.length > 0 ? room.features : amenities));

                  // FIX 3: Only show rule sections that actually have points
                  const validRules = Array.isArray(room.rules)
                    ? room.rules.filter(rule => Array.isArray(rule.points) && rule.points.length > 0)
                    : [];

                  return (
                    <div key={idx} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', gap: '16px', flexDirection: 'row', flexWrap: 'wrap' }}>
                        {roomImg && (
                          <img
                            src={roomImg}
                            alt={roomTitle}
                            onError={e => { e.target.style.display = 'none'; }}
                            style={{ width: 140, height: 100, objectFit: 'cover', borderRadius: '10px', flexShrink: 0, border: '1px solid #E5E7EB' }}
                          />
                        )}
                        <div style={{ flex: 1, minWidth: '250px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>{roomTitle}</h4>
                              <div style={{ fontSize: '13px', color: '#4B5563', marginBottom: '4px' }}>
                                {roomBedType} bed · {roomGuests} guests · {roomCount} room{(roomCount > 1 || typeof roomCount === 'string') ? 's' : ''}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '18px', fontWeight: 700, color: '#58A429' }}>
                                ₹{Number(roomPrice).toLocaleString()}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6B7280' }}>per night</div>
                            </div>
                          </div>

                          {roomAmenities.length > 0 && (
                            <div style={{ marginTop: '12px' }}>
                              <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Room Amenities</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {roomAmenities.map((am, i) => (
                                  <span key={i} style={{ padding: '4px 10px', background: '#E8F5E0', color: '#58A429', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: '1px solid #C6E6A0' }}>
                                    {am}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* FIX 3: Only render Room Rules section when validRules has content */}
                          {validRules.length > 0 && (
                            <div style={{ marginTop: '12px' }}>
                              <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Room Rules</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {validRules.map((rule, ri) => (
                                  <div key={ri} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '6px 10px', fontSize: '11px', color: '#374151' }}>
                                    <strong style={{ color: '#111827' }}>{rule.title || 'Rule'}:</strong> {rule.points.join(', ')}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Dynamic Rules (dynamicRules / ruleSections / otherDetails) */}
        {(() => {
          const validDynamicRules = (
            property.dynamicRules ||
            property.ruleSections ||
            property.otherDetails ||
            []
          ).filter(sec => sec.title && (
            (sec.text && sec.text.trim() !== '') ||
            (Array.isArray(sec.points) && sec.points.length > 0)
          ));

          if (validDynamicRules.length === 0) return null;

          return (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0' }}>Property Rules</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {validDynamicRules.map((sec, sIdx) => (
                  <div key={sIdx} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Shield size={13} color="#58A429" /> {sec.title}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {sec.text && sec.text.trim() !== '' &&
                        sec.text.split('\n')
                          .map(line => line.replace(/^[•*\-]\s*/, '').trim())
                          .filter(line => line !== '')
                          .map((line, lIdx) => (
                            <li key={lIdx} style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.6 }}>{line}</li>
                          ))
                      }
                      {Array.isArray(sec.points) && sec.points.map((point, pIdx) => (
                        <li key={pIdx} style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.6 }}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* House Rules — static string fallback, only if no dynamic rules */}
        {rules && (
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={16} color="#58A429" /> House Rules</h3>
            <div style={{ background: '#F9FAFB', padding: '14px 16px', borderRadius: '10px', color: '#4B5563', fontSize: '13px', lineHeight: 1.7, whiteSpace: 'pre-wrap', border: '1px solid #E5E7EB' }}>
              {rules}
            </div>
          </div>
        )}

        {/* Map */}
        {latitude && longitude && (
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={16} color="#58A429" /> Location Map</h3>
            <div style={{ height: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <iframe
                title="Property Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      {content}
    </div>
  );
}
