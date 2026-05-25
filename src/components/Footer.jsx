import { footerBgImg, footerLogoImg } from '../assets';

export default function Footer({ token, onNavigate, onRequireAuth }) {
  return (
    <footer className="site-footer" style={{ backgroundImage: `url("${footerBgImg}")` }}>
      <div className="site-footer-overlay">
        <div className="footer-logo-row" style={{ marginBottom: 24, marginTop: -40 }}>
          <img src={footerLogoImg} alt="Tripin Villa Logo" style={{ height: '78px', width: 'auto', objectFit: 'contain' }} />
        </div>

        <p className="footer-intro-desc">
          We help travelers discover comfortable, trusted, and affordable stays across India. From cozy homestays and private villas to modern apartments and resorts, our platform brings together verified properties to suit every travel style
        </p>

        <div className="footer-line-divider" />

        <div className="footer-nav-row">
          <a href="#home" onClick={() => onNavigate('Home')}>Home</a>
          <div className="footer-vertical-divider" />
          <a href="#properties" onClick={() => onNavigate('Properties')}>Properties</a>
          <div className="footer-vertical-divider" />
          <a href="#wishlist" onClick={() => { if (!token) { onRequireAuth(); return; } onNavigate('Wishlist'); }}>Wishlist</a>
          <div className="footer-vertical-divider" />
          <a href="#bookings" onClick={() => { if (!token) { onRequireAuth(); return; } onNavigate('Profile'); }}>My Bookings</a>
          <div className="footer-vertical-divider" />
          <a href="#about" onClick={() => onNavigate('About Us')}>About Us</a>
          <div className="footer-vertical-divider" />
          <a href="#contact" onClick={() => onNavigate('Contact')}>Contact Us</a>
          <div className="footer-vertical-divider" />
          <a href="#terms" onClick={() => onNavigate('Terms')}>Terms & Conditions</a>
          <div className="footer-vertical-divider" />
          <a href="#privacy" onClick={() => onNavigate('Privacy')}>Privacy Policy</a>
        </div>

        <div className="footer-line-divider" />

        <p className="footer-copyright-text">
          © {new Date().getFullYear()} Tripinvilla.com all rights reserved
        </p>
      </div>
    </footer>
  );
}
