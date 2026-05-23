import React, { useState, useEffect } from 'react';
import { 
  MapPin, Heart, Inbox, ThumbsUp, 
  Search, Sparkles, Calendar, Users, DollarSign, Bed, Utensils, ChevronDown,
  ChevronLeft, ChevronRight, Star, CreditCard, Percent,
  Maximize, DoorClosed, CheckCircle, Phone,
  Edit2, User, Filter, MessageSquare, Play, Sliders, UserRound, UploadCloud, ArrowRight, X, Eye, EyeOff
} from 'lucide-react';
import {
  aboutHeroImg,
  contactBgShapeImg,
  contactHeroImg,
  enquiriesHeroImg,
  heroBgImg,
  listPlaceHeroImg,
  loginLeftImg,
  profileHeroImg,
  recommendHeroImg,
  rect32Img,
  rect33Img,
  rect35Img,
  reviewsHeroImg,
  wishlistHeroImg,
  areaIcon,
  bedIcon,
  roomIcon,
  guestIcon,
  missionIcon,
  visionIcon,
  contactAddressIcon,
  contactEmailIcon,
  contactCallIcon,
  privacyHeroImg,
  termsHeroImg,
  filterIcon,
  stepIcon1,
  stepIcon2,
  stepIcon3,
  stepIcon4,
} from './assets';
import './App.css';

import {
  bestVillasList,
  carouselDestinations,
  curatedList,
  detailSubTabs,
  landmarks,
  popularOffersList,
  propertiesHomestaysList,
  propertiesVillasList,
  propertyCategories,
  roomOptions,
} from './data/mockData';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const API_ORIGIN = (() => {
  try { return new URL(API_BASE).origin; } catch { return 'http://localhost:5000'; }
})();

