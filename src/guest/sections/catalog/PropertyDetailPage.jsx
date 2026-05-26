import { Calendar, CheckCircle, MapPin, Phone, Search, Sparkles, Star } from 'lucide-react';
import { areaIcon, bedIcon, guestIcon, roomIcon } from '../../../assets';
import { detailSubTabs, landmarks, roomOptions } from '../../../data/mockData';
import './PropertyDetailPage.css';

export default function PropertyDetailPage(props) {
  const {
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
    popularOffers,
    token, user,
    setActiveMenu,
    setIsGalleryOpen,
    setCurrentImageIndex,
    setContactStep,
    setContactModalOpen,
    handleEnquirySubmit,
    guestEnquiryName, setGuestEnquiryName,
    guestEnquiryPhone, setGuestEnquiryPhone,
    guestEnquiryEmail, setGuestEnquiryEmail,
    guestEnquiryMessage, setGuestEnquiryMessage,
    guestEnquirySubmitting,
    setSelectedProperty,
    setAuthMode,
    setAuthModalOpen,
    setReviewModalOpen,
    setReviewRating,
    setReviewText,
    setReviewName,
    setReviewPage,
    reviewPage,
    API_BASE,
    fetchProfileAndEnquiries,
  } = props;

  const propImages =
    activeDetailProp.images && activeDetailProp.images.length > 0
      ? activeDetailProp.images
      : [activeDetailProp.img || activeDetailProp.image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'];

  // Gracefully calculate price display values
  const rawVal = activeDetailProp.priceRaw || (activeDetailProp.price ? Number(String(activeDetailProp.price).replace(/[^\d]/g, '')) : 1400);
  const priceString = activeDetailProp.price && String(activeDetailProp.price).startsWith('₹') 
    ? activeDetailProp.price 
    : `₹${Number(rawVal).toLocaleString('en-IN')}`;
  const oldPriceString = `₹${Math.round(rawVal * 1.2).toLocaleString('en-IN')}`;

  return (
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
          <div className="detail-image-gallery" style={{ gridTemplateColumns: propImages.length <= 1 ? '1fr' : '1.6fr 1fr' }}>
            {/* Large main image */}
            <div className="gallery-master-img" style={{ borderRadius: '12px 0 0 12px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => { setCurrentImageIndex(0); setIsGalleryOpen(true); }}>
              <img src={propImages[0]} alt={activeDetailProp.title} />
            </div>

            {/* Right 2-row stack */}
            {propImages.length > 1 && (
              <div className="gallery-sub-images">
                {/* Top thumbnail: image[1] */}
                <div className="sub-img-wrap" onClick={() => { setCurrentImageIndex(1); setIsGalleryOpen(true); }}>
                  <img
                    src={propImages[1]}
                    alt={`${activeDetailProp.title} view 2`}
                  />
                </div>

                {/* Bottom thumbnail: image[2] with "+X" overlay */}
                {propImages[2] && (
                  <div className="sub-img-wrap overlay" onClick={() => { setCurrentImageIndex(2); setIsGalleryOpen(true); }}>
                    <img
                      src={propImages[2]}
                      alt={`${activeDetailProp.title} view 3`}
                    />
                    {propImages.length > 3 && (
                      <div className="gallery-count-layer">
                        <span>View {propImages.length - 2} more</span>
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
              <span className="old-strike-price">{oldPriceString}/night</span>
              <span className="taxes-subtext">+{activeDetailProp.taxAmount || 212} taxes & fees per room per night</span>
              <div style={{ marginTop: '4px' }}>
                <span className="highlight-green-detail">{priceString}/night</span>
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
              <span className="amenity-vertical-val">{activeDetailProp.area || `${(activeDetailProp.bedRooms || 2) * 150} sq. ft.`}</span>
            </div>
            <div className="amenity-vertical-item">
              <img src={roomIcon} alt="Rooms" className="amenity-vertical-icon" />
              <span className="amenity-vertical-lbl">Rooms</span>
              <span className="amenity-vertical-val">{activeDetailProp.rooms || `${activeDetailProp.bedRooms || 1} Room`}</span>
            </div>
            <div className="amenity-vertical-item">
              <img src={bedIcon} alt="Beds" className="amenity-vertical-icon" />
              <span className="amenity-vertical-lbl">Beds</span>
              <span className="amenity-vertical-val">{activeDetailProp.beds || `${activeDetailProp.bedRooms || 2} Beds`}</span>
            </div>
            <div className="amenity-vertical-item">
              <img src={guestIcon} alt="Guests" className="amenity-vertical-icon" />
              <span className="amenity-vertical-lbl">Guests</span>
              <span className="amenity-vertical-val">{activeDetailProp.guests || `${activeDetailProp.capacity || 3} Person`}</span>
            </div>
            {(activeDetailProp.amenities || []).map((amenity, idx) => (
              <div key={idx} className="amenity-vertical-item">
                <div className="amenity-vertical-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={30} color="#58A429" />
                </div>
                <span className="amenity-vertical-lbl">{typeof amenity === 'object' ? amenity.name || amenity.amenitiesName : amenity}</span>
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
            {(propertyRooms && propertyRooms.length > 0 ? propertyRooms : roomOptions).map((room, idx) => {
              const roomImg = room.room_image_url || room.img || room.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80';
              const roomTitle = room.room_type || room.title || room.name || room.type || 'Standard Room';
              const roomPrice = Number(String(room.price_per_room || room.price || room.rate || 1400).replace(/[^\d]/g, ''));
              const roomOriginalPrice = room.original_price || room.originalPrice || room.original_rate || Math.round(roomPrice * 1.2);

              return (
                <div key={idx} className="room-vertical-card">
                  <div className="room-card-img-wrap">
                    <img src={roomImg} alt={roomTitle} />
                  </div>
                  <div className="room-card-info-wrap">
                    <div className="room-card-mid-col">
                      <h4 className="room-card-title">{roomTitle}</h4>
                      
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
                        {roomOriginalPrice && (
                          <span className="room-old-strike">₹{Number(roomOriginalPrice).toLocaleString('en-IN')}/night</span>
                        )}
                        <span className="room-green-val">₹{Number(roomPrice).toLocaleString('en-IN')}/night</span>
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
              );
            })}
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
                {(dynamicLandmarks.length > 0 ? dynamicLandmarks : (activeDetailProp._id?.toString().startsWith('mock-') ? landmarks : landmarks.slice(0, 4))).map((mark, idx) => (
                  <div key={idx} className="landmark-row-item">
                    <div className="landmark-row-left-content">
                      <div className="landmark-avatar-square">
                        <img 
                          src={mark.landmark_image_url || mark.img || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80'} 
                          alt={mark.landmark_name || mark.name} 
                          className="landmark-thumb-img" 
                        />
                      </div>
                      <div className="landmark-texts">
                        <span className="landmark-title-name">{mark.landmark_name || mark.name}</span>
                        <span className="landmark-badge-desc">{mark.landmark_type || mark.label || mark.distance}</span>
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
            {dynamicReviewStats && (
              <div className="reviews-score-card">
                <div className="score-top-row">
                  <div className="score-pill-large">
                    <span>{dynamicReviewStats.avg || dynamicReviewStats.average || '4.8'}</span>
                  </div>
                  <div className="score-lbl-wrap">
                    <span className="score-main-lbl">{dynamicReviewStats.label || 'Excellent'}</span>
                    <span className="score-sub-lbl">{dynamicReviewStats.count || dynamicReviews.length || 0} Genuine Reviews</span>
                  </div>
                </div>

                <div className="rating-progress-stack" style={{ margin: '24px 0' }}>
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = dynamicReviewStats.breakdown?.[star] || 0;
                    const total = dynamicReviews.length || 1;
                    const percentage = Math.round((count / total) * 100);
                    return (
                      <div key={star} className="progress-row">
                        <span>{star} Star</span>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${percentage || (star === 5 ? 70 : star === 4 ? 20 : 0)}%` }} />
                        </div>
                        <span>{percentage || (star === 5 ? 70 : star === 4 ? 20 : 0)}%</span>
                      </div>
                    );
                  })}
                </div>

                {token && user ? (
                  <button className="btn-share-experience" onClick={() => { setReviewRating(5); setReviewText(''); setReviewName(user?.name || ''); setReviewPage(1); setReviewModalOpen(true); }}>
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
            )}

            {/* Right reviews stream */}
            <div className="reviews-stream-col">
              {dynamicReviews.slice((reviewPage - 1) * 5, reviewPage * 5).map((rev, idx) => (
                <div key={idx} className="review-stream-item">
                  <div className="review-header-avatar">
                    <div className="user-avatar-thumb">
                      {rev.reviewer_photo_url || rev.photo || rev.avatar ? (
                        <img src={rev.reviewer_photo_url || rev.photo || rev.avatar} alt={rev.reviewer_name || rev.guestName || rev.name} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', fontWeight: 'bold' }}>
                          {(rev.reviewer_name || rev.guestName || rev.name || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="review-user-info">
                      <span className="review-user-name">{rev.reviewer_name || rev.guestName || rev.name}</span>
                      <span className="review-user-role">{rev.reviewer_role || rev.role || (rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Verified Guest')}</span>
                    </div>
                  </div>

                  <p className="review-quote-text">
                    "{rev.review_text || rev.comment || rev.text || rev.review}"
                  </p>

                  <div className="review-footer-row">
                    <div className="review-star-rating-row">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} fill={s <= (rev.rating || 5) ? "#F59E0B" : "none"} color={s <= (rev.rating || 5) ? "#F59E0B" : "#D1D5DB"} />
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
    </div>
  );
}
