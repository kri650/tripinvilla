import { Heart, Inbox, MapPin, MessageSquare, User } from 'lucide-react';
import { areaIcon, bedIcon, filterIcon, guestIcon, roomIcon, wishlistHeroImg } from '../../../assets';
import './WishlistTab.css';

export default function WishlistTab(props) {
  const {
    token, user, setActiveMenu, openLoginModal,
    isWishlistFilterOpen, setIsWishlistFilterOpen,
    wishlistSearchQuery, setWishlistSearchQuery,
    wishlistSortOption, setWishlistSortOption,
    mapDbProperties, API_BASE, fetchProfileAndEnquiries,
    setAuthMode, setAuthModalOpen,
    setSelectedProperty, setContactStep, setContactModalOpen,
  } = props;

  const wishlistProps = user && user.wishlist ? mapDbProperties(user.wishlist, []) : [];
  const filtered = wishlistProps.filter(villa => {
    const matchesSearch = !wishlistSearchQuery ||
      (villa.title && villa.title.toLowerCase().includes(wishlistSearchQuery.toLowerCase())) ||
      (villa.location && villa.location.toLowerCase().includes(wishlistSearchQuery.toLowerCase()));
    return matchesSearch;
  });
  if (wishlistSortOption === 'price-low-high') filtered.sort((a, b) => a.price - b.price);
  else if (wishlistSortOption === 'price-high-low') filtered.sort((a, b) => b.price - a.price);
  else if (wishlistSortOption === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  return (
    <div className="account-dashboard-wrapper fade-in">
      <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${wishlistHeroImg}")` }}>
        <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>My Wishlist</h1>
      </div>

      <div className="dashboard-content-box">
        <div className="wishlist-title-header-row">
          <h2 className="dashboard-section-main">Wishlist</h2>
          <button className="btn-wishlist-filter" onClick={() => setIsWishlistFilterOpen(!isWishlistFilterOpen)}>
            <img src={filterIcon} alt="Filter" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <span>Filters</span>
          </button>
        </div>
        <p className="dashboard-section-sub">Keep track of destinations and villas you love.</p>

        {isWishlistFilterOpen && (
          <div className="filter-panel-box" style={{ display: 'flex', gap: '16px', margin: '16px 0', padding: '16px', background: '#FAFAFA', borderRadius: '10px', border: '1px solid #E5E7EB', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>Search Stays</label>
              <input type="text" placeholder="Search by villa name or location..." value={wishlistSearchQuery} onChange={e => setWishlistSearchQuery(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
            </div>
            <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>Sort By</label>
              <select value={wishlistSortOption} onChange={e => setWishlistSortOption(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff' }}>
                <option value="All">Default (Saved Date)</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Guest Rating</option>
              </select>
            </div>
          </div>
        )}

        <div className="dashboard-capsule-nav">
          <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Profile'); }}><User size={15} /><span>My Account</span></button>
          <button className="capsule-btn active" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Wishlist'); }}><Heart size={15} /><span>Wishlist</span></button>
          <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Enquiries'); }}><Inbox size={15} /><span>My Enquiries</span></button>
          <button className="capsule-btn" onClick={() => setActiveMenu('Reviews')}><MessageSquare size={15} /><span>My Reviews</span></button>
        </div>

        <div className="villas-grid" style={{ marginTop: '40px' }}>
          {filtered.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6B7280' }}>Your wishlist is empty or no stays match your criteria.</p>
          ) : filtered.map((villa, idx) => {
            const isWishlisted = user && user.wishlist && user.wishlist.some(w => w._id === villa._id || w === villa._id);
            return (
              <div key={idx} className="recommend-property-card">
                <div className="recommend-card-img-wrap">
                  <img src={villa.img} alt={villa.title} />
                  <button className={`recommend-heart-circle ${isWishlisted ? 'liked' : ''}`} onClick={async (e) => {
                    e.stopPropagation();
                    if (!token) { setAuthMode('login'); setAuthModalOpen(true); return; }
                    try {
                      const res = await fetch(`${API_BASE}/users/wishlist/${villa._id}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
                      if (res.ok) fetchProfileAndEnquiries(token);
                    } catch (err) { console.error(err); }
                  }}>
                    <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : '#FFFFFF'} />
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
      </div>
    </div>
  );
}
