import { ArrowRight, Calendar, CheckCircle, Heart, MapPin, Phone, Search, Sparkles, Star } from 'lucide-react';
import { areaIcon, bedIcon, guestIcon, roomIcon } from '../../assets';
import { detailSubTabs, landmarks, propertiesHomestaysList, propertiesVillasList, propertyCategories, roomOptions } from '../../data/mockData';

export default function CatalogPages(props) {
  const {
    activeMenu,
    token,
    user,

    // Navigation
    setActiveMenu,

    // Shared content
    homepageContent,
    renderTitle,
    popularOffers,
    aiSummary,
    aiTags,

    // Wishlist (mock)
    mockWishlistedTitles,
    toggleMockWishlist,

    // Properties -> Search handoff
    activePropCategory,
    setActivePropCategory,
    setWhere,
    where,
    fetchProperties,

    // Search view
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
    allProperties,
    getFilteredProperties,
    handleClearAll,
    API_BASE,
    fetchProfileAndEnquiries,

    // Detail view
    setSelectedProperty,
    activeDetailProp,
    activeDetailTab,
    hostContactRevealed,
    scrollToDetailSection,
    showFullDescription,
    setShowFullDescription,
    propertyRooms,
    dynamicLandmarks,
    dynamicReviews,
    dynamicReviewStats,

    // Detail actions
    setIsGalleryOpen,
    setCurrentImageIndex,
    setContactStep,
    setContactModalOpen,
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

    // Modals
    setAuthMode,
    setAuthModalOpen,
    setReviewModalOpen,
    setReviewRating,
    setReviewText,
    setReviewName,
    setReviewPage,
    reviewPage,
  } = props;

  return (
    <>
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
                      {(activeDetailProp.highlights && activeDetailProp.highlights.length > 0 ? activeDetailProp.highlights : ['Breakfast Included', 'Free cancellation till 24 hrs before check', 'Parking Available']).map((highlight, idx) => (
                        <div key={idx} className="check-bullet">
                          <CheckCircle size={15} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>

                    {/* Offer Display Block */}
                    {(() => {
                      const currentOffer = popularOffers.find(o => 
                        (o.property_id && o.property_id._id === activeDetailProp._id) || 
                        o.property_id === activeDetailProp._id ||
                        o.propertyId === activeDetailProp._id
                      );
                      
                      if (currentOffer) {
                        return (
                          <div style={{ 
                            background: 'rgba(56, 161, 105, 0.08)', 
                            border: '1px dashed rgba(56, 161, 105, 0.5)', 
                            borderRadius: '8px', 
                            padding: '12px', 
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            <div style={{ background: '#38A169', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px' }}>
                              {currentOffer.offerPercent || currentOffer.offer_percent} OFF
                            </div>
                            <span style={{ fontSize: '13px', color: '#276749', fontWeight: '500', lineHeight: 1.4 }}>
                              {currentOffer.description || 'Special offer applicable on this property.'}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    <div className="reservation-pricing-block">
                      <span className="old-strike-price">₹{Number(activeDetailProp.priceRaw * 1.2 || 2140).toLocaleString('en-IN')}/night</span>
                      <span className="taxes-subtext">+{activeDetailProp.taxAmount || 212} taxes & fees per room per night</span>
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
              {activeDetailProp?.description ? (
                showFullDescription || activeDetailProp.description.length <= 250 
                  ? activeDetailProp.description 
                  : `${activeDetailProp.description.substring(0, 250)}...`
              ) : 'Experience a comfortable and refined stay at Azure Bay Hotel, located in the heart of the city and designed for both leisure and business travelers. The hotel offers thoughtfully designed rooms, modern amenities, and warm hospitality to ensure a relaxing and memorable stay. With easy access to popular attractions, dining spots, and transport hubs, Azure Bay Hotel is an ideal choice for a seamless travel.'} 
              {activeDetailProp?.description && activeDetailProp.description.length > 250 && (
                <span className="read-more-link" onClick={() => setShowFullDescription(!showFullDescription)} style={{ cursor: 'pointer', color: '#2563EB', fontWeight: '500', marginLeft: '5px' }}>
                  {showFullDescription ? 'Read Less' : 'Read More'}
                </span>
              )}
            </p>
          </div>

          {/* Amenities Row */}
          <div className="about-property-section">
            <h3 className="section-subtitle-title">Amenities</h3>
            <div className="amenities-horizontal-layout" style={{ flexWrap: 'wrap' }}>
              <div className="amenity-vertical-item">
                <img src={areaIcon} alt="Area Size" className="amenity-vertical-icon" />
                <span className="amenity-vertical-lbl">Area Size</span>
                <span className="amenity-vertical-val">{activeDetailProp.area || '31 sq. ft.'}</span>
              </div>
              <div className="amenity-vertical-item">
                <img src={roomIcon} alt="Rooms" className="amenity-vertical-icon" />
                <span className="amenity-vertical-lbl">Rooms</span>
                <span className="amenity-vertical-val">{activeDetailProp.rooms || '1 Room'}</span>
              </div>
              <div className="amenity-vertical-item">
                <img src={bedIcon} alt="Beds" className="amenity-vertical-icon" />
                <span className="amenity-vertical-lbl">Beds</span>
                <span className="amenity-vertical-val">{activeDetailProp.beds || '2 Beds'}</span>
              </div>
              <div className="amenity-vertical-item">
                <img src={guestIcon} alt="Guests" className="amenity-vertical-icon" />
                <span className="amenity-vertical-lbl">Guests</span>
                <span className="amenity-vertical-val">{activeDetailProp.guests || '3 Person'}</span>
              </div>
              {(activeDetailProp.amenities || []).map((amenity, idx) => (
                <div key={idx} className="amenity-vertical-item">
                  <div className="amenity-vertical-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={30} color="#58A429" />
                  </div>
                  <span className="amenity-vertical-lbl">{amenity}</span>
                  <span className="amenity-vertical-val">Available</span>
                </div>
              ))}
            </div>
          </div>

          {/* Unique Experiences Section (Moved after amenities) */}
          {activeDetailProp && activeDetailProp.experiences && activeDetailProp.experiences.length > 0 && (
            <div className="about-property-section">
              <h3 className="section-subtitle-title">Unique Experiences</h3>
              <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px', marginTop: '-4px' }}>
                This property offers the following unique experiences for guests
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeDetailProp.experiences.map((exp, idx) => (
                  <div key={idx} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '14px 20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <span style={{ fontSize: '28px', flexShrink: 0 }}>{exp.representingIcon || exp.icon || '✨'}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#065F46', fontFamily: '"Outfit", sans-serif' }}>
                        {exp.experienceName || exp.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#047857', marginTop: '2px' }}>
                        This property with <strong>{exp.experienceName || exp.name}</strong> experience is available here
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                  {(dynamicLandmarks.length > 0 ? dynamicLandmarks : (activeDetailProp._id?.toString().startsWith('mock-') ? landmarks : [])).map((mark, idx) => (
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
                  {dynamicLandmarks.length === 0 && !activeDetailProp._id?.toString().startsWith('mock-') && (
                    <span style={{ fontSize: '13px', color: '#9CA3AF' }}>No landmarks added yet.</span>
                  )}
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
              {/* AI Summary Banner */}
              {aiSummary && (
                <div style={{
                  background: 'linear-gradient(to right, rgba(14, 165, 233, 0.1), rgba(168, 85, 247, 0.1))',
                  border: '1px solid rgba(14, 165, 233, 0.2)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Sparkles size={20} color="#0ea5e9" />
                    <span style={{ fontWeight: 700, fontSize: '15px', color: '#0ea5e9', fontFamily: '"Outfit", sans-serif' }}>AI Search Summary</span>
                  </div>
                  <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.5', marginBottom: '16px' }}>{aiSummary}</p>
                  
                  {aiTags && aiTags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {aiTags.map((tag, i) => (
                        <span key={i} style={{ 
                          background: '#fff', 
                          padding: '6px 12px', 
                          borderRadius: '100px', 
                          fontSize: '13px', 
                          fontWeight: 500,
                          color: '#4b5563',
                          border: '1px solid rgba(0,0,0,0.05)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
                {renderTitle(homepageContent?.section1?.title, <span>Best <span className="highlight-sharp-blue-box">Villas</span> Around You</span>, "Villas")}
              </h2>
              <p className="section-sub-headline">
                {homepageContent?.section1?.subText || 'Choose from homestays, villas, apartments, resorts and more—stays that fit your travel style.'}
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
                {homepageContent?.section1?.subText || 'Choose from homestays, villas, apartments, resorts and more—stays that fit your travel style.'}
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

    </>
  );
}
