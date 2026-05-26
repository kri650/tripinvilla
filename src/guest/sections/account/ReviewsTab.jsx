import { Heart, Inbox, MapPin, MessageSquare, Star, User } from 'lucide-react';
import { filterIcon, reviewsHeroImg } from '../../../assets';
import './ReviewsTab.css';

export default function ReviewsTab(props) {
  const {
    token, setActiveMenu, openLoginModal,
    isReviewsFilterOpen, setIsReviewsFilterOpen,
    reviewsRatingFilter, setReviewsRatingFilter,
    userReviews,
  } = props;

  const filtered = (userReviews || []).filter(r =>
    reviewsRatingFilter === 'All' || r.rating.toString() === reviewsRatingFilter
  );

  return (
    <div className="account-dashboard-wrapper fade-in">
      <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${reviewsHeroImg}")` }}>
        <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>My Reviews</h1>
      </div>

      <div className="dashboard-content-box">
        <div className="wishlist-title-header-row">
          <h2 className="dashboard-section-main">My Reviews</h2>
          <button className="btn-wishlist-filter" onClick={() => setIsReviewsFilterOpen(!isReviewsFilterOpen)}>
            <img src={filterIcon} alt="Filter" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <span>Filters</span>
          </button>
        </div>
        <p className="dashboard-section-sub">Manage your review details from here</p>

        {isReviewsFilterOpen && (
          <div className="filter-panel-box" style={{ display: 'flex', gap: '16px', margin: '16px 0', padding: '16px', background: '#FAFAFA', borderRadius: '10px', border: '1px solid #E5E7EB', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>Filter by Rating</label>
              <select value={reviewsRatingFilter} onChange={e => setReviewsRatingFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff', width: '200px' }}>
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        )}

        <div className="dashboard-capsule-nav">
          <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Profile'); }}><User size={15} /><span>My Account</span></button>
          <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Wishlist'); }}><Heart size={15} /><span>Wishlist</span></button>
          <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Enquiries'); }}><Inbox size={15} /><span>My Enquiries</span></button>
          <button className="capsule-btn active" onClick={() => setActiveMenu('Reviews')}><MessageSquare size={15} /><span>My Reviews</span></button>
        </div>

        <div className="dashboard-list-items-stack">
          {!userReviews || userReviews.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>You haven't posted any reviews yet.</p>
          ) : filtered.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>No reviews found matching this criteria.</p>
          ) : filtered.map((r, index) => (
            <div key={index} className="dashboard-list-card" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
              <div className="list-card-img-wrap"><img src={r.img} alt={r.title} /></div>
              <div className="list-card-details" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="list-card-title">{r.title}</h3>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map(num => (
                      <Star key={num} size={14} fill={num <= r.rating ? '#F59E0B' : 'none'} color={num <= r.rating ? '#F59E0B' : '#D1D5DB'} />
                    ))}
                  </div>
                </div>
                <div className="list-card-location"><MapPin size={13} color="#9CA3AF" /><span>{r.location}</span></div>
                <p className="list-card-question" style={{ marginTop: '8px', color: '#4B5563', fontStyle: 'italic' }}>"{r.reviewText}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
