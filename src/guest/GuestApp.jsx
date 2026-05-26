import React, { useState } from 'react';

import {
  bestVillasList,
  carouselDestinations,
  carouselExperiences,
  curatedList,
  propertiesVillasList,
} from '../data/mockData';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from './components/HeroSection';
import AccountPages from './pages/AccountPages';
import StaticPages from './pages/StaticPages';
import CatalogPages from './pages/CatalogPages';
import HomePage from './pages/HomePage';
import GuestModals from './modals/GuestModals';

import { API_BASE, API_ORIGIN } from './config/api';
import usePopularOffers from './hooks/usePopularOffers';
import useGuestAuth from './hooks/useGuestAuth';
import useGuestSearch from './hooks/useGuestSearch';
import usePropertyDetailData from './hooks/usePropertyDetailData';
import useOtpVerification from './hooks/useOtpVerification';
import useGuestEnquiry from './hooks/useGuestEnquiry';
import useGuestBootstrapData from './hooks/useGuestBootstrapData';
import { mapDbProperties as mapDbPropertiesRaw } from './utils/mapDbProperties';
import { renderTitle } from './utils/renderTitle';
import {
  buildAccountPagesProps,
  buildCatalogPagesProps,
  buildGuestModalsProps,
  buildHeroSectionProps,
  buildHomePageProps,
  buildStaticPagesProps,
} from './props/pageProps';

