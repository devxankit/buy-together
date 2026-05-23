import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * Modern floating curved bottom navigation matching custom premium design systems.
 * Aligns the create action button perfectly inline in the same row, and provides smooth
 * active bubble-expanding tab changes for all exploration routes.
 */
const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: (isActive) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    {
      path: '/categories',
      label: 'Explore',
      icon: (isActive) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
        </svg>
      )
    },
    {
      path: '/groups/create',
      label: 'Create',
      icon: (isActive) => (
        <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all ${
          isActive 
            ? 'bg-gradient-to-tr from-[var(--primary-deep)] to-[var(--primary)] text-white shadow-lg shadow-primary/20 scale-105' 
            : 'bg-primary text-white shadow-md shadow-primary/15'
        }`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4.5 h-4.5 stroke-[2.5]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="18"
            height="18"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
      )
    },
    {
      path: '/groups',
      label: 'My Groups',
      icon: (isActive) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      )
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: (isActive) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    }
  ];

  // Helper to determine the active tab index for sliding animation
  const activeIndex = navItems.findIndex(item => {
    if (location.pathname === '/groups/create') return false; // Hide pill for create tab
    if (item.path === '/') return location.pathname === '/';
    if (item.path === '/groups') return location.pathname.startsWith('/groups') && location.pathname !== '/groups/create';
    return location.pathname.startsWith(item.path);
  });

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(min(100vw,430px)-32px)] z-50">
      {/* Curved floating bar container with modern glow and outline */}
      <nav className="relative h-[64px] bg-[var(--nav-bg)] backdrop-blur-xl border border-line rounded-[22px] shadow-[0_10px_35px_rgba(0,0,0,0.06)] grid grid-cols-5 items-center px-3 select-none">
        
        {/* Sliding Active Background Pill */}
        {activeIndex !== -1 && (
          <div
            className="absolute h-[46px] bg-primary-soft border border-primary/10 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              left: `calc(12px + ${activeIndex} * (100% - 24px) / 5 + 3px)`,
              top: '50%',
              transform: 'translateY(-50%)',
              width: `calc((100% - 24px) / 5 - 6px)`,
              pointerEvents: 'none'
            }}
          />
        )}

        {navItems.map((item, idx) => {
          const isActive = idx === activeIndex;

          return (
            <NavLink
              key={idx}
              to={item.path}
              className="flex flex-col items-center justify-center h-[54px] w-full rounded-xl active:scale-95 transition-all text-center z-10"
              style={{
                color: isActive ? 'var(--primary)' : 'rgba(107, 107, 114, 0.65)',
                fontWeight: isActive ? '800' : '500',
              }}
            >
              <span className={`transition-all duration-300 flex items-center justify-center ${
                isActive && item.label !== 'Create' ? 'scale-110 text-primary' : item.label !== 'Create' ? 'text-muted/70' : ''
              }`}>
                {item.icon(isActive)}
              </span>
              
              <span className={`text-[9.5px] tracking-tight leading-none mt-1 transition-all duration-200 ${
                isActive ? 'font-black opacity-100' : 'font-semibold opacity-60'
              }`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
