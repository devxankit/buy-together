import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { useSelector } from '../../hooks/useSelector';
import Sidebar from './Sidebar';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="h-20 bg-white/50 backdrop-blur-xl border-none pl-6 pr-3 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center">
          <Link to="/" className="text-[22px] md:text-2xl font-black tracking-tighter flex items-center">
            <span className="text-[#0052cc]">Buy</span>
            <span className="text-[#ff7a00]">together</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/notifications" className="relative p-2 text-gray-900 transition-all active:scale-90">
            <Bell size={24} strokeWidth={2} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ff7a00] border-2 border-white rounded-full" />
          </Link>
          
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-900 transition-all active:scale-90"
          >
            <Menu size={24} strokeWidth={2.5} />
          </button>
        </div>
      </nav>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
};

export default Navbar;
