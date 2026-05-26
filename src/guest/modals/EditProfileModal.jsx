export default function EditProfileModal(props) {
  const {
    isEditProfileModalOpen,
    setIsEditProfileModalOpen,
    editProfileForm,
    setEditProfileForm,
    editProfileError,
    handleEditProfileSubmit,
  } = props;

  if (!isEditProfileModalOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={() => setIsEditProfileModalOpen(false)} style={{ zIndex: 9999 }}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', padding: '32px', borderRadius: '16px', position: 'relative' }}>
        <button className="auth-close-btn" style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', fontSize: '28px', color: '#9CA3AF', cursor: 'pointer' }} onClick={() => setIsEditProfileModalOpen(false)}>&times;</button>
        
        <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#111827', marginBottom: '20px', fontFamily: '"Outfit", sans-serif' }}>Edit Profile Details</h2>
        
        {editProfileError && (
          <div style={{ color: '#EF4444', backgroundColor: '#FEE2E2', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontWeight: 500 }}>
            {editProfileError}
          </div>
        )}

        <form onSubmit={handleEditProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Country of Citizenship</label>
              <input 
                type="text" 
                value={editProfileForm.citizenship} 
                onChange={e => setEditProfileForm({ ...editProfileForm, citizenship: e.target.value })}
                style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Country of Residence</label>
              <input 
                type="text" 
                value={editProfileForm.residence} 
                onChange={e => setEditProfileForm({ ...editProfileForm, residence: e.target.value })}
                style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Phone Number</label>
              <input 
                type="text" 
                value={editProfileForm.phone} 
                onChange={e => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>City</label>
              <input 
                type="text" 
                value={editProfileForm.city} 
                onChange={e => setEditProfileForm({ ...editProfileForm, city: e.target.value })}
                style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>State</label>
              <input 
                type="text" 
                value={editProfileForm.state} 
                onChange={e => setEditProfileForm({ ...editProfileForm, state: e.target.value })}
                style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Pin Code</label>
              <input 
                type="text" 
                value={editProfileForm.pincode} 
                onChange={e => setEditProfileForm({ ...editProfileForm, pincode: e.target.value })}
                style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Home Address</label>
            <input 
              type="text" 
              value={editProfileForm.address} 
              onChange={e => setEditProfileForm({ ...editProfileForm, address: e.target.value })}
              style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
            />
          </div>

          <div style={{ borderTop: '1px solid #E5E7EB', margin: '8px 0' }}></div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 10px 0' }}>Emergency Contact Details</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Contact Person</label>
              <input 
                type="text" 
                value={editProfileForm.emergencyName} 
                onChange={e => setEditProfileForm({ ...editProfileForm, emergencyName: e.target.value })}
                style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Phone Number</label>
              <input 
                type="text" 
                value={editProfileForm.emergencyPhone} 
                onChange={e => setEditProfileForm({ ...editProfileForm, emergencyPhone: e.target.value })}
                style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Email Address</label>
            <input 
              type="email" 
              value={editProfileForm.emergencyEmail} 
              onChange={e => setEditProfileForm({ ...editProfileForm, emergencyEmail: e.target.value })}
              style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={() => setIsEditProfileModalOpen(false)}
              style={{ padding: '10px 20px', border: '1px solid #D1D5DB', borderRadius: '8px', background: '#ffffff', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={{ padding: '10px 24px', border: 'none', borderRadius: '8px', background: '#58A429', color: '#ffffff', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
