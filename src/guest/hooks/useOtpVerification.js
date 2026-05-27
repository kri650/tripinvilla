import { useEffect, useState } from 'react';

export default function useOtpVerification({
  API_BASE,
  selectedProperty,
  token,
  enquiryFirstName,
  enquiryLastName,
  enquiryEmail,
  enquiryPhone,
  fetchProfileAndEnquiries,
}) {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactStep, setContactStep] = useState(1); // 1 = View Contact, 2 = Request OTP
  const [contactOTP, setContactOTP] = useState(['', '', '', '', '', '']);
  const [hostContactRevealed, setHostContactRevealed] = useState({});
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpChannel, setOtpChannel] = useState('sms');
  const [resendTimer, setResendTimer] = useState(0);

  // OTP Countdown Timer
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setOtpLoading(true);
    setOtpError('');
    const propName =
      (selectedProperty && (selectedProperty.propertyName || selectedProperty.title)) ||
      'Kasol Villa Stay';
    try {
      const res = await fetch(`${API_BASE}/enquiries/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: enquiryEmail,
          name: `${enquiryFirstName} ${enquiryLastName}`.trim(),
          phone: enquiryPhone,
          propertyName: propName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContactStep(2);
        setOtpChannel(data.channel || 'sms');
        setResendTimer(30); // 30s resend timer
      } else {
        setOtpError(data.message || 'Failed to send OTP code.');
      }
    } catch (error) {
      console.error('Failed to request verification code:', error);
      setOtpError('Failed to request verification code. Please check server connection.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError('');
    const otpValue = contactOTP.join('');
    if (otpValue.length < 6) {
      setOtpError('Please enter the full 6-digit verification code.');
      setOtpLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/enquiries/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: enquiryPhone,
          otp: otpValue,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setHostContactRevealed((prev) => ({
          ...prev,
          [selectedProperty?._id]: true,
        }));
        setContactModalOpen(false);
        if (token) fetchProfileAndEnquiries(token);
        alert('✅ Phone verified! The host contact number is now visible on the property page.');
        setContactOTP(['', '', '', '', '', '']);
      } else {
        setOtpError(data.message || 'Verification failed.');
      }
    } catch (error) {
      console.error('Failed to verify OTP code:', error);
      setOtpError('Failed to verify OTP code. Please check your connection.');
    } finally {
      setOtpLoading(false);
    }
  };

  return {
    contactModalOpen,
    setContactModalOpen,
    contactStep,
    setContactStep,
    contactOTP,
    setContactOTP,
    hostContactRevealed,
    otpLoading,
    otpError,
    otpChannel,
    resendTimer,
    handleSendOTP,
    handleVerifyOTP,
  };
}

