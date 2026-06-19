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
        <div className="relative w-full h-auto min-h-[600px] sm:min-h-[700px] md:min-h-[800px] lg:min-h-screen overflow-hidden">
          
          {/* Background Image */}
          <img 
            src={homepageContent?.banner?.image || heroBgImg}
            className="absolute top-0 left-0 w-full h-full object-cover z-10"
            alt="Luxury Villa Background" 
          />

          {/* Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/45 via-black/20 to-black/60 flex flex-col justify-center items-center z-20 px-1 xs:px-2 sm:px-4 pt-16 xs:pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-8 xs:pb-12 sm:pb-16 md:pb-20 lg:pb-8">
            
            {/* Hero Content Container */}
            <div className="flex flex-col items-center gap-3 xs:gap-4 sm:gap-8 md:gap-10 lg:gap-12 w-full max-w-6xl">
              
              {/* Hero Title */}
              <div className="text-center px-1 sm:px-2">
                {activeMenu === 'Properties' ? (
                  <h1 className="font-lato text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-medium text-white leading-tight m-0 break-words">
                    {where ? 'Best Properties In ' : 'Best Properties '}
                    <span className="font-bold bg-blue-600 px-2 py-1 xs:px-3 xs:py-1 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg shadow-blue-600/40 shadow-lg inline-flex items-center justify-center text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                      {where ? (where.charAt(0).toUpperCase() + where.slice(1) + (where.toLowerCase() === 'india' ? '' : ', India')) : 'For You'}
                    </span>
                  </h1>
                ) : (
                  <h1 className="font-lato text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-white leading-tight m-0 break-words">
                    {homepageContent?.banner?.title ? (
                      <>
                        {homepageContent.banner.title.split(" ").slice(0, -2).join(" ")} <span className="font-bold bg-blue-600 px-2 py-1 xs:px-3 xs:py-1 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-none shadow-blue-600/40 shadow-lg inline-flex items-center justify-center text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-7xl">{homepageContent.banner.title.split(" ").slice(-2).join(" ")}</span>
                      </>
                    ) : (
                      <>
                        Find Your <span className="font-bold bg-blue-600 px-2 py-1 xs:px-3 xs:py-1.5 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-10 lg:py-5 xl:px-12 xl:py-6 rounded-none shadow-blue-600/40 shadow-lg inline-flex items-center justify-center text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">Perfect Stay</span>
                      </>
                    )}
                  </h1>
                )}
              </div>

              {/* Hero Search Card */}
              <form className="bg-white rounded-xl xs:rounded-2xl sm:rounded-2xl md:rounded-3xl p-3 xs:p-4 sm:p-4 md:p-6 lg:p-8 shadow-2xl border border-gray-200 w-full max-w-xs xs:max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-6xl xl:max-w-7xl mx-2 xs:mx-4" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                
                {/* Hero Tabs Row */}
                <div className="flex gap-1 xs:gap-2 sm:gap-2 md:gap-3 mb-4 xs:mb-5 sm:mb-6 md:mb-8 lg:mb-6 overflow-x-auto scrollbar-none lg:justify-start">
                  {['Villas', 'Homestays', 'Hotels', 'Resorts', 'More+'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 lg:px-4 lg:py-2 rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-full font-lato text-xs sm:text-sm lg:text-sm font-medium border-none cursor-pointer transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                        activeSearchTab === tab 
                          ? 'bg-blue-600 text-white font-semibold' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveSearchTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Hero Fields Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-3 xs:gap-4 sm:gap-4 md:gap-5 lg:gap-4 mb-4 xs:mb-5 sm:mb-6 md:mb-8 lg:mb-6">
                  
                  {/* Field 1: Where */}
                  <div className="flex flex-col gap-1.5 xs:gap-2 col-span-1 sm:col-span-1 lg:col-span-1">
                    <label className="font-lato text-xs sm:text-sm lg:text-sm font-semibold text-gray-700">Where</label>
                    <input 
                      type="text" 
                      className="h-10 xs:h-11 sm:h-10 md:h-12 lg:h-11 bg-white border border-gray-300 rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-lg px-3 sm:px-3 md:px-4 lg:px-3 font-lato text-sm lg:text-sm text-gray-700 outline-none transition-colors duration-200 placeholder:text-gray-400 focus:border-blue-600 focus:shadow-blue-600/10 focus:shadow-lg" 
                      placeholder="Where are you going?" 
                      value={where}
                      onChange={(e) => setWhere(e.target.value)}
                    />
                  </div>

                  {/* Field 2: When */}
                  <div className="flex flex-col gap-1.5 xs:gap-2 col-span-1 sm:col-span-1 lg:col-span-1" ref={datePickerRef}>
                    <label className="font-lato text-xs sm:text-sm lg:text-sm font-semibold text-gray-700">When</label>
                    <div 
                      className="h-10 xs:h-11 sm:h-10 md:h-12 lg:h-11 bg-white border border-gray-300 rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-lg px-3 sm:px-3 md:px-4 lg:px-3 font-lato text-sm lg:text-sm text-gray-700 outline-none transition-colors duration-200 cursor-pointer flex items-center gap-2 sm:gap-2 md:gap-3 lg:gap-2 focus-within:border-blue-600 focus-within:shadow-blue-600/10 focus-within:shadow-lg" 
                      onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                      <span className="flex-1 text-gray-400 text-xs sm:text-sm lg:text-sm truncate">
                        {dates ? `${dates.split(' to ')[0] || ''} - ${dates.split(' to ')[1] || ''}` : 'mm/dd/yyyy - mm/dd/yyyy'}
                      </span>
                      <CalendarIcon size={12} className="xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-500 flex-shrink-0 lg:w-4 lg:h-4" />
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
                  <div className="flex flex-col gap-1.5 xs:gap-2 col-span-1 sm:col-span-1 lg:col-span-1">
                    <label className="font-lato text-xs sm:text-sm lg:text-sm font-semibold text-gray-700">Who</label>
                    <div className="text-sm">
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
                          ...selectStyles,
                          control: (base, state) => ({
                            ...selectStyles.control(base, state),
                            minHeight: window.innerWidth >= 1024 ? '44px' : window.innerWidth >= 768 ? '48px' : window.innerWidth >= 640 ? '40px' : window.innerWidth >= 480 ? '44px' : '40px',
                            fontSize: window.innerWidth >= 1024 ? '14px' : window.innerWidth >= 640 ? '14px' : '13px',
                            borderRadius: window.innerWidth >= 1024 ? '8px' : window.innerWidth >= 768 ? '12px' : window.innerWidth >= 640 ? '8px' : '8px'
                          })
                        }}
                        isSearchable={false}
                        placeholder="Any Guests"
                      />
                    </div>
                  </div>

                  {/* Field 4: Price per Night */}
                  <div className="flex flex-col gap-1.5 xs:gap-2 col-span-1 sm:col-span-1 lg:col-span-1">
                    <label className="font-lato text-xs sm:text-sm lg:text-sm font-semibold text-gray-700">Price per Night</label>
                    <div className="text-sm">
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
                        styles={{
                          ...selectStyles,
                          control: (base, state) => ({
                            ...selectStyles.control(base, state),
                            minHeight: window.innerWidth >= 1024 ? '44px' : window.innerWidth >= 768 ? '48px' : window.innerWidth >= 640 ? '40px' : window.innerWidth >= 480 ? '44px' : '40px',
                            fontSize: window.innerWidth >= 1024 ? '14px' : window.innerWidth >= 640 ? '14px' : '13px',
                            borderRadius: window.innerWidth >= 1024 ? '8px' : window.innerWidth >= 768 ? '12px' : window.innerWidth >= 640 ? '8px' : '8px'
                          })
                        }}
                        isSearchable={false}
                        placeholder="Any"
                      />
                    </div>
                  </div>

                  {/* Field 5: Room/Stay Type */}
                  <div className="flex flex-col gap-1.5 xs:gap-2 col-span-1 sm:col-span-1 lg:col-span-1">
                    <label className="font-lato text-xs sm:text-sm lg:text-sm font-semibold text-gray-700">Room/Stay Type</label>
                    <div className="text-sm">
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
                        styles={{
                          ...selectStyles,
                          control: (base, state) => ({
                            ...selectStyles.control(base, state),
                            minHeight: window.innerWidth >= 1024 ? '44px' : window.innerWidth >= 768 ? '48px' : window.innerWidth >= 640 ? '40px' : window.innerWidth >= 480 ? '44px' : '40px',
                            fontSize: window.innerWidth >= 1024 ? '14px' : window.innerWidth >= 640 ? '14px' : '13px',
                            borderRadius: window.innerWidth >= 1024 ? '8px' : window.innerWidth >= 768 ? '12px' : window.innerWidth >= 640 ? '8px' : '8px'
                          })
                        }}
                        isSearchable={false}
                        placeholder="Any"
                      />
                    </div>
                  </div>

                  {/* Field 6: Food Preference */}
                  <div className="flex flex-col gap-1.5 xs:gap-2 col-span-1 sm:col-span-1 lg:col-span-1">
                    <label className="font-lato text-xs sm:text-sm lg:text-sm font-semibold text-gray-700">Food Preference</label>
                    <div className="text-sm">
                      <Select
                        value={{ value: foodPref, label: foodPref }}
                        onChange={(option) => setFoodPref(option.value)}
                        options={[
                          { value: 'Any', label: 'Any' },
                          { value: 'Pure Veg', label: 'Pure Veg' },
                          { value: 'Non-Veg', label: 'Non-Veg' },
                          { value: 'Buffet Available', label: 'Buffet Available' },
                        ]}
                        styles={{
                          ...selectStyles,
                          control: (base, state) => ({
                            ...selectStyles.control(base, state),
                            minHeight: window.innerWidth >= 1024 ? '44px' : window.innerWidth >= 768 ? '48px' : window.innerWidth >= 640 ? '40px' : window.innerWidth >= 480 ? '44px' : '40px',
                            fontSize: window.innerWidth >= 1024 ? '14px' : window.innerWidth >= 640 ? '14px' : '13px',
                            borderRadius: window.innerWidth >= 1024 ? '8px' : window.innerWidth >= 768 ? '12px' : window.innerWidth >= 640 ? '8px' : '8px'
                          })
                        }}
                        isSearchable={false}
                        placeholder="Any"
                      />
                    </div>
                  </div>

                </div>

                {/* Hero Bottom Row */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 xs:gap-4 lg:gap-6">
                  
                  {/* Checkboxes */}
                  <div className="flex gap-3 xs:gap-4 sm:gap-6 lg:gap-6 flex-col xs:flex-row lg:flex-row order-2 lg:order-1 w-full lg:w-auto justify-start">
                    <label className="flex items-center gap-2 cursor-pointer font-lato text-xs sm:text-sm lg:text-sm font-medium text-gray-700">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 sm:w-[18px] sm:h-[18px] lg:w-4 lg:h-4 accent-blue-600 cursor-pointer" 
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                      />
                      <span>Verified only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-lato text-xs sm:text-sm lg:text-sm font-medium text-gray-700">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 sm:w-[18px] sm:h-[18px] lg:w-4 lg:h-4 accent-blue-600 cursor-pointer" 
                        checked={featuredOnly}
                        onChange={(e) => setFeaturedOnly(e.target.checked)}
                      />
                      <span>Featured only</span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1.5 xs:gap-2 sm:gap-3 lg:gap-3 flex-col sm:flex-row justify-center w-full lg:w-auto order-1 lg:order-2">
                    <div className="flex gap-1.5 xs:gap-2 sm:gap-3 lg:gap-3">
                      <button type="button" className="flex-1 sm:flex-none px-2.5 xs:px-3 sm:px-4 md:px-6 lg:px-4 py-2 xs:py-2.5 sm:py-3 lg:py-2.5 rounded-lg sm:rounded-xl lg:rounded-lg font-lato text-xs sm:text-sm lg:text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400" onClick={handleCloseSearch || handleClearAll}>
                        Close
                      </button>
                      <button type="button" className="flex-1 sm:flex-none px-2.5 xs:px-3 sm:px-4 md:px-6 lg:px-4 py-2 xs:py-2.5 sm:py-3 lg:py-2.5 rounded-lg sm:rounded-xl lg:rounded-lg font-lato text-xs sm:text-sm lg:text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400" onClick={handleClearAll}>
                        Clear all
                      </button>
                      <button type="submit" className="flex-1 sm:flex-none px-2.5 xs:px-3 sm:px-4 md:px-6 lg:px-4 py-2 xs:py-2.5 sm:py-3 lg:py-2.5 rounded-lg sm:rounded-xl lg:rounded-lg font-lato text-xs sm:text-sm lg:text-sm font-semibold cursor-pointer flex items-center justify-center gap-1.5 xs:gap-2 transition-all duration-200 bg-green-600 text-white shadow-green-600/30 shadow-lg hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-green-600/40 hover:shadow-xl">
                        <Search size={12} className="xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 lg:w-4 lg:h-4" />
                        <span>Search</span>
                      </button>
                      <button type="button" className="flex-1 sm:flex-none px-2.5 xs:px-3 sm:px-4 md:px-6 lg:px-4 py-2 xs:py-2.5 sm:py-3 lg:py-2.5 rounded-lg sm:rounded-xl lg:rounded-lg font-lato text-xs sm:text-sm lg:text-sm font-semibold cursor-pointer flex items-center justify-center gap-1.5 xs:gap-2 transition-all duration-200 bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 disabled:opacity-70" onClick={handleAISearch} disabled={aiSearchLoading}>
                        <Sparkles size={12} className="xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 lg:w-4 lg:h-4" />
                        <span className="hidden sm:inline lg:inline">{aiSearchLoading ? 'Searching...' : 'Search with AI'}</span>
                        <span className="sm:hidden lg:hidden">AI</span>
                      </button>
                    </div>
                  </div>

                </div>

              </form>

            </div>

          </div>

        </div>
      )}
    </>
  );
}