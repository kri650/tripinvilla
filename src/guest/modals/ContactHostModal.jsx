export default function ContactHostModal(props) {
  const {
    contactModalOpen,
    setContactModalOpen,
    contactStep,
    contactOTP,
    setContactOTP,
    otpLoading,
    otpError,
    otpChannel,
    resendTimer,
    enquiryFirstName, setEnquiryFirstName,
    enquiryLastName, setEnquiryLastName,
    enquiryEmail, setEnquiryEmail,
    enquiryPhone, setEnquiryPhone,
    handleSendOTP,
    handleVerifyOTP,
  } = props;

  if (!contactModalOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={() => setContactModalOpen(false)}>
      <div className="auth-modal-card contact-modal-card-size" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={() => setContactModalOpen(false)}>&times;</button>
        
        {contactStep === 1 ? (
          <div className="contact-form-content fade-in">
            <h2 className="auth-modal-title">
              View Contact <span className="highlight-sharp-blue-box">Number</span>
            </h2>
            
            {otpError && (
              <div style={{ color: '#EF4444', backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: '500', marginBottom: '16px', border: '1px solid #FEE2E2', textAlign: 'center' }}>
                {otpError}
              </div>
            )}
            
            <form onSubmit={handleSendOTP} className="contact-info-form">
              <div className="contact-form-grid-2x2">
                <div className="auth-form-group">
                  <label className="auth-input-label">First Name*</label>
                  <input type="text" className="auth-input-field" placeholder="Add First Name" value={enquiryFirstName} onChange={(e) => setEnquiryFirstName(e.target.value)} required />
                </div>
                <div className="auth-form-group">
                  <label className="auth-input-label">Last Name*</label>
                  <input type="text" className="auth-input-field" placeholder="Add Last Name" value={enquiryLastName} onChange={(e) => setEnquiryLastName(e.target.value)} required />
                </div>
                <div className="auth-form-group">
                  <label className="auth-input-label">Email Address*</label>
                  <input type="email" className="auth-input-field" placeholder="Add Email Address" value={enquiryEmail} onChange={(e) => setEnquiryEmail(e.target.value)} required />
                </div>
                <div className="auth-form-group">
                  <label className="auth-input-label">Phone Number*</label>
                  <input type="tel" className="auth-input-field" placeholder="Add Phone Number" value={enquiryPhone} onChange={(e) => setEnquiryPhone(e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn-green mt-36" disabled={otpLoading}>
                {otpLoading ? 'Requesting Code...' : 'Verify & View Contact Number'}
              </button>
            </form>
          </div>
        ) : (
          <div className="contact-otp-content fade-in">
            <h2 className="auth-modal-title">
              Request Contact <span className="highlight-sharp-blue-box">Number</span>
            </h2>
            
            <p className="otp-sub-banner-text">
              {otpChannel === 'sms' 
                ? <>We've sent a 6-digit code to your phone <strong>{enquiryPhone}</strong> via SMS.</>
                : <>We've sent a 6-digit code to your email <strong>{enquiryEmail}</strong>.</>
              }
            </p>

            {otpError && (
              <div style={{ color: '#EF4444', backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: '500', marginBottom: '16px', border: '1px solid #FEE2E2', textAlign: 'center' }}>
                {otpError}
              </div>
            )}
            
            <form onSubmit={handleVerifyOTP} className="contact-otp-form">
              
              <div className="otp-digit-inputs-row">
                {contactOTP.map((val, idx) => (
                  <input 
                    key={idx}
                    type="text"
                    maxLength="1"
                    className="otp-digit-box"
                    placeholder="-"
                    value={val}
                    id={`otp-box-${idx}`}
                    onChange={(e) => {
                      const value = e.target.value;
                      const newOTP = [...contactOTP];
                      newOTP[idx] = value;
                      setContactOTP(newOTP);
                      
                      // Auto focus next box
                      if (value && idx < 5) {
                        const nextBox = document.getElementById(`otp-box-${idx + 1}`);
                        if (nextBox) nextBox.focus();
                      }
                    }}
                  />
                ))}
              </div>

              <p className="otp-resend-prompt">
                Didn't receive OTP?{' '}
                {resendTimer > 0 ? (
                  <span style={{ color: '#9CA3AF', cursor: 'not-allowed' }}>Resend OTP</span>
                ) : (
                  <span className="otp-resend-link" onClick={() => handleSendOTP(null)}>Resend OTP</span>
                )}
              </p>
              
              {resendTimer > 0 && (
                <p className="otp-timer-subtext">
                  Resend available in {resendTimer}s
                </p>
              )}

              <button type="submit" className="auth-submit-btn-green mt-36" disabled={otpLoading}>
                {otpLoading ? 'Verifying...' : 'Verify & Proceed'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
