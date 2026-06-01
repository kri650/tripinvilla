import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import AllProperties from './pages/properties/AllProperties';
import PropertyRooms from './pages/properties/PropertyRooms';
import CitiesLocations from './pages/properties/CitiesLocations';
import PropertyOwned from './pages/properties/PropertyOwned';
import AddPropertyOwner from './pages/properties/AddPropertyOwner';
import OffersbyDate from './pages/properties/OffersbyDate';
import AddOffer from './pages/properties/AddOffer';
import PropertyMakers from './pages/modes/PropertyMakers';
import LocationMakers from './pages/modes/LocationMakers';
import AssemblyMakers from './pages/modes/AssemblyMakers';
import PricingRules from './pages/modes/PricingRules';
import CountryMaster from './pages/masters/CountryMaster';
import StateMaster from './pages/masters/StateMaster';
import CityMaster from './pages/masters/CityMaster';
import LocationMaster from './pages/masters/LocationMaster';
import DestinationMaster from './pages/masters/DestinationMaster';
import UniqueExperienceMaster from './pages/masters/UniqueExperienceMaster';
import AmenitiesMaster from './pages/masters/AmenitiesMaster';
import PropertyTypeMaster from './pages/masters/PropertyTypeMaster';
import Homepage from './pages/content/Homepage';
import AboutUs from './pages/content/AboutUs';
import Account from './pages/content/Account';
import Contacts from './pages/content/Contacts';
import TermsConditions from './pages/content/TermsConditions';
import PrivacyPolicy from './pages/content/PrivacyPolicy';
import AdminList from './pages/useraccess/AdminList';
import Blacklist from './pages/useraccess/Blacklist';
import PayNow from './pages/useraccess/PayNow';
import SupportAbuse from './pages/useraccess/SupportAbuse';
import LogOut from './pages/useraccess/LogOut';
import Enquiries from './pages/Enquiries';
import Login from './pages/Login';
import './admin.css';

export default function AdminApp() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* Property Management */}
        <Route path="properties/all" element={<AllProperties />} />
        <Route path="properties/rooms" element={<PropertyRooms />} />
        <Route path="properties/cities" element={<CitiesLocations />} />
        <Route path="properties/owned" element={<PropertyOwned />} />
        <Route path="properties/owned/add" element={<AddPropertyOwner />} />
        <Route path="properties/offers" element={<OffersbyDate />} />
        <Route path="properties/offers/add" element={<AddOffer />} />
        <Route path="properties/offers/edit/:id" element={<AddOffer />} />
        {/* Modes */}
        <Route path="modes/property-makers" element={<PropertyMakers />} />
        <Route path="modes/location-makers" element={<LocationMakers />} />
        <Route path="modes/assembly-makers" element={<AssemblyMakers />} />
        <Route path="modes/pricing-rules" element={<PricingRules />} />
        {/* Masters */}
        <Route path="masters/country" element={<CountryMaster />} />
        <Route path="masters/state" element={<StateMaster />} />
        <Route path="masters/city" element={<CityMaster />} />
        <Route path="masters/location" element={<LocationMaster />} />
        <Route path="masters/destination" element={<DestinationMaster />} />
        <Route path="masters/unique-experience" element={<UniqueExperienceMaster />} />
        <Route path="masters/amenities" element={<AmenitiesMaster />} />
        <Route path="masters/property-types" element={<PropertyTypeMaster />} />
        {/* Content Management */}
        <Route path="content/homepage" element={<Homepage />} />
        <Route path="content/about-us" element={<AboutUs />} />
        <Route path="content/account" element={<Account />} />
        <Route path="content/contacts" element={<Contacts />} />
        <Route path="content/terms" element={<TermsConditions />} />
        <Route path="content/privacy" element={<PrivacyPolicy />} />
        {/* User Access */}
        <Route path="users/admin-list" element={<AdminList />} />
        <Route path="users/blacklist" element={<Blacklist />} />
        <Route path="users/pay-now" element={<PayNow />} />
        <Route path="users/support-abuse" element={<SupportAbuse />} />
        <Route path="users/logout" element={<LogOut />} />
        {/* Enquiries */}
        <Route path="enquiries" element={<Enquiries />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
