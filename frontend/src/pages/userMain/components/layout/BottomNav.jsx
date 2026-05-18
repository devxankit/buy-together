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
      path: '/groups',
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
        <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center transition-all ${
          isActive 
            ? 'bg-gradient-to-tr from-[#0B7A70] to-[#0D9488] text-white shadow-md shadow-[#0D9488]/20 scale-105' 
            : 'bg-slate-100 text-[#64748B]'
        }`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 stroke-[3]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
      )
    },
    {
      path: '/deals',
      label: 'My Groups',
      icon: (isActive) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
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
    if (item.path === '/') return location.pathname === '/';
    if (item.path === '/groups') return location.pathname.startsWith('/groups') && location.pathname !== '/groups/create';
    return location.pathname.startsWith(item.path);
  });

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(min(100vw,430px)-32px)] z-50">
      {/* Curved floating bar container with modern glow and outline */}
      <nav className="relative h-[64px] bg-white/94 backdrop-blur-xl border border-[#0D9488]/15 rounded-[22px] shadow-[0_10px_35px_rgba(11,122,112,0.18)] grid grid-cols-5 items-center px-3 select-none">
        
        {/* Sliding Active Background Pill */}
        {activeIndex !== -1 && (
          <div
            className="absolute h-[38px] bg-gradient-to-r from-[rgba(11,122,112,0.08)] to-[rgba(13,148,136,0.08)] border border-[rgba(13,148,136,0.12)] rounded-xl transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              left: `calc(12px + ${activeIndex} * (100% - 24px) / 5 + 3px)`,
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
              className="flex items-center justify-center gap-1 h-[38px] w-full rounded-xl active:scale-95 transition-all text-center z-10"
              style={{
                color: isActive ? 'var(--primary)' : 'rgba(107, 107, 114, 0.65)',
                fontWeight: isActive ? '800' : '500',
              }}
            >
              <span className={`transition-all duration-300 ${isActive ? 'scale-110 text-primary' : 'text-muted/70'}`}>
                {item.icon(isActive)}
              </span>
              
              {isActive && item.label !== 'Create' && (
                <span className="text-[9px] font-black tracking-tight leading-none animate-fadeIn ml-1">
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
