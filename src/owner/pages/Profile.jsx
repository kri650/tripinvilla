import React, { useState, useEffect } from 'react';
import { userService, propertyService } from '../services/api';
import ImageCropper from '../../components/ImageCropper';

export default function Profile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    pan: '',
    bank: '',
    accountNum: '',
    ifsc: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    avatar: ''
  });
  
  const [file, setFile] = useState(null);
  const [cropFile, setCropFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getProfile();
        const data = res.data;
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          company: data.company || '',
          pan: data.pan || '',
          bank: data.bank || '',
          accountNum: data.accountNum || '',
          ifsc: data.ifsc || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          avatar: data.avatar || ''
        });
        setIsPremium(data.isPremium === true);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      let avatarUrl = formData.avatar;
      
      // Upload image if selected
      if (file) {
        const uploadData = new FormData();
        uploadData.append('images', file);
        const uploadRes = await propertyService.uploadImages(uploadData);
        if (uploadRes.data && uploadRes.data.urls && uploadRes.data.urls.length > 0) {
          avatarUrl = uploadRes.data.urls[0];
        }
      }

      const payload = { ...formData, avatar: avatarUrl };
      await userService.updateProfile(payload);
      
      // Update local storage so Topbar updates instantly
      try {
        const prevStr = localStorage.getItem('owner_user');
        if (prevStr) {
          const prev = JSON.parse(prevStr);
          const newUser = { ...prev, name: payload.name, email: payload.email, avatar: payload.avatar };
          localStorage.setItem('owner_user', JSON.stringify(newUser));
        }
      } catch(err) {}

      setFormData(prev => ({ ...prev, avatar: avatarUrl }));
      setFile(null);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading profile...</div>;

  const getAvatarUrl = (av) => {
    if (!av) return '';
    if (av.startsWith('http') || av.startsWith('data:')) return av;
    const base = (import.meta.env.VITE_API_BASE || 'http://localhost:8000/api').replace('/api', '');
    return `${base}/uploads/${av}`;
  };

  const displayImage = file ? URL.createObjectURL(file) : getAvatarUrl(formData.avatar);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ fontSize: '14px', color: '#6B7280' }}>
           <span style={{ color: '#111827', fontWeight: 600 }}>My Profile</span>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', margin: '0 24px 24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>My Profile</h2>
          <button 
            style={{ padding: '10px 32px', background: '#58A429', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }} 
            onClick={handleUpdate} 
            disabled={saving}
          >
            {saving ? 'Updating...' : 'Update'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap-reverse' }}>
          
          <form style={{ flex: '1 1 300px', minWidth: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px', fontWeight: 500 }}>Owner Name*</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px', fontWeight: 500 }}>Company Name</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div style={{ gridRow: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px', fontWeight: 500 }}>Profile Image</label>
              <div style={{ display: 'flex', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                 <input type="text" value={file ? file.name : (formData.avatar ? 'Image Uploaded' : 'Choose an image...')} readOnly style={{ flex: 1, padding: '10px 14px', border: 'none', outline: 'none', fontSize: '13px' }} />
                 <input type="file" accept="image/*" onChange={e => {
                   if (e.target.files[0]) setCropFile(e.target.files[0]);
                   e.target.value = null;
                 }} style={{ position: 'absolute', opacity: 0, top: 0, left: 0, right: 0, bottom: 0, cursor: 'pointer' }} />
                 <button type="button" style={{ padding: '0 20px', background: '#F3F4F6', border: 'none', borderLeft: '1px solid #E5E7EB', color: '#374151', fontSize: '13px', cursor: 'pointer' }}>Browse</button>
              </div>
              <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px' }}>Supported File: .jpg, .png / max. 5mb</p>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px', fontWeight: 500 }}>Contact Number*</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px', fontWeight: 500 }}>Email Address*</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none' }} />
            </div>

            <div style={{ gridColumn: 'span 3', height: '1px', background: '#E5E7EB', margin: '8px 0' }} />

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px', fontWeight: 500 }}>PAN Number</label>
              <input type="text" name="pan" value={formData.pan} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px', fontWeight: 500 }}>Street Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px', fontWeight: 500 }}>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px', fontWeight: 500 }}>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4B5563', marginBottom: '8px', fontWeight: 500 }}>Pincode</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none' }} />
            </div>

          </form>

          {/* Right Side Avatar Display */}
          <div style={{ flex: '1 1 250px', maxWidth: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#F9FAFB', padding: '32px 20px', borderRadius: '12px', border: '1px solid #F3F4F6', margin: '0 auto' }}>
            <div style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1d9e75, #157a5a)',
              color: '#ffffff',
              fontSize: 36,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              boxShadow: '0 8px 16px -4px rgba(29, 158, 117, 0.4)',
              overflow: 'hidden'
            }}>
              {displayImage ? (
                <img src={displayImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                formData.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'
              )}
            </div>
            
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>{formData.name || 'Owner'}</h3>
            <span style={{ fontSize: 12, color: isPremium ? '#1d9e75' : '#9ca3af', fontWeight: 600, textTransform: 'uppercase', marginTop: 8, padding: '4px 12px', background: isPremium ? '#dcfce7' : '#f3f4f6', borderRadius: '20px' }}>
              {isPremium ? 'Premium Host' : 'Normal Host'}
            </span>
          </div>

        </div>
      </div>
      
      {cropFile && (
        <ImageCropper
          file={cropFile}
          onApply={(croppedFile) => {
            setFile(croppedFile);
            setCropFile(null);
          }}
          onCancel={() => setCropFile(null)}
          shape="circle"
        />
      )}
    </div>
  );
}
