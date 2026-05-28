import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { authService } from '../services/api';
import ForgotPasswordModal from '../../guest/modals/ForgotPasswordModal.jsx';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPwd, setShowForgotPwd] = useState(false);

  React.useEffect(() => {
    const checkAutoLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      if (urlToken) {
        setLoading(true);
        try {
          const profileRes = await fetch(`${import.meta.env.VITE_API_BASE}/users/profile`, {
            headers: { 'Authorization': `Bearer ${urlToken}` }
          });
          if (!profileRes.ok) throw new Error('Token verification failed');
          let user = await profileRes.json();
          
          if (!['owner', 'admin', 'super_admin'].includes(user.role)) {
            const updateRes = await fetch(`${import.meta.env.VITE_API_BASE}/users/profile`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${urlToken}`
              },
              body: JSON.stringify({ role: 'owner' })
            });
            if (updateRes.ok) {
              user = await updateRes.json();
            }
          }
          
          localStorage.setItem('token', urlToken);
          localStorage.setItem('owner_user', JSON.stringify(user));
          navigate('/owner/dashboard', { replace: true });
        } catch (err) {
          console.error('Auto login failed in Login:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    checkAutoLogin();
  }, [navigate]);

  React.useEffect(() => {
    const handleOAuthMessage = async (event) => {
      const apiOrigin = new URL(import.meta.env.VITE_API_BASE || 'http://13.127.196.228:8000').origin;
      if (event.origin !== apiOrigin) return;
      if (event.data?.type === 'tripinvilla_oauth_success') {
        setLoading(true);
        try {
          const { token, user } = event.data.payload;
          let finalUser = user;
          
          if (!['owner', 'admin', 'super_admin'].includes(user.role)) {
            const updateRes = await fetch(`${import.meta.env.VITE_API_BASE}/users/profile`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ role: 'owner' })
            });
            if (updateRes.ok) {
              finalUser = await updateRes.json();
            }
          }
          
          localStorage.setItem('token', token);
          localStorage.setItem('owner_user', JSON.stringify(finalUser));
          navigate('/owner/dashboard', { replace: true });
        } catch (err) {
          console.error('OAuth owner upgrade failed:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [navigate]);

  const handleOAuthLogin = (provider) => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      `${import.meta.env.VITE_API_BASE}/auth/oauth/${provider}`,
      `${provider}_oauth`,
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.login(email, password);
      const data = res.data || {};
      const role = data?.user?.role;
      if (!data.token) throw new Error('Invalid login response');
      if (!['owner', 'admin', 'super_admin'].includes(role)) {
        alert('This account does not have owner access.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('owner_user', JSON.stringify(data.user));
      navigate('/owner/dashboard', { replace: true });
    } catch (err) {
      console.error('Owner login failed:', err);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="owner-theme fade-in" style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', boxSizing: 'border-box' }}>
      <div className="dash-section" style={{ maxWidth: 520, width: '100%', padding: 0 }}>
        <div className="chart-card" style={{ padding: 28, borderRadius: 16, border: 'none', boxShadow: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F5EE', color: '#1d9e75', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogIn size={20} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', fontFamily: '"Outfit", sans-serif' }}>Owner Login</div>
              <div style={{ fontSize: 12.5, color: '#6B7280' }}>Access the Property Owner Portal</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid-1">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setShowForgotPwd(true)}
                style={{ background: 'none', border: 'none', color: '#1d9e75', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="btn-solid-green"
              style={{ width: '100%', cursor: 'pointer', padding: '10px 18px', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            {/* Social Logins */}
            <div style={{ margin: '20px 0 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '10px' }}>
                <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Or Log In with</span>
                <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" onClick={() => handleOAuthLogin('google')} style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid #E5E7EB', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.97 1 12 1 7.35 1 3.37 3.65 1.4 7.56l3.92 3.04C6.27 7.74 8.92 5.04 12 5.04z"/><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.48c-.29 1.56-1.17 2.87-2.5 3.75v3.1h4.03c2.37-2.18 3.73-5.39 3.73-9.01z"/><path fill="#FBBC05" d="M5.32 14.6c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2L1.4 7.16C.51 8.94 0 10.91 0 13s.51 4.06 1.4 5.84l3.92-3.24z"/><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-4.03-3.1c-1.12.75-2.54 1.2-3.93 1.2-3.08 0-5.73-2.7-6.68-5.56L1.4 15.84C3.37 19.75 7.35 23 12 23z"/></svg>
                </button>
                <button type="button" onClick={() => handleOAuthLogin('facebook')} style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid #E5E7EB', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#6B7280' }}>
              Don't have an owner account? <Link to="/owner/register" style={{ color: '#1d9e75', fontWeight: 600, textDecoration: 'none' }}>Register Here</Link>
            </div>
          </form>
        </div>
      </div>
      
      <ForgotPasswordModal isOpen={showForgotPwd} onClose={() => setShowForgotPwd(false)} />
    </div>
  );
}

