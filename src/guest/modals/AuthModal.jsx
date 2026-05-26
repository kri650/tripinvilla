import { Eye, EyeOff } from 'lucide-react';
import { loginLeftImg } from '../../assets';

export default function AuthModal(props) {
  const {
    authModalOpen,
    setAuthModalOpen,
    authMode,
    setAuthMode,
    showPassword,
    setShowPassword,
    token,
    authLoading,
    handleOAuthLogin,
    handleSignupSubmit,
    handleLoginSubmit,
    signupFirstName, setSignupFirstName,
    signupLastName, setSignupLastName,
    signupEmail, setSignupEmail,
    signupPassword, setSignupPassword,
    signupPhone, setSignupPhone,
    signupResidence, setSignupResidence,
    signupAddress, setSignupAddress,
    signupPincode, setSignupPincode,
    signupState, setSignupState,
    loginEmail, setLoginEmail,
    loginPassword, setLoginPassword,
  } = props;

  if (!authModalOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={() => setAuthModalOpen(false)}>
      <div 
        className={`auth-modal-card ${authMode === 'login' ? 'login-split-card' : ''}`} 
        style={authMode === 'login' ? { position: 'relative' } : { position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="auth-close-btn" style={{ position: 'absolute', top: '24px', right: '28px', background: 'none', border: 'none', fontSize: '30px', color: '#9CA3AF', cursor: 'pointer', zIndex: 100 }} onClick={() => setAuthModalOpen(false)}>&times;</button>
        
        {authMode === 'signup' ? (
          <div className="auth-signup-content fade-in" style={{ width: '100%', boxSizing: 'border-box' }}>
            
            <h2 className="auth-modal-title" style={{ textAlign: 'center', fontFamily: "'Lato', sans-serif", fontSize: '32px', fontWeight: '500', color: '#111827', lineHeight: '1.35', marginBottom: '32px' }}>
              Sign Up To <br />Find Your <span style={{ backgroundColor: '#0066ff', color: '#FFFFFF', padding: '2px 14px', borderRadius: '0px', display: 'inline-block', fontWeight: '700' }}>Perfect Stay</span>
            </h2>
            
            <form onSubmit={handleSignupSubmit} className="auth-signup-form" autoComplete="off">
              <div className="auth-form-grid-3x3">
                <div className="auth-form-group">
                  <label className="auth-input-label">First Name*</label>
                  <input type="text" className="auth-input-field" placeholder="Your first name" value={signupFirstName} onChange={(e) => setSignupFirstName(e.target.value)} required autoComplete="off" />
                </div>
                <div className="auth-form-group">
                  <label className="auth-input-label">Last Name*</label>
                  <input type="text" className="auth-input-field" placeholder="Your surname" value={signupLastName} onChange={(e) => setSignupLastName(e.target.value)} required autoComplete="off" />
                </div>
                <div className="auth-form-group">
                  <label className="auth-input-label">Choose Password*</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPassword ? "text" : "password"} className="auth-input-field" placeholder="Minimum 8 characters" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required autoComplete="off" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div className="auth-form-group">
                  <label className="auth-input-label">Email Address*</label>
                  <input type="email" className="auth-input-field" placeholder="name@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required autoComplete="off" />
                </div>
                <div className="auth-form-group">
                  <label className="auth-input-label">Phone Number*</label>
                  <input type="tel" className="auth-input-field" placeholder="Enter your phone number" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} required autoComplete="off" />
                </div>
                <div className="auth-form-group">
                  <label className="auth-input-label">Country of Residence*</label>
                  <input type="text" className="auth-input-field" placeholder="Select your country" value={signupResidence} onChange={(e) => setSignupResidence(e.target.value)} required autoComplete="off" />
                </div>
                
                <div className="auth-form-group">
                  <label className="auth-input-label">Address*</label>
                  <input type="text" className="auth-input-field" placeholder="Apartment, street, city" value={signupAddress} onChange={(e) => setSignupAddress(e.target.value)} required autoComplete="off" />
                </div>
                <div className="auth-form-group">
                  <label className="auth-input-label">Pin Code*</label>
                  <input type="text" className="auth-input-field" placeholder="Enter postal code" value={signupPincode} onChange={(e) => setSignupPincode(e.target.value)} required autoComplete="off" />
                </div>
                <div className="auth-form-group">
                  <label className="auth-input-label">State*</label>
                  <input type="text" className="auth-input-field" placeholder="Select your state" value={signupState} onChange={(e) => setSignupState(e.target.value)} required autoComplete="off" />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn-green" style={{ width: '100%', borderRadius: '15px', fontSize: '16px', fontWeight: '600', backgroundColor: '#58A429', color: '#FFFFFF', border: 'none', cursor: 'pointer', marginTop: '8px', height: '48px', transition: 'background-color 0.2s' }}>{authLoading ? 'Registering...' : 'Continue'}</button>
            </form>

            {/* Dotted separator line */}
            <div style={{ width: '100%', borderTop: '1px dotted #D1D5DB', margin: '24px 0 12px 0' }}></div>

            {/* Dashed divider */}
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '12px 0 24px 0' }}>
              <div style={{ flex: 1, borderTop: '1px dotted #D1D5DB' }}></div>
              <span style={{ padding: '0 16px', fontSize: '13px', color: '#9CA3AF' }}>Or Sign Up with</span>
              <div style={{ flex: 1, borderTop: '1px dotted #D1D5DB' }}></div>
            </div>

            {/* Official Brand square social items */}
            <div className="auth-social-row" style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginBottom: '24px' }}>
              <button style={{ background: '#f4f6f8', border: 'none', borderRadius: '10px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.2s' }} onClick={() => handleOAuthLogin('google')}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button style={{ background: '#f4f6f8', border: 'none', borderRadius: '10px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.2s' }} onClick={() => handleOAuthLogin('facebook')}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>

            <div className="auth-footer-links" style={{ textAlign: 'center' }}>
              <p className="auth-switch-text" style={{ fontSize: '14px', color: '#4B5563', margin: '6px 0' }}>
                Already have an account? <span className="auth-link-green" style={{ color: '#58A429', fontWeight: '600', cursor: 'pointer', textDecoration: 'none' }} onClick={() => setAuthMode('login')}>Log In</span>
              </p>
              <p className="auth-switch-text" style={{ fontSize: '14px', color: '#4B5563', margin: '6px 0' }}>
                <span className="auth-link-owner" style={{ color: '#58A429', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { window.location.href = token ? `/owner/login?token=${token}` : '/owner/login'; setAuthModalOpen(false); }}>Log In as a Property Owner</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="auth-login-split-container fade-in" style={{ display: 'flex', width: '100%', height: '100%', flex: 1 }}>
            {/* Left side scenic Sunset pool image with clean CSS Glassmorphism Box */}
            <div className="auth-login-left-image" style={{ width: '550px', flexShrink: 0, height: '100%', display: 'block', overflow: 'hidden', position: 'relative' }}>
              <img src={loginLeftImg} alt="Sign In / Sign Up" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', borderRadius: '0', transform: 'scale(1.15)' }} />
            </div>

            {/* Right side Log In form fields */}
            <div className="auth-login-right-content" style={{ flex: 1, padding: '50px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box', position: 'relative' }}>
              
              <h2 className="auth-modal-title login-title-align" style={{ fontFamily: "'Lato', sans-serif", fontSize: '24px', fontWeight: '400', color: '#374151', lineHeight: '1.4', marginBottom: '24px' }}>
                Log In Your Account To <br />Find Your <span style={{ backgroundColor: '#0066FF', color: '#FFFFFF', padding: '2px 10px', borderRadius: '4px', marginLeft: '6px', fontWeight: '700', display: 'inline-block' }}>Perfect Stay</span>
              </h2>
              
              <form onSubmit={handleLoginSubmit} className="auth-login-form" autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="auth-form-group full-width">
                  <label className="auth-input-label">Email Address*</label>
                  <input type="text" className="auth-input-field" placeholder="jhondoe@gmail.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required autoComplete="off" />
                </div>

                <div className="auth-form-group full-width">
                  <label className="auth-input-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Password*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPassword ? "text" : "password"} className="auth-input-field" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required autoComplete="off" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn-green" style={{ width: '100%', borderRadius: '8px', fontSize: '15px', fontWeight: '600', backgroundColor: '#58A429', color: '#FFFFFF', border: 'none', cursor: 'pointer', height: '46px', transition: 'background-color 0.2s', marginTop: '12px' }}>
                  {authLoading ? 'Logging In...' : 'Continue'}
                </button>
              </form>

              {/* Dotted separator line */}
              <div style={{ width: '100%', borderTop: '1px dotted #D1D5DB', margin: '24px 0 8px 0' }}></div>

              {/* Dashed divider */}
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '20px 0' }}>
                <div style={{ flex: 1, borderTop: '1px dotted #D1D5DB' }}></div>
                <span style={{ padding: '0 16px', fontSize: '13px', color: '#9CA3AF' }}>Or Sign In with</span>
                <div style={{ flex: 1, borderTop: '1px dotted #D1D5DB' }}></div>
              </div>

              <div className="auth-social-row" style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '8px' }}>
                <button style={{ background: '#F3F4F6', border: 'none', borderRadius: '8px', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.2s' }} onClick={() => handleOAuthLogin('google')}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
                <button style={{ background: '#F3F4F6', border: 'none', borderRadius: '8px', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.2s' }} onClick={() => handleOAuthLogin('facebook')}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>

              <div className="auth-footer-links">
                <p className="auth-switch-text">
                  Don't have an account? <span className="auth-link-green" style={{ color: '#58A429', fontWeight: '600', cursor: 'pointer', textDecoration: 'none' }} onClick={() => setAuthMode('signup')}>Sign Up</span>
                </p>
                <p className="auth-switch-text">
                  <span className="auth-link-owner" style={{ color: '#58A429', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { window.location.href = token ? `/owner/login?token=${token}` : '/owner/login'; setAuthModalOpen(false); }}>Log in as a Property Owner</span>
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
