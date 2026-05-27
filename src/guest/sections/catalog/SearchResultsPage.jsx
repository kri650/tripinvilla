import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Heart, MapPin, Phone, Search, Sparkles, Star, Map as MapIcon, List } from 'lucide-react';
import './SearchResultsPage.css';
import MapResultsView from './MapResultsView';

export default function SearchResultsPage(props) {
  const {
    token, user,
    where, setActiveMenu,
    sidebarSearchText, setSidebarSearchText,
    filterMinPrice, setFilterMinPrice,
    filterMaxPrice, setFilterMaxPrice,
    setFilterPriceSlider,
    filterSelectedTypes, setFilterSelectedTypes,
    filterSelectedAmenities, setFilterSelectedAmenities,
    filterMinRating, setFilterMinRating,
    searchSortBy, setSearchSortBy,
    filterInstantBook, setFilterInstantBook,
    filterCancellationPolicy, setFilterCancellationPolicy,
    filterHomestays, setFilterHomestays,
    searchCurrentPage, setSearchCurrentPage,
    allProperties,
    getFilteredProperties,
    handleClearAll,
    API_BASE,
    fetchProfileAndEnquiries,
    setSelectedProperty,
    setContactStep, setContactModalOpen,
    setAuthMode, setAuthModalOpen,
    aiSummary, aiTags,
    fetchProperties,
  } = props;

  const [showMap, setShowMap] = useState(false);

  return (
    <div className="search-results-page fade-in">
      <div className="search-results-layout">

        {/* ── LEFT SIDEBAR FILTERS ── */}
        <div className="search-sidebar">
          <div className="filter-container-card">

            {/* Map Preview */}
            <div className="map-preview-box" style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '180px', marginBottom: '20px' }}>
              <img src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=400&q=80" alt="Map Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button className="btn-explore-map" style={{ zIndex: 10 }} onClick={() => setShowMap(true)}>Explore on Map</button>
            </div>

            {/* Sidebar search */}
            <div style={{ paddingBottom: '20px', borderBottom: '1px solid #EFF6E6', marginBottom: '20px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder="Search for hotel, locality"
                  value={sidebarSearchText}
                  onChange={e => setSidebarSearchText(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px 12px 46px', fontSize: '14px', fontFamily: '"Outfit", sans-serif', border: '1px solid #E5E7EB', borderRadius: '24px', outline: 'none', color: '#111827', boxSizing: 'border-box', background: '#ffffff', transition: 'border-color 0.2s' }}
                />
              </div>
            </div>

            {/* Property Type filter */}
            <div className="sidebar-filter-block">
              <h4 className="filter-block-title" style={{ fontFamily: '"Outfit", sans-serif', fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>Property Type</h4>
              <div className="filter-checkbox-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Villa', 'Hotel', 'Resort', 'Homestay', 'Apartment', 'Cottage', 'Bungalow', 'Motel'].map((type, i) => {
                  const isChecked = filterSelectedTypes.includes(type);
                  const count = (allProperties || []).filter(p => (p.type || '').toLowerCase() === type.toLowerCase() || (p.category || '').toLowerCase() === type.toLowerCase()).length;
                  const displayCount = allProperties.length > 0 ? count : (type === 'Villa' ? 122 : 12);
                  return (
                    <div key={i} className="filter-checkbox-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#4B5563', fontFamily: '"Outfit", sans-serif' }}>
                        <input type="checkbox" checked={isChecked} onChange={() => setFilterSelectedTypes(isChecked ? filterSelectedTypes.filter(t => t !== type) : [...filterSelectedTypes, type])} style={{ accentColor: '#58A429', cursor: 'pointer' }} />
                        {type}
                      </label>
                      <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: '"Outfit", sans-serif' }}>({displayCount})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price slider */}
            <div className="sidebar-filter-block">
              <h4 className="filter-block-title" style={{ fontFamily: '"Outfit", sans-serif', fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>Price Per Night</h4>
              {(() => {
                const sliderMin = filterMinPrice === '' ? 100 : Number(filterMinPrice);
                const sliderMax = filterMaxPrice === '' ? 100000 : Number(filterMaxPrice);
                return (
                  <div className="dual-slider-container" style={{ position: 'relative', width: '100%', height: '40px', marginTop: '24px', marginBottom: '12px' }}>
                    <div style={{ position: 'absolute', top: '16px', left: '0', right: '0', height: '4px', background: '#E5E7EB', borderRadius: '2px', zIndex: '1' }} />
                    <div style={{ position: 'absolute', top: '16px', left: `${((sliderMin - 100) / 99900) * 100}%`, right: `${100 - ((sliderMax - 100) / 99900) * 100}%`, height: '4px', background: '#111827', zIndex: '2' }} />
                    <div style={{ position: 'absolute', left: `${((sliderMin - 100) / 99900) * 100}%`, top: '-18px', background: '#111827', color: '#ffffff', fontSize: '9.5px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: '"Outfit", sans-serif', zIndex: '5' }}>₹ {sliderMin}</div>
                    <div style={{ position: 'absolute', left: `${((sliderMax - 100) / 99900) * 100}%`, top: '-18px', background: '#111827', color: '#ffffff', fontSize: '9.5px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: '"Outfit", sans-serif', zIndex: '5' }}>₹ {sliderMax}</div>
                    <input type="range" min="100" max="100000" step="100" value={sliderMin} onChange={e => { const val = Math.min(Number(e.target.value), sliderMax - 1000); setFilterMinPrice(val); }} style={{ position: 'absolute', width: '100%', pointerEvents: 'none', background: 'none', appearance: 'none', WebkitAppearance: 'none', height: '4px', top: '16px', zIndex: '3', margin: 0, outline: 'none' }} />
                    <input type="range" min="100" max="100000" step="100" value={sliderMax} onChange={e => { const val = Math.max(Number(e.target.value), sliderMin + 1000); setFilterMaxPrice(val); }} style={{ position: 'absolute', width: '100%', pointerEvents: 'none', background: 'none', appearance: 'none', WebkitAppearance: 'none', height: '4px', top: '16px', zIndex: '4', margin: 0, outline: 'none' }} />
                  </div>
                );
              })()}
              <h4 className="filter-block-title" style={{ fontFamily: '"Outfit", sans-serif', fontSize: '13px', fontWeight: '700', color: '#111827', marginTop: '16px', marginBottom: '10px' }}>Your Budget</h4>
              <div className="budget-inputs" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="number" placeholder="Min" value={filterMinPrice} onChange={e => setFilterMinPrice(e.target.value === '' ? '' : Number(e.target.value))} style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', fontFamily: '"Outfit", sans-serif', color: '#374151', outline: 'none' }} />
                <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: '"Outfit", sans-serif' }}>To</span>
                <input type="number" placeholder="Max" value={filterMaxPrice} onChange={e => setFilterMaxPrice(e.target.value === '' ? '' : Number(e.target.value))} style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', fontFamily: '"Outfit", sans-serif', color: '#374151', outline: 'none' }} />
                <button style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#58A429'} onMouseOut={e => e.currentTarget.style.borderColor = '#E5E7EB'}><ArrowRight size={14} color="#111827" /></button>
              </div>
            </div>

            {/* Star Rating filter */}
            <div className="sidebar-filter-block">
              <h4 className="filter-block-title" style={{ fontFamily: '"Outfit", sans-serif', fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>Star Category</h4>
              <div className="filter-checkbox-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[5, 4, 3, 2].map((stars, i) => {
                  const count = (allProperties || []).filter(p => Math.round(Number(p.rating || 0)) === stars).length;
                  const displayCount = allProperties.length > 0 ? count : (stars === 5 ? 122 : 12);
                  return (
                    <div key={i} className="filter-checkbox-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#4B5563', fontFamily: '"Outfit", sans-serif' }}>
                        <input type="checkbox" checked={filterMinRating === stars} onChange={() => setFilterMinRating(filterMinRating === stars ? 0 : stars)} style={{ accentColor: '#58A429', cursor: 'pointer' }} />
                        {stars} Star
                        <div style={{ display: 'flex', gap: '2px', marginLeft: '4px' }}>
                          {Array(5).fill(0).map((_, idx) => <Star key={idx} size={12} fill={idx < stars ? '#0C6DC4' : 'none'} color={idx < stars ? '#0C6DC4' : '#D1D5DB'} style={{ strokeWidth: 1.5 }} />)}
                        </div>
                      </label>
                      <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: '"Outfit", sans-serif' }}>({displayCount})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenities filter */}
            <div className="sidebar-filter-block">
              <h4 className="filter-block-title" style={{ fontFamily: '"Outfit", sans-serif', fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>Amenities</h4>
              <div className="filter-checkbox-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Swimming Pool', 'WiFi', 'Parking', 'Spa', 'Barbeque', 'Lifts/Elevator', 'Bonfire'].map((checkVal, i) => {
                  const isChecked = filterSelectedAmenities.includes(checkVal);
                  const count = (allProperties || []).filter(p => (p.amenities || []).some(a => String(a).toLowerCase().includes(checkVal.toLowerCase()))).length;
                  const displayCount = allProperties.length > 0 ? count : (checkVal === 'Swimming Pool' ? 122 : 12);
                  return (
                    <div key={i} className="filter-checkbox-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#4B5563', fontFamily: '"Outfit", sans-serif' }}>
                        <input type="checkbox" checked={isChecked} onChange={() => setFilterSelectedAmenities(isChecked ? filterSelectedAmenities.filter(a => a !== checkVal) : [...filterSelectedAmenities, checkVal])} style={{ accentColor: '#58A429', cursor: 'pointer' }} />
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
                  { label: 'Homestays', checked: filterHomestays, setter: setFilterHomestays },
                ].map((item, i) => (
                  <div key={i} className="filter-checkbox-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#4B5563', fontFamily: '"Outfit", sans-serif' }}>
                      <input type="checkbox" checked={item.checked} onChange={() => item.setter(!item.checked)} style={{ accentColor: '#58A429', cursor: 'pointer' }} />
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            <button onClick={() => { setFilterSelectedTypes([]); setFilterSelectedAmenities([]); setFilterMinPrice(''); setFilterMaxPrice(''); setFilterPriceSlider(50000); setSidebarSearchText(''); setFilterMinRating(0); setFilterInstantBook(false); setFilterCancellationPolicy(false); setFilterHomestays(false); setSearchSortBy('popularity'); fetchProperties({ search: where }); }} style={{ width: '100%', marginTop: '16px', padding: '10px', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#E5E7EB'} onMouseOut={e => e.currentTarget.style.background = '#F3F4F6'}>
              Clear All Filters
            </button>
          </div>
        </div>

        {/* ── MAIN RESULTS COLUMN ── */}
        <div className="search-main-content">
          {/* AI Summary Banner */}
          {aiSummary && (
            <div style={{ background: 'linear-gradient(to right, rgba(14,165,233,0.1), rgba(168,85,247,0.1))', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '16px', padding: '20px', marginBottom: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={20} color="#0ea5e9" />
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#0ea5e9', fontFamily: '"Outfit", sans-serif' }}>AI Search Summary</span>
              </div>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.5', marginBottom: '16px' }}>{aiSummary}</p>
              {aiTags && aiTags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {aiTags.map((tag, i) => <span key={i} style={{ background: '#fff', padding: '6px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: 500, color: '#4b5563', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>{tag}</span>)}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="search-results-count" style={{ margin: 0 }}>
              {`${getFilteredProperties().length} Properties In ${where || 'India'}`}
            </h2>
            <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '8px', padding: '4px' }}>
              <button 
                onClick={() => setShowMap(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: !showMap ? '#ffffff' : 'transparent', border: 'none', borderRadius: '6px', boxShadow: !showMap ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: !showMap ? '#111827' : '#6B7280', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <List size={14} /> List
              </button>
              <button 
                onClick={() => setShowMap(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: showMap ? '#ffffff' : 'transparent', border: 'none', borderRadius: '6px', boxShadow: showMap ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: showMap ? '#111827' : '#6B7280', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <MapIcon size={14} /> Map
              </button>
            </div>
          </div>

          {/* Sort tabs */}
          <div className="search-sort-tabs">
            {[['popularity', 'Popularity'], ['price_low', 'Price (Low to High)'], ['price_high', 'Price (High to Low)'], ['offer', 'Offer Included'], ['rating', 'User Rating (Highest)']].map(([key, label]) => (
              <button key={key} className={`sort-tab ${searchSortBy === key ? 'active' : ''}`} onClick={() => setSearchSortBy(key)}>{label}</button>
            ))}
          </div>

          {/* Results list or Map */}
          {showMap ? (
            <MapResultsView 
              properties={getFilteredProperties()} 
              onPropertyClick={(prop) => { setSelectedProperty(prop); setActiveMenu('Detail'); }} 
            />
          ) : (
            <div className="search-horizontal-list">
              {(() => {
              let displayList = getFilteredProperties();
              if (searchSortBy === 'price_low') displayList.sort((a, b) => Number(String(a.price || a.bestRoomRate || 0).replace(/[^\d]/g, '')) - Number(String(b.price || b.bestRoomRate || 0).replace(/[^\d]/g, '')));
              else if (searchSortBy === 'price_high') displayList.sort((a, b) => Number(String(b.price || b.bestRoomRate || 0).replace(/[^\d]/g, '')) - Number(String(a.price || a.bestRoomRate || 0).replace(/[^\d]/g, '')));
              else if (searchSortBy === 'rating') displayList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
              else if (searchSortBy === 'offer') displayList.sort((a, b) => (b.hasActiveOffer ? 1 : 0) - (a.hasActiveOffer ? 1 : 0));

              if (displayList.length === 0) return (
                <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px', border: '1px solid #E5E7EB' }}>
                  <Search size={40} color="#0C6DC4" style={{ marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '20px', color: '#111827', marginBottom: '8px' }}>No properties found</h3>
                  <p style={{ color: '#6B7280', marginBottom: '20px' }}>Try adjusting your filters or search criteria.</p>
                  <button className="btn-view-details" onClick={handleClearAll}>Clear Filters</button>
                </div>
              );

              const itemsPerPage = 5;
              const totalPages = Math.ceil(displayList.length / itemsPerPage) || 1;
              const safeCurrentPage = Math.min(searchCurrentPage, totalPages);
              const paginatedList = displayList.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);

              return (
                <>
                  {paginatedList.map((property, idx) => {
                    const isWishlisted = user && user.wishlist && user.wishlist.some(w => w._id === property._id || w === property._id);
                    return (
                      <div key={idx} className="horizontal-property-card">
                        <div className="horiz-card-img"><img src={property.img || property.image} alt={property.title || property.propertyName} /></div>
                        <div className="horiz-card-info">
                          <div className="horiz-card-header">
                            <div>
                              <h3>{property.title || property.propertyName} {idx === 0 && <span className="premium-badge"><Star size={10} fill="white" /> Premium</span>}</h3>
                              <p><MapPin size={14} color="#9CA3AF" /> {property.location}</p>
                            </div>
                            <button className={`fav-btn ${isWishlisted ? 'active' : ''}`} onClick={async (e) => {
                              e.stopPropagation();
                              if (!token) { setAuthMode('login'); setAuthModalOpen(true); return; }
                              try {
                                const res = await fetch(`${API_BASE}/users/wishlist/${property._id}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
                                if (res.ok) fetchProfileAndEnquiries(token);
                              } catch (err) { console.error(err); }
                            }}>
                              <Heart size={18} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : '#6B7280'} />
                            </button>
                          </div>
                          <div className="horiz-card-rating">
                            <span className="rating-badge">{property.rating || '4.8'}</span>
                            <span style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ color: '#4B5563', fontWeight: '500' }}>Excellent</span>
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '32px', marginBottom: '16px' }}>
                      <button disabled={safeCurrentPage === 1} onClick={() => { setSearchCurrentPage(p => Math.max(p - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', border: '1px solid #E5E7EB', background: safeCurrentPage === 1 ? '#F9FAFB' : '#ffffff', color: safeCurrentPage === 1 ? '#9CA3AF' : '#374151', cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>&larr;</button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => { setSearchCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', border: '1px solid', borderColor: page === safeCurrentPage ? '#58A429' : '#E5E7EB', background: page === safeCurrentPage ? '#58A429' : '#ffffff', color: page === safeCurrentPage ? '#ffffff' : '#374151', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>{page}</button>
                      ))}
                      <button disabled={safeCurrentPage === totalPages} onClick={() => { setSearchCurrentPage(p => Math.min(p + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', border: '1px solid #E5E7EB', background: safeCurrentPage === totalPages ? '#F9FAFB' : '#ffffff', color: safeCurrentPage === totalPages ? '#9CA3AF' : '#374151', cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>&rarr;</button>
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
