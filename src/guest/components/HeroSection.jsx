import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import { DateRange, Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format, parse } from 'date-fns';
import { heroBgImg } from '../../assets';
import Select from 'react-select';

// Custom styles for react-select
const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '48px',
    borderRadius: '12px',
    borderColor: state.isFocused ? 'var(--primary-blue)' : '#D1D5DB',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
    '&:hover': {
      borderColor: 'var(--primary-blue)'
    }
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 9999
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: '200px',
    padding: '4px',
    '::-webkit-scrollbar': {
      width: '8px'
    },
    '::-webkit-scrollbar-track': {
      background: '#F3F4F6',
      borderRadius: '4px'
    },
    '::-webkit-scrollbar-thumb': {
      background: '#CBD5E1',
      borderRadius: '4px'
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: '#94A3B8'
    }
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected 
      ? 'var(--primary-blue)' 
      : state.isFocused 
      ? 'rgba(59, 130, 246, 0.1)' 
      : 'white',
    color: state.isSelected ? 'white' : '#374151',
    cursor: 'pointer',
    padding: '10px 12px',
    borderRadius: '8px',
    margin: '2px 0',
    fontSize: '14px',
    fontFamily: "'Lato', sans-serif"
  }),
  singleValue: (base) => ({
    ...base,
    color: '#374151',
    fontSize: '14px',
    fontFamily: "'Lato', sans-serif"
  }),
  placeholder: (base) => ({
    ...base,
    color: '#9CA3AF',
    fontSize: '14px',
    fontFamily: "'Lato', sans-serif"
  })
};

