import { useState, useEffect } from 'react';
import { Heart, MapPin } from 'lucide-react';
import { areaIcon, bedIcon, filterIcon, guestIcon, recommendHeroImg, roomIcon } from '../../../assets';
import './RecommendPage.css';

export default function RecommendPage(props) {
  const { setSelectedProperty, setActiveMenu, isRecommendFilterOpen, setIsRecommendFilterOpen, recommendSearchQuery, setRecommendSearchQuery, toggleWishlist, user, API_BASE } = props;

  const [recommendedItems, setRecommendedItems] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE || 'http://13.127.196.228:8000/api'}/properties/recommended`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRecommendedItems(data);
      })
      .catch(err => console.error('Error fetching recommended properties:', err));
  }, [API_BASE]);

  const filtered = recommendedItems
    .filter(item => {
      const owner = item.owner;
      if (owner) {
        return owner.isPremium === true || owner.subscription?.isActive === true;
      }
      return true; // fallback for mock/test data with no owner info
    })
    .filter(item =>
      !recommendSearchQuery ||
      item.name.toLowerCase().includes(recommendSearchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(recommendSearchQuery.toLowerCase())
    );

  const displayedItems = showAll ? filtered : filtered.slice(0, 3);

  return (
    <div className="recommend-page-wrapper fade-in">
      <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${recommendHeroImg}")` }}>
        <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>Recommended By Us</h1>
      </div>

      <div className="recommend-main-container">
        <div className="recommend-header-row">
          <div className="recommend-header-left">
            <h2 className="recommend-header-title">Our Recommendations</h2>
            <p className="recommend-header-sub">Keep track of destinations and villas you love.</p>
          </div>
          <button className="recommend-filter-btn" onClick={() => setIsRecommendFilterOpen(!isRecommendFilterOpen)}>
            <img src={filterIcon} alt="Filter" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <span>Filters</span>
          </button>
        </div>

        {isRecommendFilterOpen && (
          <div className="filter-panel-box" style={{ display: 'flex', gap: '16px', margin: '16px 0', padding: '16px', background: '#FAFAFA', borderRadius: '10px', border: '1px solid #E5E7EB', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>Search Recommendations</label>
              <input type="text" placeholder="Search by name or location..." value={recommendSearchQuery} onChange={e => setRecommendSearchQuery(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
            </div>
          </div>
        )}

        <div className="recommend-cards-grid">
          {displayedItems.map((item) => {
            const propertyId = item._id || item.id;
            const isLiked = user && user.wishlist && user.wishlist.some(w => w._id === propertyId || w === propertyId);
            return (
              <div key={propertyId} className="recommend-property-card">
                <div className="recommend-card-img-wrap">
                  <img src={item.img} alt={item.name} />
                  <button className={`recommend-heart-circle ${isLiked ? 'liked' : ''}`} onClick={(e) => toggleWishlist(propertyId, e)}>
                    <Heart size={16} fill={isLiked ? '#EF4444' : 'none'} color={isLiked ? '#EF4444' : '#111827'} />
                  </button>
                </div>
                <div className="recommend-card-info-col">
                  <h4 className="recommend-card-name-text">{item.name}</h4>
                  <div className="recommend-card-location-row"><span>{item.location}</span><MapPin size={13} color="#9CA3AF" /></div>
                  <div className="recommend-specs-2x2-grid">
                    <div className="recommend-spec-pill"><img src={areaIcon} alt="Area" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Area Size: 300 sq. ft.</span></div>
                    <div className="recommend-spec-pill"><img src={bedIcon} alt="Beds" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Beds: 2 Beds</span></div>
                    <div className="recommend-spec-pill"><img src={roomIcon} alt="Rooms" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Rooms: 1 Room</span></div>
                    <div className="recommend-spec-pill"><img src={guestIcon} alt="Guests" style={{ width: '14px', height: '14px', objectFit: 'contain' }} /><span>Guests: 3 Person</span></div>
                  </div>
                  <div className="recommend-price-tag-row">
                    <span className="price-label">Starting from </span>
                    <span className="price-green-bold">₹{Number(String(item.price).replace(/[^\d]/g, '')).toLocaleString('en-IN')}/night</span>
                  </div>
                  <div className="recommend-actions-row">
                    <button className="recommend-details-btn-blue" onClick={() => { setSelectedProperty({ title: item.name, location: item.location, price: `₹${Number(String(item.price).replace(/[^\d]/g, '')).toLocaleString('en-IN')}`, img: item.img, images: [item.img] }); setActiveMenu('Detail'); }}>View Details</button>
                    <button className="recommend-contact-btn-green" onClick={() => alert(`Connecting with the owner of "${item.name}"...`)}>Contact Owner</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length > 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                padding: '12px 32px',
                backgroundColor: '#58A429',
                border: 'none',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontFamily: 'sans-serif',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#38A169'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#58A429'}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {showAll ? 'Show Less' : 'View All'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
