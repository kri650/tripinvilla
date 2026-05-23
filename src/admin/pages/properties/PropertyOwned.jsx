import { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle2, Calendar, ChevronDown, Filter, Search, Edit2, Trash2, MoreVertical, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PropertyOwned() {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);
  const [stats, setStats] = useState({ totalOwners: 48, activeOwners: 42, inactiveOwners: 6 });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/owners');
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

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`http://localhost:5000/api/owners/${id}/status`, {
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
      const res = await fetch(`http://localhost:5000/api/owners/${id}`, { method: 'DELETE' });
      if (res.ok) fetchOwners();
    } catch (err) {
      console.error('Error deleting owner:', err);
    }
  };

  const filteredOwners = owners.filter(o => 
    (o.ownerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.contactNo || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fade-in">
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
              <div className="props-search-wrap" style={{ width: 260 }}>
                <Search size={14} />
                <input 
                  type="text" 
                  placeholder="Search owners..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="props-btn-add" onClick={() => navigate('/admin/properties/owned/add')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Plus size={16} /> Add Owner
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
          <div style={{ overflowX: 'auto' }}>
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
                  filteredOwners.map((o, i) => (
                    <tr key={o._id || i}>
                      <td style={{ color: '#58A429', fontWeight: 600 }}>{o.ownerNo || `OWN-500${1 + i}`}</td>
                      <td>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', background: '#E5E7EB' }}>
                          <img src={o.image || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80"} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </td>
                      <td style={{ color: '#111827', fontWeight: 500 }}>{o.ownerName}</td>
                      <td style={{ color: '#9CA3AF' }}>{o.email}</td>
                      <td style={{ color: '#3B82F6', fontWeight: 500 }}>{o.contactNo}</td>
                      <td style={{ color: '#6B7280' }}>{(o.properties && o.properties.length > 0) ? o.properties.join(', ') : 'None'}</td>
                      <td style={{ color: '#6B7280' }}>{o.numberOfProperties || (o.properties ? o.properties.length : 0)}</td>
                      <td>
                        <button 
                          onClick={() => toggleStatus(o._id, o.status)} 
                          style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
                          title="Click to toggle status"
                        >
                          <span className={`status-pill ${o.status === 'Active' ? 'active' : 'inactive'}`}>{o.status}</span>
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => toggleStatus(o._id, o.status)} style={{ color: '#58A429', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Edit2 size={15} strokeWidth={2} /></button>
                          <button onClick={() => handleDelete(o._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Trash2 size={15} strokeWidth={2} /></button>
                          <button className="action-dots" onClick={() => toggleStatus(o._id, o.status)}><MoreVertical size={14} /></button>
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
