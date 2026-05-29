import { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle2, Calendar, ChevronDown, Filter, Search, Edit2, Trash2, MoreVertical, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import ReadMore from '../../components/ReadMore';

export default function PropertyOwned() {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);
  const [stats, setStats] = useState({ totalOwners: 48, activeOwners: 42, inactiveOwners: 6 });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [actionMenu, setActionMenu] = useState(null);
  const [viewPropertiesOwner, setViewPropertiesOwner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (propertyType) params.append("type", propertyType);
      if (dateFrom) params.append("date", dateFrom);

      const res = await fetch(`${import.meta.env.VITE_API_BASE}/owners?${params.toString()}`);
      const data = await res.json();
      if (data && data.owners) {
        setOwners(data.owners);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching owners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const updateStatus = async (id, nextStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/owners/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) fetchOwners();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property owner?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/owners/${id}`, { method: 'DELETE' });
      if (res.ok) fetchOwners();
    } catch (err) {
      console.error('Error deleting owner:', err);
    }
  };

  const filteredOwners = owners;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateFrom, propertyType]);

  const totalItems = filteredOwners.length;
  const paginated = filteredOwners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="fade-in" onClick={() => setActionMenu(null)}>
      {/* Breadcrumb */}
      <div className="props-breadcrumb" style={{ margin: '0 39px 12px' }}>
        Property Management &gt; <span>Property Owners</span>
      </div>

      {/* Stats Section */}
      <div className="dash-section" style={{ minHeight: 162, boxSizing: 'border-box', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div className="props-stat-card" style={{ margin: 0, borderRadius: 12 }}>
            <div className="props-stat-icon-wrap blue"><ClipboardList strokeWidth={2.5} /></div>
            <div className="props-stat-content">
              <div className="props-stat-label">Total Owners</div>
              <div className="props-stat-value">{stats.totalOwners}</div>
            </div>
          </div>
          <div className="props-stat-card" style={{ margin: 0, borderRadius: 12 }}>
            <div className="props-stat-icon-wrap green"><Clock strokeWidth={2.5} /></div>
            <div className="props-stat-content">
              <div className="props-stat-label">Active Owners</div>
              <div className="props-stat-value">{stats.activeOwners}</div>
            </div>
          </div>
          <div className="props-stat-card" style={{ margin: 0, borderRadius: 12 }}>
            <div className="props-stat-icon-wrap red"><CheckCircle2 strokeWidth={2.5} /></div>
            <div className="props-stat-content">
              <div className="props-stat-label">In-active Owners</div>
              <div className="props-stat-value">{stats.inactiveOwners}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Table Section */}
      <div className="dash-section" style={{ marginBottom: 24, gap: 16 }}>
        
        {/* Toolbar */}
        <div className="chart-card" style={{ padding: '16px 20px', borderRadius: 12 }}>
          <div className="props-table-toolbar" style={{ margin: 0, borderBottom: 'none' }}>
            <div className="props-table-title">Property Owners</div>
            <div className="props-table-actions">
              <div className="props-filter-select" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: 8 }}>
                <Calendar size={14} style={{ color: '#6B7280' }} />
                <input 
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontSize: 13, cursor: 'pointer' }}
                />
              </div>
              <div className="props-filter-select" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: 8 }}>
                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontSize: 13, cursor: 'pointer' }}
                >
                  <option value="">All Types</option>
                  {["Villa", "Homestay", "Resort", "Apartment", "Cottage", "Others"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <button className="props-btn-filter" onClick={fetchOwners} style={{ cursor: 'pointer', border: '1px solid #58A429', background: '#fff', color: '#58A429', padding: '6px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                <Filter size={14} /> Filter
              </button>
              <div className="props-search-wrap" style={{ width: 260, border: '1px solid #E5E7EB', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px' }}>
                <Search size={14} style={{ color: '#9CA3AF' }} />
                <input 
                  type="text" 
                  placeholder="Search owners..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchOwners()}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: 13 }}
                />
              </div>
              <button className="props-btn-add" onClick={() => navigate('/admin/properties/owned/add')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Plus size={16} /> Add Owner
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="chart-card" style={{ padding: 0, overflow: 'visible', borderRadius: 12 }}>
          <div style={{ overflowX: 'visible' }}>
            <table className="data-table" style={{ whiteSpace: 'nowrap' }}>
              <thead>
                <tr>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Owner No <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Image <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Owner Name <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Email <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Contact No <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Properties <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Number of Properties <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500 }}>Status <ChevronDown size={12} style={{ display: 'inline', marginLeft: 4 }} /></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '30px 0', color: '#6B7280' }}>Loading owners...</td></tr>
                ) : filteredOwners.length === 0 ? (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '30px 0', color: '#6B7280' }}>No property owners found</td></tr>
                ) : (
                  paginated.map((o, i) => (
                    <tr key={o._id || i}>
                      <td style={{ color: '#58A429', fontWeight: 600 }}>{o.ownerNo || `OWN-500${1 + i}`}</td>
                      <td>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', background: '#E5E7EB' }}>
                          <img src={o.image || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80"} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </td>
                      <td style={{ color: '#111827', fontWeight: 500 }}><ReadMore maxWords={4}>{o.ownerName}</ReadMore></td>
                      <td style={{ color: '#9CA3AF' }}><ReadMore maxWords={4}>{o.email}</ReadMore></td>
                      <td style={{ color: '#3B82F6', fontWeight: 500 }}>{o.contactNo}</td>
                      <td style={{ color: '#6B7280' }}><ReadMore maxWords={4}>{(o.properties && o.properties.length > 0) ? o.properties.join(', ') : 'None'}</ReadMore></td>
                      <td style={{ color: '#6B7280' }}>{o.numberOfProperties || (o.properties ? o.properties.length : 0)}</td>
                      <td>
                        <button 
                          onClick={() => updateStatus(o._id, o.status === 'Active' ? 'Inactive' : 'Active')} 
                          style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
                          title="Click to toggle status"
                        >
                          <span className={`status-pill ${o.status === 'Active' ? 'active' : 'inactive'}`}>{o.status}</span>
                        </button>
                      </td>
                      <td style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                        <button className="action-dots" onClick={() => setActionMenu(actionMenu === o._id ? null : o._id)}>
                          <MoreVertical size={14} />
                        </button>
                        {actionMenu === o._id && (
                          <div style={{ position: 'absolute', right: 8, top: 32, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 100, minWidth: 160 }}>
                            <button onClick={() => { setActionMenu(null); navigate(`/admin/properties/owned/edit/${o._id}`); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }}>
                              Edit
                            </button>
                            <button onClick={() => { setActionMenu(null); setViewPropertiesOwner(o); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }}>
                              View Details
                            </button>
                            <button onClick={() => { setActionMenu(null); updateStatus(o._id, 'Active'); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, color: '#58A429', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }}>
                              Active
                            </button>
                            <button onClick={() => { setActionMenu(null); updateStatus(o._id, 'Inactive'); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }}>
                              Inactive
                            </button>
                            <button onClick={() => { setActionMenu(null); handleDelete(o._id); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <Pagination 
              currentPage={currentPage} 
              totalItems={totalItems} 
              itemsPerPage={itemsPerPage} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </div>

      </div>

      {viewPropertiesOwner && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewPropertiesOwner(null)} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 400, background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#111827' }}>Properties Owned</h3>
              <button onClick={() => setViewPropertiesOwner(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: '50%' }}>✕</button>
            </div>
            <div style={{ padding: 20, maxHeight: 400, overflowY: 'auto' }}>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>
                Showing properties for <strong>{viewPropertiesOwner.ownerName}</strong>
              </div>
              {(!viewPropertiesOwner.properties || viewPropertiesOwner.properties.length === 0) ? (
                <div style={{ color: '#9CA3AF', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>No properties assigned</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {viewPropertiesOwner.properties.map((p, i) => (
                    <div key={i} style={{ padding: '10px 14px', background: '#F3F4F6', borderRadius: 8, fontSize: 14, color: '#374151', fontWeight: 500 }}>
                      {i + 1}. {p}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
