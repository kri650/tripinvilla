import { ChevronLeft, ChevronRight, CreditCard, Heart, MapPin, Percent } from 'lucide-react';
import { rect32Img, rect33Img, rect35Img } from '../../assets';
import { popularOffersList } from '../../data/mockData';

export default function HomePage(props) {
  const {
    activeMenu,

    // Tabs
    activeDestTab,
    setActiveDestTab,

    // Derived lists
    displayDestinations,
    displayExperiences,
    currentBestVillas,
    currentCuratedVillas,

    // Content
    homepageContent,
    renderTitle,
    popularOffers,

    // Auth + user
    token,
    user,
    setAuthMode,
    setAuthModalOpen,
    API_BASE,
    fetchProfileAndEnquiries,

    // Navigation / selections
    setActiveMenu,
    setSelectedProperty,
    setContactStep,
    setContactModalOpen,
  } = props;

  return (
    <>
      {/* VIEW E: HOME VIEW */}
      {activeMenu === 'Home' && (
        <>
          {/* ══ SECTION 1: DESTINATIONS CAROUSEL (Width 1281px, Height 465px) ══ */}
          <div className="destinations-carousel-section">
            
            {/* Toggle selectors inside Section 1 */}
            <div className="carousel-nav-pill">
              <button 
                className={`carousel-nav-btn ${activeDestTab === 'Destinations' ? 'active' : ''}`}
                onClick={() => setActiveDestTab('Destinations')}
              >
                Destinations
              </button>
              <button 
                className={`carousel-nav-btn ${activeDestTab === 'Unique' ? 'active' : ''}`}
                onClick={() => setActiveDestTab('Unique')}
              >
                Unique Experiences
              </button>
            </div>

            {/* Carousel Grid with Arrow buttons */}
            <div className="carousel-viewport">
              <button 
                className="carousel-arrow left"
                onClick={() => {
                  const track = document.querySelector('.carousel-track');
                  if (track) {
                    track.scrollBy({ left: -240, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="carousel-track">
                {(activeDestTab === 'Destinations' ? displayDestinations : displayExperiences).map((dest, i) => (
                  <div key={i} className="carousel-card-item">
                    <div className="carousel-img-wrap">
                      <img src={dest.img} alt={dest.name} />
                    </div>
                    <h3 className="carousel-city-title">{dest.name}</h3>
                    <p className="carousel-city-sub">{dest.count}</p>
                  </div>
                ))}
              </div>

              <button 
                className="carousel-arrow right"
                onClick={() => {
                  const track = document.querySelector('.carousel-track');
                  if (track) {
                    track.scrollBy({ left: 240, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

          </div>

          {/* ══ SECTION 2: BEST VILLAS AROUND YOU (Figma Specifications) ══ */}
          <div className="villas-around-section">
            
            {/* Keyword-highlighted headline block */}
            <div className="section-title-wrap">
              <h2 className="section-main-headline">
                {renderTitle(homepageContent?.section1?.title, <span>Best <span className="highlight-sharp-blue-box">Villas</span> Around You</span>, "Villas")}
              </h2>
              <p className="section-sub-headline">
                {homepageContent?.section1?.subText || 'Choose from homestays, villas, apartments, resorts and more—stays that fit your travel style.'}
              </p>
            </div>

            {/* 3-column Grid layout */}
            <div className="villas-grid">
              {currentBestVillas.map((villa, idx) => {
                const isWishlisted = user && user.wishlist && user.wishlist.some(w => w._id === villa._id || w === villa._id);
                return (
                  <div key={idx} className="villa-card">
                    <div className="villa-card-img-wrap">
                      <img src={villa.img} alt={villa.title} />
                      <button 
                        className={`wishlist-btn-circle ${isWishlisted ? 'active' : ''}`}
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!token) {
                            setAuthMode('login');
                            setAuthModalOpen(true);
                            return;
                          }
                          try {
                            const res = await fetch(`${API_BASE}/users/wishlist/${villa._id}`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                              }
                            });
                            if (res.ok) {
                              fetchProfileAndEnquiries(token);
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      >
                        <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : '#111827'} />
                      </button>
                    </div>
                    
                    <div className="villa-card-content">
                      <h3 className="villa-card-title">{villa.title}</h3>
                      
                      <div className="villa-card-location">
                        <MapPin size={13} color="#9CA3AF" />
                        <span>{villa.location}</span>
                      </div>

                      <div className="villa-card-rating-row">
                        <div className="rating-pill">
                          <span>{villa.rating}</span>
                        </div>
                        <div className="rating-text-stack">
                          <span className="rating-desc-excellent">Excellent</span>
                          <span className="rating-reviews-count">{villa.reviews}</span>
                        </div>
                      </div>

                      <div className="villa-card-price-row">
                        <span className="price-label">Starting from</span>
                        <span className="price-value-highlight">{villa.price}/night</span>
                      </div>

                      <div className="villa-card-actions">
                        <button className="btn-villa-action outline-blue" onClick={() => { setSelectedProperty(villa); setActiveMenu('Detail'); }}>View Details</button>
                        <button className="btn-villa-action outline-green" onClick={() => { setSelectedProperty(villa); setContactStep(1); setContactModalOpen(true); }}>Contact Owner</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ══ SECTION 3: CURATED PROPERTIES ══ */}
          <div className="curated-properties-section">
            
            {/* Title layout block */}
            <div className="section-title-wrap">
              <h2 className="section-main-headline">
                {renderTitle(homepageContent?.section2?.title, <span><span className="highlight-sharp-blue-box">Curated</span> Properties</span>, "Curated")}
              </h2>
              <p className="section-sub-headline">
                {homepageContent?.section2?.subText || 'Carefully selected stays that meet our standards for comfort, quality, and location.'}
              </p>
            </div>

            {/* Horizontal Card pairs inside a scroll viewport */}
            <div className="curated-viewport">
              <button 
                className="curated-arrow left"
                onClick={() => {
                  const track = document.querySelector('.curated-horizontal-grid');
                  if (track) {
                    track.scrollBy({ left: -400, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="curated-horizontal-grid">
                {currentCuratedVillas.map((item, idx) => (
                  <div key={idx} className="curated-horizontal-card">
                    <div className="curated-card-img-wrap">
                      <img src={item.img} alt={item.title} />
                      <button className="recommend-heart-circle">
                        <Heart size={16} fill="none" color="#111827" />
                      </button>
                    </div>

                    <div className="curated-card-content">
                      <h3 className="curated-card-title">{item.title}</h3>
                      
                      <div className="curated-card-location">
                        <MapPin size={13} color="#9CA3AF" />
                        <span>{item.location}</span>
                      </div>

                      <div className="curated-card-rating-row">
                        <div className="rating-pill">
                          <span>{item.rating}</span>
                        </div>
                        <div className="rating-text-stack">
                          <span className="rating-desc-excellent">Excellent</span>
                          <span className="rating-reviews-count">{item.reviews}</span>
                        </div>
                      </div>

                      <div className="curated-card-price-row">
                        <span className="price-label">Starting from</span>
                        <span className="price-green-bold">{item.price}/night</span>
                      </div>

                      <div className="curated-card-actions">
                        <button className="recommend-details-btn-blue" onClick={() => setActiveMenu('Detail')}>View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="curated-arrow right"
                onClick={() => {
                  const track = document.querySelector('.curated-horizontal-grid');
                  if (track) {
                    track.scrollBy({ left: 400, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

          </div>

          {/* ══ SECTION 4: POPULAR OFFERS OF PROPERTY ══ */}
          <div className="popular-offers-section">
            
            {/* Title Layout */}
            <div className="section-title-wrap">
              <h2 className="section-main-headline">
                <span className="highlight-sharp-blue-box">Popular</span> Offers Of Property
              </h2>
              <p className="section-sub-headline">
                {homepageContent?.section2?.subText || 'Carefully selected stays that meet our standards for comfort, quality, and location.'}
              </p>
            </div>

            {/* 2x2 Grid Layout */}
            <div className="popular-offers-grid">
              {[...(popularOffers || []), ...popularOffersList].slice(0, 4).map((offer, idx) => {
                const isDynamic = offer.property_id || offer.propertyName;
                const title = isDynamic ? `${offer.propertyName || offer.property_id?.name} - ${offer.room_type || offer.room || 'Deluxe Room'}` : offer.title;
                const subtitle = isDynamic ? `${offer.category} | ${offer.food_type || offer.foods} | ${offer.description}` : offer.subtitle;
                const discount = isDynamic ? `${offer.offer_percent || offer.offerPercent}` : (offer.discount ? offer.discount.replace(/Up to\s+/i, '') : '30% OFF');
                const img = isDynamic 
                  ? (offer.property_id?.images?.[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80') 
                  : offer.img;

                return (
                  <div key={idx} className="offer-horizontal-card">
                    <div className="offer-card-img-wrap">
                      <img src={img} alt={title} />
                      {(idx % 2 === 0) && (
                        <span className="exclusive-offer-badge">Exclusive Offer</span>
                      )}
                    </div>

                    <div className="offer-card-content">
                      <h3 className="offer-card-title">{title}</h3>
                      <p className="offer-card-subtitle">{subtitle}</p>
                      
                      <div className="offer-card-discount-row">
                        <span className="discount-label">Up to</span>
                        <span className="discount-value-highlight">{discount}</span>
                      </div>

                      <div className="offer-card-actions">
                        <button 
                          className="recommend-details-btn-blue" 
                          onClick={() => {
                            if (isDynamic && offer.property_id) {
                              setSelectedProperty(offer.property_id);
                              setActiveMenu('Detail');
                            } else {
                              setActiveMenu('Detail');
                            }
                          }}
                        >
                          View Stays
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ══ SECTION 5: WHY CHOOSE OUR SERVICES ══ */}
          <div className="services-section" style={{ marginBottom: 0 }}>
            <div className="services-inner-container">
              
              <div className="section-title-wrap">
                <h2 className="section-main-headline">
                  {renderTitle(homepageContent?.section5?.title, <span>Why Choose Our <span className="highlight-sharp-blue-box">Services</span></span>, "Services")}
                </h2>
                <p className="section-sub-headline" style={{ color: '#4B5563' }}>
                  {homepageContent?.section5?.subText || 'Choose the next destination for you'}
                </p>
              </div>

              {/* Asymmetric custom grid row */}
              <div className="services-grid-asym">
                
                {/* Column 1 */}
                <div className="services-col">
                  
                  {/* White card top */}
                  <div className="service-text-card white-bg">
                    <p className="service-card-desc">
                      {homepageContent?.section5?.row1Desc || 'Every property is carefully verified to ensure quality, safety, and comfort you can rely on.'}
                    </p>
                    <div className="service-card-bottom-group">
                      <h3 className="service-card-accent-title">{homepageContent?.section5?.row1?.title || 'Verified & Trusted Stays'}</h3>
                      <p className="service-card-subtext">{homepageContent?.section5?.row1?.subText || 'Get genuine and good stays'}</p>
                    </div>
                  </div>

                  {/* {homepageContent?.section5?.features?.[0]?.title || 'Secure Payments'} bottom image */}
                  <div className="service-image-card">
                    <img 
                      src={homepageContent?.section5?.features?.[0]?.image || rect35Img} 
                      alt={homepageContent?.section5?.features?.[0]?.title || "Secure Payments"} 
                    />
                    <div className="service-overlay-badge-bottom">
                      <div className="service-icon-circle-overlay">
                        <CreditCard size={18} color="#FFFFFF" />
                      </div>
                      <span>{homepageContent?.section5?.features?.[0]?.title || 'Secure Payments'}</span>
                    </div>
                  </div>

                </div>

                {/* Column 2 (Full Height Traveler center image) */}
                <div className="services-col-center">
                  <div className="service-tall-card">
                    <img 
                      src={homepageContent?.section5?.image3 || rect32Img} 
                      alt="Traveler with suitcase" 
                    />
                  </div>
                </div>

                {/* Column 3 */}
                <div className="services-col">
                  
                  {/* Pool Resort top image */}
                  <div className="service-image-card">
                    <img 
                      src={homepageContent?.section5?.features?.[1]?.image || rect33Img} 
                      alt={homepageContent?.section5?.features?.[1]?.title || 'Best Price Guarantee'} 
                    />
                    <div className="service-overlay-badge-bottom">
                      <div className="service-icon-circle-overlay">
                        <Percent size={18} color="#FFFFFF" />
                      </div>
                      <span>{homepageContent?.section5?.features?.[1]?.title || 'Best Price Guarantee'}</span>
                    </div>
                  </div>

                  {/* 24/7 Support text card bottom */}
                  <div className="service-text-card transparent-bg">
                    <div className="service-card-top-group">
                      <h3 className="service-card-accent-title">{homepageContent?.section5?.row2?.title || '24/7 Support, Always There'}</h3>
                      <p className="service-card-bold-sub">{homepageContent?.section5?.row2?.subText || 'All type of support'}</p>
                    </div>
                    <p className="service-card-desc-light">
                      {homepageContent?.section5?.row2Desc || 'From booking to checkout, our support team is available anytime to help you.'}
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </>
      )}

      {/* ══ SECTION 6: PREMIUM SITE FOOTER ══ */}
    </>
  );
}
