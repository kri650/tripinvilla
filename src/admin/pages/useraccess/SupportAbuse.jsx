import { useState } from 'react';
import { Filter, Search, MoreVertical, Edit2, Trash2, X, Play } from 'lucide-react';

export default function SupportAbuse() {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const videos = [
    { title: 'Admin Guide Videos', email: 'rahul@gmail.com' },
  ];

  return (
    <div className="fade-in">
      <div className="page-header" style={{ margin: '0 40px 12px' }}>
        <div style={{ fontSize: '14px', color: '#6B7280' }}>
          User Access &gt; <span style={{ color: '#111827', fontWeight: 600 }}>Support Videos</span>
        </div>
      </div>

      {/* Add Video Form Card */}
      <div className="admin-table-card" style={{ marginBottom: '24px' }}>
        <div className="admin-table-header" style={{ marginBottom: '24px' }}>
          <h2 className="admin-table-title">Support Videos</h2>
          <button className="admin-toolbar-btn add" style={{ padding: '8px 24px' }}>
            Add Video
          </button>
        </div>

        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Title*</label>
            <input type="text" defaultValue="Aparhotel Stare Miasto, Deluxe" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Email*</label>
            <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#111827' }}>
              <option>Homestay</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Video*</label>
            <div style={{ display: 'flex', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
               <input type="text" defaultValue="vdo.mp4" style={{ flex: 1, padding: '10px 14px', border: 'none', outline: 'none', color: '#111827' }} />
               <button type="button" style={{ padding: '0 20px', background: '#F3F4F6', border: 'none', borderLeft: '1px solid #E5E7EB', color: '#374151', fontSize: '13px', cursor: 'pointer' }}>Browse</button>
            </div>
            <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px' }}>Supported File: .mp4 / hd. 20mb</p>
          </div>
        </form>
      </div>

      {/* Videos Table Card */}
      <div className="admin-table-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ border: 'none' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #E5E7EB' }}>Title <ChevronDown size={12} /></th>
                <th style={{ borderBottom: '1px solid #E5E7EB' }}>Email <ChevronDown size={12} /></th>
                <th style={{ borderBottom: '1px solid #E5E7EB', textAlign: 'center' }}>Video <ChevronDown size={12} /></th>
                <th style={{ borderBottom: '1px solid #E5E7EB', textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {videos.map((vid, i) => (
                <tr key={i}>
                  <td style={{ color: '#58A429', fontWeight: 500 }}>{vid.title}</td>
                  <td>{vid.email}</td>
                  <td>
                    <div style={{ margin: '0 auto', width: '180px', height: '40px', background: '#4B5563', borderRadius: '20px', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '8px', color: 'white', cursor: 'pointer' }} onClick={() => setShowVideoModal(true)}>
                       <div style={{ width: '0', height: '0', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid white' }}></div>
                       <span style={{ fontSize: '11px', flex: 1 }}>0:00</span>
                       <div style={{ width: '40px', height: '4px', background: '#58A429', borderRadius: '2px' }}></div>
                       <MoreVertical size={14} color="white" />
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                      <button style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={16} /></button>
                      <button style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      <button className="admin-action-dots"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Video Overlay Modal */}
      {showVideoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ position: 'relative', width: '800px', height: '450px', background: '#000', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <button 
              onClick={() => setShowVideoModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, color: 'white' }}
            >
              <X size={18} />
            </button>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111827' }}>
               {/* Mock Video Player */}
               <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
               <button style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5, backdropFilter: 'blur(4px)' }}>
                 <Play size={24} color="white" style={{ marginLeft: '4px' }} />
               </button>
               {/* Custom Video Controls Bar */}
               <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }}>
                   <div style={{ width: '30%', height: '100%', background: '#58A429', borderRadius: '2px' }}></div>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Play size={16} />
                      <span>0:00 / 3:45</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple ChevronDown component for headers
function ChevronDown({ size }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
