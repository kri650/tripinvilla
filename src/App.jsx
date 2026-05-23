import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminApp from './admin/AdminApp';
import OwnerApp from './owner/OwnerApp';
import GuestApp from './GuestApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/owner/*" element={<OwnerApp />} />
        <Route path="/*" element={<GuestApp />} />
      </Routes>
    </BrowserRouter>
  );
}
