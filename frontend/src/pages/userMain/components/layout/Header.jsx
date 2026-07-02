import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Modern Header component for userMain module.
 * Incorporates glassmorphic backgrounds and auto back-navigation states.
 */
const Header = ({
  title,
  showNotificationIcon = true,
  notificationCount = 0,
  rightActions,
  onBack,
  ...props
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Root views don't show the back button by default
  const isRootView = ['/', '/groups', '/deals', '/profile', '/categories'].includes(location.pathname);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className="sticky top-0 w-full h-[60px] bg-surface/80 backdrop-blur-md border-b border-line/40 flex items-center justify-between px-5 z-40 select-none"
      {...props}
    >
      <div className="flex items-center gap-3">
        {!isRootView && (
          <button
            onClick={handleBack}
            className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center hover:bg-surface-deep active:scale-90 transition-all text-ink"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        )}
        
        {title ? (
          <h1 className="text-lg font-black tracking-tight text-ink">
            {title}
          </h1>
        ) : (
          <div className="flex items-center text-lg font-black tracking-tight select-none">
            <span className="text-slate-800 dark:text-slate-200">Buy</span>
            <span className="text-primary">together</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {rightActions}
        
        {showNotificationIcon && (
          <button
            onClick={() => navigate('/notifications')}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-deep active:scale-90 transition-all text-ink relative"
            aria-label="View notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            
            {notificationCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-danger text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                {notificationCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
