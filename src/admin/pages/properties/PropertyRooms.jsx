import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, ClipboardList, Clock, CheckCircle2, Search, Filter, Edit2, Trash2, MoreVertical, Check, X, Eye } from 'lucide-react';

export default function PropertyRooms() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ totalProperties: 1540, pendingRequests: 224, rejectedRequests: 100 });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const getAuthHeaders = (method = 'GET') => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/property-requests', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data && data.requests) {
        setRequests(data.requests);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching property requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/property-requests/${id}/accept`, {
        method: 'PUT',
        headers: getAuthHeaders('PUT')
      });
      if (res.ok) {
        fetchRequests();
        if (selectedRequest && selectedRequest._id === id) {
          setSelectedRequest(prev => ({ ...prev, status: 'Accepted' }));
        }
      }
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/property-requests/${id}/reject`, {
        method: 'PUT',
        headers: getAuthHeaders('PUT')
      });
      if (res.ok) {
        fetchRequests();
        if (selectedRequest && selectedRequest._id === id) {
          setSelectedRequest(prev => ({ ...prev, status: 'Rejected' }));
        }
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property request?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/property-requests/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders('DELETE')
      });
      if (res.ok) fetchRequests();
    } catch (err) {
      console.error('Error deleting request:', err);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchQuery = !searchQuery ? true : (
      (r.propertyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.ownerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.requestNo || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchCat = selectedCategory ? r.category === selectedCategory : true;
    
    let requestStatus = r.status || 'NotAccepted';
    if (requestStatus === 'NotAccepted') requestStatus = 'Pending';
    const matchStatus = selectedStatus ? requestStatus === selectedStatus : true;
    
    const matchLocation = !filterLocation ? true : (r.location || '').toLowerCase().includes(filterLocation.toLowerCase());
    
    let matchesDate = true;
    if (r.createdAt) {
      const rDate = new Date(r.createdAt);
      rDate.setHours(0,0,0,0);
      
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        fromDate.setHours(0,0,0,0);
        if (rDate < fromDate) matchesDate = false;
      }
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(0,0,0,0);
        if (rDate > toDate) matchesDate = false;
      }
    } else if (filterDateFrom || filterDateTo) {
      matchesDate = false;
    }
    
    return matchQuery && matchCat && matchStatus && matchLocation && matchesDate;
  });

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Property Management &gt; <span>Property Requests</span>
      </div>

      {/* Stats Section */}
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
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid #EFF6E6',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div className="props-stat-card" style={{ margin: 0, borderRadius: 12 }}>
              <div className="props-stat-icon-wrap blue"><ClipboardList strokeWidth={2.5} /></div>
              <div className="props-stat-content">
                <div className="props-stat-label">Total Properties</div>
                <div className="props-stat-value">{stats.totalProperties}</div>
              </div>
            </div>
            <div className="props-stat-card" style={{ margin: 0, borderRadius: 12 }}>
              <div className="props-stat-icon-wrap green"><Clock strokeWidth={2.5} /></div>
              <div className="props-stat-content">
                <div className="props-stat-label">Property Request</div>
                <div className="props-stat-value">{stats.pendingRequests}</div>
              </div>
            </div>
            <div className="props-stat-card" style={{ margin: 0, borderRadius: 12 }}>
              <div className="props-stat-icon-wrap red"><CheckCircle2 strokeWidth={2.5} /></div>
              <div className="props-stat-content">
                <div className="props-stat-label">Rejected</div>
                <div className="props-stat-value">{stats.rejectedRequests}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
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
          <div className="props-table-toolbar" style={{ margin: 0, borderBottom: 'none', padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div className="props-table-title" style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: '"Outfit", sans-serif' }}>Property Requests</div>
            
            <div className="props-table-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Date From */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', background: '#ffffff' }}>
                <Calendar size={13} style={{ color: '#6B7280' }} />
                <input 
                  type="date"
                  value={filterDateFrom}
                  onChange={e => setFilterDateFrom(e.target.value)}
                  style={{ border: 'none', outline: 'none', color: '#374151', fontSize: '13px', fontFamily: '"Outfit", sans-serif', width: '105px', cursor: 'pointer' }}
                />
              </div>

              {/* Date To */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', background: '#ffffff' }}>
                <Calendar size={13} style={{ color: '#6B7280' }} />
                <input 
                  type="date"
                  value={filterDateTo}
                  onChange={e => setFilterDateTo(e.target.value)}
                  style={{ border: 'none', outline: 'none', color: '#374151', fontSize: '13px', fontFamily: '"Outfit", sans-serif', width: '105px', cursor: 'pointer' }}
                />
              </div>

              {/* Property Type Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', background: '#ffffff' }}>
                <select 
                  value={selectedCategory} 
                  onChange={e => setSelectedCategory(e.target.value)}
                  style={{ border: 'none', outline: 'none', color: '#6B7280', fontSize: '13px', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', background: 'transparent' }}
                >
                  <option value="">Property Type</option>
                  <option value="Villa">Villa</option>
                  <option value="Homestay">Homestay</option>
                  <option value="Resort">Resort</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Hotel">Hotel</option>
                </select>
              </div>

              {/* Location Input */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', background: '#ffffff' }}>
                <input 
                  type="text" 
                  placeholder="Location" 
                  value={filterLocation}
                  onChange={e => setFilterLocation(e.target.value)}
                  style={{ border: 'none', outline: 'none', color: '#374151', fontSize: '13px', fontFamily: '"Outfit", sans-serif', width: '100px' }}
                />
              </div>

              {/* Clear Filter / Filter Button */}
              <button 
                onClick={() => {
                  setFilterDateFrom('');
                  setFilterDateTo('');
                  setSelectedCategory('');
                  setFilterLocation('');
                  setSearchQuery('');
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  border: '1px solid #58A429', 
                  borderRadius: '8px', 
                  padding: '6px 16px', 
                  background: '#ffffff', 
                  color: '#58A429', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  fontFamily: '"Outfit", sans-serif',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#FAFDF2'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#ffffff'; }}
              >
                <Filter size={13} style={{ color: '#58A429' }} />
                <span>Filter</span>
              </button>

              {/* Search input with search icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', background: '#ffffff', width: '160px' }}>
                <Search size={13} style={{ color: '#9CA3AF' }} />
                <input 
                  type="text" 
                  placeholder="Search" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', color: '#374151', fontSize: '13px', fontFamily: '"Outfit", sans-serif', width: '100%' }}
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  {['Request No','Image','Property Name','Location','Category','Owner Name','Owner Contact','Price by Owner','Status','Actions'].map((h, i) => (
                    <th key={i} style={{ color: '#9CA3AF', fontWeight: 500, padding: '12px 14px', fontSize: '12px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="10" style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>Loading requests...</td></tr>
                ) : filteredRequests.length === 0 ? (
                  <tr><td colSpan="10" style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>No requests found</td></tr>
                ) : (
                  filteredRequests.map((p, i) => (
                    <tr key={p._id || i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ color: '#58A429', fontWeight: 600, padding: '14px', cursor: 'pointer' }} onClick={() => setSelectedRequest(p)}>{p.requestNo || `REQ-${3000 + i}`}</td>
                      <td onClick={() => setSelectedRequest(p)} style={{ cursor: 'pointer', padding: '14px' }}>
                        <div style={{ width: 40, height: 30, background: '#E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                          <img src={p.image || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=100&q=80"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        </div>
                      </td>
                      <td style={{ color: '#111827', fontWeight: 500, padding: '14px', cursor: 'pointer' }} onClick={() => setSelectedRequest(p)}>{p.propertyName}</td>
                      <td style={{ color: '#6B7280', padding: '14px', whiteSpace: 'pre-line', lineHeight: 1.4 }}>{p.location}</td>
                      <td style={{ padding: '14px' }}><span className="category-pill">{p.category}</span></td>
                      <td style={{ color: '#6B7280', padding: '14px' }}>{p.ownerName}</td>
                      <td style={{ color: '#6B7280', padding: '14px' }}>{p.ownerContact}</td>
                      <td style={{ color: '#111827', fontWeight: 600, padding: '14px' }}>{typeof p.priceByOwner === 'number' ? `₹${p.priceByOwner.toLocaleString()}` : `₹${p.priceByOwner}`}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', 
                          background: p.status === 'Accepted' ? '#DCFCE7' : p.status === 'Rejected' ? '#FEE2E2' : '#FEF3C7', 
                          color: p.status === 'Accepted' ? '#16A34A' : p.status === 'Rejected' ? '#EF4444' : '#D97706', 
                          borderRadius: 20, fontSize: 12, fontWeight: 600 
                        }}>
                          {p.status || 'NotAccepted'}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => setSelectedRequest(p)} title="View Details" style={{ color: '#2563EB', background: '#DBEAFE', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}>
                            <Eye size={15} strokeWidth={2.5} />
                          </button>
                          {p.status !== 'Accepted' && (
                            <button onClick={() => handleAccept(p._id)} title="Accept Request" style={{ color: '#16A34A', background: '#DCFCE7', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}>
                              <Check size={15} strokeWidth={2.5} />
                            </button>
                          )}
                          {p.status !== 'Rejected' && (
                            <button onClick={() => handleReject(p._id)} title="Reject Request" style={{ color: '#EF4444', background: '#FEE2E2', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}>
                              <X size={15} strokeWidth={2.5} />
                            </button>
                          )}
                          <button onClick={() => handleDelete(p._id)} title="Delete Request" style={{ color: '#6B7280', background: '#F3F4F6', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}>
                            <Trash2 size={15} strokeWidth={2} />
                          </button>
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

      {/* Requested Property Details Modal (Matches Screenshot 1 exactly) */}
      {selectedRequest && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 20, width: 860, maxWidth: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
            <button 
              onClick={() => setSelectedRequest(null)}
              style={{ position: 'absolute', top: 20, right: 20, background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E5E7EB', paddingBottom: 20, marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>Requested Property Details</h3>
                <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0 0' }}>The property details of requested property</p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button 
                  onClick={() => handleAccept(selectedRequest._id)}
                  style={{ background: '#58A429', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Check size={16} /> Accept Request
                </button>
                <button 
                  onClick={() => handleReject(selectedRequest._id)}
                  style={{ background: '#fff', color: '#EF4444', border: '1px solid #EF4444', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <X size={16} /> Reject
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 28, alignItems: 'flex-start' }}>
              <div style={{ width: '100%', height: 260, borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <img src={selectedRequest.image || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80"} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>{selectedRequest.propertyName || "Aparthotel Stare Miasto, Deluxe"}</h2>
                  <p style={{ fontSize: 13, color: '#58A429', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#58A429' }}></span>
                    {selectedRequest.location || "Kasol, Himachal Pradesh, India"}
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>About Property</h4>
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
                    {selectedRequest.about || "No description provided."}
                  </p>
                </div>

                <div style={{ paddingTop: 12, borderTop: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>Price By Owner</span>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#58A429', marginTop: 2 }}>
                    {typeof selectedRequest.priceByOwner === 'number' ? `₹${selectedRequest.priceByOwner.toLocaleString()}` : `₹${selectedRequest.priceByOwner || '1,400'}`}/night
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