export default function GuestApp() {
  const [activeMenu, setActiveMenu] = useState('Home');
  const popularOffers = usePopularOffers(API_BASE);

  const {
    token,
    user,
    liveEnquiries,
    userReviews,
    fetchProfileAndEnquiries,

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

    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    handleLoginSubmit,

    enquiryFirstName,
    setEnquiryFirstName,
    enquiryLastName,
    setEnquiryLastName,
    enquiryEmail,
    setEnquiryEmail,
    enquiryPhone,
    setEnquiryPhone,

    isEditProfileModalOpen,
    setIsEditProfileModalOpen,
    editProfileForm,
    setEditProfileForm,
    editProfileError,
    openEditProfileModal,
    handleEditProfileSubmit,
  } = useGuestAuth({ API_BASE, API_ORIGIN, setActiveMenu });

  const {
    // tabs
    activeSearchTab,
    setActiveSearchTab,
    activePropCategory,
    setActivePropCategory,

    // inputs
    where,
    setWhere,
    dates,
    setDates,
    guests,
    setGuests,
    price,
    setPrice,
    stayType,
    setStayType,
    foodPref,
    setFoodPref,
    verifiedOnly,
    setVerifiedOnly,
    featuredOnly,
    setFeaturedOnly,

    // results
    liveProperties,

    // AI
    aiSearchLoading,
    aiSummary,
    aiTags,

    // filters
    filterMinPrice,
    setFilterMinPrice,
    filterMaxPrice,
    setFilterMaxPrice,
    setFilterPriceSlider,
    sidebarSearchText,
    setSidebarSearchText,
    filterSelectedTypes,
    setFilterSelectedTypes,
    filterSelectedAmenities,
    setFilterSelectedAmenities,
    filterMinRating,
    setFilterMinRating,
    searchSortBy,
    setSearchSortBy,
    filterInstantBook,
    setFilterInstantBook,
    filterCancellationPolicy,
    setFilterCancellationPolicy,
    filterHomestays,
    setFilterHomestays,

    // pagination
    searchCurrentPage,
    setSearchCurrentPage,

    // actions
    fetchProperties,
    handleAISearch,
    handleSearch,
    handleClearAll,
  } = useGuestSearch({ API_BASE, setActiveMenu });

  const mapDbProperties = (dbProps, defaultList) =>
    mapDbPropertiesRaw(dbProps, defaultList, where);

  const [activeDestTab, setActiveDestTab] = useState('Destinations');
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

  // Contact Us Form States
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactAgreed, setContactAgreed] = useState(false);

  // Recommended Page Wishlist toggled list
  const [recWishlist, setRecWishlist] = useState([0, 2]);
  const [mockWishlistedTitles, setMockWishlistedTitles] = useState([]);

  // List Your Place Page Collapsible FAQ Active Index
  const [activeFaq, setActiveFaq] = useState(0);

  // Experience Review Modal States (Figma accurate design!)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewPage, setReviewPage] = useState(1);

  // API Integration States
  const [allProperties, setAllProperties] = useState([]);
  const [liveDestinations, setLiveDestinations] = useState([]);
  const [liveExperiences, setLiveExperiences] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [homepageContent, setHomepageContent] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useGuestBootstrapData({
    API_BASE,
    token,
    activeMenu,
    activePropCategory,
    setLiveDestinations,
    setLiveExperiences,
    setFeaturedProperties,
    setHomepageContent,
    setAllProperties,
    fetchProperties,
    fetchProfileAndEnquiries,
  });

  const {
    propertyRooms,
    dynamicLandmarks,
    dynamicReviews,
    setDynamicReviews,
    dynamicReviewStats,
    fullPropertyDetail,
  } = usePropertyDetailData({ API_BASE, selectedProperty });

  const {
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
  } = useOtpVerification({
    API_BASE,
    selectedProperty,
    token,
    enquiryFirstName,
    enquiryLastName,
    enquiryEmail,
    enquiryPhone,
    fetchProfileAndEnquiries,
  });

  const activeDetailProp = fullPropertyDetail ? mapDbProperties([fullPropertyDetail], [])[0] : (selectedProperty || null);

  const {
    guestEnquiryName,
    setGuestEnquiryName,
    guestEnquiryPhone,
    setGuestEnquiryPhone,
    guestEnquiryEmail,
    setGuestEnquiryEmail,
    guestEnquiryMessage,
    setGuestEnquiryMessage,
    guestEnquirySubmitting,
    handleEnquirySubmit,
  } = useGuestEnquiry({
    API_BASE,
    token,
    user,
    selectedProperty,
    activeDetailProp,
    fetchProfileAndEnquiries,
  });
  // Gallery modal states
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Filter states
  const [wishlistSearchQuery, setWishlistSearchQuery] = useState('');
  const [wishlistSortOption, setWishlistSortOption] = useState('All');
  const [isWishlistFilterOpen, setIsWishlistFilterOpen] = useState(false);

  const [recommendSearchQuery, setRecommendSearchQuery] = useState('');
  const [isRecommendFilterOpen, setIsRecommendFilterOpen] = useState(false);

  const [enquirySearchQuery, setEnquirySearchQuery] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');
  const [isEnquiryFilterOpen, setIsEnquiryFilterOpen] = useState(false);

  const [reviewsRatingFilter, setReviewsRatingFilter] = useState('All');
  const [isReviewsFilterOpen, setIsReviewsFilterOpen] = useState(false);

  const handleReviewFormSubmit = async (e) => {
    e.preventDefault();
    const propToUse = selectedProperty || activeDetailProp;
    if (!propToUse) return;

    const rName = reviewName || user?.name || 'Guest';
    const rText = reviewText;
    const rRating = reviewRating;

    // Simulate submission for mock properties that don't have database IDs
    if (!propToUse._id || !/^[0-9a-fA-F]{24}$/.test(propToUse._id)) {
      const mockPropKey = String(propToUse.title || propToUse.propertyName || 'prop')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const mockReviewId = `mock-rev-${mockPropKey}-${dynamicReviews.length + 1}`;
      const mockReview = {
        _id: mockReviewId,
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
      const res = await fetch(`${API_BASE}/reviews/${propToUse._id}`, {
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
        if (token) fetchProfileAndEnquiries(token);
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

  // Prevent protected views (Profile/Wishlist/Enquiries) from opening without auth
  React.useEffect(() => {
    const protectedMenus = ['Wishlist', 'Enquiries', 'Profile'];
    if (protectedMenus.includes(activeMenu) && !token) {
      openLoginModal();
      setActiveMenu('Home');
    }
  }, [activeMenu, token, openLoginModal]);

  React.useEffect(() => {
    if (activeMenu === 'Detail' && activeDetailProp?.title) {
      document.title = `Tripinstays | ${activeDetailProp.title}`;
    } else if (activeMenu === 'Home') {
      document.title = 'Tripinstays | Find Your Perfect Stay';
    } else {
      document.title = `Tripinstays | ${activeMenu}`;
    }
    window.scrollTo(0, 0);
  }, [activeMenu, activeDetailProp]);

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

  const mappedBest = featuredProperties.length > 0 ? mapDbProperties(featuredProperties, bestVillasList) : mapDbProperties(allProperties, bestVillasList).slice(0, 6);
  let currentBestVillas = [...mappedBest];
  if (currentBestVillas.length === 0) {
    currentBestVillas = mapDbProperties([], bestVillasList.slice(0, 6));
  }

  // Also map properties for Curated section (Section 3) instead of hardcoded curatedList
  let currentCuratedVillas = featuredProperties.length > 0 
    ? mapDbProperties(featuredProperties.slice().reverse(), curatedList)
    : mapDbProperties(allProperties.slice().reverse(), curatedList).slice(0, 6);
  if (currentCuratedVillas.length === 0) {
    currentCuratedVillas = mapDbProperties([], curatedList); // fallback to 3 mock items
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

  const displayDestinations = liveDestinations.length > 0 ? liveDestinations.map(d => ({
    img: d.coverImageUrl ? (d.coverImageUrl.startsWith('http') ? d.coverImageUrl : `${import.meta.env.VITE_API_BASE.replace('/api', '')}${d.coverImageUrl}`) : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
    name: d.destinationName || d.name,
    count: `${d.propertiesCount || 0} Homestays - Villas & Appartments`
  })) : carouselDestinations;
  const displayExperiences = liveExperiences.length > 0 ? liveExperiences.map(e => ({
    img: e.themeCoverImageUrl ? (e.themeCoverImageUrl.startsWith('http') ? e.themeCoverImageUrl : `${import.meta.env.VITE_API_BASE.replace('/api', '')}${e.themeCoverImageUrl}`) : 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80',
    name: e.experienceName || e.name,
    count: `${e.propertiesCount || 0} properties`
  })) : carouselExperiences;

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

  const viewCtx = {
    API_BASE,
    activeMenu,
    setActiveMenu,
    homepageContent,
    renderTitle,

    // navigation
    activeDestTab,
    setActiveDestTab,
    activeDetailTab,
    setActiveDetailTab,
    scrollToDetailSection,

    // auth/session
    token,
    user,
    liveEnquiries,
    userReviews,
    fetchProfileAndEnquiries,
    openAuthModal,
    openLoginModal,
    handleLogout,
    authModalOpen,
    setAuthModalOpen,
    authMode,
    setAuthMode,
    showPassword,
    setShowPassword,
    authLoading,
    handleOAuthLogin,
    handleSignupSubmit,
    handleLoginSubmit,
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
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    enquiryFirstName,
    setEnquiryFirstName,
    enquiryLastName,
    setEnquiryLastName,
    enquiryEmail,
    setEnquiryEmail,
    enquiryPhone,
    setEnquiryPhone,

    // profile editing
    isEditProfileModalOpen,
    setIsEditProfileModalOpen,
    editProfileForm,
    setEditProfileForm,
    editProfileError,
    openEditProfileModal,
    handleEditProfileSubmit,

    // guest search
    activeSearchTab,
    setActiveSearchTab,
    activePropCategory,
    setActivePropCategory,
    where,
    setWhere,
    dates,
    setDates,
    guests,
    setGuests,
    price,
    setPrice,
    stayType,
    setStayType,
    foodPref,
    setFoodPref,
    verifiedOnly,
    setVerifiedOnly,
    featuredOnly,
    setFeaturedOnly,
    aiSearchLoading,
    aiSummary,
    aiTags,
    fetchProperties,
    handleAISearch,
    handleSearch,
    handleClearAll,
    sidebarSearchText,
    setSidebarSearchText,
    filterMinPrice,
    setFilterMinPrice,
    filterMaxPrice,
    setFilterMaxPrice,
    setFilterPriceSlider,
    filterSelectedTypes,
    setFilterSelectedTypes,
    filterSelectedAmenities,
    setFilterSelectedAmenities,
    filterMinRating,
    setFilterMinRating,
    searchSortBy,
    setSearchSortBy,
    filterInstantBook,
    setFilterInstantBook,
    filterCancellationPolicy,
    setFilterCancellationPolicy,
    filterHomestays,
    setFilterHomestays,
    searchCurrentPage,
    setSearchCurrentPage,

    // data + derived
    allProperties,
    getFilteredProperties,
    popularOffers,
    mockWishlistedTitles,
    toggleMockWishlist,
    mapDbProperties,
    setSelectedProperty,
    activeDetailProp,
    displayDestinations,
    displayExperiences,
    currentBestVillas,
    currentCuratedVillas,

    // detail + gallery
    showFullDescription,
    setShowFullDescription,
    propertyRooms,
    dynamicLandmarks,
    dynamicReviews,
    dynamicReviewStats,
    isGalleryOpen,
    setIsGalleryOpen,
    currentImageIndex,
    setCurrentImageIndex,

    // contact verification
    contactModalOpen,
    setContactModalOpen,
    contactStep,
    setContactStep,
    contactOTP,
    setContactOTP,
    otpLoading,
    otpError,
    otpChannel,
    resendTimer,
    handleSendOTP,
    handleVerifyOTP,
    hostContactRevealed,

    // enquiry
    handleEnquirySubmit,
    guestEnquiryName,
    setGuestEnquiryName,
    guestEnquiryPhone,
    setGuestEnquiryPhone,
    guestEnquiryEmail,
    setGuestEnquiryEmail,
    guestEnquiryMessage,
    setGuestEnquiryMessage,
    guestEnquirySubmitting,
    setReviewPage,
    reviewPage,

    // review modal
    reviewModalOpen,
    setReviewModalOpen,
    reviewRating,
    setReviewRating,
    reviewText,
    setReviewText,
    reviewName,
    setReviewName,
    handleReviewFormSubmit,

    // contact / static pages state
    contactName,
    setContactName,
    contactPhone,
    setContactPhone,
    contactEmail,
    setContactEmail,
    contactMessage,
    setContactMessage,
    contactAgreed,
    setContactAgreed,
    isRecommendFilterOpen,
    setIsRecommendFilterOpen,
    recommendSearchQuery,
    setRecommendSearchQuery,
    recWishlist,
    setRecWishlist,
    activeFaq,
    setActiveFaq,

    // account filter state
    isWishlistFilterOpen,
    setIsWishlistFilterOpen,
    wishlistSearchQuery,
    setWishlistSearchQuery,
    wishlistSortOption,
    setWishlistSortOption,
    isEnquiryFilterOpen,
    setIsEnquiryFilterOpen,
    enquirySearchQuery,
    setEnquirySearchQuery,
    enquiryStatusFilter,
    setEnquiryStatusFilter,
    isReviewsFilterOpen,
    setIsReviewsFilterOpen,
    reviewsRatingFilter,
    setReviewsRatingFilter,
  };

  const heroSectionProps = buildHeroSectionProps(viewCtx);
  const accountPagesProps = buildAccountPagesProps(viewCtx);
  const staticPagesProps = buildStaticPagesProps(viewCtx);
  const catalogPagesProps = buildCatalogPagesProps(viewCtx);
  const homePageProps = buildHomePageProps(viewCtx);
  const guestModalsProps = buildGuestModalsProps(viewCtx);

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

        <HeroSection {...heroSectionProps} />
        <AccountPages {...accountPagesProps} />
        <StaticPages {...staticPagesProps} />
        <CatalogPages {...catalogPagesProps} />
        <HomePage {...homePageProps} />

        <Footer token={token} onNavigate={setActiveMenu} onRequireAuth={openLoginModal} />
      </div>

      <GuestModals {...guestModalsProps} />
    </>
  );
}
