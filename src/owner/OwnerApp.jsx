import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import OwnerLayout from './layouts/OwnerLayout';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import MyProperties from './pages/MyProperties';
import PropertyRequests from './pages/PropertyRequests';
import OffersByDate from './pages/OffersByDate';
import Enquiries from './pages/Enquiries';
import Premium from './pages/Premium';
import LogOut from './pages/LogOut';
import Login from './pages/Login';
import Register from './pages/Register';
import PricingRules from './pages/PricingRules';
import './owner.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token') || localStorage.getItem('user_token');
  if (!token) {
    return <Navigate to="/owner/login" replace />;
  }
  return children;
};

export default function OwnerApp() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route
        element={
          <ProtectedRoute>
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="properties" element={<MyProperties />} />
        <Route path="pricing-rules" element={<PricingRules />} />
        <Route path="profile" element={<Profile />} />
        <Route path="requests" element={<PropertyRequests />} />
        <Route path="offers" element={<OffersByDate />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="premium" element={<Premium />} />
        <Route path="logout" element={<LogOut />} />
      </Route>
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
