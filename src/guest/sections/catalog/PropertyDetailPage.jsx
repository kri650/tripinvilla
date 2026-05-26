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
      : [activeDetailProp.img];

  return (
    <div className="detail-page-wrapper fade-in">
      {/* Breadcrumb */}
      <div className="breadcrumb-row">
        <span onClick={() => setActiveMenu('Home')}>Home</span>
        <span className="bread-sep">/</span>
        <span onClick={() => setActiveMenu('Properties')}>Properties</span>
        <span className="bread-sep">/</span>
        <span className="bread-active">Property Details</span>
      </div>

      <div className="detail-white-container-card">
        {/* Image gallery + Reservation card row */}
        <div className="detail-primary-grid">
          {/* Image gallery */}
          <div className="detail-image-gallery" style={{ gridTemplateColumns: propImages.length <= 1 ? '1fr' : '1.6fr 1fr' }}>
            <div className="gallery-master-img" style={{ borderRadius: '12px 0 0 12px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => { setCurrentImageIndex(0); setIsGalleryOpen(true); }}>
              <img src={propImages[0]} alt={activeDetailProp.title} />
            </div>
            {propImages.length > 1 && (
              <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '6px', height: '440px' }}>
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '0 12px 0 0', cursor: 'pointer' }} onClick={() => { setCurrentImageIndex(1); setIsGalleryOpen(true); }}>
                  <img src={propImages[1]} alt={`${activeDetailProp.title} view 2`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                {propImages[2] && (
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '0 0 12px 0', cursor: 'pointer' }} onClick={() => { setCurrentImageIndex(2); setIsGalleryOpen(true); }}>
                    <img src={propImages[2]} alt={`${activeDetailProp.title} view 3`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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

          {/* Reservation card */}
          <div className="detail-reservation-card">
            <h2 className="reservation-title">{activeDetailProp.title}</h2>
            <div className="reservation-location">
              <MapPin size={14} color="#48BB78" />
              <span>{activeDetailProp.location}</span>
            </div>

            <div className="reservation-timing-row">
              <div className="time-badge"><Calendar size={14} color="#48BB78" /><span>Check In : {activeDetailProp.checkIn || '3:00 PM'}</span></div>
              <div className="time-badge"><Calendar size={14} color="#48BB78" /><span>Check Out : {activeDetailProp.checkOut || '12:00 PM'}</span></div>
            </div>

            <div className="reservation-checks-list">
              {(activeDetailProp.highlights && activeDetailProp.highlights.length > 0
                ? activeDetailProp.highlights
                : ['Breakfast Included', 'Free cancellation till 24 hrs before check', 'Parking Available']
              ).map((highlight, idx) => (
                <div key={idx} className="check-bullet">
                  <CheckCircle size={15} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Offer block */}
            {(() => {
              const currentOffer = popularOffers.find(o =>
                o.property_id && (o.property_id._id === activeDetailProp._id || o.property_id === activeDetailProp._id)
              );
              if (!currentOffer) return null;
              return (
                <div style={{ margin: '16px 0', padding: '12px 16px', background: 'linear-gradient(135deg, #ECFDF5, #F0FDF4)', borderRadius: '10px', border: '1px solid #A7F3D0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Sparkles size={14} color="#059669" />
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#065F46' }}>Special Offer Available!</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#047857', margin: 0 }}>
                    {currentOffer.offer_percent || currentOffer.offerPercent}% OFF — {currentOffer.description}
                  </p>
                </div>
              );
            })()}

            <div className="reservation-pricing-block">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span className="old-strike-price">{activeDetailProp.originalPrice || activeDetailProp.price ? `₹${(Number(String(activeDetailProp.price || 0).replace(/[^\d]/g, '')) + 500).toLocaleString('en-IN')}` : ''}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span className="highlight-green-detail">₹{Number(String(activeDetailProp.price || activeDetailProp.bestRoomRate || 0).replace(/[^\d]/g, '')).toLocaleString('en-IN')}</span>
                <span className="room-per-night-label">/night</span>
              </div>
              <span className="taxes-subtext">+ taxes and charges</span>
            </div>

            <button className="btn-view-contact-green" style={{ width: '100%' }} onClick={() => {
              if (!token) { setAuthMode('login'); setAuthModalOpen(true); return; }
              setContactStep(1); setContactModalOpen(true);
            }}>
              <Phone size={16} /> Contact Owner
            </button>

            {hostContactRevealed && activeDetailProp.ownerContact && (
              <div style={{ marginTop: '12px', padding: '12px', background: '#F9FAFB', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>📞 {activeDetailProp.ownerContact}</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Tab Navigation */}
        <div className="detail-sub-navigation-tabs">
          {detailSubTabs.map((tab) => (
            <button
              key={tab.id}
              className={`detail-sub-nav-btn ${activeDetailTab === tab.id ? 'active' : ''}`}
              onClick={() => scrollToDetailSection(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        <div id="Overview" className="border-box-style" style={{ scrollMarginTop: '80px' }}>
          <h3 className="section-subtitle-title">Overview</h3>

          <div className="amenities-horizontal-layout">
            {[
              { icon: areaIcon, label: 'Area Size', val: `${(activeDetailProp.bedRooms || 2) * 150} sq. ft.` },
              { icon: bedIcon, label: 'Beds', val: `${activeDetailProp.bedRooms || 2} Beds` },
              { icon: roomIcon, label: 'Rooms', val: `${activeDetailProp.bedRooms || 1} Room` },
              { icon: guestIcon, label: 'Guests', val: `${activeDetailProp.capacity || 3} Person` },
            ].map((spec, i) => (
              <div key={i} className="amenity-vertical-item">
                <img src={spec.icon} alt={spec.label} className="amenity-vertical-icon" />
                <span className="amenity-vertical-lbl">{spec.label}</span>
                <span className="amenity-vertical-val">{spec.val}</span>
              </div>
            ))}
          </div>

          <p className="about-property-text" style={{ marginTop: '24px' }}>
            {showFullDescription
              ? (activeDetailProp.description || 'This stunning property offers a perfect blend of luxury and comfort.')
              : (activeDetailProp.description || 'This stunning property offers a perfect blend of luxury and comfort.').substring(0, 300) + '...'}
            <span className="read-more-link" onClick={() => setShowFullDescription(!showFullDescription)}>
              {showFullDescription ? 'Read Less ↑' : 'Read More ↓'}
            </span>
          </p>
        </div>

        {/* Rooms Tab */}
        <div id="Rooms" className="border-box-style" style={{ scrollMarginTop: '80px' }}>
          <h3 className="section-subtitle-title">Rooms</h3>
          <div className="rooms-stack">
            {(propertyRooms && propertyRooms.length > 0 ? propertyRooms : roomOptions).map((room, idx) => (
              <div key={idx} className="room-vertical-card">
                <div className="room-card-img-wrap">
                  <img src={room.img || room.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=400&q=80'} alt={room.name || room.type} />
                </div>
                <div className="room-card-info-wrap">
                  <div className="room-card-mid-col">
                    <h4 className="room-card-title">{room.name || room.type}</h4>
                    <div className="room-card-bullets-list">
                      <div className="bullet-check">
                        <CheckCircle size={15} color="#4B5563" />
                        <span>{room.description || room.desc || 'A comfortable room with premium amenities.'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="room-card-pricing-col">
                    <span className="room-taxes-label">+ taxes & fees</span>
                    <span className="room-old-strike"></span>
                    <span className="room-green-val">₹{Number(String(room.price || room.rate || 2500).replace(/[^\d]/g, '')).toLocaleString('en-IN')}/night</span>
                    <button className="btn-view-contact-green" onClick={() => { setContactStep(1); setContactModalOpen(true); }}>Book Room</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities Tab */}
        <div id="Amenities" className="border-box-style" style={{ scrollMarginTop: '80px' }}>
          <h3 className="section-subtitle-title">Amenities</h3>
          <div className="amenities-horizontal-pills">
            {(activeDetailProp.amenities && activeDetailProp.amenities.length > 0
              ? activeDetailProp.amenities
              : ['Swimming Pool', 'Free Wi-Fi', 'Air Conditioning', 'Restaurant', 'Parking', 'Room Service', '24-Hour Front Desk', 'Fitness Center', 'Spa & Wellness', 'Conference Room']
            ).map((amenity, idx) => (
              <div key={idx} className="amenity-pill-item">
                <CheckCircle size={20} color="#48BB78" />
                <div className="pill-texts">
                  <span className="pill-lbl">AMENITY</span>
                  <span className="pill-val green-text">{typeof amenity === 'object' ? amenity.name || amenity.amenitiesName : amenity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Tab */}
        <div id="Reviews" className="border-box-style" style={{ scrollMarginTop: '80px' }}>
          <h3 className="section-subtitle-title">Guest Reviews</h3>

          <div className="reviews-layout-split">
            {dynamicReviewStats && (
              <div className="reviews-score-card">
                <div className="score-top-row">
                  <div className="score-pill-large">{dynamicReviewStats.average || '4.8'}</div>
                  <div className="score-lbl-wrap">
                    <span className="score-main-lbl">Excellent</span>
                    <span className="score-sub-lbl">Based on {dynamicReviews.length || 0} reviews</span>
                  </div>
                </div>
                <div className="rating-progress-stack" style={{ marginTop: '24px', marginBottom: '24px' }}>
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = dynamicReviewStats.breakdown?.[star] || 0;
                    const total = dynamicReviews.length || 1;
                    return (
                      <div key={star} className="progress-row">
                        <span>{star} Stars</span>
                        <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${(count / total) * 100}%` }} /></div>
                        <span>{count}</span>
                      </div>
                    );
                  })}
                </div>
                <button className="btn-share-experience" onClick={() => {
                  if (!token) { setAuthMode('login'); setAuthModalOpen(true); return; }
                  setReviewRating(5); setReviewText(''); setReviewName(user?.name || '');
                  setReviewPage('detail'); setReviewModalOpen(true);
                }}>
                  <Star size={16} fill="white" color="white" /> Share your experience
                </button>
              </div>
            )}

            <div className="reviews-stream-col">
              {dynamicReviews.slice((reviewPage - 1) * 5, reviewPage * 5).map((rev, idx) => (
                <div key={idx} className="review-stream-item">
                  <div className="review-header-avatar">
                    <div className="user-avatar-thumb">
                      <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="Avatar" />
                    </div>
                    <div className="review-user-info">
                      <span className="review-user-name">{rev.guestName || rev.name || 'Guest'}</span>
                      <span className="review-user-role">{rev.date || 'Recent'}</span>
                    </div>
                  </div>
                  <p className="review-quote-text">"{rev.comment || rev.text || rev.review}"</p>
                  <div className="review-footer-row">
                    <div className="review-star-rating-row">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= (rev.rating || 5) ? '#F59E0B' : 'none'} color={s <= (rev.rating || 5) ? '#F59E0B' : '#D1D5DB'} />)}
                    </div>
                    <div className="review-images-row">
                      {(() => {
                        const pics = propImages.length > 0 ? [...propImages] : ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=100&q=80'];
                        while (pics.length < 3) pics.push(pics[pics.length % pics.length]);
                        return pics.slice(0, 3).map((p, pi) => <img key={pi} src={p} alt="" />);
                      })()}
                    </div>
                  </div>
                </div>
              ))}
              {dynamicReviews.length > 5 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
                  <button onClick={() => setReviewPage(p => Math.max(1, p - 1))} disabled={reviewPage === 1} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', background: reviewPage === 1 ? '#F3F4F6' : '#FFFFFF', cursor: reviewPage === 1 ? 'not-allowed' : 'pointer' }}>Prev</button>
                  <span style={{ padding: '6px 12px', fontSize: '14px', fontWeight: 500 }}>Page {reviewPage} of {Math.ceil(dynamicReviews.length / 5)}</span>
                  <button onClick={() => setReviewPage(p => Math.min(Math.ceil(dynamicReviews.length / 5), p + 1))} disabled={reviewPage === Math.ceil(dynamicReviews.length / 5)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', background: reviewPage === Math.ceil(dynamicReviews.length / 5) ? '#F3F4F6' : '#FFFFFF', cursor: reviewPage === Math.ceil(dynamicReviews.length / 5) ? 'not-allowed' : 'pointer' }}>Next</button>
                </div>
              )}
              {dynamicReviews.length === 0 && <div style={{ color: '#6B7280', fontSize: '15px' }}>No reviews yet. Be the first to review!</div>}
            </div>
          </div>
        </div>

        {/* Location Tab */}
        <div id="Location" className="border-box-style" style={{ scrollMarginTop: '80px' }}>
          <h3 className="section-subtitle-title">Location & Nearby Landmarks</h3>
          <div className="map-landmarks-split">
            <div className="mock-map-graphic">
              <div className="map-badge-point active">📍 {activeDetailProp.location}</div>
            </div>
            <div className="landmarks-sidebar">
              <div className="landmarks-stack">
                {(dynamicLandmarks.length > 0 ? dynamicLandmarks : landmarks).map((lm, idx) => (
                  <div key={idx} className="landmark-row-item">
                    <div className="landmark-row-left-content">
                      <div className="landmark-avatar-square">
                        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=100&q=80" alt="" className="landmark-thumb-img" />
                      </div>
                      <div className="landmark-texts">
                        <span className="landmark-title-name">{lm.name}</span>
                        <span className="landmark-badge-desc">{lm.distance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="border-box-style" style={{ marginBottom: '80px' }}>
          <h3 className="section-subtitle-title" style={{ marginBottom: '16px', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>Still have questions? Enquire Now</h3>
          <form onSubmit={handleEnquirySubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#4B5563', fontWeight: 600, textAlign: 'left' }}>Your Name*</label>
              <input type="text" value={guestEnquiryName} onChange={e => setGuestEnquiryName(e.target.value)} required placeholder="e.g. John Doe" style={{ padding: '10px 14px', fontSize: '14px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none', background: '#ffffff', color: '#111827' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#4B5563', fontWeight: 600, textAlign: 'left' }}>Phone Number*</label>
              <input type="tel" value={guestEnquiryPhone} onChange={e => setGuestEnquiryPhone(e.target.value)} required placeholder="e.g. +91 9876543210" style={{ padding: '10px 14px', fontSize: '14px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none', background: '#ffffff', color: '#111827' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', color: '#4B5563', fontWeight: 600, textAlign: 'left' }}>Email Address*</label>
              <input type="email" value={guestEnquiryEmail} onChange={e => setGuestEnquiryEmail(e.target.value)} required placeholder="e.g. john@example.com" style={{ padding: '10px 14px', fontSize: '14px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none', background: '#ffffff', color: '#111827' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', color: '#4B5563', fontWeight: 600, textAlign: 'left' }}>Query / Message*</label>
              <textarea value={guestEnquiryMessage} onChange={e => setGuestEnquiryMessage(e.target.value)} required rows={4} placeholder="Write your query to the owner..." style={{ padding: '10px 14px', fontSize: '14px', border: '1px solid #D1D5DB', borderRadius: '8px', outline: 'none', resize: 'none', background: '#ffffff', color: '#111827' }} />
            </div>
            <button type="submit" disabled={guestEnquirySubmitting} className="btn-view-contact-green" style={{ gridColumn: '1 / -1', marginTop: '10px', opacity: guestEnquirySubmitting ? 0.7 : 1 }}>
              {guestEnquirySubmitting ? 'Sending Enquiry...' : 'Submit Enquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
