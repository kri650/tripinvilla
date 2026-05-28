import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './styles/ForgotPasswordModal.css';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      setMessage(data.message || 'OTP sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      setError('Please fill all fields.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      setMessage('Password reset successfully! You can now login.');
      setTimeout(() => {
        onClose();
        setStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
        setMessage('');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content forgot-pwd-modal">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ marginBottom: '16px', fontFamily: '"Outfit", sans-serif' }}>Reset Password</h2>
        
        {error && <div style={{ color: '#EF4444', marginBottom: '12px', fontSize: '14px' }}>{error}</div>}
        {message && <div style={{ color: '#10B981', marginBottom: '12px', fontSize: '14px' }}>{message}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '14px', color: '#4B5563', margin: 0 }}>
              Enter your email address and we'll send you a 6-digit OTP to reset your password.
            </p>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }}
                required
              />
            </div>
            <button type="submit" disabled={loading} style={{ background: '#58A429', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '14px', color: '#4B5563', margin: 0 }}>
              Enter the OTP sent to <strong>{email}</strong> and your new password.
            </p>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>6-Digit OTP</label>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box', letterSpacing: '4px', fontSize: '18px', textAlign: 'center' }}
                maxLength={6}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }}
                required
              />
            </div>
            <button type="submit" disabled={loading} style={{ background: '#58A429', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button type="button" onClick={() => setStep(1)} style={{ background: 'transparent', color: '#6B7280', border: 'none', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
              Back to Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
