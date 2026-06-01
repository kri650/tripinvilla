import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Calendar, ChevronDown, Menu } from 'lucide-react';

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

function formatMonthYear(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function Topbar({ onToggleSidebar }) {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Dashboard';
  
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return localStorage.getItem('dashboard_month') || '';
  });

  const handleMonthChange = (e) => {
    const val = e.target.value;
    setSelectedMonth(val);
    localStorage.setItem('dashboard_month', val);
  };

  return (
    <header className="topbar">
      {/* Left – page title */}
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="mobile-menu-btn" onClick={onToggleSidebar} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#111827' }}>
          <Menu size={24} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      {/* Right – date filter + user */}
      <div className="topbar-right">
        {/* Date picker pill */}
        <div className="topbar-date-btn" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#fff' }}>
          <input 
            type="month" 
            value={selectedMonth}
            max={new Date().toISOString().slice(0, 7)}
            onChange={handleMonthChange}
            onClick={(e) => { try { e.target.showPicker(); } catch(err) {} }}
            style={{ position: 'absolute', opacity: 0, top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
          />
          <Calendar style={{ width: 14, height: 14, color: '#6B7280' }} />
          <span>{formatMonthYear(selectedMonth)}</span>
          <ChevronDown style={{ width: 13, height: 13, color: '#9CA3AF' }} />
        </div>

        {/* User block */}
        <div className="topbar-user" style={{ position: 'relative' }}>
          {(() => {
            const adminUserStr = localStorage.getItem('admin_user');
            let name = 'TripInVilla Admin';
            let email = 'admin@tripinvilla.com';
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
              } catch (e) {
                console.error(e);
              }
            }
            return (
              <>
                <div className="topbar-avatar">{initial}</div>
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
