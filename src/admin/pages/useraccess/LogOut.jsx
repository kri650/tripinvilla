import { LogOut as LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LogOut() {
  const navigate = useNavigate();
  return (
    <div className="fade-in">
      <div className="page-header"><div className="page-title">Log Out</div></div>
      <div className="content-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ width: 64, height: 64, background: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <LogOutIcon size={28} color="#EF4444" />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Confirm Logout</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>Are you sure you want to log out of the admin panel?</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
          <button className="btn btn-primary" style={{ background: '#EF4444' }} onClick={() => {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            navigate('/admin/login', { replace: true });
          }}>Yes, Log Out</button>
        </div>
      </div>
    </div>
  );
}
