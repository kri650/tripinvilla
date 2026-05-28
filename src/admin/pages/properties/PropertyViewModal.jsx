import React from 'react';
import { X, MapPin, Bed, Bath, Users, IndianRupee, Clock, CheckCircle2, Star } from 'lucide-react';

export default function PropertyViewModal({ property, onClose }) {
  if (!property) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '800px', maxHeight: '90vh', background: '#fff', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#111827' }}>{property.name || property.propertyName || 'Property Details'}</h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14}/> {property.city || property.location}</span>
              <span style={{ padding: '2px 8px', background: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: 600, borderRadius: '12px' }}>{property.type || property.category}</span>
              <span style={{ padding: '2px 8px', background: property.status === 'Active' ? '#ECFDF5' : '#FEF2F2', color: property.status === 'Active' ? '#059669' : '#DC2626', fontSize: '11px', fontWeight: 600, borderRadius: '12px' }}>{property.status}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex' }} onMouseOver={e => e.currentTarget.style.background = '#E5E7EB'} onMouseOut={e => e.currentTarget.style.background = 'none'}>
            <X size={20} color="#4B5563" />
          </button>
        </div>

        {/* Content */}
        <div style={{ overflowY: 'auto', padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Images */}
          {(property.images?.length > 0 || property.image) && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px' }}>
              {(property.images || [property.image]).map((img, idx) => (
                <img key={idx} src={img} alt="" style={{ height: '160px', width: '240px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
              ))}
            </div>
          )}

          {/* Key Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', background: '#F3F4F6', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Owner Details</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{property.ownerName || 'Unknown'}</div>
              <div style={{ fontSize: '13px', color: '#4B5563' }}>{property.ownerContact || 'No contact'}</div>
            </div>
            <div style={{ padding: '16px', background: '#F3F4F6', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Pricing</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#58A429', display: 'flex', alignItems: 'center' }}>
                <IndianRupee size={16} /> {(property.price_per_night || property.price || property.propertyPrice || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>per night / room</div>
            </div>
            <div style={{ padding: '16px', background: '#F3F4F6', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Timings</div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14}/> In: {property.checkIn || '3:00 PM'}</div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}><Clock size={14}/> Out: {property.checkOut || '12:00 PM'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>About Property</h3>
              <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>
                {property.description || property.aboutProperty || 'No description provided.'}
              </p>
            </div>
            
            <div style={{ flex: '1 1 250px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Capacities & Areas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}><Bed size={14}/> Bedrooms</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{property.bedRooms || property.rooms || 1}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14}/> Max Capacity</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{property.capacity || 2} guests</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}><Bath size={14}/> Bathrooms</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{property.bathRooms || 1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities & Experiences */}
          {(property.amenities?.length > 0 || property.amenityTypes?.length > 0) && (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Amenities</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(property.amenities || property.amenityTypes).map((am, i) => (
                  <span key={i} style={{ padding: '4px 10px', background: '#F3F4F6', color: '#374151', borderRadius: '16px', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} color="#58A429" /> {am}
                  </span>
                ))}
              </div>
            </div>
          )}

          {property.rules && (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>House Rules</h3>
              <div style={{ background: '#FEF2F2', padding: '16px', borderRadius: '8px', color: '#991B1B', fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {property.rules}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
