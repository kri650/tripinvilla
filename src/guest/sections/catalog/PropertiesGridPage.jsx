import { Heart, MapPin } from 'lucide-react';
import { areaIcon, bedIcon, guestIcon, roomIcon } from '../../../assets';
import { propertyCategories, propertiesVillasList, propertiesHomestaysList } from '../../../data/mockData';
import './PropertiesGridPage.css';

export default function PropertiesGridPage(props) {
  const {
    activePropCategory, setActivePropCategory,
    setFilterSelectedTypes,
    setWhere,
    fetchProperties,
    setActiveMenu,
    setSelectedProperty,
    setContactStep, setContactModalOpen,
    mockWishlistedTitles, toggleMockWishlist,
    homepageContent, renderTitle,
  } = props;

  return (
    <div className="properties-page-layout fade-in">

      {/* Category Scroller */}
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
                  const typeMap = { Apartments: 'Apartment', Homestays: 'Homestay', Resorts: 'Resort', Motels: 'Motel', Cottages: 'Cottage', Bungalows: 'Bungalow', Villas: 'Villa' };
                  setFilterSelectedTypes([typeMap[cat.name] || cat.name]);
                  setWhere('');
                  fetchProperties({ type: cat.name, search: '' });
                  setActiveMenu('Search');
                }}
              >
                <span className="prop-cat-icon">
                  {cat.iconImg
                    ? <img src={cat.iconImg} alt={cat.name} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                    : cat.icon}
                </span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section A: Best Villas */}
      <div className="villas-around-section" style={{ marginTop: '40px' }}>
        <div className="section-title-wrap">
          <h2 className="section-main-headline">
            {renderTitle(homepageContent?.section1?.title, <span>Best <span className="highlight-sharp-blue-box">Villas</span> Around You</span>, 'Villas')}
          </h2>
          <p className="section-sub-headline">
            {homepageContent?.section1?.subText || 'Choose from homestays, villas, apartments, resorts and more.'}
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
                    <Heart size={16} fill={isLiked ? '#EF4444' : 'none'} color={isLiked ? '#EF4444' : '#FFFFFF'} />
                  </button>
                </div>
                <div className="recommend-card-info-col">
                  <h3 className="recommend-card-name-text">{villa.title}</h3>
                  <div className="recommend-card-location-row"><span>{villa.location}</span><MapPin size={13} color="#9CA3AF" /></div>
                  <div className="recommend-specs-2x2-grid">
                    <div className="recommend-spec-pill"><img src={areaIcon} alt="Area" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Area Size: {(villa.bedRooms || 2) * 150} sq. ft.</span></div>
                    <div className="recommend-spec-pill"><img src={bedIcon} alt="Beds" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Beds: {villa.bedRooms || 2} Beds</span></div>
                    <div className="recommend-spec-pill"><img src={roomIcon} alt="Rooms" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Rooms: {villa.bedRooms || 1} Room</span></div>
                    <div className="recommend-spec-pill"><img src={guestIcon} alt="Guests" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Guests: {villa.capacity || 3} Person</span></div>
                  </div>
                  <div className="recommend-price-tag-row">
                    <span className="price-label">Starting from</span>
                    <span className="price-green-bold">{String(villa.price).startsWith('₹') ? villa.price : '₹' + villa.price}/night</span>
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
        <div className="view-more-btn-container"><button className="btn-view-more">View More</button></div>
      </div>

      {/* Section B: Best Homestays */}
      <div className="villas-around-section" style={{ margin: '80px auto' }}>
        <div className="section-title-wrap">
          <h2 className="section-main-headline">
            Best <span className="highlight-sharp-blue-box">Homestays</span> Around You
          </h2>
          <p className="section-sub-headline">
            {homepageContent?.section1?.subText || 'Choose from homestays, villas, apartments, resorts and more.'}
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
                    <Heart size={16} fill={isLiked ? '#EF4444' : 'none'} color={isLiked ? '#EF4444' : '#FFFFFF'} />
                  </button>
                </div>
                <div className="recommend-card-info-col">
                  <h3 className="recommend-card-name-text">{homestay.title}</h3>
                  <div className="recommend-card-location-row"><span>{homestay.location}</span><MapPin size={13} color="#9CA3AF" /></div>
                  <div className="recommend-specs-2x2-grid">
                    <div className="recommend-spec-pill"><img src={areaIcon} alt="Area" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Area Size: {(homestay.bedRooms || 2) * 150} sq. ft.</span></div>
                    <div className="recommend-spec-pill"><img src={bedIcon} alt="Beds" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Beds: {homestay.bedRooms || 2} Beds</span></div>
                    <div className="recommend-spec-pill"><img src={roomIcon} alt="Rooms" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Rooms: {homestay.bedRooms || 1} Room</span></div>
                    <div className="recommend-spec-pill"><img src={guestIcon} alt="Guests" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Guests: {homestay.capacity || 3} Person</span></div>
                  </div>
                  <div className="recommend-price-tag-row">
                    <span className="price-label">Starting from</span>
                    <span className="price-green-bold">{String(homestay.price).startsWith('₹') ? homestay.price : '₹' + homestay.price}/night</span>
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
        <div className="view-more-btn-container"><button className="btn-view-more">View More</button></div>
      </div>
    </div>
  );
}
