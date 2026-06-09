import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import { DateRange, Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format, parse } from 'date-fns';
import { heroBgImg } from '../../assets';

export default function HeroSection(props) {
  const [propertyTypes, setPropertyTypes] = useState([]);
  
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/master/property-types`);
        const data = await res.json();
        if (Array.isArray(data)) setPropertyTypes(data);
      } catch (err) {
        console.error("Error fetching property types:", err);
      }
    };
    fetchTypes();
  }, []);

  const {
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
                        padding: '16px',
                        border: '1px solid #E5E7EB',
                        width: '90vw',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflow: 'auto'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827', marginBottom: '8px', paddingLeft: '8px' }}>From</div>
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
                          
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827', marginBottom: '8px', paddingLeft: '8px' }}>To</div>
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
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
                          <button type="button" onClick={() => { setDates(''); setShowDatePicker(false); }} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Cancel</button>
                          <button type="button" onClick={() => setShowDatePicker(false)} style={{ padding: '8px 16px', background: '#2563EB', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#fff' }}>Done</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mobile-form-group">
                    <label className="mobile-field-label">Who</label>
                    <select 
                      className="mobile-form-select" 
                      value={guests} 
                      onChange={(e) => setGuests(e.target.value)}
                    >
                      <option value="Any Guests">Any Guests</option>
                      <option value="1 Guest">1 Guest</option>
                      <option value="2 Guests">2 Guests</option>
                      <option value="3 Guests">3 Guests</option>
                      <option value="4+ Guests">4+ Guests</option>
                    </select>
                  </div>
                </div>

                {/* Price and Stay Type Row */}
                <div className="mobile-form-row">
                  <div className="mobile-form-group">
                    <label className="mobile-field-label">Price per Night</label>
                    <select 
                      className="mobile-form-select" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)}
                    >
                      <option value="Any">Any</option>
                      <option value="₹2,000 - ₹5,000">₹2,000 - ₹5,000</option>
                      <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
                      <option value="₹10,000 - ₹20,000">₹10,000 - ₹20,000</option>
                      <option value="₹20,000+">₹20,000+</option>
                    </select>
                  </div>

                  <div className="mobile-form-group">
                    <label className="mobile-field-label">Room/Stay Type</label>
                    <select 
                      className="mobile-form-select" 
                      value={stayType} 
                      onChange={(e) => setStayType(e.target.value)}
                    >
                      <option value="Any">Any</option>
                      <option value="1 Deluxe Room">1 Deluxe Room</option>
                      <option value="2 Deluxe Rooms">2 Deluxe Rooms</option>
                      <option value="Entire Villa">Entire Villa</option>
                    </select>
                  </div>
                </div>

                {/* Food Preference */}
                <div className="mobile-form-group">
                  <label className="mobile-field-label">Food Preference</label>
                  <select 
                    className="mobile-form-select" 
                    value={foodPref} 
                    onChange={(e) => setFoodPref(e.target.value)}
                  >
                    <option value="Any">Any</option>
                    <option value="Pure Veg">Pure Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Buffet Available">Buffet Available</option>
                  </select>
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
                  const picker = (
                    <div ref={portalRef} style={{ 
                      position: 'fixed', 
                      top: pickerCoords.top, 
                      left: pickerCoords.left, 
                      background: '#fff', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                      zIndex: 30000, 
                      padding: '16px', 
                      border: '1px solid #E5E7EB', 
                      width: 'max-content',
                      maxHeight: 'calc(100vh - 40px)',
                      overflowY: 'auto'
                    }}>
                      <div style={{ display: 'flex', gap: '24px' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827', marginBottom: '8px', paddingLeft: '8px' }}>From</div>
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
                        
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '15px', color: '#111827', marginBottom: '8px', paddingLeft: '8px' }}>To</div>
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
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
                        <button type="button" onClick={() => { setDates(''); setShowDatePicker(false); }} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Cancel</button>
                        <button type="button" onClick={() => setShowDatePicker(false)} style={{ padding: '8px 16px', background: '#2563EB', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#fff' }}>Filter</button>
                      </div>
                    </div>
                  );
                  return createPortal(picker, document.body);
                })()}
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
                    {propertyTypes.map(pt => (
                      <option key={pt._id} value={pt.name}>{pt.name}</option>
                    ))}
                    {propertyTypes.length === 0 && (
                      <>
                        <option value="1 Deluxe Room">1 Deluxe Room</option>
                        <option value="2 Deluxe Rooms">2 Deluxe Rooms</option>
                        <option value="Entire Villa">Entire Villa</option>
                      </>
                    )}
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
