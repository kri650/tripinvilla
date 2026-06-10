import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  ArrowUpRight, 
  Building2,
  Users
} from 'lucide-react';
import ReadMore from '../../admin/components/ReadMore';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/api';
import DateRangeDropdown from '../../components/DateRangeDropdown';

export default function Dashboard() {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(null);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const params = {};
      if (dashboardDateFrom) params.dateFrom = dashboardDateFrom;
      if (dashboardDateTo) params.dateTo = dashboardDateTo;

      const statsRes = await dashboardService.getStats(params);
      setStatsData(statsRes.data);
      
      const queryParams = [];
      if (dashboardDateFrom) queryParams.push(`dateFrom=${dashboardDateFrom}`);
      if (dashboardDateTo) queryParams.push(`dateTo=${dashboardDateTo}`);
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      const enquiriesRes = await fetch(`${import.meta.env.VITE_API_BASE}/owner-dashboard/enquiries${queryString}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const enquiriesData = await enquiriesRes.json();
      if (Array.isArray(enquiriesData)) {
        setRecentEnquiries(enquiriesData.slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dashboardDateFrom, dashboardDateTo]);

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: '#6B7280', fontSize: '15px', fontFamily: '"Outfit", sans-serif' }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ height: '16px' }} />

      {/* ══ Section 1: Stat Cards ════════ */}
      <div className="dash-section" style={{ marginBottom: 16 }}>
        <div className="props-stats-row">
          <div className="props-stat-card" style={{ margin: 0, borderRadius: 12 }}>
            <div className="props-stat-icon-wrap blue">
              <MessageSquare strokeWidth={2.5} />
            </div>

            <div className="props-stat-content">
              <div className="props-stat-label">Total Enquiries (Today)</div>
              <div className="props-stat-value">{statsData?.totalEnquiries || 0}</div>
              <div className="stat-card-meta" style={{ marginTop: 4 }}>
                <span className="stat-badge up">
                  <TrendingUp size={10} /> +04.6%
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
              <div className="props-stat-value">{statsData?.activeProperties || 0}</div>
              <div className="stat-card-meta" style={{ marginTop: 4 }}>
                <span className="stat-badge down">
                  <TrendingDown size={10} /> -16.6%
                </span>
                <span className="stat-card-sub">Compared to yesterday</span>
              </div>
            </div>
          </div>
          <div className="props-stat-card" style={{ margin: 0, borderRadius: 12 }}>
            <div className="props-stat-icon-wrap purple">
              <Users strokeWidth={2.5} />
            </div>
            <div className="props-stat-content">
              <div className="props-stat-label">Response Rate</div>
              <div className="props-stat-value">{statsData?.responseRate !== undefined ? `${statsData.responseRate}%` : '0%'}</div>
              <div className="stat-card-meta" style={{ marginTop: 4 }}>
                <span className="stat-badge up">
                  <TrendingUp size={10} /> +16.6%
                </span>
                <span className="stat-card-sub">Compared to yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Section 2: Recent Enquiries ══════ */}
      <div className="dash-section" style={{ marginBottom: 24 }}>
        <div className="chart-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12, border: 'none', boxShadow: 'none' }}>
          <div className="table-header" style={{ padding: '14px 20px' }}>
            <span className="table-title">Recent Enquiries</span>
            <div className="table-header-right">
              <button className="table-view-all" onClick={() => navigate('/owner/enquiries')} style={{ cursor: 'pointer' }}>View All</button>
            </div>
          </div>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="data-table" style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <th style={{ minWidth: '100px', color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Enquiry ID</th>
                  <th style={{ minWidth: '200px', color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Property</th>
                  <th style={{ minWidth: '110px', color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Guest Name</th>
                  <th style={{ minWidth: '150px', color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Date & Time</th>
                  <th style={{ minWidth: '150px', color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Email</th>
                  <th style={{ minWidth: '110px', color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Phone</th>
                  <th style={{ minWidth: '100px', color: '#9CA3AF', fontWeight: 500, fontSize: '12px', padding: '12px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.length > 0 ? (
                  recentEnquiries.map((e, i) => {
                    const dateStr = new Date(e.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                    return (
                      <tr key={e._id || i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ fontWeight: 600, color: '#58A429', padding: '14px', fontSize: '13px' }}>
                          ENQ-{String(i + 1).padStart(3, '0')}
                        </td>
                        <td style={{ fontWeight: 500, color: '#111827', padding: '14px', fontSize: '13px' }}>
                          <ReadMore maxWords={6}>{e.property?.name || 'Unnamed Property'}</ReadMore>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 500, color: '#374151', fontSize: '13px' }}><ReadMore maxWords={6}>{e.name || 'Guest'}</ReadMore></span>
                          </div>
                        </td>
                        <td style={{ color: '#6B7280', padding: '14px', fontSize: '13px' }}>
                          {dateStr}
                        </td>
                        <td style={{ padding: '14px', fontSize: '12.5px', color: '#374151', fontWeight: 500 }}>
                          {e.email}
                        </td>
                        <td style={{ padding: '14px', fontSize: '12.5px', color: '#374151' }}>
                          {e.phone}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span className={`status-pill ${e.status === 'Replied' ? 'active' : 'pending'}`}>
                            {e.status === 'Replied' ? 'Replied' : e.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: '13px' }}>
                      No recent enquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}