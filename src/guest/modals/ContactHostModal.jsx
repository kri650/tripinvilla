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
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 max-[768px]:p-1" 
      onClick={() => setContactModalOpen(false)}
    >
      <div 
        className="bg-white rounded-[20px] shadow-2xl relative w-[653px] max-w-[95vw] p-12 
          max-[1024px]:w-[600px] max-[1024px]:p-10
          max-[768px]:w-[calc(100%-24px)] max-[768px]:max-w-[500px] max-[768px]:p-8 max-[768px]:px-6 max-[768px]:rounded-2xl
          max-[480px]:w-[calc(100%-16px)] max-[480px]:max-w-full max-[480px]:p-7 max-[480px]:px-5 max-[480px]:rounded-[14px]
          max-[360px]:w-[calc(100%-12px)] max-[360px]:p-6 max-[360px]:px-4 max-[360px]:rounded-xl
          max-[320px]:w-[calc(100%-8px)] max-[320px]:p-4 max-[320px]:px-[10px] max-[320px]:rounded-[10px]
          max-[768px]:landscape:max-h-[85vh] max-[768px]:landscape:overflow-y-auto max-[768px]:landscape:p-5 max-[768px]:landscape:px-4" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 text-3xl font-light leading-none transition-colors"
          onClick={() => setContactModalOpen(false)}
        >
          &times;
        </button>
        
        {contactStep === 1 ? (
          <div className="animate-[fadeIn_0.3s_ease-in-out]">
            <h2 className="font-['Poppins'] text-[28px] font-semibold text-gray-900 text-center mb-8
              max-[768px]:text-[22px] max-[768px]:mb-6
              max-[480px]:text-xl max-[480px]:mb-5 max-[480px]:leading-tight
              max-[360px]:text-lg max-[360px]:mb-[18px] max-[360px]:leading-tight
              max-[320px]:text-[15px] max-[320px]:mb-3 max-[320px]:leading-tight
              max-[768px]:landscape:text-base max-[768px]:landscape:mb-[10px]">
              View Contact <span className="bg-[#1B94DC] text-white px-3 py-1 rounded-md inline-block
                max-[360px]:px-2 max-[360px]:text-lg
                max-[320px]:px-[5px] max-[320px]:text-[15px]">Number</span>
            </h2>
            
            {otpError && (
              <div className="text-red-500 bg-red-50 p-3 rounded-[10px] text-[13px] font-medium mb-4 border border-red-200 text-center
                max-[768px]:p-3 max-[768px]:text-xs max-[768px]:mb-4
                max-[480px]:p-[11px] max-[480px]:text-[11px] max-[480px]:mb-[14px] max-[480px]:rounded-lg
                max-[360px]:p-[10px] max-[360px]:text-[10px] max-[360px]:mb-3">
                {otpError}
              </div>
            )}
            
            <form onSubmit={handleSendOTP}>
              <div className="grid grid-cols-2 gap-y-5 gap-x-6 w-full
                max-[1024px]:gap-y-[18px] max-[1024px]:gap-x-5
                max-[768px]:grid-cols-1 max-[768px]:gap-[18px]
                max-[480px]:gap-4
                max-[360px]:gap-[14px]
                max-[320px]:gap-[10px]">
                <div className="flex flex-col">
                  <label className="font-['Lato'] text-sm font-semibold text-gray-700 mb-2
                    max-[768px]:text-[13px] max-[768px]:mb-[7px]
                    max-[480px]:text-xs max-[480px]:mb-[6px]
                    max-[360px]:text-[11px] max-[360px]:mb-[5px]
                    max-[320px]:text-[10px] max-[320px]:mb-1">First Name*</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl font-['Lato'] text-[15px] text-gray-900 outline-none transition-colors focus:border-[#58A429] focus:ring-2 focus:ring-[#58A429]/20
                      max-[768px]:px-[14px] max-[768px]:py-[14px] max-[768px]:text-[15px] max-[768px]:rounded-[10px] max-[768px]:min-h-[50px]
                      max-[480px]:px-3 max-[480px]:py-[13px] max-[480px]:text-sm max-[480px]:min-h-[48px]
                      max-[360px]:px-[10px] max-[360px]:py-3 max-[360px]:text-[13px] max-[360px]:min-h-[46px]
                      max-[320px]:px-2 max-[320px]:py-[10px] max-[320px]:text-xs max-[320px]:min-h-[42px]" 
                    placeholder="Add First Name" 
                    value={enquiryFirstName} 
                    onChange={(e) => setEnquiryFirstName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-['Lato'] text-sm font-semibold text-gray-700 mb-2
                    max-[768px]:text-[13px] max-[768px]:mb-[7px]
                    max-[480px]:text-xs max-[480px]:mb-[6px]
                    max-[360px]:text-[11px] max-[360px]:mb-[5px]
                    max-[320px]:text-[10px] max-[320px]:mb-1">Last Name*</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl font-['Lato'] text-[15px] text-gray-900 outline-none transition-colors focus:border-[#58A429] focus:ring-2 focus:ring-[#58A429]/20
                      max-[768px]:px-[14px] max-[768px]:py-[14px] max-[768px]:text-[15px] max-[768px]:rounded-[10px] max-[768px]:min-h-[50px]
                      max-[480px]:px-3 max-[480px]:py-[13px] max-[480px]:text-sm max-[480px]:min-h-[48px]
                      max-[360px]:px-[10px] max-[360px]:py-3 max-[360px]:text-[13px] max-[360px]:min-h-[46px]
                      max-[320px]:px-2 max-[320px]:py-[10px] max-[320px]:text-xs max-[320px]:min-h-[42px]" 
                    placeholder="Add Last Name" 
                    value={enquiryLastName} 
                    onChange={(e) => setEnquiryLastName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-['Lato'] text-sm font-semibold text-gray-700 mb-2
                    max-[768px]:text-[13px] max-[768px]:mb-[7px]
                    max-[480px]:text-xs max-[480px]:mb-[6px]
                    max-[360px]:text-[11px] max-[360px]:mb-[5px]
                    max-[320px]:text-[10px] max-[320px]:mb-1">Email Address*</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl font-['Lato'] text-[15px] text-gray-900 outline-none transition-colors focus:border-[#58A429] focus:ring-2 focus:ring-[#58A429]/20
                      max-[768px]:px-[14px] max-[768px]:py-[14px] max-[768px]:text-[15px] max-[768px]:rounded-[10px] max-[768px]:min-h-[50px]
                      max-[480px]:px-3 max-[480px]:py-[13px] max-[480px]:text-sm max-[480px]:min-h-[48px]
                      max-[360px]:px-[10px] max-[360px]:py-3 max-[360px]:text-[13px] max-[360px]:min-h-[46px]
                      max-[320px]:px-2 max-[320px]:py-[10px] max-[320px]:text-xs max-[320px]:min-h-[42px]" 
                    placeholder="Add Email Address" 
                    value={enquiryEmail} 
                    onChange={(e) => setEnquiryEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-['Lato'] text-sm font-semibold text-gray-700 mb-2
                    max-[768px]:text-[13px] max-[768px]:mb-[7px]
                    max-[480px]:text-xs max-[480px]:mb-[6px]
                    max-[360px]:text-[11px] max-[360px]:mb-[5px]
                    max-[320px]:text-[10px] max-[320px]:mb-1">Phone Number*</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl font-['Lato'] text-[15px] text-gray-900 outline-none transition-colors focus:border-[#58A429] focus:ring-2 focus:ring-[#58A429]/20
                      max-[768px]:px-[14px] max-[768px]:py-[14px] max-[768px]:text-[15px] max-[768px]:rounded-[10px] max-[768px]:min-h-[50px]
                      max-[480px]:px-3 max-[480px]:py-[13px] max-[480px]:text-sm max-[480px]:min-h-[48px]
                      max-[360px]:px-[10px] max-[360px]:py-3 max-[360px]:text-[13px] max-[360px]:min-h-[46px]
                      max-[320px]:px-2 max-[320px]:py-[10px] max-[320px]:text-xs max-[320px]:min-h-[42px]" 
                    placeholder="Add Phone Number" 
                    value={enquiryPhone} 
                    onChange={(e) => setEnquiryPhone(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#58A429] text-white font-['Lato'] text-base font-bold py-4 px-6 rounded-xl transition-all hover:bg-[#4a8e22] disabled:opacity-50 disabled:cursor-not-allowed mt-9
                  max-[768px]:h-[52px] max-[768px]:text-[15px] max-[768px]:mt-6 max-[768px]:px-6
                  max-[480px]:h-[50px] max-[480px]:text-sm max-[480px]:mt-[22px] max-[480px]:px-5
                  max-[360px]:h-12 max-[360px]:text-[13px] max-[360px]:mt-5 max-[360px]:px-4
                  max-[320px]:h-11 max-[320px]:text-xs max-[320px]:mt-[14px]
                  max-[768px]:landscape:h-11 max-[768px]:landscape:mt-3" 
                disabled={otpLoading}
              >
                {otpLoading ? 'Requesting Code...' : 'Verify & View Contact Number'}
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-[fadeIn_0.3s_ease-in-out]">
            <h2 className="font-['Poppins'] text-[28px] font-semibold text-gray-900 text-center mb-8
              max-[768px]:text-[22px] max-[768px]:mb-6
              max-[480px]:text-xl max-[480px]:mb-5 max-[480px]:leading-tight
              max-[360px]:text-lg max-[360px]:mb-[18px] max-[360px]:leading-tight
              max-[320px]:text-[15px] max-[320px]:mb-3 max-[320px]:leading-tight
              max-[768px]:landscape:text-base max-[768px]:landscape:mb-[10px]">
              Request Contact <span className="bg-[#1B94DC] text-white px-3 py-1 rounded-md inline-block
                max-[360px]:px-2 max-[360px]:text-lg
                max-[320px]:px-[5px] max-[320px]:text-[15px]">Number</span>
            </h2>
            
            <p className="font-['Lato'] text-[13.5px] text-gray-600 text-center -mt-4 mb-6 leading-relaxed
              max-[768px]:text-[13px] max-[768px]:-mt-3 max-[768px]:mb-5 max-[768px]:px-3
              max-[480px]:text-xs max-[480px]:-mt-[10px] max-[480px]:mb-[18px] max-[480px]:px-2 max-[480px]:leading-snug
              max-[360px]:text-[11px] max-[360px]:-mt-2 max-[360px]:mb-4 max-[360px]:px-[6px] max-[360px]:leading-[1.35]
              max-[320px]:text-[10px] max-[320px]:-mt-[6px] max-[320px]:mb-3 max-[320px]:leading-[1.3]
              max-[768px]:landscape:-mt-2 max-[768px]:landscape:mb-3">
              {otpChannel === 'sms' 
                ? <>We've sent a 6-digit code to your phone <strong>{enquiryPhone}</strong> via SMS.</>
                : <>We've sent a 6-digit code to your email <strong>{enquiryEmail}</strong>.</>
              }
            </p>

            {otpError && (
              <div className="text-red-500 bg-red-50 p-3 rounded-[10px] text-[13px] font-medium mb-4 border border-red-200 text-center
                max-[768px]:p-3 max-[768px]:text-xs max-[768px]:mb-4
                max-[480px]:p-[11px] max-[480px]:text-[11px] max-[480px]:mb-[14px] max-[480px]:rounded-lg
                max-[360px]:p-[10px] max-[360px]:text-[10px] max-[360px]:mb-3">
                {otpError}
              </div>
            )}
            
            <form onSubmit={handleVerifyOTP}>
              <div className="flex justify-center gap-3 my-4 mb-6
                max-[768px]:gap-3 max-[768px]:my-5 max-[768px]:mb-6
                max-[480px]:gap-[10px] max-[480px]:my-[18px] max-[480px]:mb-5 max-[480px]:flex-nowrap
                max-[360px]:gap-2 max-[360px]:my-4 max-[360px]:mb-[18px]
                max-[320px]:gap-1 max-[320px]:my-[10px] max-[320px]:mb-[14px]
                max-[768px]:landscape:my-[10px] max-[768px]:landscape:mb-[14px]">
                {contactOTP.map((val, idx) => (
                  <input 
                    key={idx}
                    type="text"
                    maxLength="1"
                    className="w-12 h-12 border border-gray-300 rounded-lg text-center font-['Lato'] text-lg font-bold text-gray-900 outline-none transition-all focus:border-[#58A429] focus:ring-2 focus:ring-[#58A429]/20 shrink-0
                      max-[1024px]:w-11 max-[1024px]:h-11 max-[1024px]:text-base
                      max-[768px]:w-11 max-[768px]:h-11 max-[768px]:text-base max-[768px]:rounded-[10px]
                      max-[480px]:w-10 max-[480px]:h-10 max-[480px]:text-[15px] max-[480px]:rounded-lg
                      max-[360px]:w-9 max-[360px]:h-9 max-[360px]:text-sm max-[360px]:rounded-md
                      max-[320px]:w-[34px] max-[320px]:h-[34px] max-[320px]:text-[13px] max-[320px]:rounded-md
                      max-[768px]:landscape:w-[38px] max-[768px]:landscape:h-[38px] max-[768px]:landscape:text-sm
                      max-[768px]:focus:border-2 max-[768px]:focus:shadow-[0_0_0_3px_rgba(88,164,41,0.1)]
                      max-[768px]:active:scale-95 max-[768px]:active:transition-transform max-[768px]:active:duration-100"
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

              <p className="font-['Lato'] text-[13px] text-gray-500 text-center mb-[6px]
                max-[768px]:text-xs max-[768px]:mb-[10px]
                max-[480px]:text-[11px] max-[480px]:mb-2
                max-[360px]:text-[10px] max-[360px]:mb-[6px] max-[360px]:leading-snug
                max-[320px]:text-[9px] max-[320px]:leading-[1.3]">
                Didn't receive OTP?{' '}
                {resendTimer > 0 ? (
                  <span className="text-gray-400 cursor-not-allowed">Resend OTP</span>
                ) : (
                  <span 
                    className="text-[#58A429] font-bold cursor-pointer underline hover:text-[#4a8e22]
                      max-[768px]:inline-block max-[768px]:p-1 max-[768px]:px-2 max-[768px]:-m-1 max-[768px]:-mx-2 max-[768px]:rounded max-[768px]:min-h-8 max-[768px]:leading-[1.6]
                      max-[768px]:focus:outline max-[768px]:focus:outline-2 max-[768px]:focus:outline-[#58A429] max-[768px]:focus:outline-offset-2
                      max-[768px]:active:opacity-70 max-[768px]:active:transition-opacity max-[768px]:active:duration-100" 
                    onClick={() => handleSendOTP(null)}
                  >
                    Resend OTP
                  </span>
                )}
              </p>
              
              {resendTimer > 0 && (
                <p className="font-['Lato'] text-xs text-gray-400 text-center m-0 mb-1
                  max-[480px]:text-[10px]
                  max-[360px]:text-[9px] max-[360px]:mb-1
                  max-[320px]:text-[8px]">
                  Resend available in {resendTimer}s
                </p>
              )}

              <button 
                type="submit" 
                className="w-full bg-[#58A429] text-white font-['Lato'] text-base font-bold py-4 px-6 rounded-xl transition-all hover:bg-[#4a8e22] disabled:opacity-50 disabled:cursor-not-allowed mt-9
                  max-[768px]:h-[52px] max-[768px]:text-[15px] max-[768px]:mt-6 max-[768px]:px-6
                  max-[480px]:h-[50px] max-[480px]:text-sm max-[480px]:mt-[22px] max-[480px]:px-5
                  max-[360px]:h-12 max-[360px]:text-[13px] max-[360px]:mt-5 max-[360px]:px-4
                  max-[320px]:h-11 max-[320px]:text-xs max-[320px]:mt-[14px]
                  max-[768px]:landscape:h-11 max-[768px]:landscape:mt-3" 
                disabled={otpLoading}
              >
                {otpLoading ? 'Verifying...' : 'Verify & Proceed'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
