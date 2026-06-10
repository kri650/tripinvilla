import { toast } from 'react-hot-toast';
import ReadMore from '../../components/ReadMore';
import DateRangeDropdown from '../../../components/DateRangeDropdown';
import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, ClipboardList, Clock, CheckCircle2, Search, Filter, Edit2, Trash2, MoreVertical, Check, X, Eye, XCircle } from 'lucide-react';

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return `₹${amount.toLocaleString('en-IN')}`;
};

const firstPresent = (...values) => values.find((value) => value !== null && value !== undefined && value !== '');

const getDiscountText = (originalValue, priceValue, offers = []) => {
  const offerText = Array.isArray(offers) && offers.length > 0 ? offers.join(', ') : '';
  const original = Number(originalValue);
  const price = Number(priceValue);
  if (Number.isFinite(original) && Number.isFinite(price) && original > price) {
    const discountAmount = original - price;
    return offerText ? `${offerText} · Save ${formatCurrency(discountAmount)}` : `Save ${formatCurrency(discountAmount)}`;
  }
  return offerText || '—';
};

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // (fetching logic remains unchanged)
  // Let's assume line numbers align correctly from original file
  // We are replacing the top stats hero section in return block:
  // (We will use the replacement target range lines below)

  const getRequestRooms = (request) => {
    if (Array.isArray(request?.rooms) && request.rooms.length > 0) return request.rooms;
    return [request];
  };

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
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/property-requests`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/property-requests/${id}/accept`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/property-requests/${id}/reject`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/property-requests/${id}`, {
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

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Property Management &gt; <span>Property Requests</span>
      </div>

      {/* Stats Section */}
      <div
        className="dash-section"
        style={{
          minHeight: 162,
          boxSizing: "border-box",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <div className="props-stats-row">
          <div
            className="props-stat-card"
            style={{ margin: 0, borderRadius: 12 }}
          >
            <div className="props-stat-icon-wrap blue">
              <ClipboardList strokeWidth={2.5} />
            </div>
            <div className="props-stat-content">
              <div className="props-stat-label">Total Properties</div>
              <div className="props-stat-value">{stats.totalProperties}</div>
            </div>
          </div>
          <div
            className="props-stat-card"
            style={{ margin: 0, borderRadius: 12 }}
          >
            <div className="props-stat-icon-wrap green">
              <Clock strokeWidth={2.5} />
            </div>
            <div className="props-stat-content">
              <div className="props-stat-label">Property Request</div>
              <div className="props-stat-value">{stats.pendingRequests}</div>
            </div>
          </div>
          <div
            className="props-stat-card"
            style={{ margin: 0, borderRadius: 12 }}
          >
            <div className="props-stat-icon-wrap red">
              <XCircle strokeWidth={2.5} />
            </div>
            <div className="props-stat-content">
              <div className="props-stat-label">Rejected</div>
              <div className="props-stat-value">{stats.rejectedRequests}</div>
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
          <div className="props-table-toolbar" style={{ margin: 0, borderBottom: 'none', padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: '16px', minWidth: 0 }}>
            <div className="props-table-title" style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: '"Outfit", sans-serif', whiteSpace: 'nowrap', flexShrink: 0 }}>Property Requests</div>
            
            <div className="props-table-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap', minWidth: 0, overflowX: 'auto' }}>
              <div style={{ flexShrink: 0 }}>
                <DateRangeDropdown 
                  startDate={filterDateFrom}
                  endDate={filterDateTo}
                  onChange={(start, end) => {
                    setFilterDateFrom(start);
                    setFilterDateTo(end);
                  }}
                />
              </div>

              <div className="props-filter-select" style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', background: '#ffffff', flexShrink: 0, maxWidth: 140 }}>
                <select 
                  value={selectedCategory} 
                  onChange={e => setSelectedCategory(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontSize: 13, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', maxWidth: '100%' }}
                >
                  <option value="">Property Type</option>
                  <option value="Villa">Villa</option>
                  <option value="Homestay">Homestay</option>
                  <option value="Resort">Resort</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Hotel">Hotel</option>
                </select>
              </div>

              <div className="props-filter-select" style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', background: '#ffffff', width: 140, flexShrink: 0 }}>
                <input 
                  type="text"
                  placeholder="Location"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontSize: 13, fontFamily: '"Outfit", sans-serif', width: '100%' }}
                />
              </div>

              <div className="props-filter-select" style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', background: '#ffffff', flexShrink: 0, maxWidth: 140 }}>
                <select 
                  value={selectedStatus} 
                  onChange={e => setSelectedStatus(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontSize: 13, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', maxWidth: '100%' }}
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <button 
                className="props-btn-filter" 
                onClick={fetchRequests} 
                style={{ cursor: 'pointer', border: '1px solid #58A429', background: '#fff', color: '#58A429', padding: '6px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}
              >
                <Filter size={13} /> Filter
              </button>

              <div className="admin-flex-search-wrap" style={{ minWidth: 80, maxWidth: 240, margin: 0, border: '1px solid #E5E7EB', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', flexShrink: 1 }}>
                <Search size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                <input 
                  type="text" 
                  placeholder="Search properties..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchRequests()}
                  style={{ border: 'none', outline: 'none', width: '100%', minWidth: 0, padding: 0, fontSize: 13 }}
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto', width: '100%', flex: 1, minHeight: 'min-content' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  {['Request No','Image','Property Name','Location','Category','Rooms','Owner Name','Owner Contact','Price by Owner','Status','Actions'].map((h, i) => (
                    <th key={i} style={{ minWidth: { 'Offer ID': 100, 'Property No': 100, 'Enquiry No': 100, 'Owner No': 100, 'Booking ID': 100, 'Request No': 100, 'Date & Time': 150, 'Dates & Time': 150, 'Check In': 150, 'Check Out': 150, 'Property Name': 200, 'Location': 180, 'Category': 100, 'Room Type': 130, 'Room': 130, 'Foods': 100, 'Amenities': 180, 'Amenities Types': 180, 'Offer %': 100, 'Offer': 100, 'Description': 180, 'Status': 100 }[h], color: '#9CA3AF', fontWeight: 500, padding: '12px 14px', fontSize: '12px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="11" style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>Loading requests...</td></tr>
                ) : paginatedRequests.length === 0 ? (
                  <tr><td colSpan="11" style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>No requests found</td></tr>
                ) : (
                  paginatedRequests.map((p, i) => (
                    <tr key={p._id || i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ color: '#58A429', fontWeight: 600, padding: '14px', cursor: 'pointer' }} onClick={() => { setSelectedRequest(p); setTimeout(() => document.getElementById('request-detail-div')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>{p.requestNo || `REQ-${3000 + i}`}</td>
                      <td onClick={() => { setSelectedRequest(p); setTimeout(() => document.getElementById('request-detail-div')?.scrollIntoView({ behavior: 'smooth' }), 100); }} style={{ cursor: 'pointer', padding: '14px' }}>
                        <div style={{ width: 40, height: 30, background: '#E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                          <img src={p.image || p.room_image_url || (p.room_images && p.room_images[0]) || (p.images && p.images[0]) || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=100&q=80"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        </div>
                      </td>
                      <td style={{ color: '#111827', fontWeight: 500, padding: '14px', cursor: 'pointer' }} onClick={() => { setSelectedRequest(p); setTimeout(() => document.getElementById('request-detail-div')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>{p.propertyName}</td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ maxWidth: 220, whiteSpace: 'normal', lineHeight: 1.4, color: '#6B7280' }}>
                          <ReadMore maxWords={6}>{p.location}</ReadMore>
                        </div>
                      </td>
                      <td style={{ padding: '14px' }}><span className="category-pill">{p.category}</span></td>
                      <td style={{ color: '#374151', padding: '14px', fontWeight: 500 }}>
                        {getRequestRooms(p).length > 1
                          ? `${getRequestRooms(p).length} Rooms`
                          : (p.room_type || '1 Room')}
                      </td>
                      <td style={{ color: '#6B7280', padding: '14px' }}>{p.ownerName}</td>
                      <td style={{ color: '#6B7280', padding: '14px' }}>{p.ownerContact}</td>
                      <td style={{ color: '#111827', fontWeight: 600, padding: '14px' }}>{formatCurrency(p.priceByOwner)}</td>
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
                          <button onClick={() => {
                            setSelectedRequest(p);
                            setTimeout(() => document.getElementById('request-detail-div')?.scrollIntoView({ behavior: 'smooth' }), 100);
                            toast.success('Viewing Details');
                          }} title="View Details" style={{ color: '#2563EB', background: '#DBEAFE', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}>
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

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)}
                style={{ padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', background: currentPage === 1 ? '#F3F4F6' : '#fff', color: currentPage === 1 ? '#9CA3AF' : '#374151', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', background: currentPage === idx + 1 ? '#58A429' : '#F3F4F6', color: currentPage === idx + 1 ? '#fff' : '#374151', cursor: 'pointer', fontWeight: 600 }}
                >
                  {idx + 1}
                </button>
              ))}
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)}
                style={{ padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', background: currentPage === totalPages ? '#F3F4F6' : '#fff', color: currentPage === totalPages ? '#9CA3AF' : '#374151', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Requested Property Details Inline */}
      {selectedRequest && (
        <div id="request-detail-div" style={{ position: 'relative', width: '100%', background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginTop: '24px', padding: 32, boxSizing: 'border-box' }}>
            <button 
              onClick={() => setSelectedRequest(null)}
              style={{ position: 'absolute', top: 20, right: 20, background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', cursor: 'pointer', zIndex: 10 }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E5E7EB', paddingBottom: 20, marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>Requested Property Details</h3>
                <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0 0' }}>
                  Request: {selectedRequest.requestNo} · {getRequestRooms(selectedRequest).length} room{getRequestRooms(selectedRequest).length > 1 ? 's' : ''}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {selectedRequest.status !== 'Accepted' && (
                  <button 
                    onClick={() => handleAccept(selectedRequest._id)}
                    style={{ background: '#58A429', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Check size={16} /> Accept Request
                  </button>
                )}
                {selectedRequest.status !== 'Rejected' && (
                  <button 
                    onClick={() => handleReject(selectedRequest._id)}
                    style={{ background: '#fff', color: '#EF4444', border: '1px solid #EF4444', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <X size={16} /> Reject
                  </button>
                )}
              </div>
            </div>

            {/* Property Name & Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>{selectedRequest.propertyName || 'Property'}</h2>
                <p style={{ fontSize: 13, color: '#58A429', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#58A429' }}></span>
                  <span>{selectedRequest.location || 'Location N/A'}</span>
                  {selectedRequest.category && (
                    <>
                      <span style={{ color: '#9CA3AF' }}>•</span>
                      <span style={{ color: '#4B5563', fontWeight: 600 }}>{selectedRequest.category}</span>
                    </>
                  )}
                </p>
              </div>
              <span style={{
                padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: selectedRequest.status === 'Accepted' ? '#DCFCE7' : selectedRequest.status === 'Rejected' ? '#FEE2E2' : '#FEF3C7',
                color: selectedRequest.status === 'Accepted' ? '#16A34A' : selectedRequest.status === 'Rejected' ? '#EF4444' : '#D97706'
              }}>
                {selectedRequest.status || 'Pending'}
              </span>
            </div>

            {/* Owner Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginBottom: 2 }}>Owner</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{selectedRequest.ownerName || '—'}</div>
              </div>
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginBottom: 2 }}>Contact</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{selectedRequest.ownerContact || '—'}</div>
              </div>
            </div>

            {/* All Rooms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {getRequestRooms(selectedRequest).map((room, roomIdx) => (
                <div key={roomIdx} style={{ border: '1px solid #E5E7EB', borderRadius: 14, padding: 24, background: '#FAFAFA' }}>
                  {getRequestRooms(selectedRequest).length > 1 && (
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#2563EB', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Room {roomIdx + 1} of {getRequestRooms(selectedRequest).length}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24, marginBottom: 20 }}>
                    <div>
                      <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', aspectRatio: '4/3', marginBottom: 10 }}>
                        <img
                          src={room.room_image_url || selectedRequest.room_image_url || selectedRequest.image || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"}
                          alt="Room"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      {(room.room_images || selectedRequest.room_images) && (room.room_images || selectedRequest.room_images).length > 1 && (
                        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                          {(room.room_images || selectedRequest.room_images).map((imgUrl, imgIdx) => (
                            <div
                              key={imgIdx}
                              style={{ width: 60, height: 45, borderRadius: 6, overflow: 'hidden', flexShrink: 0, border: '1px solid #E5E7EB' }}
                            >
                              <img src={imgUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '12px 16px' }}>
                        <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginBottom: 2 }}>Room Type</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{room.room_type || selectedRequest.room_type || '—'}</div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 14px' }}>
                          <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginBottom: 2 }}>Bed Type</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{room.bed_type || selectedRequest.bed_type || '—'}</div>
                        </div>
                        <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 14px' }}>
                          <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginBottom: 2 }}>Price / Night (Selling)</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#58A429' }}>
                            {formatCurrency(firstPresent(room.price_per_room, selectedRequest.price_per_room, selectedRequest.priceByOwner))}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 14px' }}>
                          <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginBottom: 2 }}>Original Price</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#9CA3AF', textDecoration: (room.original_price != null || selectedRequest.original_price != null) ? 'line-through' : 'none' }}>
                            {formatCurrency(firstPresent(room.original_price, selectedRequest.original_price))}
                          </div>
                        </div>
                        <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 14px' }}>
                          <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginBottom: 2 }}>Tax Amount</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                            {formatCurrency(firstPresent(room.tax_amount, selectedRequest.tax_amount))}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                        <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 14px' }}>
                          <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginBottom: 2 }}>Discount / Offer</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#D97706' }}>
                            {getDiscountText(
                              firstPresent(room.original_price, selectedRequest.original_price),
                              firstPresent(room.price_per_room, selectedRequest.price_per_room, selectedRequest.priceByOwner),
                              room.offers || selectedRequest.offers || []
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {(room.amenities_types || selectedRequest.amenities_types) && (room.amenities_types || selectedRequest.amenities_types).length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 10 }}>Amenities</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {(room.amenities_types || selectedRequest.amenities_types).map((a, i) => (
                          <span key={i} style={{ padding: '4px 12px', background: '#EFF6FF', color: '#2563EB', borderRadius: 20, fontSize: 12, fontWeight: 500, border: '1px solid #BFDBFE' }}>
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(room.offers || selectedRequest.offers) && (room.offers || selectedRequest.offers).length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 10 }}>Offers Included</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {(room.offers || selectedRequest.offers).map((o, i) => (
                          <span key={i} style={{ padding: '4px 12px', background: '#F0FDF4', color: '#16A34A', borderRadius: 20, fontSize: 12, fontWeight: 500, border: '1px solid #BBF7D0' }}>
                            ✓ {o}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(room.rules || selectedRequest.rules) && (Array.isArray(room.rules || selectedRequest.rules) ? (room.rules || selectedRequest.rules).length > 0 : (room.rules || selectedRequest.rules)) && (
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 10 }}>House Rules</div>
                      {Array.isArray(room.rules || selectedRequest.rules) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {(room.rules || selectedRequest.rules).map((rule, idx) => (
                            <div key={idx} style={{ background: '#FFFDF5', border: '1px solid #FEF3C7', borderRadius: 8, padding: '12px 14px' }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#D97706', marginBottom: 6 }}>{rule.title || 'Rule'}</div>
                              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#6B7280', lineHeight: 1.6 }}>
                                {Array.isArray(rule.points) ? rule.points.map((pt, pidx) => (
                                  <li key={pidx}>{pt}</li>
                                )) : <li>{rule.points || rule.text || ''}</li>}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, margin: 0, background: '#FFFDF5', padding: '12px 14px', borderRadius: 8, border: '1px solid #FEF3C7' }}>
                          {room.rules || selectedRequest.rules}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* About / Description */}
            {selectedRequest.about && (
              <div style={{ marginBottom: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 8 }}>About Property</div>
                <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, margin: 0, background: '#F9FAFB', padding: '12px 14px', borderRadius: 8 }}>
                  {selectedRequest.about}
                </p>
              </div>
            )}
        </div>
      )}

    </div>
  );
}
