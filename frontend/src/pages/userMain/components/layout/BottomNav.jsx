import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * Modern floating curved bottom navigation matching custom premium design systems.
 * Elevates the create action button and provides smooth active bubble-expanding tab changes.
 */
const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    {
      path: '/groups',
      label: 'Groups',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      path: '/groups/create',
      label: 'Create',
      isCreate: true
    },
    {
      path: '/deals',
      label: 'Deals',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18"></path>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      )
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: (
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
        {activeIndex !== -1 && activeIndex !== 2 && (
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
          if (item.isCreate) {
            return (
              <div key={idx} className="relative h-full flex items-center justify-center">
                {/* Visual curved notched backdrop behind elevated button */}
                <div className="absolute -top-[16px] w-[58px] h-[29px] bg-white border-t border-r border-l border-[#0D9488]/12 rounded-t-[29px] shadow-sm pointer-events-none" style={{ backgroundColor: 'inherit' }} />
                
                {/* Actual Elevated Floating + Button */}
                <NavLink
                  to={item.path}
                  className="absolute -top-[21px] w-[46px] h-[46px] bg-gradient-to-tr from-[#0B7A70] to-[#0D9488] text-white rounded-full flex items-center justify-center shadow-[0_6px_16px_rgba(13,148,136,0.35)] hover:shadow-[0_8px_20px_rgba(13,148,136,0.45)] hover:scale-105 active:scale-95 border-4 border-white transition-all z-10"
                  aria-label="Create new group deal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5.5 h-5.5 stroke-[3]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </NavLink>
              </div>
            );
          }

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
                {item.icon}
              </span>
              
              {isActive && (
                <span className="text-[9px] font-bold tracking-tight leading-none animate-fadeIn">
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
