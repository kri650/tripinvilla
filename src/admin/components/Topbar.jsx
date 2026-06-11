import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Calendar, ChevronDown, Menu } from 'lucide-react';

import DateRangeDropdown from '../../components/DateRangeDropdown';

const PAGE_TITLES = {
  '/admin/dashboard':                  'Dashboard',
  '/admin/properties/all':             'All Properties',
  '/admin/properties/rooms':           'Property Requests',
  '/admin/properties/cities':          'Cities & Locations',
  '/admin/properties/owned':           'Property Owners',
  '/admin/properties/offers':          'Offers by Date',
  '/admin/modes/property-makers':      'Property Masters',
  '/admin/modes/location-makers':      'Location Master',
  '/admin/masters/amenities':          'Amenities Master',
  '/admin/masters/country':            'Country Master',
  '/admin/masters/state':              'State Master',
  '/admin/masters/city':               'City Master',
  '/admin/masters/destination':        'Destination Master',
  '/admin/masters/unique-experience':  'Unique Experience Master',
  '/admin/content/homepage':           'Homepage',
  '/admin/content/about-us':           'About Us',
  '/admin/content/account':            'Account',
  '/admin/content/content':            'Contacts',
  '/admin/content/terms':              'Terms & Conditions',
  '/admin/content/privacy':            'Privacy Policy',
  '/admin/users/admin-list':           'Admin List',
  '/admin/enquiries':                  'Enquiries',
  '/admin/users/support-abuse':        'Support Videos',
  '/admin/users/logout':               'Log Out',
};

export default function Topbar({ onToggleSidebar }) {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Dashboard';
  
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleDateChange = (start, end) => {
    setDateFrom(start);
    setDateTo(end);

    window.dispatchEvent(new CustomEvent('dashboard_date_changed', { detail: { dateFrom: start, dateTo: end } }));
  };

  const handleClear = () => {
    setDateFrom('');
    setDateTo('');

    window.dispatchEvent(new CustomEvent('dashboard_date_changed', { detail: { dateFrom: '', dateTo: '' } }));
  };

  return (
    <header className="topbar">
      {/* Left – page title */}
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="mobile-menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <Menu size={22} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      {/* Right – action buttons + user */}
      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

        {/* Date picker pill (Only on Dashboard) */}
        {location.pathname === '/admin/dashboard' && (
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

        {/* User block */}
        <div className="topbar-user" style={{ position: 'relative' }}>
          {(() => {
            const adminUserStr = localStorage.getItem('admin_user');
            let name = 'TripInVilla Admin';
            let email = 'admin@tripinvilla.com';
            let avatar = '';
            let initial = 'T';
            if (adminUserStr) {
              try {
                const u = JSON.parse(adminUserStr);
                if (u.name) {
                  name = u.name;
                  initial = u.name[0].toUpperCase();
                }
                if (u.email) {
                  email = u.email;
                }
                if (u.avatar) {
                  avatar = u.avatar;
                }
              } catch (e) {
                console.error(e);
              }
            }
            const getAvatarUrl = (av) => {
              if (!av) return '';
              if (av.startsWith('http') || av.startsWith('data:')) return av;
              const base = (import.meta.env.VITE_API_BASE || 'http://localhost:8000/api').replace('/api', '');
              return `${base}/uploads/${av}`;
            };
            return (
              <>
                <div className="topbar-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {avatar ? (
                    <img src={getAvatarUrl(avatar)} alt="Admin Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    initial
                  )}
                </div>
                <div>
                  <div className="topbar-user-name">{name}</div>
                  <div className="topbar-user-role">{email}</div>
                </div>
              </>
            );
          })()}
          <ChevronDown style={{ width: 13, height: 13, color: '#9CA3AF', marginLeft: 4 }} />
          <select 
            onChange={(e) => {
              if (e.target.value === 'logout') {
                window.location.href = '/admin/users/logout';
              } else if (e.target.value === 'profile') {
                window.location.href = '/admin/content/account';
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
