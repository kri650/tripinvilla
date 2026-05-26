import { Heart, MapPin } from 'lucide-react';
import { areaIcon, bedIcon, filterIcon, guestIcon, recommendHeroImg, roomIcon } from '../../../assets';
import './RecommendPage.css';

const RECOMMENDED_ITEMS = [
  { id: 0, name: 'Aparahotel Stare Miasto', location: 'Kasol, Himachal Pradesh, India', price: '140', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80' },
  { id: 1, name: 'Elysian Alpine Retreat', location: 'Manali, Himachal Pradesh, India', price: '140', img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Stellar Ridge Villa', location: 'Shimla, Himachal Pradesh, India', price: '140', img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Grand Castle Heritage Homestay', location: 'Kasol, Himachal Pradesh, India', price: '140', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Infinity Blue Ocean Villa', location: 'Goa Beachsides, India', price: '140', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80' },
  { id: 5, name: 'Cloud-Nine Horizon Cottage', location: 'Munnar Hills, Kerala, India', price: '140', img: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=600&q=80' },
];

export default function RecommendPage(props) {
  const { setSelectedProperty, setActiveMenu, isRecommendFilterOpen, setIsRecommendFilterOpen, recommendSearchQuery, setRecommendSearchQuery, recWishlist, setRecWishlist } = props;

  const filtered = RECOMMENDED_ITEMS.filter(item =>
    !recommendSearchQuery ||
    item.name.toLowerCase().includes(recommendSearchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(recommendSearchQuery.toLowerCase())
  );

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
          {filtered.map((item) => {
            const isLiked = recWishlist.includes(item.id);
            return (
              <div key={item.id} className="recommend-property-card">
                <div className="recommend-card-img-wrap">
                  <img src={item.img} alt={item.name} />
                  <button className={`recommend-heart-circle ${isLiked ? 'liked' : ''}`} onClick={(e) => { e.stopPropagation(); setRecWishlist(isLiked ? recWishlist.filter(id => id !== item.id) : [...recWishlist, item.id]); }}>
                    <Heart size={16} fill={isLiked ? '#EF4444' : 'none'} color={isLiked ? '#EF4444' : '#FFFFFF'} />
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
                    <span className="price-green-bold">₹{item.price}/night</span>
                  </div>
                  <div className="recommend-actions-row">
                    <button className="recommend-details-btn-blue" onClick={() => { setSelectedProperty({ title: item.name, location: item.location, price: `₹${item.price}`, img: item.img, images: [item.img] }); setActiveMenu('Detail'); }}>View Details</button>
                    <button className="recommend-contact-btn-green" onClick={() => alert(`Connecting with the owner of "${item.name}"...`)}>Contact Owner</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
