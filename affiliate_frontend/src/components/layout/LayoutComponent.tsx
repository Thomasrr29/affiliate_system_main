import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen w-full bg-gray-50">
      {/* Header */}
      <Header 
        onMenuClick={toggleSidebar}
        isMobileMenuOpen={isSidebarOpen}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
          <Outlet/>
      </div>
    </div>
  );
}

export default Layout