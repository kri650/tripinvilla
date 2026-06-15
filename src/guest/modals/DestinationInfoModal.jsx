import React from 'react';
import { MapPin, X } from 'lucide-react';

export default function DestinationInfoModal(props) {
  const {
    activeDestinationInfo,
    setActiveDestinationInfo,
    mapDbProperties,
    allProperties,
    setSelectedProperty,
    setActiveMenu
  } = props;

  if (!activeDestinationInfo) return null;

  const isExperience = !!activeDestinationInfo.originalObj?.experienceName;
  const title = activeDestinationInfo.name;
  const description = activeDestinationInfo.originalObj?.description || 'No description available.';
  const img = activeDestinationInfo.img;

  // Filter properties by this destination/experience
  // For destination, match location/city
  // For experience, maybe it has properties? (Assuming we match by something, or just use allProperties for now with a filter if they have experience tags)
  let matchedProps = [];
  if (isExperience) {
    // Basic match by experience tag or name if available
    matchedProps = allProperties.filter(p => 
      (p.experiences || []).some(exp => 
        (typeof exp === 'string' && exp.toLowerCase() === title.toLowerCase()) || 
        (exp.experienceName && exp.experienceName.toLowerCase() === title.toLowerCase())
      )
    );
  } else {
    matchedProps = allProperties.filter(p => 
      (p.location || '').toLowerCase().includes(title.toLowerCase()) || 
      (p.city || '').toLowerCase().includes(title.toLowerCase())
    );
  }

  const displayProps = mapDbProperties(matchedProps, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 800,
        maxHeight: '90vh', overflowY: 'auto', position: 'relative'
      }}>
        <button 
          onClick={() => setActiveDestinationInfo(null)}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: '#fff', border: 'none', borderRadius: '50%',
            width: 36, height: 36, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <X size={20} color="#111827" />
        </button>

        <img src={img} alt={title} style={{ width: '100%', height: 250, objectFit: 'cover' }} />
        
        <div style={{ padding: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px', color: '#111827' }}>{title}</h2>
          <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, margin: '0 0 24px' }}>
            {description}
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: '#111827' }}>
            Available Properties ({displayProps.length})
          </h3>

          {displayProps.length === 0 ? (
            <p style={{ color: '#6B7280', fontSize: 14 }}>No properties found for this {isExperience ? 'experience' : 'destination'}.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {displayProps.map((p, idx) => (
                <div 
                  key={idx} 
                  style={{ border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                  onClick={() => {
                    setActiveDestinationInfo(null);
                    setSelectedProperty(p);
                    setActiveMenu('Detail');
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <img src={p.img} alt={p.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  <div style={{ padding: 12 }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#111827' }}>{p.title}</h4>
                    <p style={{ margin: 0, fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} /> {p.location}
                    </p>
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
