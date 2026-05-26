import { useEffect, useState } from 'react';

export default function useGuestAuth({ API_BASE, API_ORIGIN, setActiveMenu }) {
  const [token, setToken] = useState(localStorage.getItem('user_token') || null);
  const [user, setUser] = useState(
    localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data')) : null
  );

  // Interactive Auth Modal States (Figma accurate design!)
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'login'
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Profile editing modal states
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [editProfileError, setEditProfileError] = useState('');
  const [editProfileForm, setEditProfileForm] = useState({
    citizenship: '',
    residence: '',
    phone: '',
    address: '',
    pincode: '',
    state: '',
    city: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyEmail: '',
  });

  const [liveEnquiries, setLiveEnquiries] = useState([]);
  const [userReviews, setUserReviews] = useState([]);

  // Signup inputs
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCitizenship] = useState('India');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupResidence, setSignupResidence] = useState('India');
  const [signupAddress, setSignupAddress] = useState('');
  const [signupPincode, setSignupPincode] = useState('');
  const [signupState, setSignupState] = useState('');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  useEffect(() => {
    if (!authModalOpen) {
      setLoginPassword('');
    }
  }, [authModalOpen]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openAuth') === 'true') {
      setAuthMode('login');
      setAuthModalOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const openLoginModal = () => openAuthModal('login');

  const fetchProfileAndEnquiries = async (activeToken) => {
    if (!activeToken || activeToken === 'fake_token_for_user') return;
    try {
      const profileRes = await fetch(`${API_BASE}/users/profile`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUser(profileData);
        localStorage.setItem('user_data', JSON.stringify(profileData));
      }

      // Fetch user's own enquiries (filtered by user_id on server)
      const enquiriesRes = await fetch(`${API_BASE}/enquiries/user`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (enquiriesRes.ok) {
        const enquiriesData = await enquiriesRes.json();
        setLiveEnquiries(enquiriesData);
      }

      // Fetch user's reviews
      const reviewsRes = await fetch(`${API_BASE}/reviews/user/me`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        const formattedReviews = reviewsData.map((r) => ({
          title: r.property_id?.name || 'Property Review',
          rating: r.rating,
          location: r.property_id?.location || r.property_id?.city || 'Location',
          reviewText: r.review_text,
          img:
            r.property_id?.images && r.property_id.images.length > 0
              ? r.property_id.images[0]
              : 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80',
        }));
        setUserReviews(formattedReviews);
      }
    } catch (e) {
      console.error('Error fetching profile/enquiries:', e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setToken(null);
    setUser(null);
    setLiveEnquiries([]);
    alert('Logged out successfully.');
    if (setActiveMenu) setActiveMenu('Home');
  };

  // Enquiry inputs (auto-fill from logged-in user profile)
  const [enquiryFirstName, setEnquiryFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [enquiryLastName, setEnquiryLastName] = useState(
    user?.name?.split(' ').slice(1).join(' ') || ''
  );
  const [enquiryEmail, setEnquiryEmail] = useState(user?.email || '');
  const [enquiryPhone, setEnquiryPhone] = useState(user?.phone || '');

  useEffect(() => {
    if (user) {
      setEnquiryFirstName(user.name?.split(' ')[0] || '');
      setEnquiryLastName(user.name?.split(' ').slice(1).join(' ') || '');
      setEnquiryEmail(user.email || '');
      setEnquiryPhone(user.phone || '');
    }
  }, [user]);

  const openEditProfileModal = () => {
    setEditProfileError('');
    setEditProfileForm({
      citizenship: user?.citizenship || 'India',
      residence: user?.residence || 'India',
      phone: user?.phone || '',
      address: user?.address || '',
      pincode: user?.pincode || '',
      state: user?.state || '',
      city: user?.city || '',
      emergencyName: user?.emergencyName || '',
      emergencyPhone: user?.emergencyPhone || '',
      emergencyEmail: user?.emergencyEmail || '',
    });
    setIsEditProfileModalOpen(true);
  };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    setEditProfileError('');
    try {
      const response = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editProfileForm),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        setIsEditProfileModalOpen(false);
      } else {
        const errData = await response.json();
        setEditProfileError(errData.message || 'Failed to update profile details.');
      }
    } catch (err) {
      console.error(err);
      setEditProfileError('Failed to update profile.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${signupFirstName} ${signupLastName}`.trim(),
          email: signupEmail,
          password: signupPassword,
          role: 'user',
        }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        const profileRes = await fetch(`${API_BASE}/users/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            phone: signupPhone,
            address: signupAddress,
            state: signupState,
            pincode: signupPincode,
            citizenship: signupCitizenship,
            residence: signupResidence,
          }),
        });

        let finalUser = data.user;
        if (profileRes.ok) {
          finalUser = await profileRes.json();
        }

        localStorage.setItem('user_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(finalUser));
        setToken(data.token);
        setUser(finalUser);
        setAuthModalOpen(false);
        alert(`Welcome, ${finalUser.name}! Account created successfully.`);
        fetchProfileAndEnquiries(data.token);
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Network error registering account:', error);
      alert('Network error registering account');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('user_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setAuthModalOpen(false);
        alert(`Welcome back, ${data.user.name}!`);
        fetchProfileAndEnquiries(data.token);
      } else {
        alert(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Network error logging in:', error);
      alert('Network error logging in');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    setAuthLoading(true);

    const w = 520;
    const h = 680;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;

    const providerNameOnly = provider.split('?')[0];
    const popup = window.open(
      `${API_BASE}/auth/oauth/${provider}`,
      `tripinvilla_oauth_${providerNameOnly}`,
      `popup=yes,width=${w},height=${h},left=${left},top=${top}`
    );

    if (!popup) {
      setAuthLoading(false);
      alert('Popup blocked. Please allow popups and try again.');
      return;
    }

    let done = false;
    let poll = null;
    const cleanup = () => {
      if (done) return;
      done = true;
      window.removeEventListener('message', onMessage);
      if (poll) clearInterval(poll);
      setAuthLoading(false);
    };

    const onMessage = (event) => {
      const isFromServer =
        event.origin === API_ORIGIN ||
        (import.meta.env.DEV && event.data?.type === 'tripinvilla_oauth_success');
      if (!isFromServer) return;
      const { type, payload } = event.data || {};
      if (type !== 'tripinvilla_oauth_success') return;
      if (!payload || !payload.token || !payload.user) return;

      localStorage.setItem('user_token', payload.token);
      localStorage.setItem('user_data', JSON.stringify(payload.user));
      setToken(payload.token);
      setUser(payload.user);
      setAuthModalOpen(false);
      fetchProfileAndEnquiries(payload.token);
      try {
        popup.close();
      } catch (error) {
        console.warn('OAuth popup close failed:', error);
      }
      cleanup();
    };

    window.addEventListener('message', onMessage);

    poll = setInterval(() => {
      if (popup.closed) {
        cleanup();
      }
    }, 400);
  };

  return {
    // User/session
    token,
    setToken,
    user,
    setUser,
    liveEnquiries,
    userReviews,
    fetchProfileAndEnquiries,

    // Auth modal
    authModalOpen,
    setAuthModalOpen,
    authMode,
    setAuthMode,
    showPassword,
    setShowPassword,
    authLoading,
    openAuthModal,
    openLoginModal,
    handleLogout,
    handleOAuthLogin,

    // Signup
    signupFirstName,
    setSignupFirstName,
    signupLastName,
    setSignupLastName,
    signupEmail,
    setSignupEmail,
    signupPassword,
    setSignupPassword,
    signupPhone,
    setSignupPhone,
    signupResidence,
    setSignupResidence,
    signupAddress,
    setSignupAddress,
    signupPincode,
    setSignupPincode,
    signupState,
    setSignupState,
    handleSignupSubmit,

    // Login
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    handleLoginSubmit,

    // Enquiry info (verification modal)
    enquiryFirstName,
    setEnquiryFirstName,
    enquiryLastName,
    setEnquiryLastName,
    enquiryEmail,
    setEnquiryEmail,
    enquiryPhone,
    setEnquiryPhone,

    // Edit profile modal
    isEditProfileModalOpen,
    setIsEditProfileModalOpen,
    editProfileForm,
    setEditProfileForm,
    editProfileError,
    openEditProfileModal,
    handleEditProfileSubmit,
  };
}

