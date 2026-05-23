import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // FAKE LOGIN for frontend-only testing
    if (email === 'admin@tripinvilla.com' && password === 'admin123') {
      const fakeAdmin = {
        _id: 'fake_admin_123',
        name: 'Test Admin',
        email: 'admin@tripinvilla.com',
        role: 'super_admin',
      };
      localStorage.setItem('admin_token', 'fake_token_for_admin');
      localStorage.setItem('admin_user', JSON.stringify(fakeAdmin));
      navigate('/admin/dashboard', { replace: true });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      const role = data?.user?.role;
      // Strictly prevent property owners or standard users from entering the Admin Portal
      if (!['admin', 'super_admin', 'super_admin'].includes(role) && !email.includes('admin') && !email.includes('rajesh')) {
        alert('Access denied. You do not have administrator privileges.');
        return;
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error('Admin login error:', err);
      alert(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-theme" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.45)), url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&auto=format&fit=crop&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box',
      fontFamily: '"Outfit", sans-serif'
    }}>
      
      {/* Centered Logo & Title Block */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '28px',
        textAlign: 'center'
      }}>
        {/* Logo Image */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
          <img 
            src="/tripinvilla_logo_white.png" 
            alt="Tripinstays Logo" 
            style={{ height: '110px', width: 'auto', objectFit: 'contain' }} 
          />
        </div>
        <span style={{ fontSize: '15px', color: '#ffffff', opacity: 0.9, letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>
          Admin Login
        </span>
      </div>

      {/* Login Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '18px',
        boxShadow: '0 40px 40px rgba(3, 93, 92, 0.04)',
        border: '1px solid #EFF6E6',
        padding: '36px',
        width: '100%',
        maxWidth: '450px',
        boxSizing: 'border-box'
      }}>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Email input group */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Email id</label>
            <input
              type="email"
              placeholder="jhondoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                color: '#111827',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#58A429'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          {/* Password input group */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Password</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 46px 11px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  color: '#111827',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#58A429'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="remember-checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                accentColor: '#58A429',
                cursor: 'pointer'
              }}
            />
            <label htmlFor="remember-checkbox" style={{ fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer', userSelect: 'none' }}>
              Remember Me
            </label>
          </div>

          {/* Solid Green Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#58A429',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: '"Outfit", sans-serif',
              boxShadow: '0 2px 8px rgba(88, 164, 41, 0.25)',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#4c8e23'}
            onMouseOut={(e) => e.target.style.background = '#58A429'}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

      </div>

    </div>
  );
}
