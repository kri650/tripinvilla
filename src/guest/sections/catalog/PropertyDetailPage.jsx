import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, MapPin, Phone, Mail, Search, Sparkles, Star, Maximize, Home, BedDouble, Users, Utensils, Wifi, Car, Waves, Wind, Flame, Tv, ChefHat, Coffee, Dumbbell, Flower2, Shield, Monitor } from 'lucide-react';
import { detailSubTabs, landmarks, roomOptions } from '../../../data/mockData';
import './PropertyDetailPage.css';
const ICON_MAP = {
  Wifi, Tv, Wind, Car, Utensils, Waves, Trees: Flower2,
  ShieldCheck: Shield, Flame, ChefHat, Coffee, Dumbbell,
  Bath: CheckCircle, Music: CheckCircle, Zap: CheckCircle, Package: CheckCircle
};
import { LogIn, LogOut } from 'lucide-react';

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
    toggleWishlist,
    liveExperiences,
  } = props;

  const renderTypeSpecificDetails = (p) => {
    if (!p) return null;
    const specs = [];

    const addSpec = (label, value, iconName) => {
      if (value !== undefined && value !== null && value !== '' && value !== false) {
        specs.push({ label, value: typeof value === 'boolean' ? 'Yes' : value, iconName });
      }
    };

    // Villa / House / Homestay
    addSpec('Private Pool', p.privatePool, 'Waves');
    addSpec('Garden Area', p.gardenArea, 'Flower2');
    addSpec('Chef Available', p.chefAvailable, 'ChefHat');
    addSpec('Entire Property Only', p.entirePropertyOnly, 'Home');
    addSpec('Security CCTV', p.securityCCTV, 'Shield');
    addSpec('Number of Floors', p.numberOfFloors, 'Home');
    addSpec('Plot Size', p.plotSize, 'Maximize');

    // Hotel / Resort
    addSpec('Restaurant On Site', p.restaurantOnSite, 'Utensils');
    addSpec('Spa & Wellness', p.spaWellness, 'Sparkles');
    addSpec('Conference Room', p.conferenceRoom, 'Monitor');
    addSpec('Room Service', p.roomService, 'Coffee');
    addSpec('24/7 Reception', p.receptionAllDay, 'Clock');
    addSpec('Lift / Elevator', p.liftElevator, 'Maximize');
    addSpec('Star Rating', p.starRating, 'Star');
    addSpec('Total Rooms', p.totalRooms, 'Home');
    addSpec('Total Floors', p.totalFloors, 'Home');
    if (p.activities && p.activities.length > 0) {
      addSpec('Activities', Array.isArray(p.activities) ? p.activities.join(', ') : p.activities, 'Dumbbell');
    }

    // Apartment / Flat
    addSpec('Floor Number', p.floorNumber, 'Home');
    addSpec('Total Floors in Building', p.totalFloorsBuilding, 'Home');
    addSpec('Furnished Status', p.furnishedStatus, 'Home');
    addSpec('Washing Machine', p.washingMachine, 'Wind');
    if (p.societyAmenities && p.societyAmenities.length > 0) {
      addSpec('Society Amenities', Array.isArray(p.societyAmenities) ? p.societyAmenities.join(', ') : p.societyAmenities, 'Sparkles');
    }

    // Cabin / Cottage / Camp
    addSpec('Bonfire Area', p.bonfireArea, 'Flame');
    addSpec('View Type', p.viewType, 'Waves');
    addSpec('Outdoor Seating', p.outdoorSeating, 'Coffee');
    addSpec('Nearest Hiking Trail', p.nearestHikingTrail, 'MapPin');
    if (p.distanceFromCity) {
      addSpec('Distance from City', `${p.distanceFromCity} km`, 'MapPin');
    }

    if (specs.length === 0) return null;

    const iconComponents = {
      Waves, Flower2, ChefHat, Home, Shield, Maximize, Utensils, Sparkles, Monitor, Coffee, Clock, Star, Dumbbell, Wind, Flame, MapPin
    };

    return (
      <div className="about-property-section" style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', marginTop: '20px' }}>
        <h3 className="section-subtitle-title">Property Specifications</h3>
        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px', marginTop: '-4px' }}>
          Additional characteristics and features of this {p.type || 'property'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
          {specs.map((spec, idx) => {
            const Icon = iconComponents[spec.iconName] || CheckCircle;
            return (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', background: '#F9FAFB',
                border: '1px solid #E5E7EB', borderRadius: '10px'
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: '#ECFDF5', color: '#58A429'
                }}>
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{spec.label}</div>
                  <div style={{ fontSize: '13px', color: '#111827', fontWeight: 600 }}>{spec.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const [amenitiesMap, setAmenitiesMap] = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/admin/amenities/active`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(am => {
            if (am.amenitiesName && am.icon) {
              map[am.amenitiesName.toLowerCase()] = am.icon;
            }
          });
          setAmenitiesMap(map);
        }
      })
      .catch(err => console.error("Error loading active amenities:", err));
  }, [API_BASE]);

  const propImages =
    activeDetailProp.images && activeDetailProp.images.length > 0
      ? activeDetailProp.images
      : [activeDetailProp.img || activeDetailProp.image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'];

  // Gracefully calculate price display values
  const rawVal = activeDetailProp.priceRaw || (activeDetailProp.price ? Number(String(activeDetailProp.price).replace(/[^\d]/g, '')) : 1400);
  const priceString = activeDetailProp.price && String(activeDetailProp.price).startsWith('₹') 
    ? activeDetailProp.price 
    : `₹${Number(rawVal).toLocaleString('en-IN')}`;
  const oldPriceString = activeDetailProp.originalPrice 
    ? `₹${Number(activeDetailProp.originalPrice).toLocaleString('en-IN')}`
    : `₹${Math.round(rawVal * 1.2).toLocaleString('en-IN')}`;

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <h2 className="reservation-title" style={{ margin: 0 }}>{activeDetailProp.title}</h2>
            </div>
            

            <div className="reservation-location">
              <MapPin size={16} color="#58A429" />
              <span style={{ color: '#58A429', fontWeight: 500 }}>{activeDetailProp.location}</span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '16px 0' }} />

            <div className="reservation-timing-row" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
              <div className="time-badge" style={{ background: 'transparent', border: 'none', padding: 0, justifyContent: 'flex-start', flex: '1' }}>
                <LogIn size={20} color="#58A429" strokeWidth={1.5} />
                <span style={{ color: '#4B5563', fontSize: '14px' }}>Check in : {activeDetailProp.checkIn || '3:00 PM'}</span>
              </div>
              <div className="time-badge" style={{ background: 'transparent', border: 'none', padding: 0, justifyContent: 'flex-start', flex: '1' }}>
                <LogOut size={20} color="#EF4444" strokeWidth={1.5} />
                <span style={{ color: '#4B5563', fontSize: '14px' }}>Check Out : {activeDetailProp.checkOut || '12:00 PM'}</span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '16px 0' }} />

            <div className="reservation-checks-list">
              {(activeDetailProp.highlights && activeDetailProp.highlights.length > 0 ? activeDetailProp.highlights : []).map((highlight, idx) => (
                <div key={idx} className="check-bullet">
                  <CheckCircle size={15} color="var(--primary-blue)" fill="rgba(37,99,235,0.1)" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Offer Display Block */}
            {(() => {
              let currentOffer = popularOffers.find(o => 
                (o.property_id && o.property_id._id === activeDetailProp._id) || 
                o.property_id === activeDetailProp._id ||
                o.propertyId === activeDetailProp._id
              );
              
              if (!currentOffer && propertyRooms && propertyRooms.length > 0) {
                 const roomWithOffer = propertyRooms.find(r => r.offers && r.offers.length > 0);
                 if (roomWithOffer) {
                    currentOffer = {
                       offerPercent: roomWithOffer.offers[0],
                       description: 'Special offer applicable on rooms in this property.'
                    };
                 }
              }
              
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
                      {currentOffer.offerPercent || currentOffer.offer_percent}
                    </div>
                    <span style={{ fontSize: '13px', color: '#276749', fontWeight: '500', lineHeight: 1.4 }}>
                      {currentOffer.description || 'Special offer applicable on this property.'}
                    </span>
                  </div>
                );
              }
              return null;
            })()}

            <div className="reservation-pricing-block" style={{ borderTop: 'none', paddingTop: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                {oldPriceString && (
                  <div className="old-strike-price" style={{ display: 'block', marginBottom: '4px', fontSize: '15px' }}>{oldPriceString}/night</div>
                )}
                <div className="highlight-green-detail" style={{ lineHeight: 1 }}>{priceString}/night</div>
              </div>
              <div className="taxes-subtext" style={{ textAlign: 'left', marginLeft: '12px', paddingBottom: '4px', fontSize: '13px' }}>
                +{activeDetailProp.taxAmount || 212} taxes & fees per<br />room per night
              </div>
            </div>

            {hostContactRevealed[activeDetailProp._id] ? (
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
              <div className="amenity-vertical-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Maximize size={30} color="#58A429" strokeWidth={1.5} />
              </div>
              <span className="amenity-vertical-lbl">Area Size</span>
              <span className="amenity-vertical-val" style={{ color: '#58A429', fontWeight: 600 }}>{activeDetailProp.area}</span>
            </div>
            <div 
              className="amenity-vertical-item" 
              onClick={() => scrollToDetailSection('Rooms')}
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'none'}
            >
              <div className="amenity-vertical-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Home size={30} color="#58A429" strokeWidth={1.5} />
              </div>
              <span className="amenity-vertical-lbl">Rooms</span>
              <span className="amenity-vertical-val" style={{ color: '#58A429', fontWeight: 600, textDecoration: 'underline' }}>
                {activeDetailProp.roomCountString}
              </span>
            </div>
            <div className="amenity-vertical-item">
              <div className="amenity-vertical-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BedDouble size={30} color="#58A429" strokeWidth={1.5} />
              </div>
              <span className="amenity-vertical-lbl">Beds</span>
              <span className="amenity-vertical-val" style={{ color: '#58A429', fontWeight: 600 }}>{activeDetailProp.beds}</span>
            </div>
            <div className="amenity-vertical-item">
              <div className="amenity-vertical-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={30} color="#58A429" strokeWidth={1.5} />
              </div>
              <span className="amenity-vertical-lbl">Guests</span>
              <span className="amenity-vertical-val" style={{ color: '#58A429', fontWeight: 600 }}>{activeDetailProp.guests}</span>
            </div>
            {(activeDetailProp.amenities || []).map((amenity, idx) => {
              const amName = typeof amenity === 'object' ? amenity.name || amenity.amenitiesName : amenity;
              const lName = (amName || '').toLowerCase();
              const dbIcon = amenitiesMap[lName];

              if (dbIcon && (dbIcon.startsWith('/') || dbIcon.startsWith('http'))) {
                const base = (API_BASE || 'http://localhost:8000/api').replace('/api', '');
                const iconUrl = dbIcon.startsWith('/') ? `${base}${dbIcon}` : dbIcon;
                return (
                  <div key={idx} className="amenity-vertical-item">
                    <div className="amenity-vertical-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={iconUrl} style={{ width: 30, height: 30, objectFit: 'contain', display: 'block' }} alt={amName} />
                    </div>
                    <span className="amenity-vertical-lbl">{amName}</span>
                    <span className="amenity-vertical-val" style={{ color: '#58A429', fontWeight: 600 }}>Available</span>
                  </div>
                );
              }

              let Icon = CheckCircle;
              if (dbIcon && ICON_MAP[dbIcon]) {
                Icon = ICON_MAP[dbIcon];
              } else if (lName.includes('wifi') || lName.includes('internet')) Icon = Wifi;
              else if (lName.includes('park') || lName.includes('garage')) Icon = Car;
              else if (lName.includes('pool') || lName.includes('swim')) Icon = Waves;
              else if (lName.includes('ac') || lName.includes('air con') || lName.includes('cool')) Icon = Wind;
              else if (lName.includes('heat') || lName.includes('fire')) Icon = Flame;
              else if (lName.includes('tv') || lName.includes('television')) Icon = Tv;
              else if (lName.includes('kitchen') || lName.includes('cook')) Icon = ChefHat;
              else if (lName.includes('breakfast') || lName.includes('meal') || lName.includes('food')) Icon = Coffee;
              else if (lName.includes('gym') || lName.includes('fitness')) Icon = Dumbbell;
              else if (lName.includes('garden') || lName.includes('lawn')) Icon = Flower2;
              else if (lName.includes('security') || lName.includes('cctv') || lName.includes('safe')) Icon = Shield;
              else if (lName.includes('workspace') || lName.includes('desk')) Icon = Monitor;
              
              return (
                <div key={idx} className="amenity-vertical-item">
                  <div className="amenity-vertical-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={30} color="#58A429" strokeWidth={1.5} />
                  </div>
                  <span className="amenity-vertical-lbl">{amName}</span>
                  <span className="amenity-vertical-val" style={{ color: '#58A429', fontWeight: 600 }}>Available</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unique Experiences Section */}
        {activeDetailProp && activeDetailProp.experiences && activeDetailProp.experiences.length > 0 && (
          <div className="about-property-section">
            <h3 className="section-subtitle-title">Unique Experiences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
              {activeDetailProp.experiences.map((exp, idx) => {
                const name = exp.experienceName || exp.name || 'Experience';
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4B5563', flexShrink: 0 }} />
                    <span style={{ fontSize: '15px', color: '#4B5563', fontWeight: 500, fontFamily: '"Lato", sans-serif' }}>
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {renderTypeSpecificDetails(activeDetailProp)}
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
            {(!propertyRooms || propertyRooms.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#9CA3AF', fontSize: '14px' }}>
                No rooms have been added for this property yet.
              </div>
            ) : propertyRooms.map((room, idx) => {
              const roomImg = room.room_image_url || room.img || room.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80';
              const roomTitle = room.room_type || room.title || room.name || room.type || 'Standard Room';
              const roomPrice = Number(String(room.price_per_room || room.price || room.rate || 1400).replace(/[^\d]/g, ''));
              const roomOriginalPrice = room.original_price || room.originalPrice || room.original_rate || Math.round(roomPrice * 1.2);
              const currentOfferForRoom = popularOffers.find(o => 
                (o.property_id && o.property_id._id === activeDetailProp._id) || 
                o.property_id === activeDetailProp._id ||
                o.propertyId === activeDetailProp._id
              );
              const roomFoodType = currentOfferForRoom ? (currentOfferForRoom.foods || currentOfferForRoom.food_type) : (activeDetailProp.foodPreference && activeDetailProp.foodPreference !== 'none' ? activeDetailProp.foodPreference : null);

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
                          <div key={`o-${oIdx}`} style={{ padding: '4px 10px', background: '#ECFDF5', color: '#059669', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: '1px solid #A7F3D0' }}>
                            {off}
                          </div>
                        ))}
                        {(room.features || []).map((feat, fIdx) => (
                          <div key={`f-${fIdx}`} style={{ padding: '4px 10px', background: '#E0E7FF', color: '#4338CA', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                            {feat}
                          </div>
                        ))}
                      </div>

                      <div className="room-card-traits-grid">
                        <div className="trait-lbl-item">
                          <BedDouble size={16} color="#58A429" />
                          <span className="trait-name">Beds:</span>
                          <span className="trait-value" style={{ color: '#58A429', fontWeight: 600 }}>{room.bed_type || room.beds || '2 Beds'}</span>
                        </div>
                        <div className="trait-lbl-item">
                          <Home size={16} color="#58A429" />
                          <span className="trait-name">Rooms:</span>
                          <span className="trait-value" style={{ color: '#58A429', fontWeight: 600 }}>{room.rooms || '1 Room'}</span>
                        </div>
                        <div className="trait-lbl-item">
                          <Users size={16} color="#58A429" />
                          <span className="trait-name">Guests:</span>
                          <span className="trait-value" style={{ color: '#58A429', fontWeight: 600 }}>{room.guests || '3 Person'}</span>
                        </div>
                        {roomFoodType && (
                          <div className="trait-lbl-item">
                            <Utensils size={16} color="#58A429" />
                            <span className="trait-name">Food:</span>
                            <span className="trait-value" style={{ color: '#58A429', fontWeight: 600, textTransform: 'capitalize' }}>{roomFoodType}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="room-card-pricing-col">
                      <div className="room-pricing-text-group">
                        <span className="room-taxes-label">+{room.tax_amount || room.taxAmount || activeDetailProp.taxAmount || 212} taxes & fees per<br />room per night</span>
                        {roomOriginalPrice && (
                          <span className="room-old-strike">₹{Number(roomOriginalPrice).toLocaleString('en-IN')}/night</span>
                        )}
                        <span className="room-green-val">₹{Number(roomPrice).toLocaleString('en-IN')}/night</span>
                      </div>
                      
                      {hostContactRevealed[activeDetailProp._id] ? (
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
              {(() => {
                const parseCoordinate = (val, isLat) => {
                  if (val === null || val === undefined) return null;
                  let num = Number(val);
                  if (isNaN(num)) return null;
                  const limit = isLat ? 90 : 180;
                  if (Math.abs(num) > limit) {
                    let temp = num;
                    while (Math.abs(temp) > limit) {
                      temp = temp / 10;
                    }
                    num = temp;
                  }
                  return num;
                };

                const lat = parseCoordinate(activeDetailProp.latitude, true);
                const lng = parseCoordinate(activeDetailProp.longitude, false);
                const hasValidCoords = lat !== null && lng !== null && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && (lat !== 0 || lng !== 0);

                return (
                  <iframe
                    title={`${activeDetailProp.title} Map`}
                    src={hasValidCoords 
                      ? `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`
                      : `https://www.google.com/maps?q=${encodeURIComponent(activeDetailProp.full_address || activeDetailProp.location || 'Kasol, Himachal Pradesh')}&output=embed`
                    }
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                );
              })()}
            </div>

            {/* Right Landmarks List */}
            <div className="landmarks-sidebar">
              <h3 className="section-subtitle-title" style={{ fontSize: '20px', marginBottom: '20px' }}>Key Landmarks</h3>
              <div className="landmarks-stack">
                {(() => {
                  const landmarksToRender = dynamicLandmarks.length > 0 ? dynamicLandmarks : (activeDetailProp._id?.toString().startsWith('mock-') ? landmarks : []);
                  if (landmarksToRender.length === 0) {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '150px', color: '#6B7280', textAlign: 'center', padding: '16px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>No nearby landmarks specified.</span>
                        <span style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>The owner has not listed any landmarks for this property.</span>
                      </div>
                    );
                  }
                  return landmarksToRender.map((mark, idx) => (
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
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* PROPERTY RULES SECTION — only show if there is actual rules content */}
        {(() => {
          const validOtherDetails = (
            activeDetailProp?.dynamicRules ||
            activeDetailProp?.ruleSections ||
            activeDetailProp?.otherDetails ||
            []
          ).filter(sec => sec.title && ((sec.text && sec.text.trim() !== '') || (sec.points && sec.points.length > 0)));
          const hasDynamicRules = validOtherDetails.length > 0;
          const hasStringRules = typeof activeDetailProp?.rules === 'string' && activeDetailProp.rules.trim() !== '';
          const hasRoomRules = propertyRooms && propertyRooms.some(room => Array.isArray(room.rules) && room.rules.length > 0);
          if (!hasDynamicRules && !hasStringRules && !hasRoomRules) return null;
          return (
            <div id="detail-section-rules" className="detail-tab-target-section border-box-style">
              {/* Only show heading if there are no dynamic rules */}
              {!hasDynamicRules && (hasStringRules || hasRoomRules) && (
                <h3 className="section-subtitle-title" style={{ marginBottom: '20px' }}>Property Rules</h3>
              )}
              <div className="rules-timings-grid">
                <div className="time-badge">
                  <span>Check In : {activeDetailProp.checkIn || '3:00 PM'}</span>
                </div>
                <div className="time-badge">
                  <span>Check Out : {activeDetailProp.checkOut || '12:00 PM'}</span>
                </div>
              </div>
                {/* Dynamic Property Rules */}
                {hasDynamicRules && validOtherDetails.map((sec, sIdx) => (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '14px 16px', marginTop: sIdx > 0 ? '24px' : '0' }} key={`prop-rule-${sIdx}`}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#B91C1C', margin: '0 0 8px 0' }}>{sec.title || 'Rules'}</h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {sec.text.split('\n').map((rule, rIdx) => (
                        <li key={`prop-rule-${sIdx}-${rIdx}`} style={{ fontSize: '13px', color: '#991B1B', lineHeight: 1.6 }}>{rule.replace(/^[•*-]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Only show static rules if no dynamic rules */}
                {!hasDynamicRules && hasStringRules && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '14px 16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#B91C1C', margin: '0 0 8px 0' }}>Property Rules</h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {activeDetailProp.rules.split('\n').map((rule, rIdx) => (
                        <li key={`prop-${rIdx}`} style={{ fontSize: '13px', color: '#991B1B', lineHeight: 1.6 }}>{rule.replace(/^[•*-]\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Dynamic Room Rules Sections */}
                {propertyRooms && propertyRooms.length > 0 && propertyRooms.map((room, idx) => {
                  if (Array.isArray(room.rules) && room.rules.length > 0) {
                    return room.rules
                      .filter(sec => Array.isArray(sec.points) && sec.points.length > 0) // Only show sections with points
                      .map((sec, sIdx) => (
                        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', padding: '10px 14px', marginTop: '12px' }} key={`room-${idx}-sec-${sIdx}`}>
                          <h4 style={{ color: '#B45309', margin: '0 0 6px 0', fontSize: '14px', fontWeight: 700 }}>{sec.title || 'Additional Rules'}</h4>
                          <ul style={{ paddingLeft: '20px', margin: 0, color: '#78350F', fontSize: '13px' }}>
                            {sec.points.map((point, pIdx) => <li key={pIdx} style={{ marginBottom: '4px' }}>{point}</li>)}
                          </ul>
                        </div>
                      ));
                  }
                  return null;
                })}
            </div>
          );
        })()}

        {/* USER REVIEWS SECTION */}
        <div id="detail-section-reviews" className="detail-tab-target-section border-box-style" style={{ marginBottom: '80px' }}>
          <h3 className="section-subtitle-title" style={{ marginBottom: '24px' }}>User Reviews</h3>
          <div className="reviews-layout-split">
            
            {/* Left Score Card */}
            {dynamicReviewStats && (
              <div className="reviews-score-card">
                <div className="score-top-row">
                  <div className="score-pill-large">
                    <span>{dynamicReviewStats.count > 0 ? (dynamicReviewStats.avg || dynamicReviewStats.average || '5.0') : 'N/A'}</span>
                  </div>
                  <div className="score-lbl-wrap">
                    <span className="score-main-lbl">{dynamicReviewStats.count > 0 ? (dynamicReviewStats.label || 'Excellent') : 'No Reviews'}</span>
                    <span className="score-sub-lbl">{dynamicReviewStats.count || dynamicReviews.length || 0} Genuine Reviews</span>
                  </div>
                </div>

                <div className="rating-progress-stack" style={{ margin: '24px 0' }}>
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = dynamicReviewStats.breakdown?.[star] || 0;
                    const total = dynamicReviewStats.count || dynamicReviews.length || 0;
                    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={star} className="progress-row">
                        <span>{star} Star</span>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
                        </div>
                        <span>{percentage}%</span>
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
                      <span className="review-user-role">{rev.reviewer_role || rev.role || (rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified Guest')}</span>
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
        <div className="detail-tab-target-section border-box-style" style={{ marginBottom: '24px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
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
    );
}
