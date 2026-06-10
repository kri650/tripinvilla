import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Calendar, ChevronDown, Plus, Menu, ArrowUpRight } from 'lucide-react';

import DateRangeDropdown from '../../components/DateRangeDropdown';

const PAGE_TITLES = {
  '/owner/dashboard':  'Dashboard Analytics',
  '/owner/properties': 'My Properties',
  '/owner/requests':   'Property Requests',
  '/owner/offers':     'Offers by Date',
  '/owner/enquiries':  'Enquiries',
  '/owner/premium':    'Upgrade to Premium',
  '/owner/profile':    'My Profile',
  '/owner/logout':     'Log Out',
};

export default function Topbar({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[location.pathname] || 'My Properties';

  const userStr = localStorage.getItem('owner_user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Jhon Doe', email: 'jhon@gmail.com' };
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'J';

  const [dateFrom, setDateFrom] = useState(() => localStorage.getItem('dashboard_date_from') || '');
  const [dateTo, setDateTo] = useState(() => localStorage.getItem('dashboard_date_to') || '');

  const handleDateChange = (start, end) => {
    setDateFrom(start);
    setDateTo(end);
    localStorage.setItem('dashboard_date_from', start);
    localStorage.setItem('dashboard_date_to', end);
    window.dispatchEvent(new CustomEvent('dashboard_date_changed', { detail: { dateFrom: start, dateTo: end } }));
  };

  const handleClear = () => {
    setDateFrom('');
    setDateTo('');
    localStorage.removeItem('dashboard_date_from');
    localStorage.removeItem('dashboard_date_to');
    window.dispatchEvent(new CustomEvent('dashboard_date_changed', { detail: { dateFrom: '', dateTo: '' } }));
  };

  const renderActionButton = () => {
    if (location.pathname === '/owner/properties') {
      return (
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('owner_toggle_add_form'))}
          style={{ 
            background: '#58A429', 
            color: '#ffffff', 
            borderRadius: '8px', 
            padding: '8px 16px', 
            fontWeight: 600, 
            fontSize: '12px', 
            border: 'none', 
            cursor: 'pointer', 
            fontFamily: '"Outfit", sans-serif', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            boxShadow: '0 2px 8px rgba(88,164,41,0.2)'
          }}
        >
          <Plus size={14} /> Add Property
        </button>
      );
    }
    if (location.pathname === '/owner/dashboard') {
      return (
        <button 
          onClick={() => navigate('/owner/properties')}
          style={{ 
            background: '#58A429', 
            color: '#ffffff', 
            borderRadius: '8px', 
            padding: '8px 16px', 
            fontWeight: 600, 
            fontSize: '12px', 
            border: 'none', 
            cursor: 'pointer', 
            fontFamily: '"Outfit", sans-serif', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            boxShadow: '0 2px 8px rgba(88, 164, 41, 0.2)'
          }}
        >
          Manage Listings <ArrowUpRight size={14} />
        </button>
      );
    }
    return null;
  };

  return (
    <header className="topbar">
      {/* Left – page title */}
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="mobile-menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <Menu size={22} />
        </button>
        <h1 className="topbar-title" style={{ fontSize: '20px', fontFamily: '"Outfit", sans-serif', fontWeight: 600 }}>{title}</h1>
      </div>

      {/* Right – action buttons + date filter + user */}
      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Date picker pill (Only on Dashboard) */}
        {location.pathname === '/owner/dashboard' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DateRangeDropdown 
              startDate={dateFrom}
              endDate={dateTo}
              onChange={handleDateChange}
            />
            {(dateFrom || dateTo) && (
              <button 
                onClick={handleClear} 
                style={{ fontSize: '12px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Action Button */}
        {renderActionButton()}

        {/* User block */}
        <div className="topbar-user" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#ffffff', position: 'relative' }}>
          {(() => {
            const getAvatarUrl = (av) => {
              if (!av) return '';
              if (av.startsWith('http') || av.startsWith('data:')) return av;
              const base = (import.meta.env.VITE_API_BASE || 'http://localhost:8000/api').replace('/api', '');
              return `${base}/uploads/${av}`;
            };
            return (
              <div className="topbar-avatar" style={{ background: '#58A429', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, fontSize: '14px', overflow: 'hidden' }}>
                {user.avatar ? (
                  <img src={getAvatarUrl(user.avatar)} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  initials
                )}
              </div>
            );
          })()}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="topbar-user-name" style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{user.name}</div>
            <div className="topbar-user-role" style={{ fontSize: '11px', color: '#6B7280' }}>{user.email}</div>
          </div>
          <ChevronDown style={{ width: 13, height: 13, color: '#9CA3AF' }} />
          <select 
            onChange={(e) => {
              if (e.target.value === 'logout') {
                navigate('/owner/logout');
              } else if (e.target.value === 'profile') {
                navigate('/owner/profile');
              }
            }}
            value=""
            style={{ position: 'absolute', opacity: 0, top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
          >
            <option value="" disabled>Select Action</option>
            <option value="profile">Profile</option>
            <option value="logout">Log Out</option>
          </select>
        </div>
      </div>
    </header>
  );
}
