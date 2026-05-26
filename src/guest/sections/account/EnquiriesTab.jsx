import { Heart, Inbox, MapPin, MessageSquare, User } from 'lucide-react';
import { enquiriesHeroImg, filterIcon } from '../../../assets';
import './EnquiriesTab.css';

export default function EnquiriesTab(props) {
  const {
    token, setActiveMenu, openLoginModal,
    isEnquiryFilterOpen, setIsEnquiryFilterOpen,
    enquirySearchQuery, setEnquirySearchQuery,
    enquiryStatusFilter, setEnquiryStatusFilter,
    liveEnquiries,
  } = props;

  const filtered = (liveEnquiries || []).filter(e => {
    const matchesStatus = enquiryStatusFilter === 'All' || e.status === enquiryStatusFilter;
    const matchesSearch = !enquirySearchQuery ||
      (e.propertyName && e.propertyName.toLowerCase().includes(enquirySearchQuery.toLowerCase())) ||
      (e.message && e.message.toLowerCase().includes(enquirySearchQuery.toLowerCase())) ||
      (e.query && e.query.toLowerCase().includes(enquirySearchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="account-dashboard-wrapper fade-in">
      <div className="dashboard-hero-banner" style={{ backgroundImage: `url("${enquiriesHeroImg}")` }}>
        <h1 className="dashboard-hero-title" style={{ marginTop: '170px' }}>My Enquiries</h1>
      </div>

      <div className="dashboard-content-box">
        <div className="wishlist-title-header-row">
          <h2 className="dashboard-section-main">My Enquiries</h2>
          <button className="btn-wishlist-filter" onClick={() => setIsEnquiryFilterOpen(!isEnquiryFilterOpen)}>
            <img src={filterIcon} alt="Filter" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <span>Filters</span>
          </button>
        </div>
        <p className="dashboard-section-sub">Manage your enquiries details from here</p>

        {isEnquiryFilterOpen && (
          <div className="filter-panel-box" style={{ display: 'flex', gap: '16px', margin: '16px 0', padding: '16px', background: '#FAFAFA', borderRadius: '10px', border: '1px solid #E5E7EB', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>Search Enquiries</label>
              <input type="text" placeholder="Search by villa name or message..." value={enquirySearchQuery} onChange={e => setEnquirySearchQuery(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
            </div>
            <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}>Status Filter</label>
              <select value={enquiryStatusFilter} onChange={e => setEnquiryStatusFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff' }}>
                <option value="All">All Enquiries</option>
                <option value="Open">Open</option>
                <option value="Replied">Replied</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        )}

        <div className="dashboard-capsule-nav">
          <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Profile'); }}><User size={15} /><span>My Account</span></button>
          <button className="capsule-btn" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Wishlist'); }}><Heart size={15} /><span>Wishlist</span></button>
          <button className="capsule-btn active" onClick={() => { if (!token) { openLoginModal(); return; } setActiveMenu('Enquiries'); }}><Inbox size={15} /><span>My Enquiries</span></button>
          <button className="capsule-btn" onClick={() => setActiveMenu('Reviews')}><MessageSquare size={15} /><span>My Reviews</span></button>
        </div>

        <div className="dashboard-list-items-stack">
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>No enquiries match your criteria.</p>
          ) : filtered.map((e, index) => {
            const enq = {
              title: e.propertyName || 'Property Enquiry',
              location: e.phone ? `Phone: ${e.phone}` : 'Tripinvilla Inquiry Desk',
              enquiryText: e.message || e.query,
              status: e.status || 'Open',
              reply: e.reply,
              img: (e.property_id && e.property_id.images && e.property_id.images[0]) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80'
            };
            return (
              <div key={index} className="dashboard-list-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div className="list-card-img-wrap"><img src={enq.img} alt={enq.title} /></div>
                  <div className="list-card-details" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 className="list-card-title">{enq.title}</h3>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, backgroundColor: enq.status === 'Replied' ? '#D1FAE5' : enq.status === 'Closed' ? '#F3F4F6' : '#FEF3C7', color: enq.status === 'Replied' ? '#065F46' : enq.status === 'Closed' ? '#374151' : '#92400E' }}>{enq.status}</span>
                    </div>
                    <div className="list-card-location"><MapPin size={13} color="#9CA3AF" /><span>{enq.location}</span></div>
                    <p className="list-card-question">"{enq.enquiryText}"</p>
                  </div>
                </div>
                {enq.reply && (
                  <div style={{ marginLeft: '140px', padding: '12px 16px', background: '#F9FAFB', borderRadius: '8px', borderLeft: '3px solid #58A429' }}>
                    <strong style={{ fontSize: '12px', color: '#374151', display: 'block', marginBottom: '4px' }}>Host Reply:</strong>
                    <p style={{ margin: 0, fontSize: '13px', color: '#4B5563', fontStyle: 'italic' }}>"{enq.reply}"</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
