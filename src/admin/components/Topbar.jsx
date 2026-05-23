import { useLocation } from 'react-router-dom';
import { Bell, Calendar, ChevronDown } from 'lucide-react';

const PAGE_TITLES = {
  '/admin/dashboard':                  'Dashboard',
  '/admin/properties/all':             'All Properties',
  '/admin/properties/rooms':           'Property Requests',
  '/admin/properties/cities':          'Cities & Locations',
  '/admin/properties/owned':           'Property Owners',
  '/admin/properties/offers':          'Offers by Date',
  '/admin/modes/property-makers':      'Property Masters',
  '/admin/modes/location-makers':      'Location Master',
  '/admin/modes/assembly-makers':      'Amenities Master',
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

function formatMonthYear() {
  return new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function Topbar() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Dashboard';

  return (
    <header className="topbar">
      {/* Left – page title */}
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>

      {/* Right – date filter + user */}
      <div className="topbar-right">
        {/* Date picker pill */}
        <button className="topbar-date-btn">
          <Calendar style={{ width: 14, height: 14, color: '#6B7280' }} />
          <span>{formatMonthYear()}</span>
          <ChevronDown style={{ width: 13, height: 13, color: '#9CA3AF' }} />
        </button>

        {/* User block */}
        <div className="topbar-user">
          {(() => {
            const adminUserStr = localStorage.getItem('admin_user');
            let name = 'Admin User';
            let email = 'admin@tripinvilla.com';
            let initial = 'A';
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
        </div>
      </div>
    </header>
  );
}
