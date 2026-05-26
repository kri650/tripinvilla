import { Edit2, Heart, Inbox, MessageSquare, User } from 'lucide-react';
import { profileHeroImg } from '../../../assets';
import './ProfileTab.css';

export default function ProfileTab({ user, token, setActiveMenu, openLoginModal, openEditProfileModal }) {
  return (
    <div className="account-dashboard-wrapper fade-in">
      <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${profileHeroImg}")` }}>
        <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>My Profile</h1>
      </div>

      <div className="dashboard-content-box">
        <h2 className="dashboard-section-main">My Account</h2>
        <p className="dashboard-section-sub">Manage your bookings, wishlist, and personal details here.</p>

        <div className="dashboard-capsule-nav">
          <button className="capsule-btn active" onClick={() => setActiveMenu('Profile')}><User size={15} /><span>My Account</span></button>
          <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Wishlist'); }}><Heart size={15} /><span>Wishlist</span></button>
          <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Enquiries'); }}><Inbox size={15} /><span>My Enquiries</span></button>
          <button className="capsule-btn" onClick={() => setActiveMenu('Reviews')}><MessageSquare size={15} /><span>My Reviews</span></button>
        </div>

        <div className="profile-detail-card">
          <div className="profile-card-avatar-row">
            <div className="profile-avatar-large">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="User" />
            </div>
            <div className="profile-avatar-info">
              <h3 className="profile-user-fullname">{user?.name || 'User'}</h3>
            </div>
          </div>

          <div className="profile-grid-block">
            <div className="block-header"><h4>Personal Information</h4><button className="btn-edit-details" onClick={openEditProfileModal}><Edit2 size={12} /><span>Edit</span></button></div>
            <div className="block-fields-grid">
              <div className="field-cell"><span className="field-cell-lbl">First Name</span><span className="field-cell-val">{user?.name?.split(' ')[0] || 'N/A'}</span></div>
              <div className="field-cell"><span className="field-cell-lbl">Last Name</span><span className="field-cell-val">{user?.name?.split(' ').slice(1).join(' ') || 'N/A'}</span></div>
              <div className="field-cell"><span className="field-cell-lbl">Country of Citizenship</span><span className="field-cell-val">{user?.citizenship || 'India'}</span></div>
              <div className="field-cell"><span className="field-cell-lbl">Email Address</span><span className="field-cell-val">{user?.email || 'N/A'}</span></div>
              <div className="field-cell"><span className="field-cell-lbl">Phone Number</span><span className="field-cell-val">{user?.phone || 'N/A'}</span></div>
              <div className="field-cell"><span className="field-cell-lbl">Country of Residence</span><span className="field-cell-val">{user?.residence || 'India'}</span></div>
            </div>
          </div>

          <div className="profile-grid-block">
            <div className="block-header"><h4>Address</h4><button className="btn-edit-details" onClick={openEditProfileModal}><Edit2 size={12} /><span>Edit</span></button></div>
            <div className="block-fields-grid">
              <div className="field-cell full-width"><span className="field-cell-lbl">Home Address</span><span className="field-cell-val">{user?.address || 'N/A'}</span></div>
              <div className="field-cell"><span className="field-cell-lbl">Pin Code</span><span className="field-cell-val">{user?.pincode || 'N/A'}</span></div>
              <div className="field-cell"><span className="field-cell-lbl">State</span><span className="field-cell-val">{user?.state || 'N/A'}</span></div>
              <div className="field-cell"><span className="field-cell-lbl">City</span><span className="field-cell-val">{user?.city || 'N/A'}</span></div>
            </div>
          </div>

          <div className="profile-grid-block" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div className="block-header"><h4>Other Details</h4><button className="btn-edit-details" onClick={openEditProfileModal}><Edit2 size={12} /><span>Edit</span></button></div>
            <div className="block-fields-grid">
              <div className="field-cell"><span className="field-cell-lbl">Emergency Contact Person</span><span className="field-cell-val">{user?.emergencyName || 'N/A'}</span></div>
              <div className="field-cell"><span className="field-cell-lbl">Phone Number</span><span className="field-cell-val">{user?.emergencyPhone || 'N/A'}</span></div>
              <div className="field-cell"><span className="field-cell-lbl">Email Address</span><span className="field-cell-val">{user?.emergencyEmail || 'N/A'}</span></div>
            </div>
          </div>

          {user && (user.role === 'owner' || user.role === 'admin' || user.role === 'super_admin') && (
            <div className="profile-grid-block" style={{ borderTop: '1px solid #E5E7EB', paddingTop: 20, marginTop: 20 }}>
              <div className="block-header"><h4>Dashboard Access</h4></div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                {user.role === 'owner' && (
                  <button className="btn-login" onClick={() => window.location.href = '/owner/dashboard'} style={{ background: '#58A429', color: '#FFF', fontWeight: 600, border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer' }}>
                    Go to Owner Dashboard
                  </button>
                )}
                {(user.role === 'admin' || user.role === 'super_admin') && (
                  <button className="btn-login" onClick={() => window.location.href = '/admin/dashboard'} style={{ background: '#2563EB', color: '#FFF', fontWeight: 600, border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer' }}>
                    Go to Admin Dashboard
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
