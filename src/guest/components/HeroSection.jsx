import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format, parse } from 'date-fns';
import { heroBgImg } from '../../assets';
import Select from 'react-select';

// Unified select styles for all breakpoints
const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '48px',
    borderRadius: '12px',
    borderColor: state.isFocused ? 'var(--primary-blue)' : '#D1D5DB',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
    fontSize: '14px',
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
    padding: '4px'
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
  const portalRef = useRef(null);

  // Function to update picker position
  const updatePickerPosition = () => {
    if (showDatePicker && datePickerRef.current) {
      const rect = datePickerRef.current.getBoundingClientRect();
      const popupWidth = window.innerWidth > 640 ? 560 : 320;
      
      let leftPos = rect.left;
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

  return (
    <>
      {(activeMenu !== 'Detail' && activeMenu !== 'Profile' && activeMenu !== 'Wishlist' && activeMenu !== 'Enquiries' && activeMenu !== 'Reviews' && activeMenu !== 'About Us' && activeMenu !== 'Contact' && activeMenu !== 'Terms' && activeMenu !== 'Privacy' && activeMenu !== 'Recommend By Us' && activeMenu !== 'List Your Place') && (
        <div className="hero-wrapper">
          
          {/* Background Image */}
          <img 
            src={homepageContent?.banner?.image || heroBgImg}
            className="hero-background"
            alt="Luxury Villa Background" 
          />

          {/* Overlay */}
          <div className="hero-overlay">
            
            {/* Exact Figma Specs for the Hero Headline: Top 203px */}
            <div className="hero-headline-container">
              <h1 className="hero-headline">
                {activeMenu === 'Properties' ? (
                  <>
                    {where ? 'Best Properties In ' : 'Best Properties '}
                    <span className="hero-headline-span" style={{ width: 'auto', height: 'auto', padding: '10px 20px' }}>
                      {where ? (where.charAt(0).toUpperCase() + where.slice(1) + (where.toLowerCase() === 'india' ? '' : ', India')) : 'For You'}
                    </span>
                  </>
                ) : (
                  <>
                    {homepageContent?.banner?.title ? (
                      <>
                        {homepageContent.banner.title.split(" ").slice(0, -2).join(" ")} <span className="hero-headline-span">{homepageContent.banner.title.split(" ").slice(-2).join(" ")}</span>
                      </>
                    ) : (
                      <>
                        Find Your <span className="hero-headline-span">Perfect Stay</span>
                      </>
                    )}
                  </>
                )}
              </h1>
            </div>

            {/* Floating Search box design */}
            <form className="search-card-wrapper" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              
              {/* Hero Tabs Row */}
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

              {/* Hero Fields Grid */}
              <div className="search-fields-grid">
                
                {/* Field 1: Where */}
                <div className="field-group">
                  <label className="field-label">Where</label>
                  <input 
                    type="text" 
                    className="field-input" 
                    placeholder="Where are you going?" 
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                  />
                </div>

                {/* Field 2: When */}
                <div className="field-group" ref={datePickerRef}>
                  <label className="field-label">When</label>
                  <div 
                    className="field-control-wrap" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  >
                    <input
                      type="text"
                      className="field-input"
                      style={{ cursor: 'pointer' }}
                      readOnly
                      placeholder="mm/dd/yyyy - mm/dd/yyyy"
                      value={dates ? `${dates.split(' to ')[0] || ''} - ${dates.split(' to ')[1] || ''}` : ''}
                    />
                    <CalendarIcon size={16} className="field-select-arrow" />
                  </div>

                  {showDatePicker && (() => {
                    const isSmallScreen = window.innerWidth < 900;
                    const picker = (
                      <div 
                        ref={portalRef} 
                        className="bg-white rounded-xl shadow-2xl border border-gray-200 p-3 sm:p-4 max-w-full max-h-screen overflow-y-auto"
                        style={{
                          position: 'fixed',
                          top: isSmallScreen ? '50%' : pickerCoords.top,
                          left: isSmallScreen ? '50%' : pickerCoords.left,
                          transform: isSmallScreen ? 'translate(-50%, -50%)' : 'none',
                          zIndex: 30000,
                          width: isSmallScreen ? 'calc(100vw - 16px)' : 'max-content',
                          maxWidth: isSmallScreen ? '350px' : 'none'
                        }}
                      >
                        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                          <div className="flex flex-col gap-2">
                            <div className="font-semibold text-sm sm:text-base text-gray-800 pl-2">From</div>
                            <div className="overflow-x-auto">
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
                          
                          <div className="flex flex-col gap-2">
                            <div className="font-semibold text-sm sm:text-base text-gray-800 pl-2">To</div>
                            <div className="overflow-x-auto">
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
                        <div className="flex justify-between sm:justify-end gap-2 sm:gap-3 mt-3 sm:mt-4 border-t border-gray-100 pt-3 sm:pt-4">
                          <button type="button" className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium cursor-pointer hover:bg-gray-50" onClick={() => { setDates(''); setShowDatePicker(false); }}>
                            Cancel
                          </button>
                          <button type="button" className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md bg-blue-600 border-none text-white text-xs sm:text-sm font-semibold cursor-pointer hover:bg-blue-700" onClick={() => setShowDatePicker(false)}>
                            Done
                          </button>
                        </div>
                      </div>
                    );
                    return createPortal(picker, document.body);
                  })()}
                </div>

                {/* Field 3: Who */}
                <div className="field-group">
                  <label className="field-label">Who</label>
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
                    styles={selectStyles}
                    isSearchable={false}
                    placeholder="Any Guests"
                  />
                </div>

                {/* Field 4: Price per Night */}
                <div className="field-group">
                  <label className="field-label">Price per Night</label>
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
                    styles={selectStyles}
                    isSearchable={false}
                    placeholder="Any"
                  />
                </div>

                {/* Field 5: Room/Stay Type */}
                <div className="field-group">
                  <label className="field-label">Room/Stay Type</label>
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
                    styles={selectStyles}
                    isSearchable={false}
                    placeholder="Any"
                  />
                </div>

                {/* Field 6: Food Preference */}
                <div className="field-group">
                  <label className="field-label">Food Preference</label>
                  <Select
                    value={{ value: foodPref, label: foodPref }}
                    onChange={(option) => setFoodPref(option.value)}
                    options={[
                      { value: 'Any', label: 'Any' },
                      { value: 'Pure Veg', label: 'Pure Veg' },
                      { value: 'Non-Veg', label: 'Non-Veg' },
                      { value: 'Buffet Available', label: 'Buffet Available' },
                    ]}
                    styles={selectStyles}
                    isSearchable={false}
                    placeholder="Any"
                  />
                </div>

              </div>

              {/* Hero Bottom Row */}
              <div className="action-buttons-row">
                
                {/* Checkboxes */}
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

                {/* Action Buttons */}
                <div className="buttons-group">
                  <button type="button" className="btn-outline" onClick={handleCloseSearch || handleClearAll}>
                    Close
                  </button>
                  <button type="button" className="btn-outline" onClick={handleClearAll}>
                    Clear all
                  </button>
                  <button type="submit" className="btn-search">
                    <Search size={16} />
                    <span>Search</span>
                  </button>
                  <button type="button" className="btn-search-ai" onClick={handleAISearch} disabled={aiSearchLoading}>
                    <Sparkles size={16} color="var(--primary-blue)" />
                    <span>{aiSearchLoading ? 'Searching...' : 'Search with AI'}</span>
                  </button>
                </div>

              </div>

            </form>

          </div>

        </div>
      )}
    </>
  );
}