export default function GuestApp() {
  const [activeMenu, setActiveMenu] = useState('Home');
  const [popularOffers, setPopularOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(`${API_BASE}/offers/frontend`);
        if (res.ok) {
          const data = await res.json();
          setPopularOffers(data || []);
        }
      } catch (err) {
        console.error('Error fetching frontend offers:', err);
      }
    };
    fetchOffers();
  }, []);

  const [activeSearchTab, setActiveSearchTab] = useState('Villas');
  const [activeDestTab, setActiveDestTab] = useState('Destinations');
  const [activePropCategory, setActivePropCategory] = useState('Apartments');
  const [activeDetailTab, setActiveDetailTab] = useState('Rooms');

  const scrollToDetailSection = (tabName) => {
    setActiveDetailTab(tabName);
    const idMap = {
      'Rooms': 'detail-section-rooms',
      'Location': 'detail-section-location',
      'Property Rules': 'detail-section-rules',
      'User Reviews': 'detail-section-reviews'
    };
    const targetId = idMap[tabName];
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        const yOffset = -140; 
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // Input states
  const [where, setWhere] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('Any Guests');
  const [price, setPrice] = useState('Any');
  const [stayType, setStayType] = useState('Any');
  const [foodPref, setFoodPref] = useState('Any');
  
  // Checkbox states
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Search Results Filter States
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterPriceSlider, setFilterPriceSlider] = useState(50000);
  const [sidebarSearchText, setSidebarSearchText] = useState('');
  const [filterSelectedTypes, setFilterSelectedTypes] = useState([]);
  const [filterSelectedAmenities, setFilterSelectedAmenities] = useState([]);
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [searchSortBy, setSearchSortBy] = useState('popularity');
  const [filterInstantBook, setFilterInstantBook] = useState(false);
  const [filterCancellationPolicy, setFilterCancellationPolicy] = useState(false);
  const [filterHomestays, setFilterHomestays] = useState(false);
  // Dynamic amenities from Admin Amenities Master
  const [amenitiesForFilter, setAmenitiesForFilter] = useState([]);
  
  // Pagination State
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);

  // Auto-reset page to 1 when filters change
  useEffect(() => {
    setSearchCurrentPage(1);
  }, [
    sidebarSearchText,
    filterSelectedTypes,
    filterSelectedAmenities,
    filterMinPrice,
    filterMaxPrice,
    filterMinRating,
    filterInstantBook,
    filterCancellationPolicy,
    filterHomestays,
    searchSortBy
  ]);

  // Contact Us Form States
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactAgreed, setContactAgreed] = useState(false);

  // Guest Enquiry form states
  const [guestEnquiryName, setGuestEnquiryName] = useState('');
  const [guestEnquiryPhone, setGuestEnquiryPhone] = useState('');
  const [guestEnquiryEmail, setGuestEnquiryEmail] = useState('');
  const [guestEnquiryMessage, setGuestEnquiryMessage] = useState('');
  const [guestEnquirySubmitting, setGuestEnquirySubmitting] = useState(false);

  // Recommended Page Wishlist toggled list
  const [recWishlist, setRecWishlist] = useState([0, 2]);
  const [mockWishlistedTitles, setMockWishlistedTitles] = useState([]);

  // List Your Place Page Collapsible FAQ Active Index
  const [activeFaq, setActiveFaq] = useState(0);

  // Interactive Auth Modal States (Figma accurate design!)
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'login'
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openAuth') === 'true') {
      setAuthMode('login');
      setAuthModalOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Contact Detail Verification Modal States (Figma accurate design!)
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactStep, setContactStep] = useState(1); // 1 = View Contact, 2 = Request OTP
  const [contactOTP, setContactOTP] = useState(['', '', '', '', '', '']);
  const [hostContactRevealed, setHostContactRevealed] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpChannel, setOtpChannel] = useState('sms');
  const [resendTimer, setResendTimer] = useState(0);

  // Experience Review Modal States (Figma accurate design!)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewPage, setReviewPage] = useState(1);

  // API Integration States
  const [token, setToken] = useState(localStorage.getItem('user_token') || null);
  const [user, setUser] = useState(localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data')) : null);
  const [liveProperties, setLiveProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [liveEnquiries, setLiveEnquiries] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const activeDetailProp = selectedProperty || {
    title: 'Azure Bay Hotel, Premium Suite',
    location: 'Kasol, Himachal Pradesh, India',
    price: '₹1,400',
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    images: [],
    ownerContact: '',
    amenities: [],
    area: '31 sq. ft.',
    rooms: '1 Room',
    beds: '2 Beds',
    guests: '3 Person',
    description: 'Experience a comfortable and refined stay at Azure Bay Hotel, located in the heart of the city and designed for both leisure and business travelers. The hotel offers thoughtfully designed rooms, modern amenities, and warm hospitality to ensure a relaxing and memorable stay.'
  };
  const [authLoading, setAuthLoading] = useState(false);
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  // Gallery modal states
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Filter states
  const [wishlistSearchQuery, setWishlistSearchQuery] = useState('');
  const [wishlistSortOption, setWishlistSortOption] = useState('All');
  const [isWishlistFilterOpen, setIsWishlistFilterOpen] = useState(false);

  const [propertyRooms, setPropertyRooms] = useState([]);
  const [dynamicLandmarks, setDynamicLandmarks] = useState([]);
  const [dynamicReviews, setDynamicReviews] = useState([]);
  const [dynamicReviewStats, setDynamicReviewStats] = useState({ avg: 0, count: 0, label: 'No Reviews' });

  useEffect(() => {
    if (selectedProperty && selectedProperty._id) {
      // Fetch property rooms
      fetch(`${API_BASE}/property-requests/property/${selectedProperty._id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPropertyRooms(data);
          } else {
            setPropertyRooms([]);
          }
        })
        .catch(err => {
          console.error("Error fetching property rooms:", err);
          setPropertyRooms([]);
        });

      // Fetch dynamic landmarks
      fetch(`${API_BASE}/properties/${selectedProperty._id}/landmarks`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setDynamicLandmarks(data);
          } else {
            setDynamicLandmarks([]);
          }
        })
        .catch(err => {
          console.error("Error fetching landmarks:", err);
          setDynamicLandmarks([]);
        });

      // Fetch reviews
      fetch(`${API_BASE}/reviews/${selectedProperty._id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setDynamicReviews(data);
          else setDynamicReviews([]);
        })
        .catch(() => setDynamicReviews([]));

      // Fetch review stats
      fetch(`${API_BASE}/reviews/rating/${selectedProperty._id}`)
        .then(res => res.json())
        .then(data => setDynamicReviewStats(data))
        .catch(() => setDynamicReviewStats({ avg: 0, count: 0, label: 'No Reviews' }));

    } else {
      setPropertyRooms([]);
      setDynamicLandmarks([]);
      setDynamicReviews([]);
      setDynamicReviewStats({ avg: 0, count: 0, label: 'No Reviews' });
    }
  }, [selectedProperty]);

  const [enquirySearchQuery, setEnquirySearchQuery] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');
  const [isEnquiryFilterOpen, setIsEnquiryFilterOpen] = useState(false);

  const [reviewsRatingFilter, setReviewsRatingFilter] = useState('All');
  const [isReviewsFilterOpen, setIsReviewsFilterOpen] = useState(false);
  const [userReviews] = useState([]);

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const openLoginModal = () => openAuthModal('login');

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setToken(null);
    setUser(null);
    setLiveEnquiries([]);
    alert('Logged out successfully.');
    setActiveMenu('Home');
  };

  const handleReviewFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProperty) return;

    const rName = reviewName || user?.name || 'Guest';
    const rText = reviewText;
    const rRating = reviewRating;

    // Simulate submission for mock properties that don't have database IDs
    if (!selectedProperty._id) {
      const mockReview = {
        _id: 'mock-rev-' + Math.random().toString(36).substring(2, 9),
        property_id: 'mock-prop',
        reviewer_name: rName,
        reviewer_photo_url: '',
        rating: rRating,
        review_text: rText,
        createdAt: new Date().toISOString()
      };
      setDynamicReviews([mockReview, ...dynamicReviews]);
      setReviewModalOpen(false);
      setReviewName('');
      setReviewText('');
      setReviewRating(5);
      alert('Review submitted successfully!');
      return;
    }

    if (!token) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/reviews/${selectedProperty._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reviewer_name: rName,
          rating: rRating,
          review_text: rText
        })
      });
      if (res.ok) {
        const newReview = await res.json();
        setDynamicReviews([newReview, ...dynamicReviews]);
        setReviewModalOpen(false);
        setReviewName('');
        setReviewText('');
        setReviewRating(5);
        alert('Review submitted successfully!');
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
  };

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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editProfileForm)
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

  // Prevent protected views (Profile/Wishlist/Enquiries) from opening without auth
  React.useEffect(() => {
    const protectedMenus = ['Wishlist', 'Enquiries', 'Profile'];
    if (protectedMenus.includes(activeMenu) && !token) {
      openLoginModal();
      setActiveMenu('Home');
    }
  }, [activeMenu, token]);

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
  const [showPasswordStep, setShowPasswordStep] = useState(false);

  useEffect(() => {
    if (!authModalOpen) {
      setShowPasswordStep(false);
      setLoginPassword('');
    }
  }, [authModalOpen]);

  // Enquiry inputs (auto-fill from logged-in user profile)
  const [enquiryFirstName, setEnquiryFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [enquiryLastName, setEnquiryLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
  const [enquiryEmail, setEnquiryEmail] = useState(user?.email || '');
  const [enquiryPhone, setEnquiryPhone] = useState(user?.phone || '');

  React.useEffect(() => {
    if (user) {
      setEnquiryFirstName(user.name?.split(' ')[0] || '');
      setEnquiryLastName(user.name?.split(' ').slice(1).join(' ') || '');
      setEnquiryEmail(user.email || '');
      setEnquiryPhone(user.phone || '');
    }
  }, [user]);

  const fetchProperties = async (searchParams = {}) => {
    try {
      const query = new URLSearchParams();
      const hasOwn = (key) => Object.prototype.hasOwnProperty.call(searchParams, key);
      
      // 1. Where / Search Text
      const searchVal = hasOwn('search') ? searchParams.search : where;
      const hasSearchText = searchVal && searchVal.trim() !== '';
      if (hasSearchText) {
        query.append('search', searchVal.trim());
      }
      
      // 2. Type / Category — skip type filter if user typed a location search
      const typeOverride = hasOwn('type') ? searchParams.type : null;
      let dbType = typeOverride !== null ? typeOverride : (hasSearchText ? '' : activePropCategory);
      if (dbType && dbType !== 'More+' && dbType !== 'Any' && dbType !== '') {
        const typeMap = {
          'Apartments': 'Apartment', 'Apartment': 'Apartment',
          'Homestays': 'Homestay', 'Homestay': 'Homestay',
          'Resorts': 'Resort', 'Resort': 'Resort',
          'Villas': 'Villa', 'Villa': 'Villa',
          'Hotels': 'Hotel', 'Hotel': 'Hotel',
          'Cottages': 'Cottage', 'Cottage': 'Cottage',
          'Motels': 'Motel', 'Motel': 'Motel',
          'Bungalows': 'Bungalow', 'Bungalow': 'Bungalow',
        };
        const mapped = typeMap[dbType];
        if (mapped) query.append('type', mapped);
      }

      // 3. Guests / Who
      const guestsVal = hasOwn('guests') ? searchParams.guests : guests;
      if (guestsVal && guestsVal !== 'Any Guests') {
        const match = String(guestsVal).match(/\d+/);
        if (match) query.append('guests', match[0]);
      }

      // 4. Price per Night Range
      const priceVal = hasOwn('price') ? searchParams.price : price;
      if (priceVal && priceVal !== 'Any') {
        const cleanPrice = priceVal.replace(/[₹,\s]/g, '');
        if (cleanPrice.includes('-')) {
          const [minP, maxP] = cleanPrice.split('-').map(v => parseInt(v, 10));
          if (!isNaN(minP)) query.append('minPrice', minP);
          if (!isNaN(maxP)) query.append('maxPrice', maxP);
        } else if (cleanPrice.includes('+')) {
          const minP = parseInt(cleanPrice, 10);
          if (!isNaN(minP)) query.append('minPrice', minP);
        }
      }

      // 5. Dates
      const datesVal = hasOwn('dates') ? searchParams.dates : dates;
      if (datesVal && datesVal !== 'Select dates' && datesVal.trim() !== '') {
        query.append('date', datesVal.trim());
      }
      
      const res = await fetch(`${API_BASE}/properties?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.properties) {
          setLiveProperties(data.properties);
        }
      }
    } catch (e) {
      console.error('Error fetching properties:', e);
    }
  };

  const handleAISearch = async () => {
    if (!where || !where.trim()) {
      alert('Please type what you are looking for in the search box first, then click Search with AI.');
      return;
    }
    setAiSearchLoading(true);
    try {
      const res = await fetch(`${API_BASE}/properties/ai-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: where })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.properties) {
          setLiveProperties(data.properties);
          setActiveMenu('Search');
          const f = data.extractedFilters || {};
          if (f.city) setWhere(f.city);
          if (f.type) setActivePropCategory(f.type + 's');
        }
      } else {
        // fallback to regular search
        fetchProperties({ search: where });
        setActiveMenu('Search');
      }
    } catch (e) {
      console.error('AI Search error:', e);
      fetchProperties({ search: where });
      setActiveMenu('Search');
    } finally {
      setAiSearchLoading(false);
    }
  };

  const fetchProfileAndEnquiries = async (activeToken) => {
    if (!activeToken) return;
    try {
      const profileRes = await fetch(`${API_BASE}/users/profile`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUser(profileData);
        localStorage.setItem('user_data', JSON.stringify(profileData));
      }

      // Fetch user's own enquiries (filtered by user_id on server)
      const enquiriesRes = await fetch(`${API_BASE}/enquiries/user`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (enquiriesRes.ok) {
        const enquiriesData = await enquiriesRes.json();
        setLiveEnquiries(enquiriesData);
      }
    } catch (e) {
      console.error('Error fetching profile/enquiries:', e);
    }
  };

  // Initial load
  React.useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`${API_BASE}/properties`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.properties) {
            setAllProperties(data.properties);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchAll();

    // Fetch active amenities for the guest search sidebar filter
    const fetchAmenitiesForFilter = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/amenities/active`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setAmenitiesForFilter(data);
        }
      } catch (e) {
        console.error('Could not load amenities for filter:', e);
      }
    };
    fetchAmenitiesForFilter();

    fetchProperties({ type: activePropCategory });
    if (token) {
      fetchProfileAndEnquiries(token);
    }
  }, [token]);

  React.useEffect(() => {
    if (token && activeMenu === 'Enquiries') {
      fetchProfileAndEnquiries(token);
    }
  }, [activeMenu, token]);

  // Removing useEffect for activePropCategory to prevent it from overriding AI Search results automatically

  // OTP Countdown Timer
  React.useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleSearch = () => {
    setActiveMenu('Search');
    // When a text search is active, don't restrict by type
    if (where && where.trim()) {
      fetchProperties({ search: where, price, guests });
    } else if (activeSearchTab && activeSearchTab !== 'More+') {
      setActivePropCategory(activeSearchTab);
      fetchProperties({ type: activeSearchTab, price, guests });
    } else {
      fetchProperties({ price, guests });
    }
    
    // Smoothly scroll down to the results section (below the hero area)
    setTimeout(() => {
      window.scrollTo({ top: 750, behavior: 'smooth' });
    }, 100);
  };

  const handleClearAll = () => {
    setWhere('');
    setDates('');
    setGuests('Any Guests');
    setPrice('Any');
    setStayType('Any');
    setFoodPref('Any');
    setVerifiedOnly(false);
    setFeaturedOnly(false);
    fetchProperties({});
  };

  const toggleMockWishlist = (title) => {
    if (!token) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    if (mockWishlistedTitles.includes(title)) {
      setMockWishlistedTitles(mockWishlistedTitles.filter(t => t !== title));
    } else {
      setMockWishlistedTitles([...mockWishlistedTitles, title]);
    }
  };

  const mapDbProperties = (dbProps, defaultList) => {
    const listToMap = (dbProps && dbProps.length > 0) 
      ? dbProps 
      : ((where && where.trim() !== '') ? [] : defaultList);

    const categories = ['Apartment', 'Villa', 'Resort', 'Motel', 'Cottage', 'Bungalow', 'Homestay', 'Villa'];

    return listToMap.map((p, idx) => {
      const category = p.category || p.type || categories[idx % categories.length];
      return {
        _id: p._id || `mock-${idx}`,
        title: p.propertyName || p.name || p.title || 'Beautiful Stay',
        location: p.location || 'Kasol, HP, India',
        rating: p.rating || '4.8',
        reviews: p.reviews || '3,245 Genuine Reviews',
        price: p.price ? (String(p.price).startsWith('₹') ? p.price : '₹' + p.price) : ('₹' + (p.bestRoomRate || '140')),
        priceRaw: Number(p.bestRoomRate || String(p.price || '140').replace(/[^\d]/g, '')),
        img: p.image || p.images?.[0] || p.img || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
        images: p.images || (p.image ? [p.image] : (p.img ? [p.img] : [])),
        ownerContact: p.ownerContact || '',
        roomType: p.roomType || '',
        amenities: p.amenities || ['WiFi', 'Parking', 'Swimming Pool'],
        area: p.area || '31 sq. ft.',
        beds: p.beds !== undefined ? `${p.beds} Bed${p.beds > 1 ? 's' : ''}` : '2 Beds',
        rooms: p.bedRooms !== undefined ? `${p.bedRooms} Room${p.bedRooms > 1 ? 's' : ''}` : (p.roomType || '1 Room'),
        guests: p.capacity !== undefined ? `${p.capacity} Person${p.capacity > 1 ? 's' : ''}` : '3 Person',
        description: p.description || '',
        checkIn: p.checkIn || '3:00 PM',
        checkOut: p.checkOut || '12:00 PM',
        rules: p.rules || '• Primary Guest should be atleast 18 years of age.\n• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s).',
        category: category,
        type: category,
        instantBook: p.instantBook !== undefined ? p.instantBook : true,
        cancellationPolicy: p.cancellationPolicy !== undefined ? p.cancellationPolicy : true,
        homestay: category.toLowerCase() === 'homestay'
      };
    });
  };

  const mappedBest = mapDbProperties(allProperties, bestVillasList);
  let currentBestVillas = [...mappedBest];
  if (allProperties && allProperties.length > 0 && currentBestVillas.length < 8) {
    const diff = 8 - currentBestVillas.length;
    const extraMockItems = bestVillasList.slice(currentBestVillas.length, currentBestVillas.length + diff);
    const mappedExtra = mapDbProperties([], extraMockItems);
    currentBestVillas = [...currentBestVillas, ...mappedExtra];
  }

  const mappedProps = mapDbProperties(liveProperties, propertiesVillasList);
  let currentPropertiesVillas = [...mappedProps];
  if (liveProperties && liveProperties.length > 0 && currentPropertiesVillas.length < 8) {
    // Only backfill when no active query search text is typed in
    if (!where || where.trim() === '') {
      const diff = 8 - currentPropertiesVillas.length;
      const extraMockItems = propertiesVillasList.slice(currentPropertiesVillas.length, currentPropertiesVillas.length + diff);
      const mappedExtra = mapDbProperties([], extraMockItems);
      currentPropertiesVillas = [...currentPropertiesVillas, ...mappedExtra];
    }
  }

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setOtpLoading(true);
    setOtpError('');
    const propName = (selectedProperty && (selectedProperty.propertyName || selectedProperty.title)) || 'Kasol Villa Stay';
    try {
      const res = await fetch(`${API_BASE}/enquiries/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: enquiryEmail,
          name: `${enquiryFirstName} ${enquiryLastName}`.trim(),
          phone: enquiryPhone,
          propertyName: propName
        })
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
          otp: otpValue
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setHostContactRevealed(true);
        setContactModalOpen(false);
        if (token) fetchProfileAndEnquiries(token);
        alert('✅ Phone verified! The host contact number is now visible on the property page.');
        // Reset OTP inputs
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
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          property_id: propToUse._id,
          user_id: user?._id || null,
          user_name: guestEnquiryName,
          phone: guestEnquiryPhone,
          email: guestEnquiryEmail,
          query: guestEnquiryMessage
        })
      });

      if (res.ok) {
        alert('Your enquiry has been sent to the property owner successfully!');
        setGuestEnquiryName('');
        setGuestEnquiryPhone('');
        setGuestEnquiryEmail('');
        setGuestEnquiryMessage('');
        // Refresh user's enquiry list so it appears immediately in My Enquiries
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
          role: 'user'
        })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        // Update user profile with extra fields
        const profileRes = await fetch(`${API_BASE}/users/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
          },
          body: JSON.stringify({
            phone: signupPhone,
            address: signupAddress,
            state: signupState,
            pincode: signupPincode,
            citizenship: signupCitizenship,
            residence: signupResidence
          })
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
    // FAKE LOGIN for frontend-only testing
    if (loginEmail === 'user@tripinvilla.com' && loginPassword === 'user123') {
      const fakeUser = {
        _id: 'fake_user_123',
        name: 'Test Guest',
        email: 'user@tripinvilla.com',
        role: 'user',
      };
      localStorage.setItem('user_token', 'fake_token_for_user');
      localStorage.setItem('user_data', JSON.stringify(fakeUser));
      setToken('fake_token_for_user');
      setUser(fakeUser);
      setAuthModalOpen(false);
      alert(`Welcome back, ${fakeUser.name}! (Offline Mode)`);
      setAuthLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
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
      // Accept messages from our API server or any origin in development
      const isFromServer = event.origin === API_ORIGIN || 
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
      try { popup.close(); } catch (error) { console.warn('OAuth popup close failed:', error); }
      cleanup();
    };

    window.addEventListener('message', onMessage);

    poll = setInterval(() => {
      if (popup.closed) {
        cleanup();
      }
    }, 400);
  };

  const getFilteredProperties = () => {
    let displayList = [...currentPropertiesVillas];

    // 1. Sidebar Search text filter
    if (sidebarSearchText && sidebarSearchText.trim() !== '') {
      const q = sidebarSearchText.toLowerCase().trim();
      displayList = displayList.filter(p => 
        p.title?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    // 2. Property Type filter
    if (filterSelectedTypes.length > 0) {
      displayList = displayList.filter(p => filterSelectedTypes.some(t => p.type?.toLowerCase() === t.toLowerCase() || p.category?.toLowerCase() === t.toLowerCase()));
    }

    // 3. Price/Budget filters
    const minP = filterMinPrice !== '' ? Number(filterMinPrice) : 0;
    const maxP = filterMaxPrice !== '' ? Number(filterMaxPrice) : Infinity;
    displayList = displayList.filter(p => {
      const priceNum = p.priceRaw !== undefined ? p.priceRaw : Number(String(p.price || 0).replace(/[^\d]/g, ''));
      return priceNum >= minP && priceNum <= maxP;
    });

    // 4. Rating/Star Category filter
    if (filterMinRating > 0) {
      displayList = displayList.filter(p => Math.round(Number(p.rating || 0)) >= filterMinRating);
    }

    // 5. Amenities filter
    if (filterSelectedAmenities.length > 0) {
      displayList = displayList.filter(p => {
        const propAmenities = (p.amenities || []).map(a => a.toLowerCase());
        return filterSelectedAmenities.some(a => propAmenities.some(pa => pa.includes(a.toLowerCase())));
      });
    }

    // 6. Booking Preferences filters
    if (filterInstantBook) {
      displayList = displayList.filter(p => p.instantBook || (p.rules || '').toLowerCase().includes('instant') || (p.description || '').toLowerCase().includes('instant'));
    }
    if (filterCancellationPolicy) {
      displayList = displayList.filter(p => p.cancellationPolicy || (p.rules || '').toLowerCase().includes('cancellation') || (p.description || '').toLowerCase().includes('cancel'));
    }
    if (filterHomestays) {
      displayList = displayList.filter(p => p.category?.toLowerCase() === 'homestay' || p.type?.toLowerCase() === 'homestay');
    }

    return displayList;
  };

  return (
    <>
      <div className="app-main-root-container">

        <Navbar
          activeMenu={activeMenu}
          onNavigate={setActiveMenu}
          token={token}
          user={user}
          onLogout={handleLogout}
          onOpenAuth={openAuthModal}
        />
      {/* ══ HERO SECTION (Height: 712px, Width: 100%) ══ */}
      {(activeMenu !== 'Detail' && activeMenu !== 'Profile' && activeMenu !== 'Wishlist' && activeMenu !== 'Enquiries' && activeMenu !== 'Reviews' && activeMenu !== 'About Us' && activeMenu !== 'Contact' && activeMenu !== 'Terms' && activeMenu !== 'Privacy' && activeMenu !== 'Recommend By Us' && activeMenu !== 'List Your Place') && (
        <div className="hero-wrapper">
          
          {/* Background Image: Loads your exact high-resolution custom hero image */}
          <img 
            src={heroBgImg} 
            className="hero-background" 
            alt="Luxury Villa Background" 
          />

          {/* Overlay holding the header, titles and layout layers */}
          <div className="hero-overlay">
            
            {/* ══ MAIN HERO HEADLINE (Conditional based on properties tab) ══ */}
            <div className="hero-headline-container">
              {activeMenu === 'Properties' ? (
                <h1 className="hero-headline">
                  {where ? 'Best Properties In ' : 'Best Properties '}
                  <span className="highlight-sharp-blue-box" style={{ borderRadius: 0, padding: '0 16px' }}>
                    {where ? (where.charAt(0).toUpperCase() + where.slice(1) + (where.toLowerCase() === 'india' ? '' : ', India')) : 'For You'}
                  </span>
                </h1>
              ) : (
                <h1 className="hero-headline">
                  Find Your 
                  <span className="hero-headline-span">
                    Perfect Stay
                  </span>
                </h1>
              )}
            </div>

          </div>

          {/* ══ FLOATING SEARCH CARD ══ */}
          <div className="search-card-wrapper">
            {/* Top category bar */}
            <div className="tabs-row">
              {['Villas', 'Homestays', 'Hotels', 'Resorts', 'More+'].map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeSearchTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveSearchTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Grid inputs layout */}
            <div className="search-fields-grid">
              
              {/* Field 1: Where */}
              <div className="field-group">
                <span className="field-label">Where</span>
                <div className="field-control-wrap">
                  <input 
                    type="text" 
                    className="field-input" 
                    placeholder="Where are you going?" 
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                  />
                </div>
              </div>

              {/* Field 2: When */}
              <div className="field-group">
                <span className="field-label">When</span>
                <div className="field-control-wrap">
                  <input 
                    type="text" 
                    className="field-input" 
                    placeholder="Select dates" 
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                  />
                </div>
              </div>

              {/* Field 3: Who */}
              <div className="field-group">
                <span className="field-label">Who</span>
                <div className="field-control-wrap">
                  <select 
                    className="field-select" 
                    value={guests} 
                    onChange={(e) => setGuests(e.target.value)}
                  >
                    <option value="Any Guests">Any Guests</option>
                    <option value="1 Guest">1 Guest</option>
                    <option value="2 Guests">2 Guests</option>
                    <option value="3 Guests">3 Guests</option>
                    <option value="4+ Guests">4+ Guests</option>
                  </select>
                  <ChevronDown size={14} className="field-select-arrow" />
                </div>
              </div>

              {/* Field 4: Price per Night */}
              <div className="field-group">
                <span className="field-label">Price per Night</span>
                <div className="field-control-wrap">
                  <select 
                    className="field-select" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                  >
                    <option value="Any">Any</option>
                    <option value="₹2,000 - ₹5,000">₹2,000 - ₹5,000</option>
                    <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
                    <option value="₹10,000 - ₹20,000">₹10,000 - ₹20,000</option>
                    <option value="₹20,000+">₹20,000+</option>
                  </select>
                  <ChevronDown size={14} className="field-select-arrow" />
                </div>
              </div>

              {/* Field 5: Room/Stay Type */}
              <div className="field-group">
                <span className="field-label">Room/Stay Type</span>
                <div className="field-control-wrap">
                  <select 
                    className="field-select" 
                    value={stayType} 
                    onChange={(e) => setStayType(e.target.value)}
                  >
                    <option value="Any">Any</option>
                    <option value="1 Deluxe Room">1 Deluxe Room</option>
                    <option value="2 Deluxe Rooms">2 Deluxe Rooms</option>
                    <option value="Entire Villa">Entire Villa</option>
                  </select>
                  <ChevronDown size={14} className="field-select-arrow" />
                </div>
              </div>

              {/* Field 6: Food Preference */}
              <div className="field-group">
                <span className="field-label">Food Preference</span>
                <div className="field-control-wrap">
                  <select 
                    className="field-select" 
                    value={foodPref} 
                    onChange={(e) => setFoodPref(e.target.value)}
                  >
                    <option value="Any">Any</option>
                    <option value="Pure Veg">Pure Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Buffet Available">Buffet Available</option>
                  </select>
                  <ChevronDown size={14} className="field-select-arrow" />
                </div>
              </div>

            </div>

            {/* Action and Checkbox controls row */}
            <div className="action-buttons-row">
              
              {/* Filter checkboxes */}
              <div className="checkbox-row">
                <label className="custom-checkbox-label">
                  <input 
                    type="checkbox" 
                    className="custom-checkbox" 
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                  />
                  <span>Verified only</span>
                </label>
                <label className="custom-checkbox-label">
                  <input 
                    type="checkbox" 
                    className="custom-checkbox" 
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                  />
                  <span>Featured only</span>
                </label>
              </div>

              {/* Execution Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button className="btn-outline">Close</button>
                <button className="btn-outline" onClick={handleClearAll}>Clear all</button>
                
                <button className="btn-search" onClick={handleSearch}>
                  <Search size={16} />
                  <span>Search</span>
                </button>

                <button className="btn-search-ai" onClick={handleAISearch} disabled={aiSearchLoading} style={{ opacity: aiSearchLoading ? 0.7 : 1 }}>
                  <Sparkles size={16} color="var(--primary-blue)" />
                  <span>{aiSearchLoading ? 'Searching...' : 'Search with AI'}</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ══ CONDITIONAL ROUTING ══ */}

      {/* VIEW A: MY PROFILE (MY ACCOUNT) PAGE VIEW */}
      {activeMenu === 'Profile' && (
        <div className="account-dashboard-wrapper fade-in">
          
          {/* Custom scenic high-resolution profile banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${profileHeroImg}")` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>My Profile</h1>
          </div>

          <div className="dashboard-content-box">
            <h2 className="dashboard-section-main">My Account</h2>
            <p className="dashboard-section-sub">Manage your bookings, wishlist, and personal details here.</p>

            {/* Sub-navigation Capsule Row */}
            <div className="dashboard-capsule-nav">
              <button className="capsule-btn active" onClick={() => setActiveMenu('Profile')}>
                <User size={15} />
                <span>My Account</span>
              </button>
              <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Wishlist'); }}>
                <Heart size={15} />
                <span>Wishlist</span>
              </button>
              <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Enquiries'); }}>
                <Inbox size={15} />
                <span>My Enquiries</span>
              </button>
              <button className="capsule-btn" onClick={() => setActiveMenu('Reviews')}>
                <MessageSquare size={15} />
                <span>My Reviews</span>
              </button>
            </div>

            {/* Profile Grid Card details */}
            <div className="profile-detail-card">
              
              {/* Header Avatar and Name row */}
              <div className="profile-card-avatar-row">
                <div className="profile-avatar-large">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Rohan Sharma" />
                </div>
                <div className="profile-avatar-info">
                  <h3 className="profile-user-fullname">{user?.name || 'User'}</h3>
                </div>
              </div>

              {/* Personal Info Grid Block */}
              <div className="profile-grid-block">
                <div className="block-header">
                  <h4>Personal Information</h4>
                  <button className="btn-edit-details" onClick={openEditProfileModal}>
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                </div>
                
                <div className="block-fields-grid">
                  <div className="field-cell">
                    <span className="field-cell-lbl">First Name</span>
                    <span className="field-cell-val">{user?.name?.split(' ')[0] || 'N/A'}</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Last Name</span>
                    <span className="field-cell-val">{user?.name?.split(' ').slice(1).join(' ') || 'N/A'}</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Country of Citizenship</span>
                    <span className="field-cell-val">{user?.citizenship || 'India'}</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Email Address</span>
                    <span className="field-cell-val">{user?.email || 'N/A'}</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Phone Number</span>
                    <span className="field-cell-val">{user?.phone || 'N/A'}</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Country of Residence</span>
                    <span className="field-cell-val">{user?.residence || 'India'}</span>
                  </div>
                </div>
              </div>

              {/* Address Grid Block */}
              <div className="profile-grid-block">
                <div className="block-header">
                  <h4>Address</h4>
                  <button className="btn-edit-details" onClick={openEditProfileModal}>
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                </div>
                
                <div className="block-fields-grid">
                  <div className="field-cell full-width">
                    <span className="field-cell-lbl">Home Address</span>
                    <span className="field-cell-val">{user?.address || 'N/A'}</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Pin Code</span>
                    <span className="field-cell-val">{user?.pincode || 'N/A'}</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">State</span>
                    <span className="field-cell-val">{user?.state || 'N/A'}</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">City</span>
                    <span className="field-cell-val">{user?.city || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Other Details Grid Block */}
              <div className="profile-grid-block" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <div className="block-header">
                  <h4>Other Details</h4>
                  <button className="btn-edit-details" onClick={openEditProfileModal}>
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                </div>
                
                <div className="block-fields-grid">
                  <div className="field-cell">
                    <span className="field-cell-lbl">Emergency Contact Person</span>
                    <span className="field-cell-val">{user?.emergencyName || 'N/A'}</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Phone Number</span>
                    <span className="field-cell-val">{user?.emergencyPhone || 'N/A'}</span>
                  </div>
                  <div className="field-cell">
                    <span className="field-cell-lbl">Email Address</span>
                    <span className="field-cell-val">{user?.emergencyEmail || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Access Grid Block for Owners/Admins */}
              {user && (user.role === 'owner' || user.role === 'admin' || user.role === 'super_admin') && (
                <div className="profile-grid-block" style={{ borderTop: '1px solid #E5E7EB', paddingTop: 20, marginTop: 20 }}>
                  <div className="block-header">
                    <h4>Dashboard Access</h4>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                    {(user.role === 'owner') && (
                      <button
                        className="btn-login"
                        onClick={() => window.location.href = '/owner/dashboard'}
                        style={{ background: '#58A429', color: '#FFF', fontWeight: 600, border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer' }}
                      >
                        Go to Owner Dashboard
                      </button>
                    )}
                    {(user.role === 'admin' || user.role === 'super_admin') && (
                      <button
                        className="btn-login"
                        onClick={() => window.location.href = '/admin/dashboard'}
                        style={{ background: '#2563EB', color: '#FFF', fontWeight: 600, border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer' }}
                      >
                        Go to Admin Dashboard
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* VIEW B: MY WISHLIST PAGE VIEW */}
      {activeMenu === 'Wishlist' && (
        <div className="account-dashboard-wrapper fade-in">
          
          {/* Custom scenic high-resolution wishlist banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${wishlistHeroImg}")` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>My Wishlist</h1>
          </div>

          <div className="dashboard-content-box">
            <div className="wishlist-title-header-row">
              <h2 className="dashboard-section-main">Wishlist</h2>
              <button className="btn-wishlist-filter" onClick={() => setIsWishlistFilterOpen(!isWishlistFilterOpen)}>
                <img src={filterIcon} alt="Filter" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                <span>Filters</span>
              </button>
            </div>
            <p className="dashboard-section-sub">Keep track of destinations and villas you love. Access them anytime and make your travel planning simple.</p>

            {isWishlistFilterOpen && (
              <div className="filter-panel-box" style={{ display: 'flex', gap: '16px', margin: '16px 0', padding: '16px', background: '#FAFAFA', borderRadius: '10px', border: '1px solid #E5E7EB', alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>Search Stays</label>
                  <input 
                    type="text" 
                    placeholder="Search by villa name or location..." 
                    value={wishlistSearchQuery}
                    onChange={e => setWishlistSearchQuery(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>Sort By</label>
                  <select 
                    value={wishlistSortOption}
                    onChange={e => setWishlistSortOption(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff' }}
                  >
                    <option value="All">Default (Saved Date)</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Guest Rating</option>
                  </select>
                </div>
              </div>
            )}

            {/* Sub-navigation Capsule Row */}
            <div className="dashboard-capsule-nav">
              <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Profile'); }}>
                <User size={15} />
                <span>My Account</span>
              </button>
              <button className="capsule-btn active" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Wishlist'); }}>
                <Heart size={15} />
                <span>Wishlist</span>
              </button>
              <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Enquiries'); }}>
                <Inbox size={15} />
                <span>My Enquiries</span>
              </button>
              <button className="capsule-btn" onClick={() => setActiveMenu('Reviews')}>
                <MessageSquare size={15} />
                <span>My Reviews</span>
              </button>
            </div>

            {/* Saved villas wishlist grid layout */}
            <div className="villas-grid" style={{ marginTop: '40px' }}>
              {(() => {
                const wishlistProps = user && user.wishlist ? mapDbProperties(user.wishlist, []) : [];
                const filtered = wishlistProps.filter(villa => {
                  const matchesSearch = !wishlistSearchQuery || 
                    (villa.title && villa.title.toLowerCase().includes(wishlistSearchQuery.toLowerCase())) ||
                    (villa.location && villa.location.toLowerCase().includes(wishlistSearchQuery.toLowerCase()));
                  return matchesSearch;
                });
                if (wishlistSortOption === 'price-low-high') {
                  filtered.sort((a, b) => a.price - b.price);
                } else if (wishlistSortOption === 'price-high-low') {
                  filtered.sort((a, b) => b.price - a.price);
                } else if (wishlistSortOption === 'rating') {
                  filtered.sort((a, b) => b.rating - a.rating);
                }
                if (filtered.length === 0) {
                  return <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6B7280' }}>Your wishlist is empty or no stays match your criteria.</p>;
                }
                return filtered.map((villa, idx) => {
                  const isWishlisted = user && user.wishlist && user.wishlist.some(w => w._id === villa._id || w === villa._id);
                  return (
                    <div key={idx} className="recommend-property-card">
                      <div className="recommend-card-img-wrap">
                        <img src={villa.img} alt={villa.title} />
                        <button 
                          className={`recommend-heart-circle ${isWishlisted ? 'liked' : ''}`}
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!token) {
                              setAuthMode('login');
                              setAuthModalOpen(true);
                              return;
                            }
                            try {
                              const res = await fetch(`${API_BASE}/users/wishlist/${villa._id}`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${token}`
                                }
                              });
                              if (res.ok) {
                                fetchProfileAndEnquiries(token);
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                        >
                          <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : '#FFFFFF'} />
                        </button>
                      </div>
                      
                      <div className="recommend-card-info-col">
                        <h3 className="recommend-card-name-text">{villa.title}</h3>
                        
                        <div className="recommend-card-location-row">
                          <span>{villa.location}</span>
                          <MapPin size={13} color="#9CA3AF" />
                        </div>

                        <div className="recommend-specs-2x2-grid">
                          <div className="recommend-spec-pill">
                            <img src={areaIcon} alt="Area" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                            <span>Area Size: {(villa.bedRooms || 2) * 150} sq. ft.</span>
                          </div>
                          <div className="recommend-spec-pill">
                            <img src={bedIcon} alt="Beds" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                            <span>Beds: {villa.bedRooms || 2} Beds</span>
                          </div>
                          <div className="recommend-spec-pill">
                            <img src={roomIcon} alt="Rooms" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                            <span>Rooms: {villa.bedRooms || 1} Room</span>
                          </div>
                          <div className="recommend-spec-pill">
                            <img src={guestIcon} alt="Guests" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                            <span>Guests: {villa.capacity || 3} Person</span>
                          </div>
                        </div>

                        <div className="recommend-price-tag-row">
                          <span className="price-label">Starting from</span>
                          <span className="price-green-bold">
                            {String(villa.price).startsWith('₹') ? villa.price : '₹' + villa.price}/night
                          </span>
                        </div>

                        <div className="recommend-actions-row">
                          <button className="recommend-details-btn-blue" onClick={() => { setSelectedProperty(villa); setActiveMenu('Detail'); }}>View Details</button>
                          <button className="recommend-contact-btn-green" onClick={() => { setSelectedProperty(villa); setContactStep(1); setContactModalOpen(true); }}>Contact Owner</button>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

          </div>
        </div>
      )}

      {/* VIEW B-2: MY ENQUIRIES PAGE VIEW */}
      {activeMenu === 'Enquiries' && (
        <div className="account-dashboard-wrapper fade-in">
          
          {/* Custom scenic high-resolution enquiries banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${enquiriesHeroImg}")` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>My Enquiries</h1>
          </div>

          <div className="dashboard-content-box">
            <div className="wishlist-title-header-row">
              <h2 className="dashboard-section-main">My Enquiries</h2>
              <button className="btn-wishlist-filter" onClick={() => setIsEnquiryFilterOpen(!isEnquiryFilterOpen)}>
                <img src={filterIcon} alt="Filter" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                <span>Filters</span>
              </button>
            </div>
            <p className="dashboard-section-sub">Manage your enquiries details from here</p>

            {isEnquiryFilterOpen && (
              <div className="filter-panel-box" style={{ display: 'flex', gap: '16px', margin: '16px 0', padding: '16px', background: '#FAFAFA', borderRadius: '10px', border: '1px solid #E5E7EB', alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>Search Enquiries</label>
                  <input 
                    type="text" 
                    placeholder="Search by villa name or message..." 
                    value={enquirySearchQuery}
                    onChange={e => setEnquirySearchQuery(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>Status Filter</label>
                  <select 
                    value={enquiryStatusFilter}
                    onChange={e => setEnquiryStatusFilter(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff' }}
                  >
                    <option value="All">All Enquiries</option>
                    <option value="Open">Open</option>
                    <option value="Replied">Replied</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            )}

            {/* Sub-navigation Capsule Row */}
            <div className="dashboard-capsule-nav">
              <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Profile'); }}>
                <User size={15} />
                <span>My Account</span>
              </button>
              <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Wishlist'); }}>
                <Heart size={15} />
                <span>Wishlist</span>
              </button>
              <button className="capsule-btn active" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Enquiries'); }}>
                <Inbox size={15} />
                <span>My Enquiries</span>
              </button>
              <button className="capsule-btn" onClick={() => setActiveMenu('Reviews')}>
                <MessageSquare size={15} />
                <span>My Reviews</span>
              </button>
            </div>

            {/* Enquiries horizontal list container */}
            <div className="dashboard-list-items-stack">
              {(() => {
                const filtered = (liveEnquiries || []).filter(e => {
                  const matchesStatus = enquiryStatusFilter === 'All' || e.status === enquiryStatusFilter;
                  const matchesSearch = !enquirySearchQuery ||
                    (e.propertyName && e.propertyName.toLowerCase().includes(enquirySearchQuery.toLowerCase())) ||
                    (e.message && e.message.toLowerCase().includes(enquirySearchQuery.toLowerCase())) ||
                    (e.query && e.query.toLowerCase().includes(enquirySearchQuery.toLowerCase()));
                  return matchesStatus && matchesSearch;
                });
                if (filtered.length === 0) {
                  return <p style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>No enquiries match your criteria.</p>;
                }
                return filtered.map((e, index) => {
                  const enq = {
                    title: e.propertyName || 'Property Enquiry',
                    location: e.phone ? `Phone: ${e.phone}` : 'Tripinvilla Inquiry Desk',
                    enquiryText: e.message || e.query,
                    status: e.status || 'Open',
                    reply: e.reply,
                    img: (e.property_id && e.property_id.images && e.property_id.images[0]) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80'
                  };
                  return (
                    <div key={index} className="dashboard-list-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <div className="list-card-img-wrap">
                          <img src={enq.img} alt={enq.title} />
                        </div>
                        <div className="list-card-details" style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="list-card-title">{enq.title}</h3>
                            <span style={{ 
                              padding: '4px 10px', 
                              borderRadius: '20px', 
                              fontSize: '12px', 
                              fontWeight: 600,
                              backgroundColor: enq.status === 'Replied' ? '#D1FAE5' : enq.status === 'Closed' ? '#F3F4F6' : '#FEF3C7',
                              color: enq.status === 'Replied' ? '#065F46' : enq.status === 'Closed' ? '#374151' : '#92400E'
                            }}>
                              {enq.status}
                            </span>
                          </div>
                          <div className="list-card-location">
                            <MapPin size={13} color="#9CA3AF" />
                            <span>{enq.location}</span>
                          </div>
                          <p className="list-card-question">
                            "{enq.enquiryText}"
                          </p>
                        </div>
                      </div>
                      {enq.reply && (
                        <div style={{ marginLeft: '140px', padding: '12px 16px', background: '#F9FAFB', borderRadius: '8px', borderLeft: '3px solid #58A429' }}>
                          <strong style={{ fontSize: '12px', color: '#374151', display: 'block', marginBottom: '4px' }}>Host Reply:</strong>
                          <p style={{ margin: 0, fontSize: '13px', color: '#4B5563', fontStyle: 'italic' }}>"{enq.reply}"</p>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

          </div>
        </div>
      )}

      {/* VIEW B-3: MY REVIEWS PAGE VIEW */}
      {activeMenu === 'Reviews' && (
        <div className="account-dashboard-wrapper fade-in">
          
          {/* Custom scenic high-resolution reviews banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${reviewsHeroImg}")` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>My Reviews</h1>
          </div>

          <div className="dashboard-content-box">
            <div className="wishlist-title-header-row">
              <h2 className="dashboard-section-main">My Reviews</h2>
              <button className="btn-wishlist-filter" onClick={() => setIsReviewsFilterOpen(!isReviewsFilterOpen)}>
                <img src={filterIcon} alt="Filter" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                <span>Filters</span>
              </button>
            </div>
            <p className="dashboard-section-sub">Manage your review details from here</p>

            {isReviewsFilterOpen && (
              <div className="filter-panel-box" style={{ display: 'flex', gap: '16px', margin: '16px 0', padding: '16px', background: '#FAFAFA', borderRadius: '10px', border: '1px solid #E5E7EB', alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>Filter by Rating</label>
                  <select 
                    value={reviewsRatingFilter}
                    onChange={e => setReviewsRatingFilter(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff', width: '200px' }}
                  >
                    <option value="All">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>
            )}

            {/* Sub-navigation Capsule Row */}
            <div className="dashboard-capsule-nav">
              <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Profile'); }}>
                <User size={15} />
                <span>My Account</span>
              </button>
              <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Wishlist'); }}>
                <Heart size={15} />
                <span>Wishlist</span>
              </button>
              <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Enquiries'); }}>
                <Inbox size={15} />
                <span>My Enquiries</span>
              </button>
              <button className="capsule-btn active" onClick={() => setActiveMenu('Reviews')}>
                <MessageSquare size={15} />
                <span>My Reviews</span>
              </button>
            </div>

            {/* Reviews horizontal list container */}
            <div className="dashboard-list-items-stack">
              {(() => {
                const filtered = (userReviews || []).filter(r => {
                  return reviewsRatingFilter === 'All' || r.rating.toString() === reviewsRatingFilter;
                });
                if (!userReviews || userReviews.length === 0) {
                  return <p style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>You haven't posted any reviews yet.</p>;
                }
                if (filtered.length === 0) {
                  return <p style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>No reviews found matching this criteria.</p>;
                }
                return filtered.map((r, index) => {
                  return (
                    <div key={index} className="dashboard-list-card" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
                      <div className="list-card-img-wrap">
                        <img src={r.img} alt={r.title} />
                      </div>
                      <div className="list-card-details" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 className="list-card-title">{r.title}</h3>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map(num => (
                              <Star key={num} size={14} fill={num <= r.rating ? '#F59E0B' : 'none'} color={num <= r.rating ? '#F59E0B' : '#D1D5DB'} />
                            ))}
                          </div>
                        </div>
                        <div className="list-card-location">
                          <MapPin size={13} color="#9CA3AF" />
                          <span>{r.location}</span>
                        </div>
                        <p className="list-card-question" style={{ marginTop: '8px', color: '#4B5563', fontStyle: 'italic' }}>
                          "{r.reviewText}"
                        </p>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

          </div>
        </div>
      )}

      {/* VIEW B-4: ABOUT US FULL PAGE VIEW */}
      {activeMenu === 'About Us' && (
        <div className="about-page-layout fade-in">
          
          {/* Custom scenic high-resolution About Us banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${aboutHeroImg}")` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>About Us</h1>
          </div>

          <div className="about-main-wrapper">
            
            {/* Split layout: brand statements vs alpine photo card */}
            <div className="about-split-grid">
              
              {/* Left Column texts */}
              <div className="about-left-col">
                <h2 className="about-main-hdr">
                  Redefining the Way You <span className="highlight-sharp-blue-box" style={{ borderRadius: 0, padding: '4px 10px' }}>Experience Stays</span>
                </h2>
                
                <p className="about-desc-p">
                  We bring together handpicked hotels and private villas that combine comfort, quality, and reliability. Every property on our platform is carefully verified to ensure high standards of hospitality, transparent pricing, and a seamless booking experience—so you can focus on enjoying your journey, not planning it.
                </p>

                <div className="about-bullets-row">
                  <div className="about-bullet-item">
                    <CheckCircle size={16} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" />
                    <span>Curated & Verified Stays</span>
                  </div>
                  <div className="about-bullet-item">
                    <CheckCircle size={16} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" />
                    <span>Seamless Booking Experience</span>
                  </div>
                </div>

                {/* Our Mission */}
                <div className="about-mission-block">
                  <div className="green-square-icon-wrap">
                    <img src={missionIcon} alt="Our Mission Icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div className="mission-texts">
                    <h5>Our Mission</h5>
                    <p>Our mission is to connect travelers with high-quality stays through a user-friendly platform.</p>
                  </div>
                </div>

                {/* Our Vision */}
                <div className="about-mission-block">
                  <div className="green-square-icon-wrap">
                    <img src={visionIcon} alt="Our Vision Icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div className="mission-texts">
                    <h5>Our Vision</h5>
                    <p>To become a trusted travel platform that redefines how people discover and experience hotels and villas—making every stay comfortable, reliable, and memorable.</p>
                  </div>
                </div>

              </div>

              {/* Center Decorative Column */}
              <div className="about-vertical-line"></div>

              {/* Right Column photo */}
              <div className="about-right-col">
                <div className="about-master-image-box">
                  <img src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80" alt="Sunny alpine mountain chalet" />
                </div>
                
                {/* 40+ blue overlapping card */}
                <div className="about-blue-badge-card">
                  <span className="about-badge-title">40+</span>
                  <div className="about-badge-divider"></div>
                  <span className="about-badge-sub">Years of Experience That Drive Results</span>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Our Services (Reused Component directly!) */}
          <div className="services-section" style={{ background: '#EBFDF2', padding: '60px 0', margin: '80px 0 0 0' }}>
            <div className="services-inner-container">
                
                <div className="section-title-wrap">
                  <h2 className="section-main-headline">
                    Why Choose Our <span className="highlight-sharp-blue-box">Services</span>
                  </h2>
                  <p className="section-sub-headline" style={{ color: '#4B5563' }}>
                    Choose the next destination for you
                  </p>
                </div>

                <div className="services-grid-asym">
                  <div className="services-col">
                    <div className="service-text-card white-bg">
                      <p className="service-card-desc">
                        Every property is carefully verified to ensure quality, safety, and comfort you can rely on.
                      </p>
                      <h3 className="service-card-accent-title">Verified & Trusted Stays</h3>
                      <p className="service-card-subtext">Get genuine and good stays</p>
                    </div>
                    <div className="service-image-card">
                      <img src={rect35Img} alt="Secure Payments" />
                      <div className="service-overlay-badge-bottom">
                        <div className="service-icon-circle-overlay"><CreditCard size={18} color="#FFFFFF" /></div>
                        <span>Secure Payments</span>
                      </div>
                    </div>
                  </div>

                  <div className="services-col-center">
                    <div className="service-tall-card">
                      <img src={rect32Img} alt="Traveler center image" />
                    </div>
                  </div>

                  <div className="services-col">
                    <div className="service-image-card">
                      <img src={rect33Img} alt="Best Price" />
                      <div className="service-overlay-badge-bottom">
                        <div className="service-icon-circle-overlay"><Percent size={18} color="#FFFFFF" /></div>
                        <span>Best Price Guarantee</span>
                      </div>
                    </div>
                    <div className="service-text-card transparent-bg">
                      <div className="service-card-top-group">
                        <h3 className="service-card-accent-title">24/7 Support, Always There</h3>
                        <p className="service-card-bold-sub">All type of support</p>
                      </div>
                      <p className="service-card-desc-light">
                        From booking to checkout, our support team is available anytime to help you.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          <div className="about-main-wrapper" style={{ marginTop: 0 }}>
            {/* Our Testimonials Section */}
            <div className="our-testimonials-section" style={{ margin: '80px 0 20px 0' }}>
              <div className="section-title-wrap">
                <h2 className="section-main-headline">
                  Our <span className="highlight-sharp-blue-box">Testimonials</span>
                </h2>
                <p className="section-sub-headline">
                  Check what our customers says about us
                </p>
              </div>

              {/* Renders the horizontal reviewers stack */}
              <div className="testimonials-horizontal-cards-row">
                
                {/* Review Card 1 */}
                <div className="testimonial-card-item">
                  <div className="testimonial-author-avatar-top">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Jessy Roy" />
                  </div>
                  <p className="testimonial-card-quote">
                    "Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth. They didn't just deliver a solution—they delivered confidence and long-term value."
                  </p>
                  <div className="testimonial-footer-info">
                    <h5 className="author-name-signature">Jessy Roy</h5>
                    <span className="author-role-text">Director of Operations, Enterprise Client</span>
                  </div>
                </div>

                {/* Review Card 2: Full video cover style with overlay */}
                <div className="testimonial-card-item image-cover-mode">
                  <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80" alt="David Campbell" />
                  
                  <div className="image-cover-tint-overlay">
                    {/* Circle avatar badge */}
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #FFFFFF' }}>
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="David thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div className="play-btn-circle-large">
                      <Play size={20} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: '3px' }} />
                    </div>

                    <div>
                      <h5 className="cover-mode-signature-title">David Campbell</h5>
                      <span className="cover-mode-signature-role">Head of Digital Transformation</span>
                    </div>
                  </div>
                </div>

                {/* Review Card 3 */}
                <div className="testimonial-card-item">
                  <div className="testimonial-author-avatar-top">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Jeremy Renner" />
                  </div>
                  <p className="testimonial-card-quote">
                    "From initial consultation to final delivery, the team demonstrated exceptional professionalism. Their attention to detail, responsiveness, and quality of work significantly improved our operational efficiency."
                  </p>
                  <div className="testimonial-footer-info">
                    <h5 className="author-name-signature">Jeremy Renner</h5>
                    <span className="author-role-text">Project Manager, Corporate Solutions Firm</span>
                  </div>
                </div>

                {/* Review Card 4 */}
                <div className="testimonial-card-item">
                  <div className="testimonial-author-avatar-top">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Winona Ryder" />
                  </div>
                  <p className="testimonial-card-quote">
                    "Working with this team has been a seamless experience from start to finish. Their strategic approach, technical expertise, and commitment to deadlines helped us achieve measurable business growth. They didn't just deliver a solution—they delivered confidence and long-term value."
                  </p>
                  <div className="testimonial-footer-info">
                    <h5 className="author-name-signature">Winona Ryder</h5>
                    <span className="author-role-text">CEO, Growing Tech Company</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW B-5: CONTACT US FULL PAGE VIEW */}
      {activeMenu === 'Contact' && (
        <div className="contact-page-wrapper fade-in">
          
          {/* Custom scenic high-resolution Contact Us banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${contactHeroImg}")` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>Contact Us</h1>
          </div>

          {/* Main Card Grid container holding left photo and right interactive form */}
          <div className="contact-main-row">
            
            {/* Left Column Image of front desk receptionists */}
            <div className="contact-image-panel">
              <img src={contactBgShapeImg} alt="Professional hotel frontdesk receptionists" />
            </div>

            {/* Right Column Form */}
            <div className="contact-form-panel">
              <h2 className="contact-form-title">Contact Us</h2>
              <p className="contact-form-sub">Fill out the form below & our team of expert will reach out to you as soon as possible.</p>

              <div className="contact-form-grid">
                
                {/* Row 1: Name and Phone */}
                <div className="contact-input-row">
                  <div className="contact-field-group">
                    <label className="contact-field-label">Name</label>
                    <input 
                      type="text" 
                      className="contact-text-input" 
                      placeholder="Enter your name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                  <div className="contact-field-group">
                    <label className="contact-field-label">Phone Number</label>
                    <input 
                      type="text" 
                      className="contact-text-input" 
                      placeholder="Enter your phone number"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 2: Email */}
                <div className="contact-field-group">
                  <label className="contact-field-label">Email Address</label>
                  <input 
                    type="email" 
                    className="contact-text-input" 
                    placeholder="Enter your email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>

                {/* Row 3: Message */}
                <div className="contact-field-group">
                  <label className="contact-field-label">Message</label>
                  <textarea 
                    className="contact-textarea" 
                    placeholder="Enter your message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  />
                </div>

                {/* Row 4: Custom Circular Radio Agreement check */}
                <div className="contact-agreement-row" onClick={() => setContactAgreed(!contactAgreed)}>
                  <div className={`contact-radio-indicator ${contactAgreed ? 'checked' : ''}`}>
                    {contactAgreed && <div className="contact-radio-dot" />}
                  </div>
                  <span className="contact-agreement-text">Agreed to the terms & conditions</span>
                </div>

                {/* Row 5: Action submit button */}
                <button 
                  className="btn-send-message-green"
                  onClick={() => {
                    if (!contactAgreed) {
                      alert('Please agree to the terms & conditions first!');
                      return;
                    }
                    alert(`Thank you ${contactName || 'Valued Guest'}! Your message has been sent to our corporate desks successfully!`);
                    setContactName('');
                    setContactPhone('');
                    setContactEmail('');
                    setContactMessage('');
                    setContactAgreed(false);
                  }}
                >
                  <span>Send us a message</span>
                  <ChevronRight size={18} />
                </button>

              </div>
            </div>

          </div>

          {/* Contact Details Grid Box underneath */}
          <div className="contact-details-wrapper">
            
            {/* Left description column */}
            <div className="details-left-side">
              <h2 className="details-main-title">Contact Details</h2>
              <p className="details-sub-title">You can call us or contact us directly</p>
            </div>

            {/* Right details stack column */}
            <div className="details-cards-stack">
              
              {/* Card 1: Address */}
              <div className="details-pill-card">
                <div className="details-icon-avatar">
                  <img src={contactAddressIcon} alt="Address" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div className="details-texts-col">
                  <span className="details-card-lbl">Address</span>
                  <span className="details-card-val">Esc. 135 Cuesta Adan Grijalva, Elda Nav 11777</span>
                </div>
              </div>

              {/* Card 2: Email Us */}
              <div className="details-pill-card">
                <div className="details-icon-avatar">
                  <img src={contactEmailIcon} alt="Email" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div className="details-texts-col">
                  <span className="details-card-lbl">Email Us</span>
                  <span className="details-card-val">contact@econwise.com</span>
                </div>
              </div>

              {/* Card 3: Call Us */}
              <div className="details-pill-card">
                <div className="details-icon-avatar">
                  <img src={contactCallIcon} alt="Call" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div className="details-texts-col">
                  <span className="details-card-lbl">Call Us</span>
                  <span className="details-card-val">+91 98765 43210</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* VIEW B-6: TERMS & CONDITIONS FULL PAGE VIEW */}
      {activeMenu === 'Terms' && (
        <div className="terms-page-wrapper fade-in">
          
          {/* Custom scenic high-resolution Terms & Conditions banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${termsHeroImg}")` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>Terms & Conditions</h1>
          </div>

          {/* Centered Document container holding terms detail rows */}
          <div className="terms-document-box">
            
            <h2 className="terms-document-title">Terms and Condition</h2>

            <div className="terms-document-content">
              
              <h3 className="terms-section-header">OVERVIEW</h3>
              <p className="terms-text-p">
                The website is operated by TripinVilla. Throughout the site, the terms "we", "us" and "our" refer to TripinVilla. TripinVilla offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
              </p>
              <p className="terms-text-p">
                By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including additional terms and conditions and policies referenced here and/or available via hyperlink. These Terms of Service apply to all users of the site, including without limitation browsers, vendors, customers, merchants, and/or contributors of content.
              </p>
              <p className="terms-text-p">
                Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms are considered an offer, acceptance is expressly limited to these Terms.
              </p>
              <p className="terms-text-p" style={{ marginBottom: '40px' }}>
                Any new features or tools added to the current store shall also be subject to the Terms of Service. You can review the most current version of the Terms at any time on this page. We reserve the right to update, change, modify, or replace any part of these Terms by posting updates and/or changes on our website. It is your responsibility to check this page periodically for changes. Continued use of or access to the website following any changes constitutes acceptance of those changes.
              </p>

              <h3 className="terms-section-header">1 – ONLINE STORE TERMS</h3>
              <p className="terms-text-p">
                By agreeing to these Terms of Service, you represent that you are at least the age of majority and in good health in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
              </p>
              <p className="terms-text-p">
                You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
              </p>
              <p className="terms-text-p">
                You must not transmit any worms or viruses or any code of a destructive nature in the site.
              </p>
              <p className="terms-text-p" style={{ marginBottom: '40px' }}>
                A breach or violation of any of the Terms will result in an immediate termination of your Services and you may be liable for legal consequences.
              </p>

              <h3 className="terms-section-header">2 – GENERAL CONDITIONS</h3>
              <p className="terms-text-p">
                We reserve the right to refuse service to anyone for any reason at any time.
              </p>
              <p className="terms-text-p" style={{ marginBottom: '40px' }}>
                You understand that your content (not including credit card information), may be transferred encrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.
              </p>

              <h3 className="terms-section-header">3 – ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION</h3>
              <p className="terms-text-p">
                TripinVilla is not responsible if information made available on this website is not accurate, complete, or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete, or more timely sources of information. Any reliance on the material on this site is at your own risk.
              </p>
              <p className="terms-text-p" style={{ marginBottom: '40px' }}>
                This website may contain certain historical information. Historical information is not necessarily current and is provided for your reference only. TripinVilla reserves the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site and review updated content regularly to stay informed of any modifications.
              </p>

              <h3 className="terms-section-header">4 – MODIFICATIONS TO SERVICE AND PRICES</h3>
              <p className="terms-text-p">
                Prices for our services and products are subject to change without notice. TripinVilla reserves the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
              </p>
              <p className="terms-text-p" style={{ marginBottom: '40px' }}>
                TripinVilla shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the Service. We continuously strive to improve our services and may introduce, remove, or modify features based on operational, technical, or business requirements.
              </p>

              <h3 className="terms-section-header">6 – BILLING AND ACCOUNT INFORMATION</h3>
              <p className="terms-text-p">
                TripinVilla reserves the right to refuse any order you place with us. We may limit or cancel quantities purchased per person, per household, or per order. These restrictions may include orders placed under the same customer account, credit card, and/or orders that use the same billing and/or shipping address.
              </p>
              <p className="terms-text-p">
                You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and payment details, so that we can complete your transactions and contact you as needed.
              </p>

            </div>

          </div>

        </div>
      )}

      {/* VIEW B-6.5: PRIVACY POLICY FULL PAGE VIEW */}
      {activeMenu === 'Privacy' && (
        <div className="terms-page-wrapper fade-in">
          <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${privacyHeroImg}")` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>Privacy Policy</h1>
          </div>

          <div className="terms-document-box">
            <h2 className="terms-document-title">Privacy Policy</h2>
            <div className="terms-document-content">
              <h3 className="terms-section-header">OVERVIEW</h3>
              <p className="terms-text-p">
                This Privacy Policy describes how TripinVilla collects, uses, discloses, and protects your personal information when you visit or make a purchase from our website. By using our website and services, you agree to the collection and use of information in accordance with this policy.
              </p>
              <p className="terms-text-p">
                TripinVilla is committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. We comply with applicable data protection laws and take reasonable measures to protect your data from unauthorized access, misuse, or disclosure.
              </p>

              <h3 className="terms-section-header">1 – INFORMATION WE COLLECT</h3>
              <p className="terms-text-p">
                When you visit our website, we may automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some cookies installed on your device.
              </p>
              <p className="terms-text-p">
                Additionally, when you make a purchase or attempt to make a purchase through the website, we collect certain personal information from you, including your name, billing address, shipping address, payment information, email address, and phone number. We may also collect additional information if you contact customer support or interact with our services.
              </p>

              <h3 className="terms-section-header">2 – HOW WE USE YOUR INFORMATION</h3>
              <p className="terms-text-p">
                TripinVilla uses the collected information for various purposes, including processing transactions, providing customer support, improving our website, and communicating with you about orders, updates, or promotional offers.
              </p>
              <p className="terms-text-p">
                We may also use your information to screen orders for potential risk or fraud and to improve and optimize our website experience. Your information helps us better understand customer preferences and improve our service quality.
              </p>

              <h3 className="terms-section-header">3 – SHARING YOUR PERSONAL INFORMATION</h3>
              <p className="terms-text-p">
                TripinVilla does not sell, rent, or trade your personal information to third parties. However, we may share your information with trusted third-party service providers who assist us in operating our website, conducting business, or servicing you.
              </p>
              <p className="terms-text-p">
                We may also disclose your information when required by law, legal process, or governmental request, or to protect our legal rights and prevent fraud or security issues.
              </p>

              <h3 className="terms-section-header">4 – DATA SECURITY</h3>
              <p className="terms-text-p">
                TripinVilla takes reasonable precautions and follows industry best practices to protect your personal information from loss, misuse, unauthorized access, disclosure, alteration, or destruction.
              </p>
              <p className="terms-text-p">
                All payment information is encrypted and processed through secure payment gateways. While we strive to use commercially acceptable means to protect your personal data, no method of transmission over the Internet is 100% secure.
              </p>

              <h3 className="terms-section-header">5 – COOKIES AND TRACKING TECHNOLOGIES</h3>
              <p className="terms-text-p">
                TripinVilla uses cookies and similar tracking technologies to improve your browsing experience, analyze website traffic, and understand user behavior.
              </p>
              <p className="terms-text-p">
                You can choose to disable cookies through your browser settings. However, disabling cookies may affect certain features and functionality of our website.
              </p>

              <h3 className="terms-section-header">6 – THIRD-PARTY SERVICES</h3>
              <p className="terms-text-p">
                Our website may contain links to third-party websites or services. TripinVilla is not responsible for the privacy practices or content of third-party websites. We encourage users to review the privacy policies of any third-party websites they visit.
              </p>

              <h3 className="terms-section-header">7 – YOUR RIGHTS</h3>
              <p className="terms-text-p">
                You have the right to access, update, or delete your personal information. You may contact us if you wish to review or correct any personal information we hold about you.
              </p>
              <p className="terms-text-p">
                You may also opt out of receiving marketing communications from us at any time by following the unsubscribe instructions included in our emails.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW B-7: RECOMMENDED BY US FULL PAGE VIEW */}
      {activeMenu === 'Recommend By Us' && (
        <div className="recommend-page-wrapper fade-in">
          
          {/* Custom scenic high-resolution swimming pool resort twilight banner */}
          <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${recommendHeroImg}")` }}>
            <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>Recommended By Us</h1>
          </div>

          {/* Centered Recommendations page content wrapper */}
          <div className="recommend-main-container">
            
            {/* Header row with description and filter buttons */}
            <div className="recommend-header-row">
              <div className="recommend-header-left">
                <h2 className="recommend-header-title">Our Recommendations</h2>
                <p className="recommend-header-sub">Keep track of destinations and villas you love. Access them anytime and make your travel planning simple.</p>
              </div>
              <button className="recommend-filter-btn" onClick={() => alert('Filtering options are coming soon!')}>
                <div className="filter-icon-circle-green">
                  <img src={filterIcon} alt="Filter" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                </div>
                <span>Filters</span>
              </button>
            </div>

            {/* Recommendations Grid layout */}
            <div className="recommend-cards-grid">
              {[
                {
                  id: 0,
                  name: "Aparahotel Stare Miasto",
                  location: "Kasol, Himachal Pradesh, India",
                  area: "31 sq. ft.",
                  beds: "2 Beds",
                  rooms: "1 Room",
                  guests: "3 Person",
                  price: "140",
                  img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80"
                },
                {
                  id: 1,
                  name: "Elysian Alpine Retreat",
                  location: "Manali, Himachal Pradesh, India",
                  area: "31 sq. ft.",
                  beds: "2 Beds",
                  rooms: "1 Room",
                  guests: "3 Person",
                  price: "140",
                  img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80"
                },
                {
                  id: 2,
                  name: "Stellar Ridge Villa",
                  location: "Shimla, Himachal Pradesh, India",
                  area: "31 sq. ft.",
                  beds: "2 Beds",
                  rooms: "1 Room",
                  guests: "3 Person",
                  price: "140",
                  img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80"
                },
                {
                  id: 3,
                  name: "Grand Castle Heritage Homestay",
                  location: "Kasol, Himachal Pradesh, India",
                  area: "31 sq. ft.",
                  beds: "2 Beds",
                  rooms: "1 Room",
                  guests: "3 Person",
                  price: "140",
                  img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
                },
                {
                  id: 4,
                  name: "Infinity Blue Ocean Villa",
                  location: "Goa Beachsides, India",
                  area: "31 sq. ft.",
                  beds: "2 Beds",
                  rooms: "1 Room",
                  guests: "3 Person",
                  price: "140",
                  img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
                },
                {
                  id: 5,
                  name: "Cloud-Nine Horizon Cottage",
                  location: "Munnar Hills, Kerala, India",
                  area: "31 sq. ft.",
                  beds: "2 Beds",
                  rooms: "1 Room",
                  guests: "3 Person",
                  price: "140",
                  img: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=600&q=80"
                }
              ].map((item) => {
                const isLiked = recWishlist.includes(item.id);
                return (
                  <div key={item.id} className="recommend-property-card">
                    
                    {/* Top frame with custom image overlay */}
                    <div className="recommend-card-img-wrap">
                      <img src={item.img} alt={item.name} />
                      
                      {/* Heart wishlist circular toggle */}
                      <button 
                        className={`recommend-heart-circle ${isLiked ? 'liked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isLiked) {
                            setRecWishlist(recWishlist.filter(id => id !== item.id));
                          } else {
                            setRecWishlist([...recWishlist, item.id]);
                          }
                        }}
                      >
                        <Heart size={16} fill={isLiked ? "#EF4444" : "none"} color={isLiked ? "#EF4444" : "#FFFFFF"} />
                      </button>
                    </div>

                    <div className="recommend-card-info-col">
                      <h4 className="recommend-card-name-text">{item.name}</h4>
                      
                      <div className="recommend-card-location-row">
                        <span>{item.location}</span>
                        <MapPin size={13} color="#9CA3AF" />
                      </div>

                      <div className="recommend-specs-2x2-grid">
                        <div className="recommend-spec-pill">
                          <img src={areaIcon} alt="Area" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                          <span>Area Size: {(item.bedRooms || 2) * 150} sq. ft.</span>
                        </div>
                        <div className="recommend-spec-pill">
                          <img src={bedIcon} alt="Beds" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                          <span>Beds: {item.bedRooms || 2} Beds</span>
                        </div>
                        <div className="recommend-spec-pill">
                          <img src={roomIcon} alt="Rooms" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                          <span>Rooms: {item.bedRooms || 1} Room</span>
                        </div>
                        <div className="recommend-spec-pill">
                          <img src={guestIcon} alt="Guests" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                          <span>Guests: {item.capacity || 3} Person</span>
                        </div>
                      </div>

                      <div className="recommend-price-tag-row">
                        <span className="price-label">Starting from </span>
                        <span className="price-green-bold">
                          {String(item.price).startsWith('₹') ? item.price : '₹' + item.price}/night
                        </span>
                      </div>

                      <div className="recommend-actions-row">
                        <button className="recommend-details-btn-blue" onClick={() => {
                          setSelectedProperty({
                            title: item.name,
                            location: item.location,
                            price: String(item.price).startsWith('₹') ? item.price : `₹${item.price}`,
                            img: item.img,
                            images: [
                              item.img,
                              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
                              "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=600&q=80"
                            ],
                            area: item.area,
                            beds: item.beds,
                            rooms: item.rooms,
                            guests: item.guests,
                            amenities: item.amenities || [],
                            ownerContact: item.ownerContact || '',
                            description: item.description || ''
                          });
                          setActiveMenu('Detail');
                        }}>
                          View Details
                        </button>
                        
                        <button className="recommend-contact-btn-green" onClick={() => alert(`Connecting with the owner of "${item.name}"... Our corporate desk is transferring your request.`)}>
                          Contact Owner
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* VIEW B-8: LIST YOUR PLACE FULL PAGE VIEW */}
      {activeMenu === 'List Your Place' && (
        <div className="list-property-page-wrapper fade-in">
          
          {/* High-resolution hotel bedroom banner with centered button */}
          <div className="dashboard-hero-banner list-hero-custom" style={{ backgroundImage: `url("${listPlaceHeroImg}")` }}>
            <h1 className="dashboard-hero-title">List Your Property</h1>
            
            <button className="btn-hero-green" onClick={() => {
              if (!token || !user) {
                setAuthMode('login');
                setAuthModalOpen(true);
              } else {
                window.location.href = `/owner/register?token=${token}`;
              }
            }}>
              List Property
            </button>
          </div>

          {/* Centered Steps Container: "All You Have To Do" */}
          <div className="list-steps-container">
            
            <div className="list-section-title-wrap">
              <h2 className="list-section-headline">
                All You Have <span className="highlight-sharp-blue-box">To Do</span>
              </h2>
              <p className="list-section-subline">Do The Following Steps To List Your Property With Us</p>
            </div>

            <div className="list-four-steps-grid">
              
              <div className="list-step-card">
                <div className="list-step-icon-avatar">
                  <img src={stepIcon1} alt="Step 1" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <p className="list-step-card-text">
                  Sign In Or Sign Up As A Property Owner
                </p>
              </div>

              <div className="list-step-card">
                <div className="list-step-icon-avatar">
                  <img src={stepIcon2} alt="Step 2" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <p className="list-step-card-text">
                  Upload Your Property Details And Photos
                </p>
              </div>

              <div className="list-step-card">
                <div className="list-step-icon-avatar">
                  <img src={stepIcon3} alt="Step 3" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <p className="list-step-card-text">
                  Set Your Prices And Available Dates
                </p>
              </div>

              <div className="list-step-card">
                <div className="list-step-icon-avatar">
                  <img src={stepIcon4} alt="Step 4" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <p className="list-step-card-text">
                  See Your Property Go Live In Front Of Millions Of Travelers
                </p>
              </div>

            </div>

          </div>

          {/* Reused "Why Choose Our Services" Section Container */}
          <div className="services-section" style={{ marginBottom: 0 }}>
            <div className="services-inner-container">
              
              <div className="section-title-wrap">
                <h2 className="section-main-headline">
                  Why Choose Our <span className="highlight-sharp-blue-box">Services</span>
                </h2>
                <p className="section-sub-headline" style={{ color: '#4B5563' }}>
                  Choose the next destination for you
                </p>
              </div>

              {/* Asymmetric custom grid row */}
              <div className="services-grid-asym">
                
                {/* Column 1 */}
                <div className="services-col">
                  
                  {/* White card top */}
                  <div className="service-text-card white-bg">
                    <p className="service-card-desc">
                      Every property is carefully verified to ensure quality, safety, and comfort you can rely on.
                    </p>
                    <h3 className="service-card-accent-title">Verified & Trusted Stays</h3>
                    <p className="service-card-subtext">Get genuine and good stays</p>
                  </div>

                  {/* Secure Payments bottom image */}
                  <div className="service-image-card">
                    <img 
                      src={rect35Img} 
                      alt="Secure Payments" 
                    />
                    <div className="service-overlay-badge-bottom">
                      <div className="service-icon-circle-overlay">
                        <CreditCard size={18} color="#FFFFFF" />
                      </div>
                      <span>Secure Payments</span>
                    </div>
                  </div>

                </div>

                {/* Column 2 (Full Height Traveler center image) */}
                <div className="services-col-center">
                  <div className="service-tall-card">
                    <img 
                      src={rect32Img} 
                      alt="Traveler with suitcase" 
                    />
                  </div>
                </div>

                {/* Column 3 */}
                <div className="services-col">
                  
                  {/* Pool Resort top image */}
                  <div className="service-image-card">
                    <img 
                      src={rect33Img} 
                      alt="Best Price Guarantee Pool" 
                    />
                    <div className="service-overlay-badge-bottom">
                      <div className="service-icon-circle-overlay">
                        <Percent size={18} color="#FFFFFF" />
                      </div>
                      <span>Best Price Guarantee</span>
                    </div>
                  </div>

                  {/* 24/7 Support text card bottom */}
                  <div className="service-text-card transparent-bg">
                    <div className="service-card-top-group">
                      <h3 className="service-card-accent-title">24/7 Support, Always There</h3>
                      <p className="service-card-bold-sub">All type of support</p>
                    </div>
                    <p className="service-card-desc-light">
                      From booking to checkout, our support team is available anytime to help you.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* Collapsible FAQ Accordion Section */}
          <div className="list-faq-container">
            
            <div className="list-section-title-wrap">
              <h2 className="list-section-headline">
                Frequently Asked <span className="highlight-sharp-blue-box">Questions</span>
              </h2>
              <p className="list-section-subline">You Can Ask Anything You Want</p>
            </div>

            <div className="faq-accordion-stack">
              {[
                {
                  q: "How can I enquire about a villa?",
                  a: "You can submit your enquiry through our online enquiry form available on each villa detail page. Simply provide your name, contact details, preferred dates, and requirements – our team will get back to you shortly."
                },
                {
                  q: "Is there any fee to submit an enquiry?",
                  a: "No, submitting an enquiry is completely free. You will only pay when you finalize and book a property."
                },
                {
                  q: "How soon will I receive a response?",
                  a: "Our travel experts typically respond within 2 to 4 hours during business days."
                },
                {
                  q: "Can I schedule a site visit before booking?",
                  a: "Yes, we can organize virtual or physical site visits for long-term villa rentals upon request."
                },
                {
                  q: "Are the villas available for short-term stays?",
                  a: "Absolutely! We support both short-term weekend getaways and long-term stays."
                },
                {
                  q: "What amenities are included in the villa?",
                  a: "Most of our villas include high-speed Wi-Fi, fully equipped kitchens, private pools, housekeepers, and gated security."
                }
              ].map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className={`faq-accordion-item ${isOpen ? 'expanded' : ''}`} onClick={() => setActiveFaq(isOpen ? null : idx)}>
                    
                    {/* Header Row */}
                    <div className="faq-header-trigger">
                      <div className="faq-question-col">
                        <div className="faq-badge-num">{idx + 1}</div>
                        <span className="faq-question-text">{faq.q}</span>
                      </div>
                      <ChevronDown size={18} className={`faq-arrow-indicator ${isOpen ? 'rotated' : ''}`} />
                    </div>

                    {/* Collapsible Content */}
                    <div className="faq-content-slider">
                      <p className="faq-answer-text">{faq.a}</p>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* VIEW C: PROPERTY DETAILS PAGE VIEW */}
      {activeMenu === 'Detail' && (
        <div className="detail-page-wrapper fade-in">
          

          {/* Breadcrumb row */}
          <div className="breadcrumb-row">
            <span onClick={() => setActiveMenu('Home')}>Home</span>
            <span className="bread-sep">/</span>
            <span onClick={() => setActiveMenu('Properties')}>Properties</span>
            <span className="bread-sep">/</span>
            <span className="bread-active">Property Details</span>
          </div>

          <div className="detail-white-container-card">
            {/* Triple Image and Info Box Main row */}
            <div className="detail-primary-grid">
            
            {/* Left Image grid */}
            {(() => {
              const propImages = activeDetailProp.images && activeDetailProp.images.length > 0
                ? activeDetailProp.images
                : [activeDetailProp.img];

              return (
                <>
                  <div className="detail-image-gallery" style={{
                    gridTemplateColumns: propImages.length <= 1 ? '1fr' : '1.6fr 1fr'
                  }}>
                    {/* Large main image */}
                    <div className="gallery-master-img" style={{ borderRadius: '12px 0 0 12px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => { setCurrentImageIndex(0); setIsGalleryOpen(true); }}>
                      <img src={propImages[0]} alt={activeDetailProp.title} />
                    </div>

                    {/* Right 2-row stack */}
                    {propImages.length > 1 && (
                      <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '6px', height: '440px' }}>
                        {/* Top thumbnail: image[1] */}
                        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '0 12px 0 0', cursor: 'pointer' }} onClick={() => { setCurrentImageIndex(1); setIsGalleryOpen(true); }}>
                          <img
                            src={propImages[1]}
                            alt={`${activeDetailProp.title} view 2`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        </div>

                        {/* Bottom thumbnail: image[2] with "+X" overlay */}
                        {propImages[2] && (
                          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '0 0 12px 0', cursor: 'pointer' }} onClick={() => { setCurrentImageIndex(2); setIsGalleryOpen(true); }}>
                            <img
                              src={propImages[2]}
                              alt={`${activeDetailProp.title} view 3`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                            {propImages.length > 3 && (
                              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: '#fff', fontWeight: 600, fontSize: '28px', letterSpacing: '1px' }}>+{propImages.length - 3}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Information Reservation Box */}
                  <div className="detail-reservation-card">
                    <h2 className="reservation-title">{activeDetailProp.title}</h2>
                    
                    <div className="reservation-location">
                      <MapPin size={14} color="#48BB78" />
                      <span>{activeDetailProp.location}</span>
                    </div>

                    <div className="reservation-timing-row">
                      <div className="time-badge">
                        <Calendar size={14} color="#48BB78" />
                        <span>Check In : {activeDetailProp.checkIn || '3:00 PM'}</span>
                      </div>
                      <div className="time-badge">
                        <Calendar size={14} color="#48BB78" />
                        <span>Check Out : {activeDetailProp.checkOut || '12:00 PM'}</span>
                      </div>
                    </div>

                    <div className="reservation-checks-list">
                      <div className="check-bullet">
                        <CheckCircle size={15} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" />
                        <span>Breakfast Included</span>
                      </div>
                      <div className="check-bullet">
                        <CheckCircle size={15} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" />
                        <span>Free cancellation till 24 hrs before check</span>
                      </div>
                      <div className="check-bullet">
                        <CheckCircle size={15} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" />
                        <span>Parking Available</span>
                      </div>
                    </div>

                    <div className="reservation-pricing-block">
                      <span className="old-strike-price">₹2140/night</span>
                      <span className="taxes-subtext">+212 taxes & fees per room per night</span>
                      <div style={{ marginTop: '4px' }}>
                        <span className="highlight-green-detail">{activeDetailProp.price}/night</span>
                      </div>
                    </div>

                    {hostContactRevealed ? (
                      <button className="btn-view-contact-green revealed-active" style={{ background: '#38A169', boxShadow: '0 4px 12px rgba(56, 161, 105, 0.3)' }}>
                        <Phone size={16} fill="#FFFFFF" />
                        <span style={{ fontWeight: '700' }}>{activeDetailProp.ownerContact || '+91 98765 43210'}</span>
                      </button>
                    ) : (
                      <button className="btn-view-contact-green" onClick={() => { setSelectedProperty(activeDetailProp); setContactStep(1); setContactModalOpen(true); }}>
                        <Phone size={16} fill="#FFFFFF" />
                        <span>View Contact Number</span>
                      </button>
                    )}

                  </div>


                </>
              );
            })()}

          </div>

          {/* About Property statement */}
          <div className="about-property-section">
            <h3 className="section-subtitle-title">About Property</h3>
            <p className="about-property-text">
              {(selectedProperty && selectedProperty.description) || 'Experience a comfortable and refined stay at Azure Bay Hotel, located in the heart of the city and designed for both leisure and business travelers. The hotel offers thoughtfully designed rooms, modern amenities, and warm hospitality to ensure a relaxing and memorable stay. With easy access to popular attractions, dining spots, and transport hubs, Azure Bay Hotel is an ideal choice for a seamless travel.'} <span className="read-more-link">Read More</span>
            </p>
          </div>

          {/* Amenities Row */}
          <div className="about-property-section">
            <h3 className="section-subtitle-title">Amenities</h3>
            <div className="amenities-horizontal-layout">
              <div className="amenity-vertical-item">
                <img src={areaIcon} alt="Area Size" className="amenity-vertical-icon" />
                <span className="amenity-vertical-lbl">Area Size</span>
                <span className="amenity-vertical-val">{(selectedProperty && selectedProperty.area) || '31 sq. ft.'}</span>
              </div>
              <div className="amenity-vertical-item">
                <img src={roomIcon} alt="Rooms" className="amenity-vertical-icon" />
                <span className="amenity-vertical-lbl">Rooms</span>
                <span className="amenity-vertical-val">{(selectedProperty && selectedProperty.rooms) || '1 Room'}</span>
              </div>
              <div className="amenity-vertical-item">
                <img src={bedIcon} alt="Beds" className="amenity-vertical-icon" />
                <span className="amenity-vertical-lbl">Beds</span>
                <span className="amenity-vertical-val">{(selectedProperty && selectedProperty.beds) || '2 Beds'}</span>
              </div>
              <div className="amenity-vertical-item">
                <img src={guestIcon} alt="Guests" className="amenity-vertical-icon" />
                <span className="amenity-vertical-lbl">Guests</span>
                <span className="amenity-vertical-val">{(selectedProperty && selectedProperty.guests) || '3 Person'}</span>
              </div>
              <div className="amenity-vertical-item">
                <div className="amenity-vertical-icon">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#58A429" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 10h14" />
                    <path d="M12 10v10" />
                    <path d="M8 20h8" />
                    <path d="M6 10c0 4 3 6 6 6s6-2 6-6" />
                    <path d="M9 6c.5-1.5 .5-3 .5-3" />
                    <path d="M12 6c.5-1.5 .5-3 .5-3" />
                    <path d="M15 6c.5-1.5 .5-3 .5-3" />
                  </svg>
                </div>
                <span className="amenity-vertical-lbl">Barbeque</span>
                <span className="amenity-vertical-val">Available</span>
              </div>
            </div>
          </div>
          </div>

          {/* Sub Navigation Anchor Tabs Row */}
          <div className="detail-sub-navigation-tabs">
            {detailSubTabs.map((tab) => (
              <button
                key={tab}
                className={`detail-sub-nav-btn ${activeDetailTab === tab ? 'active' : ''}`}
                onClick={() => scrollToDetailSection(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ROOMS LIST SECTION */}
          <div id="detail-section-rooms" className="detail-tab-target-section border-box-style">
            <h3 className="section-subtitle-title" style={{ marginBottom: '24px' }}>Rooms</h3>
            <div className="rooms-stack">
              {(propertyRooms && propertyRooms.length > 0 ? propertyRooms : roomOptions).map((room, idx) => (
                <div key={idx} className="room-vertical-card">
                  <div className="room-card-img-wrap">
                    <img src={room.room_image_url || room.img || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'} alt={room.room_type || room.title} />
                  </div>
                  <div className="room-card-info-wrap">
                    <div className="room-card-mid-col">
                      <h4 className="room-card-title">{room.room_type || room.title}</h4>
                      
                      <div className="room-card-bullets-list">
                        {(room.offers || []).map((off, oIdx) => (
                          <div key={`o-${oIdx}`} className="bullet-check">
                            <CheckCircle size={14} color="var(--primary-green, #10B981)" fill="rgba(16, 185, 129, 0.1)" />
                            <span style={{ fontWeight: 600, color: '#065F46' }}>{off}</span>
                          </div>
                        ))}
                        {(room.features || []).map((feat, fIdx) => (
                          <div key={`f-${fIdx}`} className="bullet-check">
                            <CheckCircle size={14} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div className="room-card-traits-grid">
                        <div className="trait-lbl-item">
                          <img src={bedIcon} alt="Beds" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                          <span className="trait-name">Beds:</span>
                          <span className="trait-value">{room.bed_type || room.beds || '2 Beds'}</span>
                        </div>
                        <div className="trait-lbl-item">
                          <img src={roomIcon} alt="Rooms" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                          <span className="trait-name">Rooms:</span>
                          <span className="trait-value">{room.rooms || '1 Room'}</span>
                        </div>
                        <div className="trait-lbl-item">
                          <img src={guestIcon} alt="Guests" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                          <span className="trait-name">Guests:</span>
                          <span className="trait-value">{room.guests || '3 Person'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="room-card-pricing-col">
                      <div className="room-pricing-text-group">
                        <span className="room-taxes-label">+212 taxes & fees per room per night</span>
                        {(room.original_price || room.originalPrice) && (
                          <span className="room-old-strike">₹{Number(room.original_price || room.originalPrice).toLocaleString('en-IN')}/night</span>
                        )}
                        <span className="room-green-val">₹{Number(room.price_per_room || room.price || 1400).toLocaleString('en-IN')}/night</span>
                      </div>
                      
                      {hostContactRevealed ? (
                        <button className="btn-view-contact-green revealed-active" style={{ width: '100%', marginTop: '10px', background: '#38A169', boxShadow: '0 4px 12px rgba(56, 161, 105, 0.3)' }}>
                          <Phone size={14} fill="#FFFFFF" />
                          <span style={{ fontWeight: '700' }}>{activeDetailProp.ownerContact || '+91 98765 43210'}</span>
                        </button>
                      ) : (
                        <button className="btn-view-contact-green" style={{ width: '100%', marginTop: '10px' }} onClick={() => { setSelectedProperty(activeDetailProp); setContactStep(1); setContactModalOpen(true); }}>
                          <Phone size={14} fill="#FFFFFF" />
                          <span>View Contact Number</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOCATION AND LANDMARKS SECTION */}
          <div id="detail-section-location" className="detail-tab-target-section border-box-style">
            <div className="map-landmarks-split">
              {/* Left Fully Functional Interactive Google Map */}
              <div className="mock-map-graphic" style={{ padding: 0, overflow: 'hidden' }}>
                <iframe
                  title={`${activeDetailProp.title} Map`}
                  src={activeDetailProp.latitude && activeDetailProp.longitude 
                    ? `https://www.google.com/maps?q=${activeDetailProp.latitude},${activeDetailProp.longitude}&z=14&output=embed`
                    : `https://www.google.com/maps?q=${encodeURIComponent(activeDetailProp.full_address || activeDetailProp.location || 'Kasol, Himachal Pradesh')}&output=embed`
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Right Landmarks List */}
              <div className="landmarks-sidebar">
                <h3 className="section-subtitle-title" style={{ fontSize: '20px', marginBottom: '20px' }}>Key Landmarks</h3>
                <div className="landmarks-stack">
                  {(dynamicLandmarks.length > 0 ? dynamicLandmarks : landmarks).map((mark, idx) => (
                    <div key={idx} className="landmark-row-item">
                      <div className="landmark-row-left-content">
                        <div className="landmark-avatar-square">
                          <img 
                            src={mark.landmark_image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80'} 
                            alt={mark.landmark_name || mark.name} 
                            className="landmark-thumb-img" 
                          />
                        </div>
                        <div className="landmark-texts">
                          <span className="landmark-title-name">{mark.landmark_name || mark.name}</span>
                          <span className="landmark-badge-desc">{mark.landmark_type || mark.label}</span>
                        </div>
                      </div>
                      <button className="landmark-nav-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PROPERTY RULES SECTION */}
          <div id="detail-section-rules" className="detail-tab-target-section border-box-style">
            <h3 className="section-subtitle-title" style={{ marginBottom: '20px' }}>Property Rules</h3>
            <div className="rules-timings-grid">
              <div className="time-badge">
                <span>Check In : {activeDetailProp.checkIn || '3:00 PM'}</span>
              </div>
              <div className="time-badge">
                <span>Check Out : {activeDetailProp.checkOut || '12:00 PM'}</span>
              </div>
            </div>

            {propertyRooms && propertyRooms.length > 0 && Array.isArray(propertyRooms[0].rules) && propertyRooms[0].rules.length > 0 ? (
              propertyRooms[0].rules.map((section, idx) => (
                <div key={idx} className="must-read-rules-block" style={{ marginTop: idx > 0 ? '24px' : '0' }}>
                  <h4 className="rules-sub-hdr">{section.title}</h4>
                  <ul className="rules-ul-list">
                    {section.points.map((point, pIdx) => (
                      <li key={pIdx}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="must-read-rules-block">
                <h4 className="rules-sub-hdr">Must Read Rules</h4>
                <ul className="rules-ul-list">
                  {typeof activeDetailProp?.rules === 'string' ? (
                    activeDetailProp.rules.split('\n').map((rule, rIdx) => (
                      <li key={rIdx}>{rule.replace(/^[•*-]\s*/, '')}</li>
                    ))
                  ) : (
                    <>
                      <li>Primary Guest should be atleast 18 years of age.</li>
                      <li>Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s).</li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* USER REVIEWS SECTION */}
          <div id="detail-section-reviews" className="detail-tab-target-section border-box-style" style={{ marginBottom: '80px' }}>
            <h3 className="section-subtitle-title" style={{ marginBottom: '24px' }}>User Reviews</h3>
            <div className="reviews-layout-split">
              
              {/* Left Score Card */}
              <div className="reviews-score-card">
                <div className="score-top-row">
                  <div className="score-pill-large">
                    <span>{dynamicReviewStats.avg > 0 ? dynamicReviewStats.avg : 'N/A'}</span>
                  </div>
                  <div className="score-lbl-wrap">
                    <span className="score-main-lbl">{dynamicReviewStats.label}</span>
                    <span className="score-sub-lbl">{dynamicReviewStats.count} Genuine Reviews</span>
                  </div>
                </div>

                <div className="rating-progress-stack" style={{ margin: '24px 0' }}>
                  {/* Real progress bars can be calculated based on dynamicReviews distribution, but keeping UI static/mock for visual structure if not specified, or we can just hide it/mock it */}
                  <div className="progress-row">
                    <span>Excellent</span>
                    <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '70%' }} /></div>
                    <span>70%</span>
                  </div>
                  <div className="progress-row">
                    <span>Very Good</span>
                    <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '20%' }} /></div>
                    <span>20%</span>
                  </div>
                </div>

                {token && user ? (
                  <button className="btn-share-experience" onClick={() => { setReviewRating(5); setReviewText(''); setReviewName(user?.name || ''); setReviewModalOpen(true); }}>
                    <Star size={15} fill="#FFFFFF" />
                    <span>Share Your Experience</span>
                  </button>
                ) : (
                  <button className="btn-share-experience" style={{ background: '#6B7280' }} onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}>
                    <Star size={15} fill="#FFFFFF" />
                    <span>Login to Review</span>
                  </button>
                )}
              </div>

              {/* Right reviews stream */}
              <div className="reviews-stream-col">
                {dynamicReviews.slice((reviewPage - 1) * 5, reviewPage * 5).map((rev, idx) => (
                  <div key={idx} className="review-stream-item">
                    <div className="review-header-avatar">
                      <div className="user-avatar-thumb">
                        {rev.reviewer_photo_url || rev.photo ? (
                          <img src={rev.reviewer_photo_url || rev.photo} alt={rev.reviewer_name || rev.name} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', fontWeight: 'bold' }}>
                            {(rev.reviewer_name || rev.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="review-user-info">
                        <span className="review-user-name">{rev.reviewer_name || rev.name}</span>
                        <span className="review-user-role">{rev.reviewer_role || rev.role || (rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Verified Guest')}</span>
                      </div>
                    </div>

                    <p className="review-quote-text">
                      "{rev.review_text || rev.text}"
                    </p>

                    <div className="review-footer-row">
                      <div className="review-star-rating-row">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} fill={s <= (rev.rating || 5) ? "var(--primary-blue)" : "none"} color={s <= (rev.rating || 5) ? "var(--primary-blue)" : "#D1D5DB"} />
                        ))}
                      </div>
                      <div className="review-images-row">
                        {(() => {
                          const reviewPics = [];
                          if (activeDetailProp.images && activeDetailProp.images.length > 0) {
                            reviewPics.push(...activeDetailProp.images);
                          } else if (activeDetailProp.img || activeDetailProp.image_url) {
                            reviewPics.push(activeDetailProp.img || activeDetailProp.image_url);
                          }
                          
                          if (reviewPics.length === 0) {
                            reviewPics.push(
                              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=100&q=80',
                              'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=100&q=80',
                              'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=100&q=80'
                            );
                          } else {
                            const originalLen = reviewPics.length;
                            while (reviewPics.length < 3) {
                              reviewPics.push(reviewPics[reviewPics.length % originalLen]);
                            }
                          }
                          
                          return reviewPics.slice(0, 3).map((picUrl, pIdx) => (
                            <img key={pIdx} src={picUrl} alt={`Property view ${pIdx + 1}`} />
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {dynamicReviews.length > 5 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
                    <button 
                      onClick={() => setReviewPage(p => Math.max(1, p - 1))} 
                      disabled={reviewPage === 1}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', background: reviewPage === 1 ? '#F3F4F6' : '#FFFFFF', cursor: reviewPage === 1 ? 'not-allowed' : 'pointer' }}
                    >
                      Prev
                    </button>
                    <span style={{ padding: '6px 12px', fontSize: '14px', fontWeight: 500 }}>Page {reviewPage} of {Math.ceil(dynamicReviews.length / 5)}</span>
                    <button 
                      onClick={() => setReviewPage(p => Math.min(Math.ceil(dynamicReviews.length / 5), p + 1))} 
                      disabled={reviewPage === Math.ceil(dynamicReviews.length / 5)}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', background: reviewPage === Math.ceil(dynamicReviews.length / 5) ? '#F3F4F6' : '#FFFFFF', cursor: reviewPage === Math.ceil(dynamicReviews.length / 5) ? 'not-allowed' : 'pointer' }}
                    >
                      Next
                    </button>
                  </div>
                )}
                {dynamicReviews.length === 0 && (
                  <div style={{ color: '#6B7280', fontSize: '15px' }}>No reviews yet. Be the first to review!</div>
                )}
              </div>

            </div>
          </div>

          {/* Contact Owner / Enquire Now form (Moved to bottom) */}
          <div className="detail-tab-target-section border-box-style" style={{ marginBottom: '80px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            <h3 className="section-subtitle-title" style={{ marginBottom: '16px', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
              Still have questions? Enquire Now
            </h3>
            <form onSubmit={handleEnquirySubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: '#4B5563', fontWeight: 600, textAlign: 'left' }}>Your Name*</label>
                <input 
                  type="text" 
                  value={guestEnquiryName}
                  onChange={(e) => setGuestEnquiryName(e.target.value)}
                  required 
                  placeholder="e.g. John Doe"
                  style={{ padding: '10px 14px', fontSize: '14px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none', background: '#ffffff', color: '#111827' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: '#4B5563', fontWeight: 600, textAlign: 'left' }}>Phone Number*</label>
                <input 
                  type="tel" 
                  value={guestEnquiryPhone}
                  onChange={(e) => setGuestEnquiryPhone(e.target.value)}
                  required 
                  placeholder="e.g. +91 9876543210"
                  style={{ padding: '10px 14px', fontSize: '14px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none', background: '#ffffff', color: '#111827' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', color: '#4B5563', fontWeight: 600, textAlign: 'left' }}>Email Address*</label>
                <input 
                  type="email" 
                  value={guestEnquiryEmail}
                  onChange={(e) => setGuestEnquiryEmail(e.target.value)}
                  required 
                  placeholder="e.g. john@example.com"
                  style={{ padding: '10px 14px', fontSize: '14px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none', background: '#ffffff', color: '#111827' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', color: '#4B5563', fontWeight: 600, textAlign: 'left' }}>Query / Message*</label>
                <textarea 
                  value={guestEnquiryMessage}
                  onChange={(e) => setGuestEnquiryMessage(e.target.value)}
                  required 
                  rows={4}
                  placeholder="Write your query to the owner..."
                  style={{ padding: '10px 14px', fontSize: '14px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none', resize: 'none', background: '#ffffff', color: '#111827' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={guestEnquirySubmitting}
                style={{ gridColumn: '1 / -1', marginTop: '10px', background: '#2563eb', color: '#ffffff', fontWeight: 600, fontSize: '15px', padding: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s', opacity: guestEnquirySubmitting ? 0.7 : 1 }}
              >
                {guestEnquirySubmitting ? 'Sending Enquiry...' : 'Submit Enquiry'}
              </button>
            </form>
          </div>

        </div>
      )}

      {/* VIEW D: SEARCH RESULTS VIEW */}
      {activeMenu === 'Search' && (
        <div className="search-results-page fade-in">
          <div className="search-results-layout">
            
            {/* Left Sidebar */}
            <div className="search-sidebar">
              <div className="filter-container-card">
                {/* Map Preview */}
                <div className="map-preview-box" style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '180px', marginBottom: '20px' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=400&q=80" 
                    alt="Map Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button className="btn-explore-map" style={{ zIndex: 10 }}>Explore on Map</button>
                </div>

                {/* Sidebar Search Input */}
                <div style={{ paddingBottom: '20px', borderBottom: '1px solid #EFF6E6', marginBottom: '20px' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      placeholder="Search for hotel, locality"
                      value={sidebarSearchText}
                      onChange={e => setSidebarSearchText(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 46px',
                        fontSize: '14px',
                        fontFamily: '"Outfit", sans-serif',
                        border: '1px solid #E5E7EB',
                        borderRadius: '24px',
                        outline: 'none',
                        color: '#111827',
                        boxSizing: 'border-box',
                        background: '#ffffff',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={e => e.target.style.borderColor = '#58A429'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>
                </div>

                {/* Property Type Filter */}
                <div className="sidebar-filter-block">
                <h4 className="filter-block-title" style={{ fontFamily: '"Outfit", sans-serif', fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>Property Type</h4>
                <div className="filter-checkbox-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Hotel', value: 'Hotel' },
                    { label: 'Villa', value: 'Villa' },
                    { label: 'Resorts', value: 'Resort' },
                    { label: 'Motels', value: 'Motel' },
                    { label: 'Cottages', value: 'Cottage' },
                    { label: 'Bungalows', value: 'Bungalow' },
                    { label: 'Apartments', value: 'Apartment' }
                  ].map((item, i) => {
                    const isChecked = filterSelectedTypes.includes(item.value);
                    const count = (allProperties || []).filter(p => p.category?.toLowerCase() === item.value.toLowerCase() || p.type?.toLowerCase() === item.value.toLowerCase()).length;
                    const displayCount = allProperties.length > 0 ? count : (item.value === 'Hotel' ? 122 : 12);
                    return (
                      <div key={i} className="filter-checkbox-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#4B5563', fontFamily: '"Outfit", sans-serif' }}>
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={() => {
                              const updated = isChecked
                                ? filterSelectedTypes.filter(t => t !== item.value)
                                : [...filterSelectedTypes, item.value];
                              setFilterSelectedTypes(updated);
                            }} 
                            style={{ accentColor: '#58A429', cursor: 'pointer' }}
                          />
                          {item.label}
                        </label>
                        <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: '"Outfit", sans-serif' }}>({displayCount})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Per Night Slider */}
              <div className="sidebar-filter-block">
                <h4 className="filter-block-title" style={{ fontFamily: '"Outfit", sans-serif', fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>Price Per Night</h4>
                
                {/* Premium Dual Range Slider */}
                {(() => {
                  const sliderMin = filterMinPrice === '' ? 100 : Number(filterMinPrice);
                  const sliderMax = filterMaxPrice === '' ? 100000 : Number(filterMaxPrice);
                  return (
                    <div className="dual-slider-container" style={{ position: 'relative', width: '100%', height: '40px', marginTop: '24px', marginBottom: '12px' }}>
                      {/* Track Background */}
                      <div style={{ position: 'absolute', top: '16px', left: '0', right: '0', height: '4px', background: '#E5E7EB', borderRadius: '2px', zIndex: '1' }} />
                      
                      {/* Active Range Line */}
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: `${((sliderMin - 100) / 99900) * 100}%`,
                        right: `${100 - ((sliderMax - 100) / 99900) * 100}%`,
                        height: '4px',
                        background: '#111827',
                        zIndex: '2'
                      }} />
                      
                      {/* Min Handle Tooltip */}
                      <div style={{
                        position: 'absolute',
                        left: `${((sliderMin - 100) / 99900) * 100}%`,
                        top: '-18px',
                        background: '#111827',
                        color: '#ffffff',
                        fontSize: '9.5px',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        transform: 'translateX(-50%)',
                        whiteSpace: 'nowrap',
                        fontFamily: '"Outfit", sans-serif',
                        zIndex: '5'
                      }}>
                        ₹ {sliderMin}
                      </div>

                      {/* Max Handle Tooltip */}
                      <div style={{
                        position: 'absolute',
                        left: `${((sliderMax - 100) / 99900) * 100}%`,
                        top: '-18px',
                        background: '#111827',
                        color: '#ffffff',
                        fontSize: '9.5px',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        transform: 'translateX(-50%)',
                        whiteSpace: 'nowrap',
                        fontFamily: '"Outfit", sans-serif',
                        zIndex: '5'
                      }}>
                        ₹ {sliderMax}
                      </div>
                      
                      {/* Invisible Inputs overlapping each other */}
                      <input
                        type="range"
                        min="100"
                        max="100000"
                        step="100"
                        value={sliderMin}
                        onChange={e => {
                          const val = Math.min(Number(e.target.value), sliderMax - 1000);
                          setFilterMinPrice(val);
                        }}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          pointerEvents: 'none',
                          background: 'none',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          height: '4px',
                          top: '16px',
                          zIndex: '3',
                          margin: 0,
                          outline: 'none'
                        }}
                      />
                      <input
                        type="range"
                        min="100"
                        max="100000"
                        step="100"
                        value={sliderMax}
                        onChange={e => {
                          const val = Math.max(Number(e.target.value), sliderMin + 1000);
                          setFilterMaxPrice(val);
                        }}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          pointerEvents: 'none',
                          background: 'none',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          height: '4px',
                          top: '16px',
                          zIndex: '4',
                          margin: 0,
                          outline: 'none'
                        }}
                      />
                    </div>
                  );
                })()}

                <h4 className="filter-block-title" style={{ fontFamily: '"Outfit", sans-serif', fontSize: '13px', fontWeight: '700', color: '#111827', marginTop: '16px', marginBottom: '10px' }}>Your Budget</h4>
                <div className="budget-inputs" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filterMinPrice}
                    onChange={e => {
                      const val = e.target.value;
                      setFilterMinPrice(val === '' ? '' : Number(val));
                    }}
                    style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', fontFamily: '"Outfit", sans-serif', color: '#374151', outline: 'none' }}
                  />
                  <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: '"Outfit", sans-serif' }}>To</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filterMaxPrice}
                    onChange={e => {
                      const val = e.target.value;
                      setFilterMaxPrice(val === '' ? '' : Number(val));
                    }}
                    style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', fontFamily: '"Outfit", sans-serif', color: '#374151', outline: 'none' }}
                  />
                  <button
                    style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    onClick={() => {
                      // Handled reactively via state update, but can keep button for user feedback/design
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = '#58A429'}
                    onMouseOut={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                  >
                    <ArrowRight size={14} color="#111827" />
                  </button>
                </div>
              </div>

              {/* Star Category / Rating Filter */}
              <div className="sidebar-filter-block">
                <h4 className="filter-block-title" style={{ fontFamily: '"Outfit", sans-serif', fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>Star Category</h4>
                <div className="filter-checkbox-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { stars: 5 },
                    { stars: 4 },
                    { stars: 3 },
                    { stars: 2 }
                  ].map((item, i) => {
                    const count = (allProperties || []).filter(p => Math.round(Number(p.rating || 0)) === item.stars).length;
                    const displayCount = allProperties.length > 0 ? count : (item.stars === 5 ? 122 : 12);
                    return (
                      <div key={i} className="filter-checkbox-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#4B5563', fontFamily: '"Outfit", sans-serif' }}>
                          <input
                            type="checkbox"
                            checked={filterMinRating === item.stars}
                            onChange={() => {
                              const newVal = filterMinRating === item.stars ? 0 : item.stars;
                              setFilterMinRating(newVal);
                            }}
                            style={{ accentColor: '#58A429', cursor: 'pointer' }}
                          />
                          {item.stars} Star
                          <div style={{ display: 'flex', gap: '2px', marginLeft: '4px' }}>
                            {Array(5).fill(0).map((_, idx) => (
                              <Star key={idx} size={12} fill={idx < item.stars ? "#0C6DC4" : "none"} color={idx < item.stars ? "#0C6DC4" : "#D1D5DB"} style={{ strokeWidth: 1.5 }} />
                            ))}
                          </div>
                        </label>
                        <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: '"Outfit", sans-serif' }}>({displayCount})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Amenities Filter — fed from Admin Amenities Master */}
              <div className="sidebar-filter-block">
                <h4 className="filter-block-title" style={{ fontFamily: '"Outfit", sans-serif', fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>Amenities</h4>
                <div className="filter-checkbox-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { amenitiesName: 'Swimming Pool' },
                    { amenitiesName: 'WiFi' },
                    { amenitiesName: 'Parking' },
                    { amenitiesName: 'Spa' },
                    { amenitiesName: 'Barbeque' },
                    { amenitiesName: 'Lifts/Elevator' },
                    { amenitiesName: 'Bonfire' }
                  ].map((item, i) => {
                    const checkVal = item.amenitiesName;
                    const isChecked = filterSelectedAmenities.includes(checkVal);
                    const count = (allProperties || []).filter(p => {
                      const propAmenities = (p.amenities || []).map(a => a.toLowerCase());
                      return propAmenities.some(pa => pa.includes(checkVal.toLowerCase()));
                    }).length;
                    const displayCount = allProperties.length > 0 ? count : (checkVal === 'Swimming Pool' ? 122 : 12);
                    return (
                      <div key={i} className="filter-checkbox-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#4B5563', fontFamily: '"Outfit", sans-serif' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setFilterSelectedAmenities(isChecked
                                ? filterSelectedAmenities.filter(a => a !== checkVal)
                                : [...filterSelectedAmenities, checkVal]
                              );
                            }}
                            style={{ accentColor: '#58A429', cursor: 'pointer' }}
                          />
                          {checkVal}
                        </label>
                        <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: '"Outfit", sans-serif' }}>({displayCount})</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Booking Preferences */}
              <div className="sidebar-filter-block" style={{ borderBottom: '1px solid #EFF6E6', paddingBottom: '20px', marginBottom: '20px' }}>
                <h4 className="filter-block-title" style={{ fontFamily: '"Outfit", sans-serif', fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>Booking Preferences</h4>
                <div className="filter-checkbox-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Instant Book', checked: filterInstantBook, setter: setFilterInstantBook },
                    { label: 'Cancellation Policy', checked: filterCancellationPolicy, setter: setFilterCancellationPolicy },
                    { label: 'Homestays', checked: filterHomestays, setter: setFilterHomestays }
                  ].map((item, i) => {
                    let count = 0;
                    if (item.label === 'Instant Book') {
                      count = (allProperties || []).filter(p => p.instantBook || (p.rules || '').toLowerCase().includes('instant') || (p.description || '').toLowerCase().includes('instant')).length;
                    } else if (item.label === 'Cancellation Policy') {
                      count = (allProperties || []).filter(p => p.cancellationPolicy || (p.rules || '').toLowerCase().includes('cancellation') || (p.description || '').toLowerCase().includes('cancel')).length;
                    } else if (item.label === 'Homestays') {
                      count = (allProperties || []).filter(p => p.category?.toLowerCase() === 'homestay' || p.type?.toLowerCase() === 'homestay').length;
                    }
                    const displayCount = allProperties.length > 0 ? count : (item.label === 'Instant Book' ? 122 : 12);
                    return (
                      <div key={i} className="filter-checkbox-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#4B5563', fontFamily: '"Outfit", sans-serif' }}>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => item.setter(!item.checked)}
                            style={{ accentColor: '#58A429', cursor: 'pointer' }}
                          />
                          {item.label}
                        </label>
                        <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: '"Outfit", sans-serif' }}>({displayCount})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

              {/* Clear All Filters button */}
              <button
                onClick={() => {
                  setFilterSelectedTypes([]);
                  setFilterSelectedAmenities([]);
                  setFilterMinPrice('');
                  setFilterMaxPrice('');
                  setFilterPriceSlider(50000);
                  setSidebarSearchText('');
                  setFilterMinRating(0);
                  setFilterInstantBook(false);
                  setFilterCancellationPolicy(false);
                  setFilterHomestays(false);
                  setSearchSortBy('popularity');
                  fetchProperties({ search: where });
                }}
                style={{ width: '100%', marginTop: '16px', padding: '10px', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = '#E5E7EB'}
                onMouseOut={e => e.currentTarget.style.background = '#F3F4F6'}
              >
                Clear All Filters
              </button>
            </div>

            {/* Main Results Column */}
            <div className="search-main-content">
              <h2 className="search-results-count">
                {(() => {
                  const displayList = getFilteredProperties();
                  return `${displayList.length} Properties In ${where || 'India'}`;
                })()}
              </h2>
              
              <div className="search-sort-tabs">
                {[['popularity', 'Popularity'], ['price_low', 'Price (Low to High)'], ['price_high', 'Price (High to Low)'], ['offer', 'Offer Included'], ['rating', 'User Rating (Highest)']].map(([key, label]) => (
                  <button key={key} className={`sort-tab ${searchSortBy === key ? 'active' : ''}`} onClick={() => setSearchSortBy(key)}>{label}</button>
                ))}
              </div>

              <div className="search-horizontal-list">
                {(() => {
                  let displayList = getFilteredProperties();
                  // Apply sort
                  if (searchSortBy === 'price_low') {
                    displayList.sort((a, b) => {
                      const pa = Number(String(a.price || a.bestRoomRate || 0).replace(/[^\d]/g, ''));
                      const pb = Number(String(b.price || b.bestRoomRate || 0).replace(/[^\d]/g, ''));
                      return pa - pb;
                    });
                  } else if (searchSortBy === 'price_high') {
                    displayList.sort((a, b) => {
                      const pa = Number(String(a.price || a.bestRoomRate || 0).replace(/[^\d]/g, ''));
                      const pb = Number(String(b.price || b.bestRoomRate || 0).replace(/[^\d]/g, ''));
                      return pb - pa;
                    });
                  } else if (searchSortBy === 'rating') {
                    displayList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                  } else if (searchSortBy === 'offer') {
                    displayList.sort((a, b) => (b.hasActiveOffer ? 1 : 0) - (a.hasActiveOffer ? 1 : 0));
                  }
                  if (displayList.length === 0) return (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px', border: '1px solid #E5E7EB' }}>
                      <Search size={40} color="#0C6DC4" style={{ marginBottom: '16px' }} />
                      <h3 style={{ fontSize: '20px', color: '#111827', marginBottom: '8px' }}>No properties found</h3>
                      <p style={{ color: '#6B7280', marginBottom: '20px' }}>Try adjusting your filters or search criteria.</p>
                      <button className="btn-view-details" onClick={handleClearAll}>Clear Filters</button>
                    </div>
                  );

                  const itemsPerPage = 5;
                  const totalItems = displayList.length;
                  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
                  
                  // Ensure searchCurrentPage doesn't overflow totalPages
                  const safeCurrentPage = Math.min(searchCurrentPage, totalPages);
                  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
                  const paginatedList = displayList.slice(startIndex, startIndex + itemsPerPage);

                  return (
                    <>
                      {paginatedList.map((property, idx) => {
                        const isWishlisted = user && user.wishlist && user.wishlist.some(w => w._id === property._id || w === property._id);
                        return (
                          <div key={idx} className="horizontal-property-card">
                            <div className="horiz-card-img">
                              <img src={property.img || property.image} alt={property.title || property.propertyName} />
                            </div>
                            <div className="horiz-card-info">
                              <div className="horiz-card-header">
                                <div>
                                  <h3>{property.title || property.propertyName} {idx === 0 && <span className="premium-badge"><Star size={10} fill="white" /> Premium</span>}</h3>
                                  <p><MapPin size={14} color="#9CA3AF" /> {property.location}</p>
                                </div>
                                <button 
                                  className={`fav-btn ${isWishlisted ? 'active' : ''}`}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!token) {
                                      setAuthMode('login');
                                      setAuthModalOpen(true);
                                      return;
                                    }
                                    try {
                                      const res = await fetch(`${API_BASE}/users/wishlist/${property._id}`, {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                          Authorization: `Bearer ${token}`
                                        }
                                      });
                                      if (res.ok) fetchProfileAndEnquiries(token);
                                    } catch (err) { console.error(err); }
                                  }}
                                >
                                  <Heart size={18} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : '#6B7280'} />
                                </button>
                              </div>
                              
                              <div className="horiz-card-rating">
                                <span className="rating-badge">{property.rating || '4.8'}</span>
                                <span style={{display: 'flex', flexDirection: 'column'}}>
                                  <span style={{color: '#4B5563', fontWeight: '500'}}>Excellent</span>
                                  <span style={{ color: '#9CA3AF', fontSize: '13px' }}>{property.reviews || '3,245 Genuine Reviews'}</span>
                                </span>
                              </div>

                              <div className="horiz-card-inclusions">
                                <span className="inclusion-item"><CheckCircle size={16} fill="#0C6DC4" color="white" /> Breakfast Included</span>
                                <span className="inclusion-item"><CheckCircle size={16} fill="#0C6DC4" color="white" /> Free cancellation till 24 hrs before check in</span>
                                <span className="inclusion-item"><CheckCircle size={16} fill="#0C6DC4" color="white" /> Parking Available</span>
                              </div>

                              <div className="horiz-card-footer">
                                <div className="horiz-card-price">
                                  <p>₹{(Number(String(property.price || property.bestRoomRate || 0).replace(/[^\d]/g, '')) + 500).toLocaleString('en-IN')}/night</p>
                                  <h4>₹{Number(String(property.price || property.bestRoomRate || 0).replace(/[^\d]/g, '')).toLocaleString('en-IN')}/night</h4>
                                </div>
                                <div className="horiz-card-actions">
                                  <button className="btn-view-details" onClick={() => { setSelectedProperty(property); setActiveMenu('Detail'); }}>View Details</button>
                                  <button className="btn-call-icon" onClick={() => { setSelectedProperty(property); setContactStep(1); setContactModalOpen(true); }}><Phone size={18} /></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '32px', marginBottom: '16px' }}>
                          <button
                            disabled={safeCurrentPage === 1}
                            onClick={() => {
                              setSearchCurrentPage(prev => Math.max(prev - 1, 1));
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              border: '1px solid #E5E7EB',
                              background: safeCurrentPage === 1 ? '#F9FAFB' : '#ffffff',
                              color: safeCurrentPage === 1 ? '#9CA3AF' : '#374151',
                              cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            &larr;
                          </button>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => {
                                setSearchCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                border: '1px solid',
                                borderColor: page === safeCurrentPage ? '#58A429' : '#E5E7EB',
                                background: page === safeCurrentPage ? '#58A429' : '#ffffff',
                                color: page === safeCurrentPage ? '#ffffff' : '#374151',
                                fontWeight: '600',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              {page}
                            </button>
                          ))}

                          <button
                            disabled={safeCurrentPage === totalPages}
                            onClick={() => {
                              setSearchCurrentPage(prev => Math.min(prev + 1, totalPages));
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              border: '1px solid #E5E7EB',
                              background: safeCurrentPage === totalPages ? '#F9FAFB' : '#ffffff',
                              color: safeCurrentPage === totalPages ? '#9CA3AF' : '#374151',
                              cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            &rarr;
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW D2: ORIGINAL PROPERTIES GRID VIEW */}
      {activeMenu === 'Properties' && (
        <div className="properties-page-layout fade-in">
          
          {/* Sub Categories Scroll selector */}
          <div className="properties-categories-scroller">
            <div className="properties-categories-inner">
              {propertyCategories.map((cat) => {
                const isSelected = activePropCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    className={`prop-cat-outline-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setActivePropCategory(cat.name);
                      const typeMap = {
                        'Apartments': 'Apartment',
                        'Homestays': 'Homestay',
                        'Resorts': 'Resort',
                        'Motels': 'Motel',
                        'Cottages': 'Cottage',
                        'Bungalows': 'Bungalow',
                        'Villas': 'Villa'
                      };
                      const mappedType = typeMap[cat.name] || cat.name;
                      setFilterSelectedTypes([mappedType]);
                      setWhere('');
                      fetchProperties({ type: cat.name, search: '' });
                      setActiveMenu('Search');
                    }}
                  >
                    <span className="prop-cat-icon">
                      {cat.iconImg ? (
                        <img src={cat.iconImg} alt={cat.name} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                      ) : (
                        cat.icon
                      )}
                    </span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION A: Best Villas Around You */}
          <div className="villas-around-section" style={{ marginTop: '40px' }}>
            <div className="section-title-wrap">
              <h2 className="section-main-headline">
                Best <span className="highlight-sharp-blue-box">Villas</span> Around You
              </h2>
              <p className="section-sub-headline">
                Choose from homestays, villas, apartments, resorts and more—stays that fit your travel style.
              </p>
            </div>

            <div className="villas-grid">
              {propertiesVillasList.map((villa, idx) => {
                const isLiked = mockWishlistedTitles.includes(villa.title);
                return (
                  <div key={idx} className="recommend-property-card">
                    <div className="recommend-card-img-wrap">
                      <img src={villa.img} alt={villa.title} />
                      <button className={`recommend-heart-circle ${isLiked ? 'liked' : ''}`} onClick={() => toggleMockWishlist(villa.title)}>
                        <Heart size={16} fill={isLiked ? "#EF4444" : "none"} color={isLiked ? "#EF4444" : "#FFFFFF"} />
                      </button>
                    </div>
                    
                    <div className="recommend-card-info-col">
                      <h3 className="recommend-card-name-text">{villa.title}</h3>
                      
                      <div className="recommend-card-location-row">
                        <span>{villa.location}</span>
                        <MapPin size={13} color="#9CA3AF" />
                      </div>

                      <div className="recommend-specs-2x2-grid">
                        <div className="recommend-spec-pill">
                          <img src={areaIcon} alt="Area" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                          <span>Area Size: {(villa.bedRooms || 2) * 150} sq. ft.</span>
                        </div>
                        <div className="recommend-spec-pill">
                          <img src={bedIcon} alt="Beds" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                          <span>Beds: {villa.bedRooms || 2} Beds</span>
                        </div>
                        <div className="recommend-spec-pill">
                          <img src={roomIcon} alt="Rooms" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                          <span>Rooms: {villa.bedRooms || 1} Room</span>
                        </div>
                        <div className="recommend-spec-pill">
                          <img src={guestIcon} alt="Guests" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                          <span>Guests: {villa.capacity || 3} Person</span>
                        </div>
                      </div>

                      <div className="recommend-price-tag-row">
                        <span className="price-label">Starting from</span>
                        <span className="price-green-bold">
                          {String(villa.price).startsWith('₹') ? villa.price : '₹' + villa.price}/night
                        </span>
                      </div>

                      <div className="recommend-actions-row">
                        <button className="recommend-details-btn-blue" onClick={() => { setSelectedProperty(villa); setActiveMenu('Detail'); }}>View Details</button>
                        <button className="recommend-contact-btn-green" onClick={() => { setSelectedProperty(villa); setContactStep(1); setContactModalOpen(true); }}>Contact Owner</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="view-more-btn-container">
              <button className="btn-view-more">View More</button>
            </div>

          </div>

          {/* SECTION B: Best Homestays Around You */}
          <div className="villas-around-section" style={{ margin: '80px auto' }}>
            <div className="section-title-wrap">
              <h2 className="section-main-headline">
                Best <span className="highlight-sharp-blue-box">Homestays</span> Around You
              </h2>
              <p className="section-sub-headline">
                Choose from homestays, villas, apartments, resorts and more—stays that fit your travel style.
              </p>
            </div>

            <div className="villas-grid">
              {propertiesHomestaysList.map((homestay, idx) => {
                const isLiked = mockWishlistedTitles.includes(homestay.title);
                return (
                  <div key={idx} className="recommend-property-card">
                    <div className="recommend-card-img-wrap">
                      <img src={homestay.img} alt={homestay.title} />
                      <button className={`recommend-heart-circle ${isLiked ? 'liked' : ''}`} onClick={() => toggleMockWishlist(homestay.title)}>
                        <Heart size={16} fill={isLiked ? "#EF4444" : "none"} color={isLiked ? "#EF4444" : "#FFFFFF"} />
                      </button>
                    </div>
                    
                    <div className="recommend-card-info-col">
                      <h3 className="recommend-card-name-text">{homestay.title}</h3>
                      
                      <div className="recommend-card-location-row">
                        <span>{homestay.location}</span>
                        <MapPin size={13} color="#9CA3AF" />
                      </div>

                      <div className="recommend-specs-2x2-grid">
                        <div className="recommend-spec-pill">
                          <img src={areaIcon} alt="Area" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                          <span>Area Size: {(homestay.bedRooms || 2) * 150} sq. ft.</span>
                        </div>
                        <div className="recommend-spec-pill">
                          <img src={bedIcon} alt="Beds" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                          <span>Beds: {homestay.bedRooms || 2} Beds</span>
                        </div>
                        <div className="recommend-spec-pill">
                          <img src={roomIcon} alt="Rooms" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                          <span>Rooms: {homestay.bedRooms || 1} Room</span>
                        </div>
                        <div className="recommend-spec-pill">
                          <img src={guestIcon} alt="Guests" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                          <span>Guests: {homestay.capacity || 3} Person</span>
                        </div>
                      </div>

                      <div className="recommend-price-tag-row">
                        <span className="price-label">Starting from</span>
                        <span className="price-green-bold">
                          {String(homestay.price).startsWith('₹') ? homestay.price : '₹' + homestay.price}/night
                        </span>
                      </div>

                      <div className="recommend-actions-row">
                        <button className="recommend-details-btn-blue" onClick={() => { setSelectedProperty(homestay); setActiveMenu('Detail'); }}>View Details</button>
                        <button className="recommend-contact-btn-green" onClick={() => { setSelectedProperty(homestay); setContactStep(1); setContactModalOpen(true); }}>Contact Owner</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="view-more-btn-container">
              <button className="btn-view-more">View More</button>
            </div>

          </div>

        </div>
      )}

      {/* VIEW E: HOME VIEW */}
      {activeMenu === 'Home' && (
        <>
          {/* ══ SECTION 1: DESTINATIONS CAROUSEL (Width 1281px, Height 465px) ══ */}
          <div className="destinations-carousel-section">
            
            {/* Toggle selectors inside Section 1 */}
            <div className="carousel-nav-pill">
              <button 
                className={`carousel-nav-btn ${activeDestTab === 'Destinations' ? 'active' : ''}`}
                onClick={() => setActiveDestTab('Destinations')}
              >
                Destinations
              </button>
              <button 
                className={`carousel-nav-btn ${activeDestTab === 'Unique' ? 'active' : ''}`}
                onClick={() => setActiveDestTab('Unique')}
              >
                Unique Experiences
              </button>
            </div>

            {/* Carousel Grid with Arrow buttons */}
            <div className="carousel-viewport">
              <button 
                className="carousel-arrow left"
                onClick={() => {
                  const track = document.querySelector('.carousel-track');
                  if (track) {
                    track.scrollBy({ left: -240, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="carousel-track">
                {carouselDestinations.map((dest, i) => (
                  <div key={i} className="carousel-card-item">
                    <div className="carousel-img-wrap">
                      <img src={dest.img} alt={dest.name} />
                    </div>
                    <h3 className="carousel-city-title">{dest.name}</h3>
                    <p className="carousel-city-sub">{dest.count}</p>
                  </div>
                ))}
              </div>

              <button 
                className="carousel-arrow right"
                onClick={() => {
                  const track = document.querySelector('.carousel-track');
                  if (track) {
                    track.scrollBy({ left: 240, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

          </div>

          {/* ══ SECTION 2: BEST VILLAS AROUND YOU (Figma Specifications) ══ */}
          <div className="villas-around-section">
            
            {/* Keyword-highlighted headline block */}
            <div className="section-title-wrap">
              <h2 className="section-main-headline">
                Best <span className="highlight-sharp-blue-box">Villas</span> Around You
              </h2>
              <p className="section-sub-headline">
                Choose from homestays, villas, apartments, resorts and more—stays that fit your travel style.
              </p>
            </div>

            {/* 3-column Grid layout */}
            <div className="villas-grid">
              {currentBestVillas.map((villa, idx) => {
                const isWishlisted = user && user.wishlist && user.wishlist.some(w => w._id === villa._id || w === villa._id);
                return (
                  <div key={idx} className="villa-card">
                    <div className="villa-card-img-wrap">
                      <img src={villa.img} alt={villa.title} />
                      <button 
                        className={`wishlist-btn-circle ${isWishlisted ? 'active' : ''}`}
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!token) {
                            setAuthMode('login');
                            setAuthModalOpen(true);
                            return;
                          }
                          try {
                            const res = await fetch(`${API_BASE}/users/wishlist/${villa._id}`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                              }
                            });
                            if (res.ok) {
                              fetchProfileAndEnquiries(token);
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      >
                        <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : '#111827'} />
                      </button>
                    </div>
                    
                    <div className="villa-card-content">
                      <h3 className="villa-card-title">{villa.title}</h3>
                      
                      <div className="villa-card-location">
                        <MapPin size={13} color="#9CA3AF" />
                        <span>{villa.location}</span>
                      </div>

                      <div className="villa-card-rating-row">
                        <div className="rating-pill">
                          <span>{villa.rating}</span>
                        </div>
                        <div className="rating-text-stack">
                          <span className="rating-desc-excellent">Excellent</span>
                          <span className="rating-reviews-count">{villa.reviews}</span>
                        </div>
                      </div>

                      <div className="villa-card-price-row">
                        <span className="price-label">Starting from</span>
                        <span className="price-value-highlight">{villa.price}/night</span>
                      </div>

                      <div className="villa-card-actions">
                        <button className="btn-villa-action outline-blue" onClick={() => { setSelectedProperty(villa); setActiveMenu('Detail'); }}>View Details</button>
                        <button className="btn-villa-action outline-green" onClick={() => { setSelectedProperty(villa); setContactStep(1); setContactModalOpen(true); }}>Contact Owner</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ══ SECTION 3: CURATED PROPERTIES ══ */}
          <div className="curated-properties-section">
            
            {/* Title layout block */}
            <div className="section-title-wrap">
              <h2 className="section-main-headline">
                <span className="highlight-sharp-blue-box">Curated</span> Properties
              </h2>
              <p className="section-sub-headline">
                Carefully selected stays that meet our standards for comfort, quality, and location.
              </p>
            </div>

            {/* Horizontal Card pairs inside a scroll viewport */}
            <div className="curated-viewport">
              <button 
                className="curated-arrow left"
                onClick={() => {
                  const track = document.querySelector('.curated-horizontal-grid');
                  if (track) {
                    track.scrollBy({ left: -400, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="curated-horizontal-grid">
                {curatedList.map((item, idx) => (
                  <div key={idx} className="curated-horizontal-card">
                    <div className="curated-card-img-wrap">
                      <img src={item.img} alt={item.title} />
                      <button className="recommend-heart-circle">
                        <Heart size={16} fill="none" color="#111827" />
                      </button>
                    </div>

                    <div className="curated-card-content">
                      <h3 className="curated-card-title">{item.title}</h3>
                      
                      <div className="curated-card-location">
                        <MapPin size={13} color="#9CA3AF" />
                        <span>{item.location}</span>
                      </div>

                      <div className="curated-card-rating-row">
                        <div className="rating-pill">
                          <span>{item.rating}</span>
                        </div>
                        <div className="rating-text-stack">
                          <span className="rating-desc-excellent">Excellent</span>
                          <span className="rating-reviews-count">{item.reviews}</span>
                        </div>
                      </div>

                      <div className="curated-card-price-row">
                        <span className="price-label">Starting from</span>
                        <span className="price-green-bold">{item.price}/night</span>
                      </div>

                      <div className="curated-card-actions">
                        <button className="recommend-details-btn-blue" onClick={() => setActiveMenu('Detail')}>View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="curated-arrow right"
                onClick={() => {
                  const track = document.querySelector('.curated-horizontal-grid');
                  if (track) {
                    track.scrollBy({ left: 400, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

          </div>

          {/* ══ SECTION 4: POPULAR OFFERS OF PROPERTY ══ */}
          <div className="popular-offers-section">
            
            {/* Title Layout */}
            <div className="section-title-wrap">
              <h2 className="section-main-headline">
                <span className="highlight-sharp-blue-box">Popular</span> Offers Of Property
              </h2>
              <p className="section-sub-headline">
                Carefully selected stays that meet our standards for comfort, quality, and location.
              </p>
            </div>

            {/* 2x2 Grid Layout */}
            <div className="popular-offers-grid">
              {[...(popularOffers || []), ...popularOffersList].slice(0, 4).map((offer, idx) => {
                const isDynamic = offer.property_id || offer.propertyName;
                const title = isDynamic ? `${offer.propertyName || offer.property_id?.name} - ${offer.room_type || offer.room || 'Deluxe Room'}` : offer.title;
                const subtitle = isDynamic ? `${offer.category} | ${offer.food_type || offer.foods} | ${offer.description}` : offer.subtitle;
                const discount = isDynamic ? `${offer.offer_percent || offer.offerPercent}` : (offer.discount ? offer.discount.replace(/Up to\s+/i, '') : '30% OFF');
                const img = isDynamic 
                  ? (offer.property_id?.images?.[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80') 
                  : offer.img;

                return (
                  <div key={idx} className="offer-horizontal-card">
                    <div className="offer-card-img-wrap">
                      <img src={img} alt={title} />
                      {(idx % 2 === 0) && (
                        <span className="exclusive-offer-badge">Exclusive Offer</span>
                      )}
                    </div>

                    <div className="offer-card-content">
                      <h3 className="offer-card-title">{title}</h3>
                      <p className="offer-card-subtitle">{subtitle}</p>
                      
                      <div className="offer-card-discount-row">
                        <span className="discount-label">Up to</span>
                        <span className="discount-value-highlight">{discount}</span>
                      </div>

                      <div className="offer-card-actions">
                        <button 
                          className="recommend-details-btn-blue" 
                          onClick={() => {
                            if (isDynamic && offer.property_id) {
                              setSelectedProperty(offer.property_id);
                              setActiveMenu('Detail');
                            } else {
                              setActiveMenu('Detail');
                            }
                          }}
                        >
                          View Stays
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ══ SECTION 5: WHY CHOOSE OUR SERVICES ══ */}
          <div className="services-section" style={{ marginBottom: 0 }}>
            <div className="services-inner-container">
              
              <div className="section-title-wrap">
                <h2 className="section-main-headline">
                  Why Choose Our <span className="highlight-sharp-blue-box">Services</span>
                </h2>
                <p className="section-sub-headline" style={{ color: '#4B5563' }}>
                  Choose the next destination for you
                </p>
              </div>

              {/* Asymmetric custom grid row */}
              <div className="services-grid-asym">
                
                {/* Column 1 */}
                <div className="services-col">
                  
                  {/* White card top */}
                  <div className="service-text-card white-bg">
                    <p className="service-card-desc">
                      Every property is carefully verified to ensure quality, safety, and comfort you can rely on.
                    </p>
                    <div className="service-card-bottom-group">
                      <h3 className="service-card-accent-title">Verified & Trusted Stays</h3>
                      <p className="service-card-subtext">Get genuine and good stays</p>
                    </div>
                  </div>

                  {/* Secure Payments bottom image */}
                  <div className="service-image-card">
                    <img 
                      src={rect35Img} 
                      alt="Secure Payments" 
                    />
                    <div className="service-overlay-badge-bottom">
                      <div className="service-icon-circle-overlay">
                        <CreditCard size={18} color="#FFFFFF" />
                      </div>
                      <span>Secure Payments</span>
                    </div>
                  </div>

                </div>

                {/* Column 2 (Full Height Traveler center image) */}
                <div className="services-col-center">
                  <div className="service-tall-card">
                    <img 
                      src={rect32Img} 
                      alt="Traveler with suitcase" 
                    />
                  </div>
                </div>

                {/* Column 3 */}
                <div className="services-col">
                  
                  {/* Pool Resort top image */}
                  <div className="service-image-card">
                    <img 
                      src={rect33Img} 
                      alt="Best Price Guarantee Pool" 
                    />
                    <div className="service-overlay-badge-bottom">
                      <div className="service-icon-circle-overlay">
                        <Percent size={18} color="#FFFFFF" />
                      </div>
                      <span>Best Price Guarantee</span>
                    </div>
                  </div>

                  {/* 24/7 Support text card bottom */}
                  <div className="service-text-card transparent-bg">
                    <div className="service-card-top-group">
                      <h3 className="service-card-accent-title">24/7 Support, Always There</h3>
                      <p className="service-card-bold-sub">All type of support</p>
                    </div>
                    <p className="service-card-desc-light">
                      From booking to checkout, our support team is available anytime to help you.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </>
      )}

      {/* ══ SECTION 6: PREMIUM SITE FOOTER ══ */}
      <Footer token={token} onNavigate={setActiveMenu} onRequireAuth={openLoginModal} />
    </div>

      {/* ══ FULL SCREEN IMAGE GALLERY MODAL ══ */}
      {isGalleryOpen && activeDetailProp && (
        <div 
          style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 99999, 
            background: 'rgba(0,0,0,0.92)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }} 
          onClick={() => setIsGalleryOpen(false)}
        >
          <div 
            style={{ 
              position: 'relative', 
              width: '90vw', 
              height: '90vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }} 
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              style={{ 
                position: 'absolute', top: '-50px', right: '0', 
                color: '#fff', background: 'transparent', border: 'none', 
                cursor: 'pointer', padding: '8px', lineHeight: 1
              }} 
              onClick={() => setIsGalleryOpen(false)}
            >
              <X size={32} />
            </button>
            
            {/* Prev arrow */}
            <button 
              style={{ 
                position: 'absolute', left: '-60px', 
                color: '#fff', background: 'rgba(255,255,255,0.15)', 
                border: 'none', cursor: 'pointer', 
                padding: '14px 16px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }} 
              onClick={() => setCurrentImageIndex(prev => {
                const imgs = activeDetailProp.images && activeDetailProp.images.length > 0 ? activeDetailProp.images : [activeDetailProp.img];
                return prev === 0 ? imgs.length - 1 : prev - 1;
              })}
            >
              <ChevronLeft size={28} />
            </button>

            {/* Main image */}
            <img 
              src={(activeDetailProp.images && activeDetailProp.images.length > 0 ? activeDetailProp.images : [activeDetailProp.img])[currentImageIndex]} 
              alt={`Gallery view ${currentImageIndex + 1}`}
              style={{ 
                maxHeight: '100%', maxWidth: '100%', 
                objectFit: 'contain', borderRadius: '10px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                userSelect: 'none'
              }} 
            />

            {/* Next arrow */}
            <button 
              style={{ 
                position: 'absolute', right: '-60px', 
                color: '#fff', background: 'rgba(255,255,255,0.15)', 
                border: 'none', cursor: 'pointer', 
                padding: '14px 16px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }} 
              onClick={() => setCurrentImageIndex(prev => {
                const imgs = activeDetailProp.images && activeDetailProp.images.length > 0 ? activeDetailProp.images : [activeDetailProp.img];
                return prev === imgs.length - 1 ? 0 : prev + 1;
              })}
            >
              <ChevronRight size={28} />
            </button>

            {/* Image counter */}
            <div style={{ 
              position: 'absolute', bottom: '-44px', left: '50%', transform: 'translateX(-50%)',
              color: '#fff', fontSize: '16px', fontWeight: '500',
              background: 'rgba(255,255,255,0.1)', padding: '4px 16px', borderRadius: '20px'
            }}>
              {currentImageIndex + 1} / {(activeDetailProp.images && activeDetailProp.images.length > 0 ? activeDetailProp.images : [activeDetailProp.img]).length}
            </div>
          </div>
        </div>
      )}

      {/* ══ INTERACTIVE AUTHENTICATION MODAL (Figma-Accurate Sign Up / Log In Views) ══ */}
      {authModalOpen && (
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
                <div className="auth-divider-wrap" style={{ margin: '12px 0 24px 0' }}>
                  <span className="auth-divider-text">Or Log In with</span>
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
              <div className="auth-login-split-container fade-in" style={{ display: 'flex', width: '100%', height: '100%' }}>
                {/* Left side scenic Sunset pool image (pre-rendered with logo, overlays, and text inside assets) */}
                <div className="auth-login-left-image" style={{ backgroundImage: `url(${loginLeftImg})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '550px', height: '600px', marginLeft: '-28px', marginTop: '-20px', marginBottom: '-20px', flexShrink: 0, borderTopLeftRadius: '25px', borderBottomLeftRadius: '25px' }}>
                  {/* Empty since everything is pre-rendered in the image */}
                </div>

                {/* Right side Log In form fields */}
                <div className="auth-login-right-content" style={{ flex: 1, padding: '30px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box', position: 'relative' }}>
                  
                  <h2 className="auth-modal-title login-title-align" style={{ fontFamily: "'Lato', sans-serif", fontSize: '24px', fontWeight: '500', color: '#111827', lineHeight: '1.4', marginBottom: '20px' }}>
                    Log In Your Account To <br />Find Your <span style={{ backgroundColor: '#0066ff', color: '#FFFFFF', padding: '2px 10px', borderRadius: '4px', marginLeft: '6px', fontWeight: '700', display: 'inline-block' }}>Perfect Stay</span>
                  </h2>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!showPasswordStep) {
                      if (!loginEmail.trim()) {
                        alert('Please enter your email or mobile number.');
                        return;
                      }
                      setShowPasswordStep(true);
                    } else {
                      handleLoginSubmit(e);
                    }
                  }} className="auth-login-form" autoComplete="off">
                    {!showPasswordStep ? (
                      <div className="auth-form-group full-width">
                        <label className="auth-input-label">Email Id or Mobile Number*</label>
                        <input type="text" className="auth-input-field" placeholder="jhondoe@gmail.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required autoComplete="off" />
                      </div>
                    ) : (
                      <>
                        <div className="auth-form-group full-width">
                          <label className="auth-input-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Password*</span>
                            <span style={{ color: '#0066ff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }} onClick={() => setShowPasswordStep(false)}>Back</span>
                          </label>
                          <div style={{ position: 'relative' }}>
                            <input type={showPassword ? "text" : "password"} className="auth-input-field" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required autoComplete="off" autoFocus />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    <button type="submit" className="auth-submit-btn-green" style={{ width: '100%', borderRadius: '15px', fontSize: '16px', fontWeight: '600', backgroundColor: '#58A429', color: '#FFFFFF', border: 'none', cursor: 'pointer', height: '48px', transition: 'background-color 0.2s', marginTop: '24px' }}>
                      {authLoading ? (showPasswordStep ? 'Logging In...' : 'Checking...') : (showPasswordStep ? 'Log In' : 'Continue')}
                    </button>
                  </form>

                  {/* Dotted separator line */}
                  <div style={{ width: '100%', borderTop: '1px dotted #D1D5DB', margin: '24px 0 12px 0' }}></div>

                  {/* Dashed divider */}
                  <div className="auth-divider-wrap" style={{ margin: '12px 0 20px 0' }}>
                    <span className="auth-divider-text">Or Sign In with</span>
                  </div>

                  <div className="auth-social-row" style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginBottom: '4px' }}>
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
      )}

      {/* ══ INTERACTIVE CONTACT DETAIL VERIFICATION MODAL (Figma-Accurate View Contact & Request OTP) ══ */}
      {contactModalOpen && (
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
      )}

      {/* ══ INTERACTIVE EXPERIENCE REVIEW SUBMISSION MODAL (Figma-Accurate Share Your Experience) ══ */}
      {reviewModalOpen && (
        <div className="auth-modal-overlay" onClick={() => setReviewModalOpen(false)}>
          <div className="auth-modal-card review-modal-card-size" onClick={(e) => e.stopPropagation()}>
            <button className="auth-close-btn" onClick={() => setReviewModalOpen(false)}>&times;</button>
            
            <div className="review-modal-content fade-in">
              <h2 className="auth-modal-title">
                Share Your <span className="highlight-sharp-blue-box">Experience</span>
              </h2>
              
              {/* Interactive Star Row */}
              <div className="review-star-selector-row">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button 
                    key={num}
                    type="button"
                    className="review-star-select-btn"
                    onClick={() => setReviewRating(num)}
                  >
                    <Star 
                      size={32} 
                      fill={num <= reviewRating ? "var(--accent-orange)" : "none"} 
                      color={num <= reviewRating ? "var(--accent-orange)" : "#D1D5DB"} 
                      strokeWidth={2}
                    />
                  </button>
                ))}
              </div>

              <form onSubmit={handleReviewFormSubmit} className="review-submit-form">
                
                <div className="auth-form-group full-width" style={{ marginBottom: '16px' }}>
                  <label className="auth-input-label">Your Name*</label>
                  <input 
                    type="text"
                    className="auth-input-field" 
                    placeholder="John Doe"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    required
                  />
                </div>

                <div className="auth-form-group full-width">
                  <label className="auth-input-label">Your Review*</label>
                  <textarea 
                    className="auth-input-field auth-textarea-field" 
                    placeholder="The travel route was smooth and the journey was comfortable."
                    rows="4"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="auth-submit-btn-green mt-36">Submit</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ══ INTERACTIVE EDIT PROFILE MODAL ══ */}
      {isEditProfileModalOpen && (
        <div className="auth-modal-overlay" onClick={() => setIsEditProfileModalOpen(false)} style={{ zIndex: 9999 }}>
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', padding: '32px', borderRadius: '16px', position: 'relative' }}>
            <button className="auth-close-btn" style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', fontSize: '28px', color: '#9CA3AF', cursor: 'pointer' }} onClick={() => setIsEditProfileModalOpen(false)}>&times;</button>
            
            <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#111827', marginBottom: '20px', fontFamily: '"Outfit", sans-serif' }}>Edit Profile Details</h2>
            
            {editProfileError && (
              <div style={{ color: '#EF4444', backgroundColor: '#FEE2E2', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontWeight: 500 }}>
                {editProfileError}
              </div>
            )}

            <form onSubmit={handleEditProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Country of Citizenship</label>
                  <input 
                    type="text" 
                    value={editProfileForm.citizenship} 
                    onChange={e => setEditProfileForm({ ...editProfileForm, citizenship: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Country of Residence</label>
                  <input 
                    type="text" 
                    value={editProfileForm.residence} 
                    onChange={e => setEditProfileForm({ ...editProfileForm, residence: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Phone Number</label>
                  <input 
                    type="text" 
                    value={editProfileForm.phone} 
                    onChange={e => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>City</label>
                  <input 
                    type="text" 
                    value={editProfileForm.city} 
                    onChange={e => setEditProfileForm({ ...editProfileForm, city: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>State</label>
                  <input 
                    type="text" 
                    value={editProfileForm.state} 
                    onChange={e => setEditProfileForm({ ...editProfileForm, state: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Pin Code</label>
                  <input 
                    type="text" 
                    value={editProfileForm.pincode} 
                    onChange={e => setEditProfileForm({ ...editProfileForm, pincode: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Home Address</label>
                <input 
                  type="text" 
                  value={editProfileForm.address} 
                  onChange={e => setEditProfileForm({ ...editProfileForm, address: e.target.value })}
                  style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
                />
              </div>

              <div style={{ borderTop: '1px solid #E5E7EB', margin: '8px 0' }}></div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 10px 0' }}>Emergency Contact Details</h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Contact Person</label>
                  <input 
                    type="text" 
                    value={editProfileForm.emergencyName} 
                    onChange={e => setEditProfileForm({ ...editProfileForm, emergencyName: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Phone Number</label>
                  <input 
                    type="text" 
                    value={editProfileForm.emergencyPhone} 
                    onChange={e => setEditProfileForm({ ...editProfileForm, emergencyPhone: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>Email Address</label>
                <input 
                  type="email" 
                  value={editProfileForm.emergencyEmail} 
                  onChange={e => setEditProfileForm({ ...editProfileForm, emergencyEmail: e.target.value })}
                  style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13.5px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsEditProfileModalOpen(false)}
                  style={{ padding: '10px 20px', border: '1px solid #D1D5DB', borderRadius: '8px', background: '#ffffff', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '10px 24px', border: 'none', borderRadius: '8px', background: '#58A429', color: '#ffffff', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
}
