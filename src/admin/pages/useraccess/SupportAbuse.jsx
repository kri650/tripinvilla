import { useState, useEffect, useRef } from 'react';
import { Filter, Search, MoreVertical, Edit2, Trash2, X, Play, Volume2, Maximize } from 'lucide-react';

export default function SupportAbuse() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const fileInputRef = useRef(null);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/support-videos`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (err) {
      console.error('Error fetching support videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!title || !email || !videoFile) {
      alert("Please fill in all fields and select a video.");
      return;
    }
    
    setSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('email', email);
    formData.append('video', videoFile);

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/support-videos`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert("Video uploaded successfully!");
        setTitle('');
        setEmail('');
        setVideoFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchVideos();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to upload video");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading video.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/support-videos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchVideos();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ margin: '0 40px 12px' }}>
        <div style={{ fontSize: '14px', color: '#6B7280' }}>
          User Access &gt; <span style={{ color: '#111827', fontWeight: 600 }}>Support Videos</span>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="admin-table-title">Support Videos</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px solid #58A429', borderRadius: '8px', color: '#58A429', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
              <Filter size={14} /> Filter
            </button>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px' }} />
              <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '8px 12px 8px 36px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '13px', width: '200px' }} />
            </div>
            <button onClick={() => setShowAddForm(!showAddForm)} className="btn-solid-green" style={{ padding: '8px 24px', cursor: 'pointer', borderRadius: '8px', border: 'none' }}>
              Add
            </button>
          </div>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddVideo} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', alignItems: 'end', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #E5E7EB' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Title*</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Video Title" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Email*</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Author/Support Email" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Video*</label>
              <div style={{ display: 'flex', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                 <input type="text" readOnly value={videoFile ? videoFile.name : ''} placeholder="Select a video file..." style={{ flex: 1, padding: '10px 14px', border: 'none', outline: 'none', color: '#111827', minWidth: 0 }} />
                 <input type="file" accept="video/mp4,video/quicktime,video/webm" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                 <button type="button" onClick={() => fileInputRef.current?.click()} style={{ padding: '0 20px', background: '#F3F4F6', border: 'none', borderLeft: '1px solid #E5E7EB', color: '#374151', fontSize: '13px', cursor: 'pointer' }}>Browse</button>
              </div>
              <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px' }}>Supported File: .mp4 / .mov / .webm (Max 50MB)</p>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <button type="submit" disabled={submitting} className="btn-solid-green" style={{ padding: '8px 24px', opacity: submitting ? 0.7 : 1, borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                {submitting ? 'Uploading...' : 'Add Video'}
              </button>
            </div>
          </form>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ border: 'none' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #E5E7EB' }}>Titles <ChevronDown size={12} /></th>
                <th style={{ borderBottom: '1px solid #E5E7EB', textAlign: 'center' }}>Videos <ChevronDown size={12} /></th>
                <th style={{ borderBottom: '1px solid #E5E7EB' }}>Email <ChevronDown size={12} /></th>
                <th style={{ borderBottom: '1px solid #E5E7EB', textAlign: 'right' }}>Actions <ChevronDown size={12} /></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#6B7280' }}>Loading videos...</td></tr>
              ) : videos.filter(v => (v.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (v.email || '').toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#6B7280' }}>No support videos found</td></tr>
              ) : videos.filter(v => (v.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (v.email || '').toLowerCase().includes(searchQuery.toLowerCase())).map((vid, i) => (
                <tr key={vid._id || i}>
                  <td style={{ color: '#58A429', fontWeight: 500 }}>{vid.title}</td>
                  <td>
                    <div style={{ margin: '0 auto', width: '200px', height: '40px', background: '#374151', borderRadius: '20px', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px', color: 'white', cursor: 'pointer' }} onClick={() => { setActiveVideo(vid); setShowVideoModal(true); }}>
                       <div style={{ width: '0', height: '0', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid white' }}></div>
                       <span style={{ fontSize: '11px', fontWeight: 500 }}>0:00</span>
                       <div style={{ flex: 1, height: '4px', background: '#4B5563', borderRadius: '2px', overflow: 'hidden', display: 'flex' }}>
                         <div style={{ width: '40%', height: '100%', background: '#58A429' }}></div>
                       </div>
                       <Volume2 size={14} color="white" />
                       <Maximize size={12} color="white" />
                    </div>
                  </td>
                  <td>{vid.email}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
                      <button style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(vid._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Trash2 size={16} /></button>
                      <button onClick={() => { setActiveVideo(vid); setShowVideoModal(true); }} style={{ color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>View Video</button>
                      <button style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Video Overlay Modal */}
      {showVideoModal && activeVideo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowVideoModal(false)}>
          <div style={{ position: 'relative', width: '800px', height: '450px', background: '#000', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowVideoModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, color: 'white' }}
            >
              <X size={18} />
            </button>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111827' }}>
               <video 
                 src={activeVideo.videoUrl} 
                 controls 
                 autoPlay
                 style={{ width: '100%', height: '100%', objectFit: 'contain' }}
               />
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
