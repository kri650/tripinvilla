import { footerBgImg } from '../assets';

export default function Footer({ token, onNavigate, onRequireAuth }) {
  return (
    <footer 
      className="relative w-full min-h-[450px] bg-cover bg-center bg-no-repeat flex items-center justify-center text-white max-[1024px]:min-h-[380px] max-[900px]:min-h-[350px] max-[768px]:min-h-[320px] max-[640px]:min-h-[280px] max-[480px]:min-h-[240px]"
      style={{ backgroundImage: `url("${footerBgImg}")` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.5)] to-[rgba(0,0,0,0.7)]" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 py-10 flex flex-col items-center text-center box-border max-[1200px]:px-8 max-[1024px]:px-7 max-[900px]:px-6 max-[768px]:px-5 max-[640px]:px-4 max-[480px]:px-3">
        
        {/* Logo */}
        <div className="mb-6 max-[900px]:mb-4 max-[768px]:mb-[14px]">
          <img 
            src="/tripinvilla_logo.png" 
            alt="Tripin Villa Logo" 
            className="h-[78px] w-auto object-contain max-[900px]:h-16 max-[768px]:h-14 max-[640px]:h-12 max-[480px]:h-11 max-[360px]:h-10"
          />
        </div>

        {/* Description */}
        <p className="font-['Lato'] text-[15px] font-normal leading-[1.7] text-white opacity-90 max-w-[720px] mx-auto mb-6 max-[1024px]:max-w-[520px] max-[1024px]:text-sm max-[900px]:max-w-[480px] max-[900px]:text-sm max-[900px]:leading-[1.6] max-[900px]:mb-6 max-[768px]:max-w-[400px] max-[768px]:text-[13px] max-[768px]:leading-[1.55] max-[768px]:mb-5 max-[640px]:max-w-[320px] max-[640px]:text-xs max-[640px]:leading-[1.5] max-[640px]:mb-4 max-[480px]:text-[11px] max-[480px]:max-w-[280px] max-[480px]:mb-3 max-[360px]:text-[10px] max-[360px]:max-w-[240px]">
          We help travelers discover comfortable, trusted, and affordable stays across India. From cozy homestays and private villas to modern apartments and resorts, our platform brings together verified properties to suit every travel style
        </p>

        {/* Divider */}
        <div className="w-full max-w-[900px] h-px bg-[rgba(255,255,255,0.2)] my-4 max-[900px]:my-2 max-[768px]:my-2 max-[640px]:my-2" />

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-[50px] my-4 w-full max-[1200px]:gap-8 max-[1024px]:gap-7 max-[900px]:gap-5 max-[768px]:gap-4 max-[640px]:gap-3 max-[640px]:my-3 max-[480px]:gap-[10px] max-[480px]:my-2 max-[360px]:gap-2">
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); window.scrollTo(0,0); onNavigate('Home'); }}
            className="font-['Lato'] text-[15px] font-medium text-white no-underline whitespace-nowrap relative transition-colors duration-200 hover:text-[#0C6DC4] max-[900px]:text-sm max-[768px]:text-[13px] max-[768px]:px-2 max-[768px]:py-1 max-[768px]:rounded max-[768px]:hover:bg-[rgba(255,255,255,0.1)] max-[640px]:text-[13px] max-[640px]:px-3 max-[640px]:py-1.5 max-[480px]:text-xs max-[480px]:px-2.5 max-[480px]:py-[5px] max-[360px]:text-[11px] max-[360px]:px-2 max-[360px]:py-1"
          >
            Home
          </a>
          
          <a 
            href="/properties" 
            onClick={(e) => { e.preventDefault(); window.scrollTo(0,0); onNavigate('Properties'); }}
            className="font-['Lato'] text-[15px] font-medium text-white no-underline whitespace-nowrap relative transition-colors duration-200 hover:text-[#0C6DC4] max-[900px]:text-sm max-[768px]:text-[13px] max-[768px]:px-2 max-[768px]:py-1 max-[768px]:rounded max-[768px]:hover:bg-[rgba(255,255,255,0.1)] max-[640px]:text-[13px] max-[640px]:px-3 max-[640px]:py-1.5 max-[480px]:text-xs max-[480px]:px-2.5 max-[480px]:py-[5px] max-[360px]:text-[11px] max-[360px]:px-2 max-[360px]:py-1"
          >
            Properties
          </a>
          
          <a 
            href="/wishlist" 
            onClick={(e) => { e.preventDefault(); window.scrollTo(0,0); if (!token) { onRequireAuth(); return; } onNavigate('Wishlist'); }}
            className="font-['Lato'] text-[15px] font-medium text-white no-underline whitespace-nowrap relative transition-colors duration-200 hover:text-[#0C6DC4] max-[900px]:text-sm max-[768px]:text-[13px] max-[768px]:px-2 max-[768px]:py-1 max-[768px]:rounded max-[768px]:hover:bg-[rgba(255,255,255,0.1)] max-[640px]:text-[13px] max-[640px]:px-3 max-[640px]:py-1.5 max-[480px]:text-xs max-[480px]:px-2.5 max-[480px]:py-[5px] max-[360px]:text-[11px] max-[360px]:px-2 max-[360px]:py-1"
          >
            Wishlist
          </a>
          
          <a 
            href="/my-bookings" 
            onClick={(e) => { e.preventDefault(); window.scrollTo(0,0); if (!token) { onRequireAuth(); return; } onNavigate('Profile'); }}
            className="font-['Lato'] text-[15px] font-medium text-white no-underline whitespace-nowrap relative transition-colors duration-200 hover:text-[#0C6DC4] max-[900px]:text-sm max-[768px]:text-[13px] max-[768px]:px-2 max-[768px]:py-1 max-[768px]:rounded max-[768px]:hover:bg-[rgba(255,255,255,0.1)] max-[640px]:text-[13px] max-[640px]:px-3 max-[640px]:py-1.5 max-[480px]:text-xs max-[480px]:px-2.5 max-[480px]:py-[5px] max-[360px]:text-[11px] max-[360px]:px-2 max-[360px]:py-1"
          >
            My Bookings
          </a>
          
          <a 
            href="/about-us" 
            onClick={(e) => { e.preventDefault(); window.scrollTo(0,0); onNavigate('About Us'); }}
            className="font-['Lato'] text-[15px] font-medium text-white no-underline whitespace-nowrap relative transition-colors duration-200 hover:text-[#0C6DC4] max-[900px]:text-sm max-[768px]:text-[13px] max-[768px]:px-2 max-[768px]:py-1 max-[768px]:rounded max-[768px]:hover:bg-[rgba(255,255,255,0.1)] max-[640px]:text-[13px] max-[640px]:px-3 max-[640px]:py-1.5 max-[480px]:text-xs max-[480px]:px-2.5 max-[480px]:py-[5px] max-[360px]:text-[11px] max-[360px]:px-2 max-[360px]:py-1"
          >
            About Us
          </a>
          
          <a 
            href="/contact" 
            onClick={(e) => { e.preventDefault(); window.scrollTo(0,0); onNavigate('Contact'); }}
            className="font-['Lato'] text-[15px] font-medium text-white no-underline whitespace-nowrap relative transition-colors duration-200 hover:text-[#0C6DC4] max-[900px]:text-sm max-[768px]:text-[13px] max-[768px]:px-2 max-[768px]:py-1 max-[768px]:rounded max-[768px]:hover:bg-[rgba(255,255,255,0.1)] max-[640px]:text-[13px] max-[640px]:px-3 max-[640px]:py-1.5 max-[480px]:text-xs max-[480px]:px-2.5 max-[480px]:py-[5px] max-[360px]:text-[11px] max-[360px]:px-2 max-[360px]:py-1"
          >
            Contact Us
          </a>
          
          <a 
            href="/terms" 
            onClick={(e) => { e.preventDefault(); window.scrollTo(0,0); onNavigate('Terms'); }}
            className="font-['Lato'] text-[15px] font-medium text-white no-underline whitespace-nowrap relative transition-colors duration-200 hover:text-[#0C6DC4] max-[900px]:text-sm max-[768px]:text-[13px] max-[768px]:px-2 max-[768px]:py-1 max-[768px]:rounded max-[768px]:hover:bg-[rgba(255,255,255,0.1)] max-[640px]:text-[13px] max-[640px]:px-3 max-[640px]:py-1.5 max-[480px]:text-xs max-[480px]:px-2.5 max-[480px]:py-[5px] max-[360px]:text-[11px] max-[360px]:px-2 max-[360px]:py-1"
          >
            Terms & Conditions
          </a>
          
          <a 
            href="/privacy" 
            onClick={(e) => { e.preventDefault(); window.scrollTo(0,0); onNavigate('Privacy'); }}
            className="font-['Lato'] text-[15px] font-medium text-white no-underline whitespace-nowrap relative transition-colors duration-200 hover:text-[#0C6DC4] max-[900px]:text-sm max-[768px]:text-[13px] max-[768px]:px-2 max-[768px]:py-1 max-[768px]:rounded max-[768px]:hover:bg-[rgba(255,255,255,0.1)] max-[640px]:text-[13px] max-[640px]:px-3 max-[640px]:py-1.5 max-[480px]:text-xs max-[480px]:px-2.5 max-[480px]:py-[5px] max-[360px]:text-[11px] max-[360px]:px-2 max-[360px]:py-1"
          >
            Privacy Policy
          </a>
        </div>

        {/* Divider */}
        <div className="w-full max-w-[900px] h-px bg-[rgba(255,255,255,0.2)] my-2 max-[768px]:my-2 max-[640px]:my-2" />

        {/* Copyright */}
        <p className="font-['Lato'] text-[13.5px] text-white m-0 mt-4 opacity-80 max-[768px]:text-xs max-[768px]:mt-3 max-[640px]:text-[11px] max-[640px]:mt-[10px] max-[480px]:text-[10px] max-[480px]:mt-2 max-[360px]:text-[9px]">
          © {new Date().getFullYear()} Tripinvilla.com all rights reserved
        </p>
      </div>
    </footer>
  );
}
