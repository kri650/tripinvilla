import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, MapPin } from 'lucide-react';
import { popularOffersList } from '../../data/mockData';
import WhyChooseUs from '../components/WhyChooseUs';

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
    setActiveDestinationInfo,
    setContactStep,
    setContactModalOpen,
    toggleWishlist,

    // Category
    activePropCategory,
    setActivePropCategory,
    fetchProperties,
    setFilterSelectedTypes,
    setWhere,
  } = props;

  const typeMap = { Apartments: 'Apartment', Homestays: 'Homestay', Resorts: 'Resort', Motels: 'Motel', Cottages: 'Cottage', Bungalows: 'Bungalow', Villas: 'Villa' };
  const activeCategory = activePropCategory || 'Villas';
  // currentBestVillas is already strictly filtered by category and capped at 6 in GuestApp
  const homepageBestVillas = currentBestVillas;

  // Debug: Log homepage content to verify section4 is loaded
  useEffect(() => {
    if (activeMenu === 'Home' && homepageContent) {
      console.log('📋 HomePage Content Loaded:', {
        section1: homepageContent.section1,
        section2: homepageContent.section2,
        section4: homepageContent.section4,
        section5: homepageContent.section5,
      });
    }
  }, [homepageContent, activeMenu]);

  const handleViewAll = () => {
    if (setActivePropCategory) setActivePropCategory(activeCategory);
    if (setFilterSelectedTypes) setFilterSelectedTypes([typeMap[activeCategory] || activeCategory]);
    if (setWhere) setWhere('');
    if (fetchProperties) fetchProperties({ type: activeCategory, search: '' });
    setActiveMenu('Properties');
  };


  // Auto-scroll curated properties
  useEffect(() => {
    if (activeMenu !== 'Home') return;
    const interval = setInterval(() => {
      const track = document.querySelector('.curated-horizontal-grid');
      if (track) {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: 400, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [activeMenu]);

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
                    const card = track.querySelector('.carousel-card-item');
                    const scrollAmount = card ? (track.clientWidth - card.clientWidth) : 240;
                    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="carousel-track">
                {(activeDestTab === 'Destinations' ? displayDestinations : displayExperiences).map((dest, i) => (
                  <div 
                    key={i} 
                    className="carousel-card-item" 
                    onClick={() => setActiveDestinationInfo(dest)}
                    style={{ cursor: 'pointer' }}
                  >
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
                    const card = track.querySelector('.carousel-card-item');
                    const scrollAmount = card ? (track.clientWidth - card.clientWidth) : 240;
                    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

          </div>

          {/* ══ SECTION 2: BEST [CATEGORY] AROUND YOU ══ */}
          <div className="villas-around-section">
            
            {/* Keyword-highlighted headline block */}
            <div className="section-title-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 className="section-main-headline">
                  {renderTitle(homepageContent?.section1?.title, <span>Best <span className="highlight-sharp-blue-box">Villas</span> Around You</span>, 'Villas')}
                </h2>
                <p className="section-sub-headline">
                  {homepageContent?.section1?.subText || 'Choose from homestays, villas, apartments, resorts and more—stays that fit your travel style.'}
                </p>
              </div>
              <button 
                onClick={handleViewAll}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                  cursor: 'pointer',
                  marginBottom: '10px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              >
                View All
              </button>
            </div>

            {/* 3-column Grid layout - show only 3 */}
            <div className="villas-grid">
              {homepageBestVillas.map((villa, idx) => {
                const isWishlisted = user && user.wishlist && user.wishlist.some(w => w._id === villa._id || w === villa._id);
                return (
                  <div key={idx} className="villa-card">
                    <div className="villa-card-img-wrap">
                      <img src={villa.img} alt={villa.title} />
                      <button 
                        className={`wishlist-btn-circle ${isWishlisted ? 'active' : ''}`}
                        onClick={(e) => toggleWishlist(villa._id, e)}
                      >
                        <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : '#111827'} />
                      </button>
                    </div>
                    
                    <div className="villa-card-content">
                      <h3 className="villa-card-title">{villa.title}</h3>
                      
                      <div className="villa-card-location">
                        <MapPin size={13} color="#9CA3AF" />
                        <span>{villa.full_address || villa.location}</span>
                      </div>

                      <div className="villa-card-rating-row">
                        {villa.reviewsCount > 0 ? (
                          <>
                            <div className="rating-pill">
                              <span>{villa.rating}</span>
                            </div>
                            <div className="rating-text-stack">
                              <span className="rating-desc-excellent">{villa.ratingLabel}</span>
                              <span className="rating-reviews-count">{villa.reviews}</span>
                            </div>
                          </>
                        ) : (
                          <div className="rating-text-stack">
                            <span style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>Not Rated Yet</span>
                            <span className="rating-reviews-count">0 Genuine Reviews</span>
                          </div>
                        )}
                      </div>

                      <div className="villa-card-price-row">
                        <span className="price-label">Starting from</span>
                        <span className="price-value-highlight">₹{Number(String(villa.price || 0).replace(/[^\d]/g, '')).toLocaleString('en-IN')}/night</span>
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
                      <button 
                        className={`wishlist-btn-circle ${user && user.wishlist && user.wishlist.some(w => w._id === item._id || w === item._id) ? 'active' : ''}`}
                        onClick={(e) => toggleWishlist(item._id, e)}
                      >
                        <Heart 
                          size={16} 
                          fill={user && user.wishlist && user.wishlist.some(w => w._id === item._id || w === item._id) ? '#EF4444' : 'none'} 
                          color={user && user.wishlist && user.wishlist.some(w => w._id === item._id || w === item._id) ? '#EF4444' : '#111827'} 
                        />
                      </button>
                    </div>

                    <div className="curated-card-content">
                      <h3 className="curated-card-title">{item.title}</h3>
                      
                      <div className="curated-card-location">
                        <MapPin size={13} color="#9CA3AF" />
                        <span>{item.full_address || item.location}</span>
                      </div>

                      <div className="curated-card-rating-row">
                        {item.reviewsCount > 0 ? (
                          <>
                            <div className="rating-pill">
                              <span>{item.rating}</span>
                            </div>
                            <div className="rating-text-stack">
                              <span className="rating-desc-excellent">{item.ratingLabel}</span>
                              <span className="rating-reviews-count">{item.reviews}</span>
                            </div>
                          </>
                        ) : (
                          <div className="rating-text-stack">
                            <span style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>Not Rated Yet</span>
                            <span className="rating-reviews-count">0 Genuine Reviews</span>
                          </div>
                        )}
                      </div>

                      <div className="curated-card-price-row">
                        <span className="price-label">Starting from</span>
                        <span className="price-value-highlight">₹{Number(String(item.price || 0).replace(/[^\d]/g, '')).toLocaleString('en-IN')}/night</span>
                      </div>

                      <div className="curated-card-actions">
                        <button className="btn-villa-action outline-blue" onClick={() => { setSelectedProperty(item); setActiveMenu('Detail'); }}>View Details</button>
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
                {renderTitle(
                  homepageContent?.section4?.title,
                  <span><span className="highlight-sharp-blue-box">Popular</span> Offers Of Property</span>,
                  'Popular'
                )}
              </h2>
              <p className="section-sub-headline">
                {homepageContent?.section4?.subText || 'Exclusive deals on handpicked stays — limited-time offers you won\'t want to miss.'}
              </p>
            </div>

            {/* 2x2 Grid Layout */}
            <div className="popular-offers-grid">
              {(() => {
                const rawSource = popularOffers?.length > 0 ? popularOffers : popularOffersList;
                const source = rawSource.filter(offer => {
                  const isDyn = offer.property_id || offer.propertyName;
                  if (isDyn) {
                    if (!offer.property_id || typeof offer.property_id !== 'object') return false;
                    if (offer.property_id.status !== 'Active') return false;
                    const name = String(offer.property_id.name || '').trim().toLowerCase();
                    if (name.includes('abc') || name === 'test' || name === 'owner') return false;
                  } else {
                    const title = String(offer.title || '').trim().toLowerCase();
                    if (title.includes('abc') || title === 'test' || title === 'owner') return false;
                  }
                  return true;
                });
                const uniqueOffers = [];
                const seenIds = new Set();
                for (const o of source) {
                  const pId = typeof o.property_id === 'object' ? o.property_id?._id : o.property_id;
                  const key = String(pId || o.propertyName || o.title || '').trim().toLowerCase();
                  if (key && !seenIds.has(key)) {
                    seenIds.add(key);
                    uniqueOffers.push(o);
                  }
                }
                return uniqueOffers.slice(0, 4);
              })().map((offer, idx) => {
                const isDynamic = offer.property_id || offer.propertyName;
                const title = isDynamic ? `${offer.propertyName || offer.property_id?.name} - ${offer.room_type || offer.room || 'Deluxe Room'}` : offer.title;
                const subtitle = isDynamic ? `${offer.category} | ${offer.food_type || offer.foods} | ${offer.description || ''}` : offer.subtitle;
                const discount = isDynamic ? `${parseInt(offer.offer_percent || offer.offerPercent || 0)}% OFF` : (offer.discount ? offer.discount.replace(/Up to\s+/i, '') : '30% OFF');
                const img = isDynamic 
                  ? (offer.image || offer.property_id?.images?.[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80') 
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
                            } else if (currentBestVillas && currentBestVillas.length > 0) {
                              setSelectedProperty(currentBestVillas[0]);
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
          <WhyChooseUs homepageContent={homepageContent} />
        </>
      )}

      {/* ══ SECTION 6: PREMIUM SITE FOOTER ══ */}
    </>
  );
}
