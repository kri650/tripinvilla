import { useState, useEffect } from 'react';

export default function Account() {
  const [formData, setFormData] = useState(() => {
    let initialUser = { name: '', phone: '', email: '', city: '', avatar: '' };
    try {
      const u = localStorage.getItem('admin_user');
      if (u) initialUser = JSON.parse(u);
    } catch(e) {}
    
    return {
      firstName: initialUser.name ? initialUser.name.split(' ')[0] : '',
      lastName: initialUser.name ? initialUser.name.split(' ').slice(1).join(' ') : '',
      contactNumber: initialUser.phone || '',
      email: initialUser.email || '',
      location: initialUser.city || '',
      image: initialUser.avatar || ''
    };
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    fetch(`${import.meta.env.VITE_API_BASE}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          setFormData({
            firstName: data.name ? data.name.split(' ')[0] : '',
            lastName: data.name ? data.name.split(' ').slice(1).join(' ') : '',
            contactNumber: data.phone || '',
            email: data.email || '',
            location: data.city || '',
            image: data.avatar || ''
          });
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.contactNumber,
        email: formData.email,
        city: formData.location
      };
      
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/users/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        // Update local storage so Topbar updates instantly
        try {
          const prevStr = localStorage.getItem('admin_user');
          if (prevStr) {
            const prev = JSON.parse(prevStr);
            const newUser = { ...prev, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone, city: updatedUser.city };
            localStorage.setItem('admin_user', JSON.stringify(newUser));
          }
        } catch(e) {}
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ margin: '0 40px 12px' }}>
        <div style={{ fontSize: '14px', color: '#6B7280' }}>
           <span style={{ color: '#111827', fontWeight: 600 }}>My Profile</span>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header" style={{ marginBottom: '32px' }}>
          <h2 className="admin-table-title">My Profile</h2>
          <button className="admin-toolbar-btn add" style={{ padding: '10px 32px' }} onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>

        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>First Name*</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Last Name*</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
          </div>
          <div style={{ gridRow: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Image*</label>
            <div style={{ display: 'flex', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
               <input type="text" value={file ? file.name : (formData.image ? formData.image.split('/').pop() : 'Choose an image...')} readOnly style={{ flex: 1, padding: '10px 14px', border: 'none', outline: 'none' }} />
               <input type="file" onChange={e => e.target.files[0] && setFile(e.target.files[0])} style={{ position: 'absolute', opacity: 0, top: 0, left: 0, right: 0, bottom: 0, cursor: 'pointer' }} />
               <button type="button" style={{ padding: '0 20px', background: '#F3F4F6', border: 'none', borderLeft: '1px solid #E5E7EB', color: '#374151', fontSize: '13px', cursor: 'pointer' }}>Browse</button>
            </div>
            <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px' }}>Supported File: .jpg / max. 5mb</p>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Contact Number*</label>
            <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Email Address*</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
          </div>
          
          <div style={{ gridColumn: '3' }}>
             <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px' }}>Location*</label>
             <input type="text" name="location" value={formData.location} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
          </div>
        </form>
      </div>
    </div>
  );
}