// Desktop select styles (slightly smaller)
const desktopSelectStyles = {
  ...customSelectStyles,
  control: (base, state) => ({
    ...base,
    minHeight: '44px',
    borderRadius: '8px',
    borderColor: state.isFocused ? 'var(--primary-blue)' : '#E5E7EB',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
    '&:hover': {
      borderColor: 'var(--primary-blue)'
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: '#111827',
    fontSize: '13.5px',
    fontFamily: "'Lato', sans-serif"
  }),
  placeholder: (base) => ({
    ...base,
    color: '#9CA3AF',
    fontSize: '13.5px',
    fontFamily: "'Lato', sans-serif"
  })
};

export default function HeroSection(props) {
  const {
    API_BASE,
    activeMenu,
    homepageContent,

    // Search form state
    activeSearchTab,
    setActiveSearchTab,
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

    // Actions
    handleClearAll,
    handleCloseSearch,
    handleSearch,
    handleAISearch,
    aiSearchLoading,
  } = props;

  const [roomTypes, setRoomTypes] = useState([]);
  
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch(`${API_BASE}/master/room-types`);
        const data = await res.json();
        if (Array.isArray(data)) setRoomTypes(data);
      } catch (err) {
        console.error("Error fetching room types:", err);
      }
    };
    fetchTypes();
  }, [API_BASE]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerCoords, setPickerCoords] = useState({ top: 0, left: 0 });
  const datePickerRef = useRef(null);
  const mobileDatePickerRef = useRef(null);
  const portalRef = useRef(null);

  // Function to update picker position
  const updatePickerPosition = () => {
    const isMobile = window.innerWidth <= 768;
    const targetRef = isMobile ? mobileDatePickerRef : datePickerRef;
    
    if (showDatePicker && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const popupWidth = window.innerWidth > 640 ? 560 : 320; // Approx widths
      
      let leftPos = rect.left;
      // Constrain to viewport
      if (leftPos + popupWidth > window.innerWidth) {
        leftPos = window.innerWidth - popupWidth - 20;
      }
      if (leftPos < 20) leftPos = 20;

      setPickerCoords({
        top: rect.bottom + 8,
        left: leftPos
      });
    }
  };

  // Update position on scroll/resize when picker is open
  useLayoutEffect(() => {
    if (showDatePicker) {
      updatePickerPosition();
      window.addEventListener('scroll', updatePickerPosition, true);
      window.addEventListener('resize', updatePickerPosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePickerPosition, true);
      window.removeEventListener('resize', updatePickerPosition);
    };
  }, [showDatePicker]);

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        (datePickerRef.current && datePickerRef.current.contains(event.target)) ||
        (mobileDatePickerRef.current && mobileDatePickerRef.current.contains(event.target)) ||
        (portalRef.current && portalRef.current.contains(event.target))
      ) {
        return;
      }
      setShowDatePicker(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const parsed = parse(dateStr, 'yyyy-MM-dd', new Date());
    return isNaN(parsed) ? new Date() : parsed;
  };

  const getSelectionRange = () => {
    const parts = (dates || '').split(' to ');
    return {
      startDate: parts[0] ? parseDate(parts[0]) : new Date(),
      endDate: parts[1] ? parseDate(parts[1]) : new Date(),
      key: 'selection',
    };
  };

  const handleSelect = (ranges) => {
    const start = format(ranges.selection.startDate, 'yyyy-MM-dd');
    const end = format(ranges.selection.endDate, 'yyyy-MM-dd');
    setDates(`${start} to ${end}`);
  };

  return (
    <>
      {/* ══ HERO SECTION (Height: 712px, Width: 100%) ══ */}
      {(activeMenu !== 'Detail' && activeMenu !== 'Profile' && activeMenu !== 'Wishlist' && activeMenu !== 'Enquiries' && activeMenu !== 'Reviews' && activeMenu !== 'About Us' && activeMenu !== 'Contact' && activeMenu !== 'Terms' && activeMenu !== 'Privacy' && activeMenu !== 'Recommend By Us' && activeMenu !== 'List Your Place') && (
        <div className="hero-wrapper">
          
          {/* Background Image: Loads your exact high-resolution custom hero image */}
          <img 
            src={homepageContent?.banner?.image || heroBgImg}
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
                <h1 className="hero-headline">{homepageContent?.banner?.title ? ( <>{homepageContent.banner.title.split(" ").slice(0, -2).join(" ")} <span className="hero-headline-span">{homepageContent.banner.title.split(" ").slice(-2).join(" ")}</span></> ) : ( <>Find Your <span className="hero-headline-span">Perfect Stay</span></> )}</h1>
              )}
            </div>

          </div>

          {/* ══ MOBILE HERO CONTENT (768px and below) ══ */}
          <div className="mobile-hero-content">
            {/* Mobile Hero Title */}
            <div className="mobile-hero-title">
              <h1>
                {activeMenu === 'Properties' ? (
                  <>
                    {where ? 'Best Properties In ' : 'Best Properties '}
                    <span className="mobile-hero-highlight">
                      {where ? (where.charAt(0).toUpperCase() + where.slice(1) + (where.toLowerCase() === 'india' ? '' : ', India')) : 'For You'}
                    </span>
                  </>
                ) : (
                  <>
                    {homepageContent?.banner?.title ? (
                      <>
                        {homepageContent.banner.title.split(" ").slice(0, -2).join(" ")} <span className="mobile-hero-highlight">{homepageContent.banner.title.split(" ").slice(-2).join(" ")}</span>
                      </>
                    ) : (
                      <>
                        Find Your <span className="mobile-hero-highlight">Perfect Stay</span>
                      </>
                    )}
                  </>
                )}
              </h1>
            </div>

            {/* Mobile Search Card */}
            <div className="mobile-search-card">
              {/* Mobile Tabs Row */}
              <div className="mobile-tabs-row">
                {['Villas', 'Homestays', 'Hotels', 'Resorts', 'More+'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`mobile-tab-btn ${activeSearchTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveSearchTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Mobile Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                {/* Where */}
                <div className="mobile-form-group">
                  <label className="mobile-field-label">Where</label>
                  <input 
                    type="text" 
                    className="mobile-form-input" 
                    placeholder="Where are you going?" 
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                  />
                </div>

                {/* When and Who Row */}
                <div className="mobile-form-row">
                  <div className="mobile-form-group" style={{ position: 'relative' }} ref={mobileDatePickerRef}>
                    <label className="mobile-field-label">When</label>
                    <div 
                      className="mobile-form-input" 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        cursor: 'pointer',
                        color: dates ? '#374151' : '#9CA3AF'
                      }}
                      onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                      <span style={{ flex: 1, fontSize: '13px' }}>
                        {dates ? `${dates.split(' to ')[0] || ''} - ${dates.split(' to ')[1] || ''}` : 'Select dates'}
                      </span>
                      <CalendarIcon size={14} color="#6B7280" />
                    </div>

                    {showDatePicker && window.innerWidth <= 640 && (
                      <div ref={portalRef} style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        zIndex: 30000,
                        padding: '10px',
                        border: '1px solid #E5E7EB',
                        width: 'calc(100vw - 24px)',
                        maxWidth: '380px',
                        maxHeight: '85vh',
                        overflow: 'auto',
                        boxSizing: 'border-box'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
                          <div style={{ width: '100%', boxSizing: 'border-box' }}>
                            <div style={{ fontWeight: 600, fontSize: '13px', color: '#111827', marginBottom: '6px', paddingLeft: '2px' }}>From</div>
                            <div style={{ width: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                              <Calendar
                                date={getSelectionRange().startDate}
                                onChange={(date) => {
                                  const start = format(date, 'yyyy-MM-dd');
                                  const { endDate } = getSelectionRange();
                                  setDates(`${start} to ${format(endDate, 'yyyy-MM-dd')}`);
                                }}
                                minDate={new Date()}
                                color="#2563EB"
                              />
                            </div>
                          </div>
                          
                          <div style={{ width: '100%', boxSizing: 'border-box' }}>
                            <div style={{ fontWeight: 600, fontSize: '13px', color: '#111827', marginBottom: '6px', paddingLeft: '2px' }}>To</div>
                            <div style={{ width: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                              <Calendar
                                date={getSelectionRange().endDate}
                                onChange={(date) => {
                                  const { startDate } = getSelectionRange();
                                  const end = format(date, 'yyyy-MM-dd');
                                  if (date < startDate) {
                                      setDates(`${format(date, 'yyyy-MM-dd')} to ${format(date, 'yyyy-MM-dd')}`);
                                  } else {
                                      setDates(`${format(startDate, 'yyyy-MM-dd')} to ${end}`);
                                  }
                                }}
                                minDate={getSelectionRange().startDate}
                                color="#2563EB"
                              />
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '10px', borderTop: '1px solid #F3F4F6', paddingTop: '10px' }}>
                          <button type="button" onClick={() => { setDates(''); setShowDatePicker(false); }} style={{ flex: 1, padding: '9px 10px', background: '#fff', border: '1px solid #D1D5DB', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: '#374151' }}>Cancel</button>
                          <button type="button" onClick={() => setShowDatePicker(false)} style={{ flex: 1, padding: '9px 10px', background: '#2563EB', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#fff' }}>Done</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mobile-form-group">
                    <label className="mobile-field-label">Who</label>
                    <Select
                      value={{ value: guests, label: guests }}
                      onChange={(option) => setGuests(option.value)}
                      options={[
                        { value: 'Any Guests', label: 'Any Guests' },
                        { value: '1 Guest', label: '1 Guest' },
                        { value: '2 Guests', label: '2 Guests' },
                        { value: '3 Guests', label: '3 Guests' },
                        { value: '4+ Guests', label: '4+ Guests' },
                      ]}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          minHeight: '48px',
                          borderRadius: '12px',
                          borderColor: state.isFocused ? 'var(--primary-blue)' : '#D1D5DB',
                          boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                          '&:hover': {
                            borderColor: 'var(--primary-blue)'
                          }
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: '12px',
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          zIndex: 9999
                        }),
                        menuList: (base) => ({
                          ...base,
                          maxHeight: '200px',
                          padding: '4px',
                          '::-webkit-scrollbar': {
                            width: '8px'
                          },
                          '::-webkit-scrollbar-track': {
                            background: '#F3F4F6',
                            borderRadius: '4px'
                          },
                          '::-webkit-scrollbar-thumb': {
                            background: '#CBD5E1',
                            borderRadius: '4px'
                          },
                          '::-webkit-scrollbar-thumb:hover': {
                            background: '#94A3B8'
                          }
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected 
                            ? 'var(--primary-blue)' 
                            : state.isFocused 
                            ? 'rgba(59, 130, 246, 0.1)' 
                            : 'white',
                          color: state.isSelected ? 'white' : '#374151',
                          cursor: 'pointer',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          margin: '2px 0',
                          fontSize: '14px',
                          fontFamily: "'Lato', sans-serif"
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: '#374151',
                          fontSize: '14px',
                          fontFamily: "'Lato', sans-serif"
                        })
                      }}
                      isSearchable={false}
                      placeholder="Select guests"
                    />
                  </div>
                </div>

                {/* Price and Stay Type Row */}
                <div className="mobile-form-row">
                  <div className="mobile-form-group">
                    <label className="mobile-field-label">Price per Night</label>
                    <Select
                      value={{ value: price, label: price }}
                      onChange={(option) => setPrice(option.value)}
                      options={[
                        { value: 'Any', label: 'Any' },
                        { value: '₹2,000 - ₹5,000', label: '₹2,000 - ₹5,000' },
                        { value: '₹5,000 - ₹10,000', label: '₹5,000 - ₹10,000' },
                        { value: '₹10,000 - ₹20,000', label: '₹10,000 - ₹20,000' },
                        { value: '₹20,000+', label: '₹20,000+' },
                      ]}
                      styles={customSelectStyles}
                      isSearchable={false}
                      placeholder="Select price"
                    />
                  </div>

                  <div className="mobile-form-group">
                    <label className="mobile-field-label">Room/Stay Type</label>
                    <Select
                      value={{ value: stayType, label: stayType }}
                      onChange={(option) => setStayType(option.value)}
                      options={[
                        { value: 'Any', label: 'Any' },
                        ...(roomTypes.length > 0 
                          ? roomTypes.map(rt => ({ value: rt.name, label: rt.name }))
                          : [
                              { value: '1 Deluxe Room', label: '1 Deluxe Room' },
                              { value: '2 Deluxe Rooms', label: '2 Deluxe Rooms' },
                              { value: 'Entire Villa', label: 'Entire Villa' }
                            ]
                        )
                      ]}
                      styles={customSelectStyles}
                      isSearchable={false}
                      placeholder="Select stay type"
                    />
                  </div>
                </div>

                {/* Food Preference */}
                <div className="mobile-form-group">
                  <label className="mobile-field-label">Food Preference</label>
                  <Select
                    value={{ value: foodPref, label: foodPref }}
                    onChange={(option) => setFoodPref(option.value)}
                    options={[
                      { value: 'Any', label: 'Any' },
                      { value: 'Pure Veg', label: 'Pure Veg' },
                      { value: 'Non-Veg', label: 'Non-Veg' },
                      { value: 'Buffet Available', label: 'Buffet Available' },
                    ]}
                    styles={customSelectStyles}
                    isSearchable={false}
                    placeholder="Select food preference"
                  />
                </div>

                {/* Mobile Checkbox Row */}
                <div className="mobile-checkbox-row">
                  <div className="mobile-checkbox-item">
                    <input 
                      type="checkbox" 
                      id="mobile-verified" 
                      className="mobile-checkbox" 
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                    />
                    <label htmlFor="mobile-verified" className="mobile-checkbox-label">Verified only</label>
                  </div>
                  <div className="mobile-checkbox-item">
                    <input 
                      type="checkbox" 
                      id="mobile-featured" 
                      className="mobile-checkbox" 
                      checked={featuredOnly}
                      onChange={(e) => setFeaturedOnly(e.target.checked)}
                    />
                    <label htmlFor="mobile-featured" className="mobile-checkbox-label">Featured only</label>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="mobile-action-buttons">
                  <button type="submit" className="mobile-search-btn">
                    <Search size={16} />
                    <span>Search Properties</span>
                  </button>
                  
                  <div className="mobile-secondary-buttons">
                    <button type="button" className="mobile-clear-btn" onClick={handleClearAll}>
                      Clear all
                    </button>
                    <button type="button" className="mobile-ai-btn" onClick={handleAISearch} disabled={aiSearchLoading}>
                      <Sparkles size={14} color="var(--primary-blue)" />
                      <span>{aiSearchLoading ? 'Searching...' : 'AI Search'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* ══ FLOATING SEARCH CARD ══ */}
          <form
            className="search-card-wrapper"
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          >
            {/* Top category bar */}
            <div className="tabs-row">
              {['Villas', 'Homestays', 'Hotels', 'Resorts', 'More+'].map((tab) => (
                <button
                  key={tab}
                  type="button"
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
              <div className="field-group" style={{ position: 'relative' }} ref={datePickerRef}>
                <span className="field-label">When</span>
                <div 
                  className="field-control-wrap" 
                  style={{ display: 'flex', gap: '8px', cursor: 'pointer', padding: '10px 14px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', alignItems: 'center', height: '44px', boxSizing: 'border-box' }}
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <span style={{ flex: 1, fontSize: '14px', color: dates ? '#111827' : '#9CA3AF' }}>
                    {dates ? `${dates.split(' to ')[0] || ''} - ${dates.split(' to ')[1] || ''}` : 'mm/dd/yyyy - mm/dd/yyyy'}
                  </span>
                  <CalendarIcon size={16} color="#6B7280" />
                </div>

                {showDatePicker && window.innerWidth > 640 && (() => {
                  const isSmallScreen = window.innerWidth < 900;
                  const picker = (
                    <div ref={portalRef} style={{ 
                      position: 'fixed', 
                      top: isSmallScreen ? '50%' : pickerCoords.top,
                      left: isSmallScreen ? '50%' : pickerCoords.left,
                      transform: isSmallScreen ? 'translate(-50%, -50%)' : 'none',
                      background: '#fff', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                      zIndex: 30000, 
                      padding: '16px', 
                      border: '1px solid #E5E7EB', 
                      width: isSmallScreen ? 'calc(100vw - 32px)' : 'max-content',
                      maxWidth: isSmallScreen ? '420px' : 'none',
                      maxHeight: 'calc(100vh - 40px)',
                      overflowY: 'auto'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: isSmallScreen ? 'column' : 'row',
                        gap: isSmallScreen ? '20px' : '24px',
                        overflowX: 'auto'
                      }}>
                        <div style={{ minWidth: isSmallScreen ? '100%' : 'auto' }}>
                          <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827', marginBottom: '8px', paddingLeft: '8px' }}>From</div>
                          <div style={{ overflowX: 'auto' }}>
                            <Calendar
                              date={getSelectionRange().startDate}
                              onChange={(date) => {
                                const start = format(date, 'yyyy-MM-dd');
                                const { endDate } = getSelectionRange();
                                setDates(`${start} to ${format(endDate, 'yyyy-MM-dd')}`);
                              }}
                              minDate={new Date()}
                              color="#2563EB"
                            />
                          </div>
                        </div>
                        
                        <div style={{ minWidth: isSmallScreen ? '100%' : 'auto' }}>
                          <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827', marginBottom: '8px', paddingLeft: '8px' }}>To</div>
                          <div style={{ overflowX: 'auto' }}>
                            <Calendar
                              date={getSelectionRange().endDate}
                              onChange={(date) => {
                                const { startDate } = getSelectionRange();
                                const end = format(date, 'yyyy-MM-dd');
                                // Ensure endDate is not before startDate
                                if (date < startDate) {
                                    setDates(`${format(date, 'yyyy-MM-dd')} to ${format(date, 'yyyy-MM-dd')}`);
                                } else {
                                    setDates(`${format(startDate, 'yyyy-MM-dd')} to ${end}`);
                                }
                              }}
                              minDate={getSelectionRange().startDate}
                              color="#2563EB"
                            />
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: isSmallScreen ? 'space-between' : 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
                        <button type="button" onClick={() => { setDates(''); setShowDatePicker(false); }} style={{ flex: isSmallScreen ? 1 : 'none', padding: '8px 16px', background: '#fff', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Cancel</button>
                        <button type="button" onClick={() => setShowDatePicker(false)} style={{ flex: isSmallScreen ? 1 : 'none', padding: '8px 16px', background: '#2563EB', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#fff' }}>Filter</button>
                      </div>
                    </div>
                  );
                  return createPortal(picker, document.body);
                })()}
              </div>

              {/* Field 3: Who */}
              <div className="field-group">
                <span className="field-label">Who</span>
                <Select
                  value={{ value: guests, label: guests }}
                  onChange={(option) => setGuests(option.value)}
                  options={[
                    { value: 'Any Guests', label: 'Any Guests' },
                    { value: '1 Guest', label: '1 Guest' },
                    { value: '2 Guests', label: '2 Guests' },
                    { value: '3 Guests', label: '3 Guests' },
                    { value: '4+ Guests', label: '4+ Guests' },
                  ]}
                  styles={desktopSelectStyles}
                  isSearchable={false}
                  placeholder="Select guests"
                />
              </div>

              {/* Field 4: Price per Night */}
              <div className="field-group">
                <span className="field-label">Price per Night</span>
                <Select
                  value={{ value: price, label: price }}
                  onChange={(option) => setPrice(option.value)}
                  options={[
                    { value: 'Any', label: 'Any' },
                    { value: '₹2,000 - ₹5,000', label: '₹2,000 - ₹5,000' },
                    { value: '₹5,000 - ₹10,000', label: '₹5,000 - ₹10,000' },
                    { value: '₹10,000 - ₹20,000', label: '₹10,000 - ₹20,000' },
                    { value: '₹20,000+', label: '₹20,000+' },
                  ]}
                  styles={desktopSelectStyles}
                  isSearchable={false}
                  placeholder="Select price"
                />
              </div>

              {/* Field 5: Room/Stay Type */}
              <div className="field-group">
                <span className="field-label">Room/Stay Type</span>
                <Select
                  value={{ value: stayType, label: stayType }}
                  onChange={(option) => setStayType(option.value)}
                  options={[
                    { value: 'Any', label: 'Any' },
                    ...(roomTypes.length > 0 
                      ? roomTypes.map(rt => ({ value: rt.name, label: rt.name }))
                      : [
                          { value: '1 Deluxe Room', label: '1 Deluxe Room' },
                          { value: '2 Deluxe Rooms', label: '2 Deluxe Rooms' },
                          { value: 'Entire Villa', label: 'Entire Villa' }
                        ]
                    )
                  ]}
                  styles={desktopSelectStyles}
                  isSearchable={false}
                  placeholder="Select stay type"
                />
              </div>

              {/* Field 6: Food Preference */}
              <div className="field-group">
                <span className="field-label">Food Preference</span>
                <Select
                  value={{ value: foodPref, label: foodPref }}
                  onChange={(option) => setFoodPref(option.value)}
                  options={[
                    { value: 'Any', label: 'Any' },
                    { value: 'Pure Veg', label: 'Pure Veg' },
                    { value: 'Non-Veg', label: 'Non-Veg' },
                    { value: 'Buffet Available', label: 'Buffet Available' },
                  ]}
                  styles={desktopSelectStyles}
                  isSearchable={false}
                  placeholder="Select food preference"
                />
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
                <button type="button" className="btn-outline" onClick={handleCloseSearch || handleClearAll}>Close</button>
                <button type="button" className="btn-outline" onClick={handleClearAll}>Clear all</button>
                
                <button type="submit" className="btn-search">
                  <Search size={16} />
                  <span>Search</span>
                </button>

                <button type="button" className="btn-search-ai" onClick={handleAISearch} disabled={aiSearchLoading} style={{ opacity: aiSearchLoading ? 0.7 : 1 }}>
                  <Sparkles size={16} color="var(--primary-blue)" />
                  <span>{aiSearchLoading ? 'Searching...' : 'Search with AI'}</span>
                </button>
              </div>

            </div>

          </form>

        </div>
      )}

    </>
  );
}
