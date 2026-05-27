import { useState, useEffect } from 'react';
import { ChevronDown, Edit2, Trash2, MoreVertical, Calendar, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OffersbyDate() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/offers`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setOffers(data);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/offers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) fetchOffers();
    } catch (err) {
      console.error('Error deleting offer:', err);
    }
  };

  const filteredOffers = offers.filter(o => {
    const matchQuery = !searchQuery ? true : (
      (o.propertyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.offerId || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchCat = selectedCategory ? o.category === selectedCategory : true;
    const matchLoc = filterLocation ? (o.location || '').toLowerCase().includes(filterLocation.toLowerCase()) : true;
    
    let matchDate = true;
    if (dateFrom || dateTo) {
      const od = new Date(o.offer_date || o.createdAt || o.dateFrom || o.datesAndTime);
      od.setHours(0,0,0,0);
      if (dateFrom) {
        const fd = new Date(dateFrom);
        fd.setHours(0,0,0,0);
        if (od < fd) matchDate = false;
      }
      if (dateTo) {
        const td = new Date(dateTo);
        td.setHours(0,0,0,0);
        if (od > td) matchDate = false;
      }
    }

    return matchQuery && matchCat && matchLoc && matchDate;
  });

  return (
    <div className="fade-in">
      {/* Breadcrumb & Action */}
      <div className="props-breadcrumb" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 39px 12px' }}>
        <div>
          Property Management &gt; <span>Offers by Date</span>
        </div>
        <button className="btn-solid-green" onClick={() => navigate('/admin/properties/offers/add')} style={{ cursor: 'pointer' }}>Add Offer</button>
      </div>

      {/* Toolbar & Table Section */}
      <div className="dash-section" style={{ 
        borderRadius: '18px', 
        border: '1px solid #EFF6E6',
        padding: '24px',
        boxSizing: 'border-box',
        marginTop: 0,
        marginBottom: '24px',
        background: '#FAFDF2'
      }}>
        <div style={{ 
          border: '1px solid #EFF6E6', 
          borderRadius: '16px', 
          padding: '32px',
          background: '#ffffff',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div className="props-table-toolbar" style={{ margin: 0, borderBottom: 'none', padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="props-table-title" style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: '"Outfit", sans-serif' }}>Offers by Date</div>
            
            <div className="props-table-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div className="props-filter-select" style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', background: '#ffffff' }}>
                <Calendar size={13} style={{ color: '#6B7280' }} />
                <input 
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontSize: 13, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' }}
                />
              </div>

              <div className="props-filter-select" style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', background: '#ffffff' }}>
                <Calendar size={13} style={{ color: '#6B7280' }} />
                <input 
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontSize: 13, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' }}
                />
              </div>

              <div className="props-filter-select" style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', background: '#ffffff' }}>
                <select 
                  value={selectedCategory} 
                  onChange={e => setSelectedCategory(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontSize: 13, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' }}
                >
                  <option value="">Property Type</option>
                  <option value="Villa">Villa</option>
                  <option value="Homestay">Homestay</option>
                  <option value="Resort">Resort</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Hotel">Hotel</option>
                </select>
              </div>

              <div className="props-filter-select" style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', background: '#ffffff', width: 140 }}>
                <input 
                  type="text"
                  placeholder="Location"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontSize: 13, fontFamily: '"Outfit", sans-serif', width: '100%' }}
                />
              </div>

              <button className="props-btn-filter" onClick={fetchOffers} style={{ cursor: 'pointer', border: '1px solid #58A429', background: '#fff', color: '#58A429', padding: '6px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                <Filter size={13} /> Filter
              </button>

              <div className="props-search-wrap" style={{ width: 240, margin: 0, border: '1px solid #E5E7EB', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px' }}>
                <Search size={14} style={{ color: '#9CA3AF' }} />
                <input 
                  type="text" 
                  placeholder="Search properties..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchOffers()}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: 13 }}
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, padding: '12px 14px', fontSize: '12px' }}>Offer ID <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, padding: '12px 14px', fontSize: '12px' }}>Dates &amp; <br/>Time <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, padding: '12px 14px', fontSize: '12px' }}>Property <br/>Name <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, padding: '12px 14px', fontSize: '12px' }}>Location <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, padding: '12px 14px', fontSize: '12px' }}>Category <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, padding: '12px 14px', fontSize: '12px' }}>Room <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, padding: '12px 14px', fontSize: '12px' }}>Foods <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, padding: '12px 14px', fontSize: '12px' }}>Amenities <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, padding: '12px 14px', fontSize: '12px' }}>Offer <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, padding: '12px 14px', fontSize: '12px' }}>Description <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, padding: '12px 14px', fontSize: '12px' }}>Status <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="12" style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>Loading offers...</td></tr>
                ) : filteredOffers.length === 0 ? (
                  <tr><td colSpan="12" style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>No offers found</td></tr>
                ) : (
                  filteredOffers.map((o, i) => (
                    <tr key={o._id || i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ color: '#58A429', fontWeight: 600, padding: '14px' }}>{o.offerId || `OFF-700${1+i}`}</td>
                      <td style={{ color: '#9CA3AF', padding: '14px', whiteSpace: 'pre-line', lineHeight: 1.4, fontSize: 13 }}>{o.datesAndTime}</td>
                      <td style={{ color: '#111827', fontWeight: 500, padding: '14px' }}>{o.propertyName}</td>
                      <td style={{ color: '#9CA3AF', padding: '14px', whiteSpace: 'pre-line', lineHeight: 1.4, fontSize: 13 }}>{o.location}</td>
                      <td style={{ padding: '14px' }}><span className="category-pill">{o.category}</span></td>
                      <td style={{ color: '#9CA3AF', padding: '14px', whiteSpace: 'pre-line', lineHeight: 1.4, fontSize: 13 }}>{o.room}</td>
                      <td style={{ color: '#6B7280', padding: '14px' }}>{o.foods}</td>
                      <td style={{ color: '#6B7280', padding: '14px' }}>{Array.isArray(o.amenities) ? o.amenities.join(', ') : o.amenities}</td>
                      <td style={{ color: '#111827', fontWeight: 600, padding: '14px' }}>
                        {(() => {
                          const val = o.offerPercent || o.offer || '20% Off';
                          const str = String(val).trim();
                          if (/off/i.test(str)) return str;
                          if (str.endsWith('%')) return `${str} Off`;
                          return `${str}% Off`;
                        })()}
                      </td>
                      <td style={{ color: '#9CA3AF', padding: '14px', whiteSpace: 'pre-line', lineHeight: 1.4, fontSize: 13 }}>{o.description}</td>
                      <td style={{ padding: '14px' }}>
                        {o.status === 'Active' ? (
                          <span className="status-pill active">{o.status}</span>
                        ) : (
                          <span className="status-pill inactive">{o.status}</span>
                        )}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => handleDelete(o._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Trash2 size={15} strokeWidth={2} /></button>
                          <button className="action-dots"><MoreVertical size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
