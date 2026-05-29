import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, ChevronDown, Calendar, MoreVertical, ChevronsUpDown, MessageSquare, Building2, Users, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

function Th({ children }) {
  return (
    <th>
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
  const [selectedEnquiryMonth, setSelectedEnquiryMonth] = useState(() => {
    const d = new Date();
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
  });
  const [actionMenu, setActionMenu] = useState(null);

  const fetchData = async () => {
    try {
      const [statsRes, chartRes, catRes, topRes, enqRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE}/dashboard/stats`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_BASE}/dashboard/enquiries-chart?year=${selectedYear}`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_BASE}/dashboard/property-categories`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_BASE}/dashboard/top-properties`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_BASE}/dashboard/recent-enquiries`).then(r => r.json())
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

  useEffect(() => { fetchData(); }, [selectedYear]);



  const StatCard = ({ icon: Icon, label, value, badge, sub, iconBg }) => (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg || '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={iconBg ? '#fff' : '#2563EB'} />
        </div>
        <div className="stat-card-label" style={{ margin: 0 }}>{label}</div>
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-meta">
        <span className={`stat-badge ${badge?.startsWith('-') ? 'down' : 'up'}`}>
          {badge?.startsWith('-') ? <TrendingDown size={10} /> : <TrendingUp size={10} />} {badge}%
        </span>
        <span className="stat-card-sub">{sub}</span>
      </div>
    </div>
  );

  return (
    <div className="fade-in">

      {/* ══ Section 1: Stat Cards ════════ */}
      <div className="dash-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <StatCard
            icon={MessageSquare}
            label="Total Enquiries (Today)"
            value={stats.totalEnquiriesToday}
            badge={stats.compareYesterday.enquiries}
            sub="Compared to yesterday"
            iconBg="#2563EB"
          />
          <StatCard
            icon={Building2}
            label="Active Properties"
            value={stats.activeProperties}
            badge={stats.compareYesterday.properties}
            sub="Compared to yesterday"
            iconBg="#58A429"
          />
          <StatCard
            icon={Users}
            label="Total Property Owners"
            value={stats.totalOwners}
            badge={stats.compareYesterday.owners}
            sub="Registered owners"
            iconBg="#7C3AED"
          />
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
      <div className="dash-section">
        <div className="chart-card" style={{ padding: 0, overflow: 'visible' }}>
          <div className="table-header" style={{ padding: '14px 20px' }}>
            <span className="table-title">Top 10 Most Enquired Properties</span>
            <div className="table-header-right">
              <button className="table-view-all" onClick={() => navigate('/admin/properties/all')} style={{ cursor: 'pointer' }}>View All</button>
            </div>
          </div>
          <div style={{ overflowX: 'visible' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <Th>Property No</Th>
                  <th style={{ color: '#9CA3AF', fontWeight: 500, fontSize: 11 }}>Image</th>
                  <Th>Property Name</Th>
                  <Th>Location</Th>
                  <Th>Category</Th>
                  <Th>Best Room Rate</Th>
                  <Th>Rooms</Th>
                  <Th>Total Enquiries</Th>
                  <Th>Rating</Th>
                  <Th>Status</Th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {topProperties.length === 0 ? (
                  <tr><td colSpan="11" style={{ textAlign: 'center', padding: '30px 0', color: '#6B7280' }}>No properties found</td></tr>
                ) : topProperties.map((p) => (
                  <tr key={p.id || p.propertyNo}>
                    <td><span className="prop-id-link" onClick={() => navigate('/admin/properties/all')} style={{ cursor: 'pointer' }}>{p.propertyNo}</span></td>
                    <td>
                      <div className="prop-thumb-placeholder">
                        <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </td>
                    <td style={{ fontWeight: 500, color: '#111827' }}>{p.name}</td>
                    <td><div className="location-text">{p.location}</div></td>
                    <td><span className="category-pill">{p.category}</span></td>
                    <td style={{ fontWeight: 600, color: '#111827' }}>{typeof p.bestRoomRate === 'number' ? `₹${p.bestRoomRate.toLocaleString()}` : p.bestRoomRate}</td>
                    <td>{p.rooms}</td>
                    <td style={{ fontWeight: 700, color: '#58A429' }}>{p.totalEnquiries ?? 0}</td>
                    <td style={{ color: '#374151' }}>{p.rating}</td>
                    <td>
                      <span className={`status-pill ${p.status === 'Active' ? 'active' : 'inactive'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ position: 'relative' }}>
                      <button className="action-dots" onClick={() => setActionMenu(actionMenu === `prop_${p.id || p.propertyNo}` ? null : `prop_${p.id || p.propertyNo}`)} style={{ cursor: 'pointer' }}><MoreVertical size={14} /></button>
                      {actionMenu === `prop_${p.id || p.propertyNo}` && (
                        <div style={{ position: 'absolute', right: 8, top: 32, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 100, minWidth: 160 }}>
                          <button onClick={() => { setActionMenu(null); navigate('/admin/properties/all'); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }}>
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
      <div className="dash-section" style={{ marginBottom: 24 }}>
        <div className="chart-card" style={{ padding: 0, overflow: 'visible' }}>
          <div className="table-header" style={{ padding: '14px 20px' }}>
            <span className="table-title">Recent Enquiries</span>
            <div className="table-header-right" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button className="table-view-all" onClick={() => navigate('/admin/enquiries')} style={{ cursor: 'pointer' }}>View All</button>
              
              <div style={{ position: 'relative' }}>
                <button className="chart-filter" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> {selectedEnquiryMonth} <ChevronDown size={14} />
                </button>
                <input 
                  type="month"
                  style={{ position: 'absolute', opacity: 0, top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [year, month] = e.target.value.split('-');
                      const d = new Date(year, month - 1);
                      setSelectedEnquiryMonth(`${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`);
                    }
                  }}
                />
              </div>

            </div>
          </div>
          <div style={{ overflowX: 'visible' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <Th>Enquiry No</Th>
                  <Th>Date &amp; Time</Th>
                  <Th>User Name</Th>
                  <Th>Phone No</Th>
                  <Th>Email Address</Th>
                  <Th>Property</Th>
                  <Th>Query</Th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {enquiries.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '30px 0', color: '#6B7280' }}>No enquiries yet</td></tr>
                ) : enquiries.map((e) => (
                  <tr key={e.enquiryNo || e.id}>
                    <td><span className="prop-id-link" onClick={() => navigate('/admin/enquiries')} style={{ cursor: 'pointer' }}>{e.enquiryNo || e.id}</span></td>
                    <td style={{ fontSize: 11, color: '#6B7280' }}>{e.datesAndTime}</td>
                    <td style={{ fontWeight: 500, color: '#111827' }}>{e.userName}</td>
                    <td>{e.phoneNo}</td>
                    <td style={{ color: '#2563EB' }}>{e.email}</td>
                    <td style={{ fontSize: 12, color: '#4B5563' }}>{e.propertyName}</td>
                    <td style={{ maxWidth: 200, whiteSpace: 'normal', fontSize: 11, color: '#6B7280', lineHeight: 1.4 }}>{e.query}</td>
                    <td style={{ position: 'relative' }}>
                      <button className="action-dots" onClick={() => setActionMenu(actionMenu === `enq_${e.id || e.enquiryNo}` ? null : `enq_${e.id || e.enquiryNo}`)} style={{ cursor: 'pointer' }}><MoreVertical size={14} /></button>
                      {actionMenu === `enq_${e.id || e.enquiryNo}` && (
                        <div style={{ position: 'absolute', right: 8, top: 32, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 100, minWidth: 160 }}>
                          <button onClick={() => { setActionMenu(null); navigate('/admin/enquiries'); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }}>
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

    </div>
  );
}
