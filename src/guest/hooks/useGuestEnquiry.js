import { useState, useEffect } from 'react';

export default function useGuestEnquiry({
  API_BASE,
  token,
  user,
  selectedProperty,
  activeDetailProp,
  fetchProfileAndEnquiries,
}) {
  const [guestEnquiryName, setGuestEnquiryName] = useState('');
  const [guestEnquiryPhone, setGuestEnquiryPhone] = useState('');
  const [guestEnquiryEmail, setGuestEnquiryEmail] = useState('');
  const [guestEnquiryMessage, setGuestEnquiryMessage] = useState('');
  const [guestEnquirySubmitting, setGuestEnquirySubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setGuestEnquiryName(user.name || '');
      setGuestEnquiryEmail(user.email || '');
      setGuestEnquiryPhone(user.phone || '');
    } else {
      setGuestEnquiryName('');
      setGuestEnquiryEmail('');
      setGuestEnquiryPhone('');
    }
  }, [user]);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    const propToUse = selectedProperty || activeDetailProp;
    if (!propToUse || !propToUse._id) {
      alert('Error: No active property selected.');
      return;
    }

    try {
      setGuestEnquirySubmitting(true);
      const res = await fetch(`${API_BASE}/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          propertyId: propToUse._id,
          propertyName: propToUse.title || propToUse.propertyName,
          user_id: user?._id || null,
          name: guestEnquiryName,
          phone: guestEnquiryPhone,
          email: guestEnquiryEmail,
          message: guestEnquiryMessage,
        }),
      });

      if (res.ok) {
        alert('Your enquiry has been sent to the property owner successfully!');
        setGuestEnquiryName('');
        setGuestEnquiryPhone('');
        setGuestEnquiryEmail('');
        setGuestEnquiryMessage('');
        if (token) fetchProfileAndEnquiries(token);
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to submit enquiry.');
      }
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      alert('Failed to connect to the server.');
    } finally {
      setGuestEnquirySubmitting(false);
    }
  };

  return {
    guestEnquiryName,
    setGuestEnquiryName,
    guestEnquiryPhone,
    setGuestEnquiryPhone,
    guestEnquiryEmail,
    setGuestEnquiryEmail,
    guestEnquiryMessage,
    setGuestEnquiryMessage,
    guestEnquirySubmitting,
    setGuestEnquirySubmitting,
    handleEnquirySubmit,
  };
}

