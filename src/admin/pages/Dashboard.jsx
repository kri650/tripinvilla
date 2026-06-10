import { toast } from 'react-hot-toast';
import ReadMore from '../components/ReadMore';
import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, ChevronDown, Calendar, MoreVertical, ChevronsUpDown, MessageSquare, Building2, Users, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropertyViewModal from './properties/PropertyViewModal';
import DateRangeDropdown from '../../components/DateRangeDropdown';
import Pagination from '../components/Pagination';

const CAT_COLORS = ['#9DC8B0', '#E8D5A0', '#2D6A6A', '#F09565', '#F0A0B0', '#C8C8C8'];

function EnqTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '7px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 12 }}>
      <p style={{ color: '#9CA3AF', marginBottom: 2 }}>{label}</p>
      <p style={{ fontWeight: 700, color: '#111827' }}>{payload[0].value} enquiries</p>
    </div>
  );
}

function Th({ children, style }) {
  return (
    <th style={style}>
      <span className="th-inner">
        {children}
        <ChevronsUpDown className="sort-icon" style={{ width: 10, height: 10 }} />
      </span>
    </th>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEnquiriesToday: 0,
    activeProperties: 0,
    totalOwners: 0,
    compareYesterday: { enquiries: '+0.0', properties: '+0.0', owners: '+0.0' }
  });
  const [enquiriesChartData, setEnquiriesChartData] = useState([
    { month: 'Jan', v: 0 }, { month: 'Feb', v: 0 }, { month: 'Mar', v: 0 },
    { month: 'Apr', v: 0 }, { month: 'May', v: 0 }, { month: 'Jun', v: 0 },
    { month: 'Jul', v: 0 }, { month: 'Aug', v: 0 }, { month: 'Sep', v: 0 },
    { month: 'Oct', v: 0 }, { month: 'Nov', v: 0 }, { month: 'Dec', v: 0 }
  ]);
  const [categoryData, setCategoryData] = useState({ total: 0, categories: [] });
  const [topProperties, setTopProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [selectedEnquiryMonth, setSelectedEnquiryMonth] = useState('All Time');
  const [selectedEnquiryRaw, setSelectedEnquiryRaw] = useState('');
  const [actionMenu, setActionMenu] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [enqDateFrom, setEnqDateFrom] = useState('');
  const [enqDateTo, setEnqDateTo] = useState('');
  const [enqCurrentPage, setEnqCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [dashboardDateFrom, setDashboardDateFrom] = useState(() => localStorage.getItem('dashboard_date_from') || '');
  const [dashboardDateTo, setDashboardDateTo] = useState(() => localStorage.getItem('dashboard_date_to') || '');

  useEffect(() => {
    const handleDateChange = (e) => {
      setDashboardDateFrom(e.detail.dateFrom);
      setDashboardDateTo(e.detail.dateTo);
    };
    window.addEventListener('dashboard_date_changed', handleDateChange);
    return () => {
      window.removeEventListener('dashboard_date_changed', handleDateChange);
    };
  }, []);

  const fetchData = async () => {
    try {
      const queryParams = [];
      if (dashboardDateFrom) queryParams.push(`dateFrom=${dashboardDateFrom}`);
      if (dashboardDateTo) queryParams.push(`dateTo=${dashboardDateTo}`);
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      const [statsRes, chartRes, catRes, topRes, enqRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE}/dashboard/stats${queryString}`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_BASE}/dashboard/enquiries-chart${queryString || `?year=${selectedYear}`}`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_BASE}/dashboard/property-categories${queryString}`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_BASE}/dashboard/top-properties${queryString}`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_BASE}/dashboard/recent-enquiries${queryString || `?dateFrom=${enqDateFrom}&dateTo=${enqDateTo}`}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}` }
        }).then(r => r.json())
      ]);

      if (statsRes && statsRes.activeProperties !== undefined) setStats(statsRes);
      if (chartRes && Array.isArray(chartRes)) {
        setEnquiriesChartData(chartRes.map(item => ({ month: item.month, v: item.count })));
      }
      if (catRes && catRes.categories) setCategoryData(catRes);
      if (topRes && Array.isArray(topRes)) setTopProperties(topRes);
      if (enqRes && Array.isArray(enqRes)) setEnquiries(enqRes);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => { 
    fetchData(); 
    setEnqCurrentPage(1);
  }, [selectedYear, enqDateFrom, enqDateTo, dashboardDateFrom, dashboardDateTo]);



  return (
    <div className="fade-in">

      {/* ══ Section 1: Stat Cards ════════ */}
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
          <div className="props-stat-card" style={{ margin: 0, borderRadius: 12 }}>
            <div className="props-stat-icon-wrap blue">
              <MessageSquare strokeWidth={2.5} />
            </div>
            <div className="props-stat-content">
              <div className="props-stat-label">Total Enquiries (Today)</div>
              <div className="props-stat-value">{stats.totalEnquiriesToday}</div>
              <div className="stat-card-meta" style={{ marginTop: 4 }}>
                <span className={`stat-badge ${stats.compareYesterday.enquiries?.startsWith('-') ? 'down' : 'up'}`}>
                  {stats.compareYesterday.enquiries?.startsWith('-') ? <TrendingDown size={10} /> : <TrendingUp size={10} />} {stats.compareYesterday.enquiries}%
                </span>
                <span className="stat-card-sub">Compared to yesterday</span>
              </div>
            </div>
          </div>
          <div className="props-stat-card" style={{ margin: 0, borderRadius: 12 }}>
            <div className="props-stat-icon-wrap green">
              <Building2 strokeWidth={2.5} />
            </div>
            <div className="props-stat-content">
              <div className="props-stat-label">Active Properties</div>
              <div className="props-stat-value">{stats.activeProperties}</div>
              <div className="stat-card-meta" style={{ marginTop: 4 }}>
                <span className={`stat-badge ${stats.compareYesterday.properties?.startsWith('-') ? 'down' : 'up'}`}>
                  {stats.compareYesterday.properties?.startsWith('-') ? <TrendingDown size={10} /> : <TrendingUp size={10} />} {stats.compareYesterday.properties}%
                </span>
                <span className="stat-card-sub">Compared to yesterday</span>
              </div>
            </div>
          </div>
          <div className="props-stat-card" style={{ margin: 0, borderRadius: 12 }}>
            <div className="props-stat-icon-wrap" style={{ background: '#F5F3FF', color: '#7C3AED', width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users strokeWidth={2.5} style={{ width: 32, height: 32 }} />
            </div>
            <div className="props-stat-content">
              <div className="props-stat-label">Total Property Owners</div>
              <div className="props-stat-value">{stats.totalOwners}</div>
              <div className="stat-card-meta" style={{ marginTop: 4 }}>
                <span className={`stat-badge ${stats.compareYesterday.owners?.startsWith('-') ? 'down' : 'up'}`}>
                  {stats.compareYesterday.owners?.startsWith('-') ? <TrendingDown size={10} /> : <TrendingUp size={10} />} {stats.compareYesterday.owners}%
                </span>
                <span className="stat-card-sub">Registered owners</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Section 2: Charts ════════════ */}
      <div className="dash-section">
        <div className="charts-row">

          {/* Enquiries Over Time Bar Chart */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div className="chart-card-title">Enquiries Over Time</div>
              <div style={{ position: 'relative' }}>
                <button className="chart-filter" style={{ cursor: 'pointer' }}>
                  <Calendar size={12} /> {selectedYear} <ChevronDown size={11} />
                </button>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{ position: 'absolute', opacity: 0, top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
                >
                  {[2026, 2025, 2024, 2023, 2022].map(y => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={enquiriesChartData} barSize={36} margin={{ top: 12, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip content={<EnqTooltip />} cursor={{ fill: 'rgba(88,164,41,0.06)' }} />
                <Bar dataKey="v" fill="#58A429" radius={[8, 8, 0, 0]} background={{ fill: '#F3F4F6', radius: [8, 8, 0, 0] }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut chart */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div className="chart-card-title">Property Category</div>
            </div>
            <div style={{ position: 'relative', marginTop: 8 }}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={categoryData.categories}
                    cx="50%" cy="50%"
                    innerRadius={74} outerRadius={110}
                    dataKey="count" strokeWidth={3} stroke="#fff"
                  >
                    {categoryData.categories.map((_, i) => (
                      <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none',
              }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: '#111827', lineHeight: 1 }}>
                  {(categoryData.total || 0).toLocaleString()}
                </span>
                <span style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Properties</span>
              </div>
            </div>
            <div className="donut-legend" style={{ marginTop: 20 }}>
              {categoryData.categories.map((d, i) => (
                <div className="legend-item" key={d.name}>
                  <div className="legend-dot" style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
                  <span className="legend-label">{d.name} ({d.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ Section 3: Top Properties by Enquiries ══════ */}
      <div style={{ margin: '0 24px 24px' }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', width: '100%', overflow: 'visible' }}>
          <div className="table-header" style={{ padding: '14px 20px' }}>
            <span className="table-title">Top 10 Most Enquired Properties</span>
            <div className="table-header-right">
              <button className="table-view-all" onClick={() => navigate('/admin/properties/all')} style={{ cursor: 'pointer' }}>View All</button>
            </div>
          </div>
          <div style={{ overflowX: 'auto', display: 'block', width: '100%' }}>
            <table className="data-table" style={{ minWidth: 1000 }}>
              <thead>
                <tr>
                  <Th style={{ minWidth: 100 }}>Property No</Th>
                  <th style={{ minWidth: 80, color: '#9CA3AF', fontWeight: 500, fontSize: 11 }}>Image</th>
                  <Th style={{ minWidth: 200 }}>Property Name</Th>
                  <Th style={{ minWidth: 180 }}>Location</Th>
                  <Th style={{ minWidth: 100 }}>Category</Th>
                  <Th style={{ minWidth: 100 }}>Best Room Rate</Th>
                  <Th style={{ minWidth: 100 }}>Rooms</Th>
                  <Th style={{ minWidth: 100 }}>Total Enquiries</Th>
                  <Th style={{ minWidth: 80 }}>Rating</Th>
                  <Th style={{ minWidth: 100 }}>Status</Th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {topProperties.length === 0 ? (
                  <tr><td colSpan="11" style={{ textAlign: 'center', padding: '30px 0', color: '#6B7280' }}>No properties found</td></tr>
                ) : topProperties.map((p, i) => (
                  <tr key={p.id || p.propertyNo}>
                    <td><span className="prop-id-link" onClick={() => navigate('/admin/properties/all')} style={{ cursor: 'pointer' }}>{p.propertyNo}</span></td>
                    <td>
                      <div className="prop-thumb-placeholder">
                        <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </td>
                    <td style={{ fontWeight: 500, color: '#111827' }}>{p.name}</td>
                    <td><div className="location-text"><ReadMore maxWords={6}>{p.location}</ReadMore></div></td>
                    <td><span className="category-pill">{p.category}</span></td>
                    <td style={{ fontWeight: 600, color: '#111827' }}>{typeof p.bestRoomRate === 'number' ? `₹${p.bestRoomRate.toLocaleString()}` : p.bestRoomRate}</td>
                    <td>{p.rooms}</td>
                    <td style={{ fontWeight: 700, color: '#58A429' }}>{p.totalEnquiries ?? 0}</td>
                    <td style={{ color: '#374151' }}>{p.rating || '—'}</td>
                    <td>
                      <span className={`status-pill ${p.status === 'Active' ? 'active' : 'inactive'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ position: 'relative' }}>
                      <button className="action-dots" onClick={() => setActionMenu(actionMenu === `prop_${p.id || p.propertyNo}` ? null : `prop_${p.id || p.propertyNo}`)} style={{ cursor: 'pointer' }}><MoreVertical size={14} /></button>
                      {actionMenu === `prop_${p.id || p.propertyNo}` && (
                        <div style={{ position: 'absolute', right: 8, top: i >= 3 ? "auto" : 32, bottom: i >= 3 ? 32 : "auto", background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 100, minWidth: 160 }}>
                          <button onClick={() => { 
                            setActionMenu(null); 
                            setSelectedProperty(p); 
                            setTimeout(() => document.getElementById('property-detail-div')?.scrollIntoView({ behavior: 'smooth' }), 100);
                            toast.success('Viewing Details');
                          }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }}>
                            👁 View Details
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══ Section 4: Recent Enquiries ══════════ */}
      <div style={{ margin: '0 24px 24px' }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', width: '100%', overflow: 'visible' }}>
          <div className="table-header" style={{ padding: '14px 20px' }}>
            <span className="table-title">Recent Enquiries</span>
            <div className="table-header-right" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button className="table-view-all" onClick={() => navigate('/admin/enquiries')} style={{ cursor: 'pointer' }}>View All</button>
              
              {/* DateRangeDropdown removed as per user request */}
            </div>
          </div>
          <div style={{ overflowX: 'auto', display: 'block', width: '100%' }}>
            <table className="data-table" style={{ minWidth: 1000, width: '100%' }}>
              <thead>
                <tr>
                  <Th style={{ minWidth: 100 }}>Enquiry No</Th>
                  <Th style={{ minWidth: 150 }}>Date &amp; Time</Th>
                  <Th style={{ minWidth: 110 }}>User Name</Th>
                  <Th style={{ minWidth: 110 }}>Phone No</Th>
                  <Th style={{ minWidth: 150 }}>Email Address</Th>
                  <Th style={{ minWidth: 200 }}>Property</Th>
                  <Th style={{ minWidth: 200 }}>Query</Th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {enquiries.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '30px 0', color: '#6B7280' }}>No enquiries yet</td></tr>
                ) : enquiries.slice((enqCurrentPage - 1) * itemsPerPage, enqCurrentPage * itemsPerPage).map((e, i) => (
                  <tr key={e.enquiryNo || e.id}>
                    <td><span className="prop-id-link" onClick={() => navigate('/admin/enquiries')} style={{ cursor: 'pointer' }}>{e.enquiryNo || e.id}</span></td>
                    <td style={{ fontSize: 11, color: '#6B7280' }}>{e.datesAndTime}</td>
                    <td style={{ fontWeight: 500, color: '#111827' }}>{e.userName}</td>
                    <td>{e.phoneNo}</td>
                    <td style={{ color: '#111827' }}>{e.email}</td>
                    <td style={{ fontSize: 12, color: '#4B5563' }}><ReadMore maxWords={6}>{e.propertyName}</ReadMore></td>
                    <td style={{ maxWidth: 200, whiteSpace: 'normal', fontSize: 11, color: '#6B7280', lineHeight: 1.4 }}><ReadMore maxWords={6}>{e.query}</ReadMore></td>
                    <td style={{ position: 'relative' }}>
                      <button className="action-dots" onClick={() => setActionMenu(actionMenu === `enq_${e.id || e.enquiryNo}` ? null : `enq_${e.id || e.enquiryNo}`)} style={{ cursor: 'pointer' }}><MoreVertical size={14} /></button>
                      {actionMenu === `enq_${e.id || e.enquiryNo}` && (
                        <div style={{ position: 'absolute', right: 8, top: i >= 3 ? "auto" : 32, bottom: i >= 3 ? 32 : "auto", background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 100, minWidth: 160 }}>
                          <button onClick={() => { 
                            setActionMenu(null); 
                            setSelectedEnquiry(e); 
                            setTimeout(() => document.getElementById('enquiry-detail-div')?.scrollIntoView({ behavior: 'smooth' }), 100);
                          }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }}>
                            👁 View Details
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {enquiries.length > 0 && (
            <Pagination 
              currentPage={enqCurrentPage} 
              totalItems={enquiries.length} 
              itemsPerPage={itemsPerPage} 
              onPageChange={setEnqCurrentPage} 
            />
          )}
        </div>
      </div>

    {/* Modals */}
      {selectedProperty && (
        <PropertyViewModal property={selectedProperty} onClose={() => setSelectedProperty(null)} inline={true} />
      )}

      {selectedEnquiry && (
        <div id="enquiry-detail-div" style={{ position: 'relative', width: '100%', background: '#fff', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginTop: '24px' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', position: 'relative' }}>
            <button onClick={() => setSelectedEnquiry(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>&times;</button>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18, color: '#111827' }}>Enquiry Details</h3>
            <div style={{ display: 'grid', gap: 12, fontSize: 14 }}>
              <div><strong>Enquiry No:</strong> {selectedEnquiry.enquiryNo || selectedEnquiry.id}</div>
              <div><strong>Date & Time:</strong> {selectedEnquiry.datesAndTime}</div>
              <div><strong>User Name:</strong> {selectedEnquiry.userName}</div>
              <div><strong>Phone No:</strong> {selectedEnquiry.phoneNo}</div>
              <div><strong>Email Address:</strong> {selectedEnquiry.email}</div>
              <div><strong>Property:</strong> {selectedEnquiry.propertyName}</div>
              <div><strong>Query:</strong> <p style={{ margin: '4px 0 0 0', whiteSpace: 'pre-wrap', color: '#4B5563' }}>{selectedEnquiry.query}</p></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
