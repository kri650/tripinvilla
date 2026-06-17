import React, { useState, useEffect } from 'react';
import { Home, MapPin, Heart, Inbox, Info, ThumbsUp, PlusCircle, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.mobile-nav-menu') && !e.target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavigation = (menuName) => {
    const target =
      menuName === 'My Enquiries' ? 'Enquiries' :
        menuName === 'Wishlist' ? 'Wishlist' :
          menuName;

    if ((target === 'Wishlist' || target === 'Enquiries') && !token) {
      onOpenAuth('login');
      setIsMobileMenuOpen(false);
      return;
    }

    onNavigate(target);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    {
      name: 'Home',
      lucideIcon: <Home size={13} strokeWidth={2.5} />
    },
    {
      name: 'Properties',
      lucideIcon: <MapPin size={13} strokeWidth={2.5} />
    },
    {
      name: 'Wishlist',
      lucideIcon: <Heart size={13} strokeWidth={2.5} />
    },
    {
      name: 'My Enquiries',
      lucideIcon: <Inbox size={13} strokeWidth={2.5} />
    },
    {
      name: 'About Us',
      lucideIcon: <Info size={13} strokeWidth={2.5} />
    },
    {
      name: 'Recommend By Us',
      lucideIcon: <ThumbsUp size={13} strokeWidth={2.5} />
    },
    {
      name: 'List Your Place',
      lucideIcon: <PlusCircle size={13} strokeWidth={2.5} />
    }
  ];

  return (
    <>
      <div className="navbar-container">
        <div className="nav-logo" onClick={() => {
          onNavigate('Home');
          setIsMobileMenuOpen(false);
        }}>
          <img src="/tripinvilla_logo.png" alt="Tripinstays Logo" />
        </div>

        {/* Desktop Navigation */}
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

        {/* Desktop Auth Section */}
        {user ? (
          <div className="nav-profile-block nav-pill-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 12px' }}>
            <div
              onClick={() => onNavigate('Profile')}
              style={{
                background: 'var(--primary-green, #58A429)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '16px',
                fontFamily: '"Outfit", sans-serif',
                overflow: 'hidden'
              }}
            >
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user.name ? user.name[0].toUpperCase() : 'U'
              )}
            </div>
            <button
              style={{
                background: 'transparent',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 16px',
                fontSize: '13px',
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 600,
                borderRadius: '60px',
                cursor: 'pointer'
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

        {/* Mobile Hamburger Toggle */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X size={20} strokeWidth={2.5} color="#374151" />
          ) : (
            <Menu size={20} strokeWidth={2.5} color="#374151" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu - Dropdown Style */}
      <div className={`mobile-nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {/* Navigation Items */}
        {navItems.map((item) => {
          const isActive = (activeMenu === item.name) ||
            (activeMenu === 'Search' && item.name === 'Properties') ||
            (activeMenu === 'Detail' && item.name === 'Properties') ||
            (activeMenu === 'Profile' && item.name === 'Properties') ||
            (activeMenu === 'Enquiries' && item.name === 'My Enquiries');

          return (
            <div
              key={item.name}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleMobileNavigation(item.name)}
            >
              <div className="mobile-nav-icon">
                {React.cloneElement(item.lucideIcon, { size: 16, strokeWidth: 2.5 })}
              </div>
              <span className="mobile-nav-label">{item.name}</span>
            </div>
          );
        })}

        {/* Auth Section */}
        {user ? (
          <div className="mobile-profile-section">
            <div className="mobile-profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" />
              ) : (
                user.name ? user.name[0].toUpperCase() : 'U'
              )}
            </div>
            <p className="mobile-profile-name">{user.name || 'User'}</p>
            <button className="mobile-logout-btn" onClick={() => {
              onLogout();
              setIsMobileMenuOpen(false);
            }}>
              Log Out
            </button>
          </div>
        ) : (
          <div className="mobile-auth-section">
            <button className="mobile-login-btn" onClick={() => {
              onOpenAuth('login');
              setIsMobileMenuOpen(false);
            }}>
              Log In / Sign Up
            </button>
          </div>
        )}
      </div>
    </>
  );
}
