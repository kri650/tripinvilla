import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../owner.css';

import React, { useState } from 'react';

export default function OwnerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="owner-theme admin-layout">
      {isSidebarOpen && (
        <div className="sidebar-overlay open" onClick={() => setIsSidebarOpen(false)} />
      )}
      <Sidebar className={isSidebarOpen ? 'open' : ''} />
      <div className="admin-main">
        <Topbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
