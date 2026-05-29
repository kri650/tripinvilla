import React from 'react';
import { Home, MapPin, Heart, Inbox, Info, ThumbsUp, PlusCircle } from 'lucide-react';
import {
  aboutIcon,
  darkLogoImg,
  enquiriesIcon,
  homeIcon,
  listYourPlaceIcon,
  logoImg,
  propertiesIcon,
  recommendIcon,
  wishlistIcon,
} from '../assets';

export default function Navbar({
  activeMenu,
  onNavigate,
  token,
  user,
  onLogout,
  onOpenAuth,
}) {
  const navItems = [
    {
      name: 'Home',
      lucideIcon: <Home size={13} strokeWidth={2.5} />,
      customIcon: homeIcon
    },
    {
      name: 'Properties',
      lucideIcon: <MapPin size={13} strokeWidth={2.5} />,
      customIcon: propertiesIcon
    },
    {
      name: 'Wishlist',
      lucideIcon: <Heart size={13} strokeWidth={2.5} />,
      customIcon: wishlistIcon
    },
    {
      name: 'My Enquiries',
      lucideIcon: <Inbox size={13} strokeWidth={2.5} />,
      customIcon: enquiriesIcon
    },
    {
      name: 'About Us',
      lucideIcon: <Info size={13} strokeWidth={2.5} />,
      customIcon: aboutIcon
    },
    {
      name: 'Recommend By Us',
      lucideIcon: <ThumbsUp size={13} strokeWidth={2.5} />,
      customIcon: recommendIcon
    },
    {
      name: 'List Your Place',
      lucideIcon: <PlusCircle size={13} strokeWidth={2.5} />,
      customIcon: listYourPlaceIcon
    }
  ];

  return (
    <div className="navbar-container">
      <div className="nav-logo" onClick={() => onNavigate('Home')}>
        <img src="/tripinvilla_logo.png" alt="Tripinstays Logo" />
      </div>

      <div className="nav-pill-wrapper">
        {navItems.map((item, index) => {
          const isActive = (activeMenu === item.name) ||
            (activeMenu === 'Search' && item.name === 'Properties') ||
            (activeMenu === 'Detail' && item.name === 'Properties') ||
            (activeMenu === 'Profile' && item.name === 'Properties') ||
            (activeMenu === 'Enquiries' && item.name === 'My Enquiries');

          return (
            <React.Fragment key={item.name}>
              <button
                onClick={() => {
                  const target =
                    item.name === 'My Enquiries' ? 'Enquiries' :
                      item.name === 'Wishlist' ? 'Wishlist' :
                        item.name;

                  if ((target === 'Wishlist' || target === 'Enquiries') && !token) {
                    onOpenAuth('login');
                    return;
                  }

                  onNavigate(target);
                }}
                className="nav-pill-item"
              >
                <div
                  className={`nav-icon-circle ${isActive ? 'active' : 'inactive'}`}
                  style={item.customIcon && !isActive ? { border: 'none', background: 'none', boxShadow: 'none' } : {}}
                >
                  {item.customIcon ? (
                    <img
                      src={item.customIcon}
                      alt={item.name}
                      style={{
                        width: '31px',
                        height: '31px',
                        objectFit: 'contain',
                        filter: isActive ? 'none' : 'grayscale(1) opacity(0.4)'
                      }}
                    />
                  ) : (
                    item.lucideIcon
                  )}
                </div>
                <span style={{ color: isActive ? 'var(--primary-blue)' : '#FFFFFF', fontWeight: isActive ? 600 : 500 }}>
                  {item.name}
                </span>
              </button>

              {index < navItems.length - 1 && <div className="nav-divider" />}
            </React.Fragment>
          );
        })}
      </div>

      {user ? (
        <div className="nav-profile-block" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            onClick={() => onNavigate('Profile')}
            style={{
              background: 'var(--primary-green, #58A429)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '18px',
              fontFamily: '"Outfit", sans-serif'
            }}
          >
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <button
            className="btn-login"
            style={{
              background: 'transparent',
              color: (activeMenu === 'Detail') ? '#111827' : '#FFFFFF',
              border: (activeMenu === 'Detail') ? '1px solid rgba(17,24,39,0.3)' : '1px solid rgba(255,255,255,0.5)',
              padding: '6px 16px',
              fontSize: '13px',
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 600
            }}
            onClick={onLogout}
          >
            Log Out
          </button>
        </div>
      ) : (
        <button className="btn-login" onClick={() => onOpenAuth('login')}>
          Log In / Sign Up
        </button>
      )}
    </div>
  );
}
