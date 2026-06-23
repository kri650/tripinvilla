import { useState } from 'react';
import { ArrowRight, CheckCircle, Filter, Heart, MapPin, Phone, Search, Sparkles, Star, Map as MapIcon, List } from 'lucide-react';
import MapResultsView from './MapResultsView';

export default function SearchResultsPage(props) {
  const {
    user, where, setActiveMenu, sidebarSearchText, setSidebarSearchText,
    filterMinPrice, setFilterMinPrice, filterMaxPrice, setFilterMaxPrice,
    filterSelectedTypes, setFilterSelectedTypes,
    filterSelectedAmenities, setFilterSelectedAmenities,
    filterMinRating, setFilterMinRating, searchSortBy, setSearchSortBy,
    filterInstantBook, setFilterInstantBook,
    filterCancellationPolicy, setFilterCancellationPolicy,
    filterHomestays, setFilterHomestays, searchCurrentPage, setSearchCurrentPage,
    allProperties, getFilteredProperties, handleClearAll,
    toggleWishlist, setSelectedProperty, setContactStep, setContactModalOpen,
    aiSummary, aiTags, fetchProperties, buildSearchParams,
  } = props;

  const [showMap, setShowMap] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="w-full animate-[fadeIn_0.3s_ease-in-out]">
      {/* Mobile Filter Toggle */}
      <button
        type="button"
        className="hidden max-[640px]:inline-flex items-center justify-center gap-2 w-full mb-4 px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 font-['Outfit'] text-sm font-bold shadow-[0_4px_12px_rgba(15,23,42,0.06)] cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98]"
        onClick={() => setShowMobileFilters(prev => !prev)}
      >
        <Filter size={18} />
        {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      <div className="grid grid-cols-[minmax(280px,320px)_1fr] gap-8 max-w-[1320px] w-full mx-auto my-10 mb-20 px-6 box-border max-[1200px]:max-w-[1200px] max-[1200px]:gap-6 max-[1100px]:grid-cols-[minmax(260px,300px)_1fr] max-[1100px]:gap-5 max-[1100px]:px-5 max-[1024px]:grid-cols-[minmax(240px,280px)_1fr] max-[1024px]:gap-4 max-[1024px]:px-4 max-[1024px]:max-w-full max-[900px]:grid-cols-1 max-[900px]:gap-[18px] max-[900px]:px-4 max-[900px]:my-[30px] max-[900px]:mb-[60px] max-[900px]:max-w-full max-[640px]:my-5 max-[640px]:mb-10 max-[640px]:px-3 max-[640px]:gap-4 max-[480px]:px-[10px] max-[480px]:gap-[14px] max-[480px]:my-4 max-[480px]:mb-8 max-[360px]:px-2 max-[360px]:gap-3 max-[360px]:my-3 max-[360px]:mb-7">
        
        {/* LEFT SIDEBAR FILTERS */}
        <div className={`flex flex-col gap-6 sticky top-[100px] h-[calc(100vh-120px)] overflow-y-auto max-[900px]:static max-[900px]:h-auto max-[900px]:overflow-visible max-[640px]:${showMobileFilters ? 'flex' : 'hidden'} max-[640px]:mb-5`}>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.02)] py-2 px-6 max-[640px]:max-h-[70vh] max-[640px]:overflow-y-auto max-[640px]:py-[6px] max-[640px]:px-[18px]">
            
            {/* Map Preview */}
            <div className="relative rounded-3xl overflow-hidden h-[180px] mb-5 max-[640px]:h-40 max-[640px]:mb-4">
              <img 
                src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=400&q=80" 
                alt="Map Preview" 
                className="w-full h-full object-cover"
              />
              <button 
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-[#58A429] text-white border-none py-[10px] px-6 rounded-3xl font-semibold text-sm cursor-pointer shadow-[0_4px_12px_rgba(88,164,41,0.3)] transition-all hover:bg-[#4A8E20] hover:scale-105 whitespace-nowrap"
                onClick={() => setShowMap(true)}
              >
                Explore on Map
              </button>
            </div>

            {/* Sidebar Search */}
            <div className="pb-5 border-b border-[#EFF6E6] mb-5">
              <div className="relative">
                <Search size={18} color="#9CA3AF" className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search for hotel, locality"
                  value={sidebarSearchText}
                  onChange={e => setSidebarSearchText(e.target.value)}
                  className="w-full py-3 px-4 pl-[46px] text-sm font-['Outfit'] border border-gray-200 rounded-3xl outline-none text-gray-900 box-border bg-white transition-colors focus:border-gray-300"
                />
              </div>
            </div>

            {/* Property Type Filter */}
            <div className="py-6 border-b border-[#EFF6E6] max-[640px]:py-4">
              <h4 className="font-['Outfit'] text-[15px] font-bold text-gray-900 mb-[14px] max-[640px]:text-sm">Property Type</h4>
              <div className="flex flex-col gap-[10px]">
                {['Villa', 'Hotel', 'Resort', 'Homestay', 'Apartment', 'Cottage', 'Bungalow', 'Motel'].map((type, i) => {
                  const isChecked = filterSelectedTypes.includes(type);
                  const count = (allProperties || []).filter(p => 
                    (p.type || '').toLowerCase() === type.toLowerCase() || 
                    (p.category || '').toLowerCase() === type.toLowerCase()
                  ).length;
                  const displayCount = allProperties.length > 0 ? count : (type === 'Villa' ? 122 : 12);
                  
                  return (
                    <div key={i} className="flex justify-between items-center">
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-600 font-['Outfit'] max-[640px]:text-[13px]">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => setFilterSelectedTypes(
                            isChecked 
                              ? filterSelectedTypes.filter(t => t !== type) 
                              : [...filterSelectedTypes, type]
                          )}
                          className="w-4 h-4 accent-[#58A429] cursor-pointer"
                        />
                        {type}
                      </label>
                      <span className="text-xs text-gray-400 font-['Outfit']">({displayCount})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Slider */}
            <div className="py-6 border-b border-[#EFF6E6] max-[640px]:py-4">
              <h4 className="font-['Outfit'] text-[15px] font-bold text-gray-900 mb-[14px] max-[640px]:text-sm">Price Per Night</h4>
              {(() => {
                const sliderMin = filterMinPrice === '' ? 100 : Number(filterMinPrice);
                const sliderMax = filterMaxPrice === '' ? 100000 : Number(filterMaxPrice);
                
                return (
                  <div className="dual-slider-container mt-6 mb-3 relative mx-[10px] max-[640px]:mx-[8px] max-[480px]:mx-[6px]">
                    <div 
                      className="absolute left-0 right-0 rounded-sm z-[1]" 
                      style={{ top: '16px', height: '4px', backgroundColor: '#E5E7EB' }} 
                    />
                    <div 
                      className="absolute z-[2]"
                      style={{ 
                        top: '16px',
                        height: '4px', 
                        backgroundColor: '#111827',
                        left: `${((sliderMin - 100) / 99900) * 100}%`, 
                        right: `${100 - ((sliderMax - 100) / 99900) * 100}%` 
                      }}
                    />
                    <div 
                      className="absolute z-[5] max-[640px]:text-[8.5px] max-[480px]:text-[8px] max-[360px]:text-[7.5px]"
                      style={{ 
                        top: '-12px',
                        left: `${Math.max(5, Math.min(95, ((sliderMin - 100) / 99900) * 100))}%`, 
                        transform: 'translateX(-50%)',
                        backgroundColor: '#111827',
                        color: '#FFFFFF',
                        fontSize: '9.5px',
                        fontWeight: 'bold',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap',
                        fontFamily: "'Outfit', sans-serif"
                      }}
                    >
                      ₹ {sliderMin}
                    </div>
                    <div 
                      className="absolute z-[5] max-[640px]:text-[8.5px] max-[480px]:text-[8px] max-[360px]:text-[7.5px]"
                      style={{ 
                        top: '-12px',
                        left: `${Math.max(5, Math.min(95, ((sliderMax - 100) / 99900) * 100))}%`, 
                        transform: 'translateX(-50%)',
                        backgroundColor: '#111827',
                        color: '#FFFFFF',
                        fontSize: '9.5px',
                        fontWeight: 'bold',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap',
                        fontFamily: "'Outfit', sans-serif"
                      }}
                    >
                      ₹ {sliderMax}
                    </div>
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
                      className="w-full"
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
                      className="w-full"
                    />
                  </div>
                );
              })()}
              
              <h4 className="font-['Outfit'] text-[13px] font-bold text-gray-900 mt-4 mb-[10px]">Your Budget</h4>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min"
                  value={filterMinPrice}
                  onChange={e => setFilterMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="flex-1 border border-gray-200 rounded-lg py-[6px] px-3 text-[13px] font-['Outfit'] text-gray-700 outline-none"
                  style={{ minWidth: 0 }}
                />
                <span className="text-xs text-gray-400 font-['Outfit']">To</span>
                <input 
                  type="number" 
                  placeholder="Max"
                  value={filterMaxPrice}
                  onChange={e => setFilterMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="flex-1 border border-gray-200 rounded-lg py-[6px] px-3 text-[13px] font-['Outfit'] text-gray-700 outline-none"
                  style={{ minWidth: 0 }}
                />
                <button 
                  type="button"
                  title="Apply budget"
                  className="bg-white border border-gray-200 rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer transition-all hover:border-[#58A429]"
                  onClick={() => fetchProperties(buildSearchParams ? buildSearchParams() : { search: where })}
                >
                  <ArrowRight size={14} color="#111827" />
                </button>
              </div>
            </div>

            {/* Star Rating Filter */}
            <div className="py-6 border-b border-[#EFF6E6] max-[640px]:py-4">
              <h4 className="font-['Outfit'] text-[15px] font-bold text-gray-900 mb-[14px] max-[640px]:text-sm">Star Category</h4>
              <div className="flex flex-col gap-[10px]">
                {[5, 4, 3, 2].map((stars, i) => {
                  const count = (allProperties || []).filter(p => Math.round(Number(p.rating || 0)) === stars).length;
                  const displayCount = allProperties.length > 0 ? count : (stars === 5 ? 122 : 12);
                  
                  return (
                    <div key={i} className="flex justify-between items-center">
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-600 font-['Outfit'] max-[640px]:text-[13px]">
                        <input 
                          type="checkbox"
                          checked={filterMinRating === stars}
                          onChange={() => setFilterMinRating(filterMinRating === stars ? 0 : stars)}
                          className="w-4 h-4 accent-[#58A429] cursor-pointer"
                        />
                        {stars} Star
                        <div className="flex gap-[2px] ml-1">
                          {Array(5).fill(0).map((_, idx) => (
                            <Star 
                              key={idx} 
                              size={12} 
                              fill={idx < stars ? '#0C6DC4' : 'none'} 
                              color={idx < stars ? '#0C6DC4' : '#D1D5DB'}
                              strokeWidth={1.5}
                            />
                          ))}
                        </div>
                      </label>
                      <span className="text-xs text-gray-400 font-['Outfit']">({displayCount})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenities Filter */}
            <div className="py-6 border-b border-[#EFF6E6] max-[640px]:py-4">
              <h4 className="font-['Outfit'] text-[15px] font-bold text-gray-900 mb-[14px] max-[640px]:text-sm">Amenities</h4>
              <div className="flex flex-col gap-[10px]">
                {['Swimming Pool', 'WiFi', 'Parking', 'Spa', 'Barbeque', 'Lifts/Elevator', 'Bonfire'].map((checkVal, i) => {
                  const isChecked = filterSelectedAmenities.includes(checkVal);
                  const count = (allProperties || []).filter(p => 
                    (p.amenities || []).some(a => String(a).toLowerCase().includes(checkVal.toLowerCase()))
                  ).length;
                  const displayCount = allProperties.length > 0 ? count : (checkVal === 'Swimming Pool' ? 122 : 12);
                  
                  return (
                    <div key={i} className="flex justify-between items-center">
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-600 font-['Outfit'] max-[640px]:text-[13px]">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => setFilterSelectedAmenities(
                            isChecked 
                              ? filterSelectedAmenities.filter(a => a !== checkVal) 
                              : [...filterSelectedAmenities, checkVal]
                          )}
                          className="w-4 h-4 accent-[#58A429] cursor-pointer"
                        />
                        {checkVal}
                      </label>
                      <span className="text-xs text-gray-400 font-['Outfit']">({displayCount})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Booking Preferences */}
            <div className="py-6 border-b border-[#EFF6E6] pb-5 mb-5 max-[640px]:py-4">
              <h4 className="font-['Outfit'] text-[15px] font-bold text-gray-900 mb-[14px] max-[640px]:text-sm">Booking Preferences</h4>
              <div className="flex flex-col gap-[10px]">
                {[
                  { label: 'Instant Book', checked: filterInstantBook, setter: setFilterInstantBook },
                  { label: 'Cancellation Policy', checked: filterCancellationPolicy, setter: setFilterCancellationPolicy },
                  { label: 'Homestays', checked: filterHomestays, setter: setFilterHomestays },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-600 font-['Outfit'] max-[640px]:text-[13px]">
                      <input 
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => item.setter(!item.checked)}
                        className="w-4 h-4 accent-[#58A429] cursor-pointer"
                      />
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button 
              onClick={handleClearAll}
              className="w-full mt-4 py-[10px] bg-gray-100 border border-gray-200 rounded-[10px] text-[13px] font-semibold text-gray-700 cursor-pointer font-['Outfit'] transition-all hover:bg-gray-200"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* MAIN RESULTS COLUMN */}
        <div className="flex flex-col gap-5 min-w-0 w-full max-[640px]:gap-4">
          
          {/* AI Summary Banner */}
          {aiSummary && (
            <div className="bg-gradient-to-r from-[rgba(14,165,233,0.1)] to-[rgba(168,85,247,0.1)] border border-[rgba(14,165,233,0.2)] rounded-2xl p-5 mb-6 shadow-[0_4px_15px_rgba(0,0,0,0.03)] max-[640px]:p-4 max-[640px]:rounded-[14px] max-[640px]:mb-[18px] max-[640px]:w-full max-[640px]:box-border">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={20} color="#0ea5e9" />
                <span className="font-bold text-[15px] text-[#0ea5e9] font-['Outfit'] max-[640px]:text-sm">AI Search Summary</span>
              </div>
              <p className="text-gray-700 text-[15px] leading-relaxed mb-4 max-[640px]:text-sm max-[640px]:leading-normal">{aiSummary}</p>
              {aiTags && aiTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {aiTags.map((tag, i) => (
                    <span 
                      key={i}
                      className="bg-white py-[6px] px-3 rounded-full text-[13px] font-medium text-gray-600 border border-black/5 shadow-[0_2px_4px_rgba(0,0,0,0.02)] max-[640px]:text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Results Count and List/Map Toggle */}
          <div className="flex justify-between items-center mb-5 max-[640px]:flex-col-reverse max-[640px]:items-start max-[640px]:gap-3 max-[640px]:w-full">
            <h2 className="font-['Outfit'] text-[28px] font-bold text-gray-900 m-0 max-[900px]:text-[22px] max-[640px]:text-xl max-[640px]:leading-tight max-[640px]:w-full max-[480px]:text-lg max-[360px]:text-base">
              {`${getFilteredProperties().length} Properties In ${where || 'India'}`}
            </h2>
            <div className="flex bg-gray-100 rounded-lg p-1 max-[640px]:w-full">
              <button 
                onClick={() => setShowMap(false)}
                className={`flex items-center gap-[6px] py-[6px] px-3 ${!showMap ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]' : 'bg-transparent'} border-none rounded-md text-[13px] font-semibold ${!showMap ? 'text-gray-900' : 'text-gray-500'} cursor-pointer transition-all max-[640px]:flex-1 max-[640px]:justify-center max-[640px]:text-xs max-[640px]:py-2 max-[640px]:px-[10px]`}
              >
                <List size={14} /> List
              </button>
              <button 
                onClick={() => setShowMap(true)}
                className={`flex items-center gap-[6px] py-[6px] px-3 ${showMap ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]' : 'bg-transparent'} border-none rounded-md text-[13px] font-semibold ${showMap ? 'text-gray-900' : 'text-gray-500'} cursor-pointer transition-all max-[640px]:flex-1 max-[640px]:justify-center max-[640px]:text-xs max-[640px]:py-2 max-[640px]:px-[10px]`}
              >
                <MapIcon size={14} /> Map
              </button>
            </div>
          </div>

          {/* Sort Tabs */}
          <div className="flex bg-white rounded-xl p-[6px] border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.02)] overflow-x-auto scrollbar-none max-[900px]:overflow-x-auto max-[900px]:-webkit-overflow-scrolling-touch max-[640px]:p-1 max-[640px]:rounded-[10px] max-[640px]:w-full max-[480px]:p-[3px]">
            {[
              ['popularity', 'Popularity'], 
              ['price_low', 'Price (Low to High)'], 
              ['price_high', 'Price (High to Low)'], 
              ['offer', 'Offer Included'], 
              ['rating', 'User Rating (Highest)']
            ].map(([key, label]) => (
              <button 
                key={key}
                className={`flex-1 py-3 px-4 bg-transparent border-none border-r border-gray-200 text-sm font-semibold ${searchSortBy === key ? 'text-[#0C6DC4]' : 'text-gray-500'} cursor-pointer transition-all whitespace-nowrap last:border-r-0 hover:text-gray-900 hover:bg-gray-50 max-[900px]:flex-[0_0_auto] max-[900px]:min-w-max max-[640px]:py-[10px] max-[640px]:px-[14px] max-[640px]:text-xs max-[480px]:py-2 max-[480px]:px-3 max-[480px]:text-[11px] max-[360px]:py-[7px] max-[360px]:px-[10px] max-[360px]:text-[10px]`}
                onClick={() => setSearchSortBy(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Results List or Map */}
          {showMap ? (
            <MapResultsView 
              properties={getFilteredProperties()} 
              onPropertyClick={(prop) => { 
                setSelectedProperty(prop); 
                setActiveMenu('Detail'); 
              }} 
            />
          ) : (
            <div className="flex flex-col gap-5 max-[640px]:gap-4">
              {(() => {
                let displayList = getFilteredProperties();
                
                // Sorting logic
                if (searchSortBy === 'price_low') {
                  displayList.sort((a, b) => 
                    Number(String(a.price || a.bestRoomRate || 0).replace(/[^\d]/g, '')) - 
                    Number(String(b.price || b.bestRoomRate || 0).replace(/[^\d]/g, ''))
                  );
                } else if (searchSortBy === 'price_high') {
                  displayList.sort((a, b) => 
                    Number(String(b.price || b.bestRoomRate || 0).replace(/[^\d]/g, '')) - 
                    Number(String(a.price || a.bestRoomRate || 0).replace(/[^\d]/g, ''))
                  );
                } else if (searchSortBy === 'rating') {
                  displayList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                } else if (searchSortBy === 'offer') {
                  displayList.sort((a, b) => (b.hasActiveOffer ? 1 : 0) - (a.hasActiveOffer ? 1 : 0));
                }

                // No results
                if (displayList.length === 0) {
                  return (
                    <div className="text-center py-[60px] bg-white rounded-[20px] border border-gray-200 max-[640px]:py-10 max-[640px]:px-5 max-[640px]:rounded-2xl">
                      <Search size={40} color="#0C6DC4" className="mb-4 mx-auto" />
                      <h3 className="text-xl text-gray-900 mb-2 max-[640px]:text-lg">No properties found</h3>
                      <p className="text-gray-500 mb-5 max-[640px]:text-sm">Try adjusting your filters or search criteria.</p>
                      <button 
                        className="bg-transparent text-[#0C6DC4] border border-[#0C6DC4] py-[10px] px-6 rounded-3xl font-semibold text-sm cursor-pointer transition-all hover:bg-[#EFF6FF]"
                        onClick={handleClearAll}
                      >
                        Clear Filters
                      </button>
                    </div>
                  );
                }

                // Pagination
                const itemsPerPage = 12;
                const totalPages = Math.ceil(displayList.length / itemsPerPage) || 1;
                const safeCurrentPage = Math.min(searchCurrentPage, totalPages);
                const paginatedList = displayList.slice(
                  (safeCurrentPage - 1) * itemsPerPage, 
                  safeCurrentPage * itemsPerPage
                );

                return (
                  <>
                    {paginatedList.map((property, idx) => {
                      const isWishlisted = user && user.wishlist && user.wishlist.some(
                        w => w._id === property._id || w === property._id
                      );
                      
                      return (
                        <div 
                          key={idx}
                          className="flex bg-white rounded-[20px] overflow-hidden border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all min-h-[260px] hover:-translate-y-[2px] hover:shadow-[0_12px_25px_rgba(0,0,0,0.06)] hover:border-[#93C5FD] w-full max-[1024px]:min-h-[240px] max-[900px]:flex-col max-[900px]:min-h-auto max-[900px]:w-full max-[640px]:rounded-2xl max-[480px]:rounded-[14px]"
                        >
                          {/* Property Image */}
                          <div className="w-64 flex-shrink-0 relative overflow-hidden max-[1200px]:w-60 max-[1024px]:w-56 max-[900px]:w-full max-[900px]:h-52 max-[768px]:h-48 max-[640px]:h-44 max-[540px]:h-40 max-[480px]:h-36 max-[420px]:h-32 max-[360px]:h-28">
                            
                            <img 
                              src={property.img || property.image} 
                              alt={property.title || property.propertyName}
                              className="w-full h-full object-cover absolute top-0 left-0"
                            />
                          </div>
{/* <div className="w-80 flex-shrink-0 relative overflow-hidden max-[1200px]:w-72 max-[1024px]:w-64 max-[900px]:w-full max-[900px]:h-60 max-[768px]:h-56 max-[640px]:h-48 max-[540px]:h-44 max-[480px]:h-40 max-[420px]:h-36 max-[360px]:h-32">
  <img 
    src={property.img || property.image} 
    alt={property.title || property.propertyName}
    // Added max-[1024px]:object-contain to fix tablet cropping
    className="w-full h-full absolute top-0 left-0 object-cover max-[1024px]:object-contain"
  />
</div> */}
                          {/* Property Info */}
                          <div className="flex-1 p-5 flex flex-col min-w-0 max-[1024px]:p-4 max-[900px]:p-[18px] max-[900px]:w-full max-[900px]:box-border max-[640px]:p-4 max-[480px]:p-[14px] max-[360px]:p-3">
                            
                            {/* Header - Title and Wishlist */}
                            <div className="flex justify-between items-start mb-4 gap-4 min-[1024px]:mb-6 min-[1024px]:gap-6 max-[640px]:mb-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-['Lato'] text-xl font-bold text-gray-900 m-0 mb-2 flex items-center gap-3 flex-wrap min-[1024px]:text-2xl min-[1024px]:mb-3 max-[1200px]:text-[22px] max-[1024px]:text-xl max-[900px]:text-[21px] max-[640px]:text-lg max-[640px]:leading-tight max-[480px]:text-[17px] max-[360px]:text-base">
                                  {property.title || property.propertyName}
                                  {idx === 0 && (
                                    <span className="bg-[#58A429] text-white text-xs font-bold py-[5px] px-3 rounded-xl inline-flex items-center gap-1 min-[1024px]:text-sm min-[1024px]:py-2 min-[1024px]:px-4 max-[640px]:text-[11px] max-[640px]:py-1 max-[640px]:px-2 max-[360px]:text-[10px] max-[360px]:py-[3px] max-[360px]:px-[7px]">
                                      <Star size={12} fill="white" className="min-[1024px]:w-4 min-[1024px]:h-4" /> Premium
                                    </span>
                                  )}
                                </h3>
                                <p className="text-gray-500 text-sm m-0 flex items-center gap-2 min-[1024px]:text-[15px] min-[1024px]:gap-3 max-[640px]:text-sm max-[480px]:text-[13px] max-[360px]:text-xs">
                                  <MapPin size={16} color="#9CA3AF" className="min-[1024px]:w-5 min-[1024px]:h-5" /> {property.location}
                                </p>
                              </div>
                              <button 
                                className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center cursor-pointer transition-all hover:bg-gray-100 hover:border-gray-300 min-[1024px]:w-11 min-[1024px]:h-11 max-[640px]:w-10 max-[640px]:h-10 max-[480px]:w-9 max-[480px]:h-9 max-[360px]:w-8 max-[360px]:h-8"
                                onClick={(e) => toggleWishlist(property._id, e)}
                              >
                                <Heart 
                                  size={20} 
                                  fill={isWishlisted ? '#EF4444' : 'none'} 
                                  color={isWishlisted ? '#EF4444' : '#6B7280'} 
                                  className="min-[1024px]:w-6 min-[1024px]:h-6"
                                />
                              </button>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 min-[1024px]:gap-5 min-[1024px]:mb-5 min-[1024px]:text-[15px] max-[640px]:mb-4 max-[640px]:gap-3 max-[640px]:text-sm max-[480px]:gap-2 max-[480px]:text-[13px] max-[360px]:text-xs">
                              {property.reviewsCount > 0 ? (
                                <>
                                  <span className="bg-[#58A429] text-white text-sm font-bold py-[5px] px-3 rounded-md min-[1024px]:text-[15px] min-[1024px]:py-[6px] min-[1024px]:px-3 max-[640px]:text-sm max-[640px]:py-1 max-[640px]:px-2 max-[480px]:text-[13px] max-[480px]:py-[3px] max-[480px]:px-[7px] max-[360px]:text-xs max-[360px]:py-[2px] max-[360px]:px-[6px]">
                                    {property.rating}
                                  </span>
                                  <span className="flex flex-col">
                                    <span className="text-gray-600 font-medium text-sm min-[1024px]:text-[15px] max-[640px]:text-sm">{property.ratingLabel}</span>
                                    <span className="text-gray-400 text-[13px] min-[1024px]:text-sm max-[640px]:text-[13px]">{property.reviews}</span>
                                  </span>
                                </>
                              ) : (
                                <span className="flex flex-col">
                                  <span className="text-gray-400 font-medium italic text-sm min-[1024px]:text-[15px] max-[640px]:text-sm">Not Rated Yet</span>
                                  <span className="text-gray-400 text-[13px] min-[1024px]:text-sm max-[640px]:text-[13px]">0 Genuine Reviews</span>
                                </span>
                              )}
                            </div>

                            {/* Highlights */}
                            <div className="flex flex-col gap-2 flex-1 min-[1024px]:gap-3">
                              {(property.highlights && property.highlights.length > 0) ? (
                                property.highlights.slice(0, 3).map((hl, i) => (
                                  <span 
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-gray-600 font-medium min-[1024px]:text-[15px] min-[1024px]:gap-3 max-[640px]:text-sm max-[640px]:gap-2 max-[480px]:text-[13px] max-[360px]:text-xs"
                                  >
                                    <CheckCircle size={16} fill="#0C6DC4" color="white" className="min-[1024px]:w-[18px] min-[1024px]:h-[18px]" /> {hl}
                                  </span>
                                ))
                              ) : (
                                <span className="flex items-center gap-2 text-sm text-gray-400 font-medium italic min-[1024px]:text-[15px] min-[1024px]:gap-3 max-[640px]:text-sm max-[480px]:text-[13px] max-[360px]:text-xs">
                                  No special highlights listed
                                </span>
                              )}
                            </div>

                            {/* Footer - Price and Actions */}
                            <div className="flex justify-between items-end mt-auto pt-4 border-t border-dashed border-gray-200 min-[1024px]:pt-5 min-[1024px]:gap-5 max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-4 max-[900px]:w-full max-[640px]:pt-4 max-[640px]:gap-3">
                              <div>
                                <p className="text-[13px] text-gray-400 m-0 mb-2 line-through min-[1024px]:text-sm min-[1024px]:mb-2 max-[640px]:text-[13px] max-[480px]:text-xs">
                                  ₹{(Number(String(property.price || property.bestRoomRate || 0).replace(/[^\d]/g, '')) + 500).toLocaleString('en-IN')}/night
                                </p>
                                <h4 className="text-xl font-bold text-[#58A429] m-0 min-[1024px]:text-2xl max-[640px]:text-[20px] max-[480px]:text-lg max-[360px]:text-base">
                                  ₹{Number(String(property.price || property.bestRoomRate || 0).replace(/[^\d]/g, '')).toLocaleString('en-IN')}/night
                                </h4>
                              </div>
                              <div className="flex items-center gap-3 min-[1024px]:gap-4 max-[900px]:w-full max-[640px]:gap-3 max-[360px]:gap-2">
                                <button 
                                  className="bg-white text-[#0C6DC4] border border-gray-300 py-[10px] px-6 rounded-full font-semibold text-sm cursor-pointer transition-all hover:bg-[#EFF6FF] hover:border-gray-400 min-[1024px]:py-3 min-[1024px]:px-7 min-[1024px]:text-[15px] max-[900px]:flex-1 max-[900px]:text-center max-[640px]:py-[11px] max-[640px]:px-5 max-[640px]:text-sm max-[480px]:py-[10px] max-[480px]:px-4 max-[480px]:text-[13px] max-[360px]:py-[9px] max-[360px]:px-3 max-[360px]:text-xs"
                                  onClick={() => { 
                                    setSelectedProperty(property); 
                                    setActiveMenu('Detail'); 
                                  }}
                                >
                                  View Details
                                </button>
                                <button 
                                  className="w-11 h-11 rounded-full border-[3px] border-[#58A429] text-[#58A429] bg-white flex items-center justify-center cursor-pointer transition-all hover:bg-[#F0FDF4] shadow-sm min-[1024px]:w-12 min-[1024px]:h-12 max-[640px]:w-10 max-[640px]:h-10 max-[480px]:w-9 max-[480px]:h-9 max-[360px]:w-[34px] max-[360px]:h-[34px]"
                                  onClick={() => { 
                                    setSelectedProperty(property); 
                                    setContactStep(1); 
                                    setContactModalOpen(true); 
                                  }}
                                >
                                  <Phone size={18} className="min-[1024px]:w-5 min-[1024px]:h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8 max-[640px]:gap-[6px]">
                        <button 
                          disabled={safeCurrentPage === 1}
                          onClick={() => { 
                            setSearchCurrentPage(p => Math.max(p - 1, 1)); 
                            window.scrollTo({ top: 0, behavior: 'smooth' }); 
                          }}
                          className="py-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 cursor-pointer transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed max-[640px]:py-2 max-[640px]:px-3 max-[640px]:text-[13px] max-[360px]:py-[6px] max-[360px]:px-[10px] max-[360px]:text-xs"
                        >
                          &larr;
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button 
                            key={page}
                            className={`py-2 px-4 ${page === safeCurrentPage ? 'bg-[#0C6DC4] text-white' : 'bg-white text-gray-700'} border border-gray-200 rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-gray-50 max-[640px]:py-2 max-[640px]:px-3 max-[640px]:text-[13px] max-[360px]:py-[6px] max-[360px]:px-[10px] max-[360px]:text-xs`}
                            onClick={() => { 
                              setSearchCurrentPage(page); 
                              window.scrollTo({ top: 0, behavior: 'smooth' }); 
                            }}
                          >
                            {page}
                          </button>
                        ))}
                        <button 
                          disabled={safeCurrentPage === totalPages}
                          onClick={() => { 
                            setSearchCurrentPage(p => Math.min(p + 1, totalPages)); 
                            window.scrollTo({ top: 0, behavior: 'smooth' }); 
                          }}
                          className="py-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 cursor-pointer transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed max-[640px]:py-2 max-[640px]:px-3 max-[640px]:text-[13px] max-[360px]:py-[6px] max-[360px]:px-[10px] max-[360px]:text-xs"
                        >
                          &rarr;
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
