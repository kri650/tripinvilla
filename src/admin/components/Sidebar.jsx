import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Building2,
  ClipboardList,
  MapPin,
  Users,
  Tag,
  Layers,
  Map,
  Star,
  Globe,
  Info,
  UserCircle,
  Phone,
  FileText,
  Lock,
  ShieldCheck,
  MessageSquare,
  PlayCircle,
  LogOut,
  Compass,
  Sparkles,
} from 'lucide-react';

/* ─── Navigation Config (matches Figma exactly) ─────────────── */
const NAV_SECTIONS = [
  {
    label: 'Dashboard',
    items: [
      { label: 'Dashboard Analytics', icon: LayoutGrid, to: '/admin/dashboard' },
    ],
  },
  {
    label: 'Property Management',
    items: [
      { label: 'All Properties',      icon: Building2,     to: '/admin/properties/all' },
      { label: 'Property Requests',   icon: ClipboardList, to: '/admin/properties/rooms' },
      { label: 'Cities & Locations',  icon: MapPin,        to: '/admin/properties/cities' },
      { label: 'Property Owners',     icon: Users,         to: '/admin/properties/owned' },
      { label: 'Offers by Date',      icon: Tag,           to: '/admin/properties/offers' },
    ],
  },
  {
    label: 'Masters',
    items: [
      { label: 'Property Masters',          icon: Layers,      to: '/admin/modes/property-makers' },
      { label: 'Property Type Master',      icon: Building2,   to: '/admin/masters/property-types' },
      { label: 'Country Master',            icon: Globe,       to: '/admin/masters/country' },
      { label: 'State Master',              icon: Map,         to: '/admin/masters/state' },
      { label: 'City Master',               icon: Building2,   to: '/admin/masters/city' },
      { label: 'Location Master',           icon: Map,         to: '/admin/masters/location' },
      { label: 'Destination Master',        icon: Compass,     to: '/admin/masters/destination' },
      { label: 'Unique Experience Master',  icon: Sparkles,    to: '/admin/masters/unique-experience' },
      { label: 'Amenities Master',          icon: Star,        to: '/admin/masters/amenities' },
    ],
  },
  {
    label: 'Content Management',
    items: [
      { label: 'Homepage',            icon: Globe,        to: '/admin/content/homepage' },
      { label: 'About Us',            icon: Info,         to: '/admin/content/about-us' },
      { label: 'Account',             icon: UserCircle,   to: '/admin/content/account' },
      { label: 'Contacts',            icon: Phone,        to: '/admin/content/contacts' },
      { label: 'Terms & Conditions',  icon: FileText,     to: '/admin/content/terms' },
      { label: 'Privacy Policy',      icon: Lock,         to: '/admin/content/privacy' },
    ],
  },
  {
    label: 'User Access',
    items: [
      { label: 'Admin List',      icon: ShieldCheck,   to: '/admin/users/admin-list' },
      { label: 'Enquiries',       icon: MessageSquare, to: '/admin/enquiries' },
      { label: 'Support Videos',  icon: PlayCircle,    to: '/admin/users/support-abuse' },
      { label: 'Log Out',         icon: LogOut,        to: '/admin/users/logout' },
    ],
  },
];

export default function Sidebar({ className = '' }) {
  return (
    <aside className={`sidebar ${className}`}>
      {/* ── Logo Container (matches Figma placement) ─────────── */}
      <div className="sidebar-logo">
        <img 
          src="/tripinvilla_logo.png" 
          alt="Tripinstays" 
          className="sidebar-logo-img" 
        />
      </div>

      {/* ── Divider under Logo ── */}
      <div className="sidebar-divider" />

      {/* ── Navigation List ─────────────────────────────────── */}
      <nav className="sidebar-nav">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={section.label} className="sidebar-section-group">
            <div className="sidebar-section-label">{section.label}</div>

            <div className="sidebar-nav-items">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-item${isActive ? ' active' : ''}`
                  }
                >
                  <span className="nav-icon">
                    <item.icon />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Render divider between sections, except after the last section */}
            {idx < NAV_SECTIONS.length - 1 && <div className="sidebar-divider" />}
          </div>
        ))}
      </nav>
    </aside>
  );
}
