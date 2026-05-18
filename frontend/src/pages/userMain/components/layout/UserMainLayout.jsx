import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

/**
 * Main Layout wrapper for userMain module.
 * Standardizes mobile dimensions (430px) and spacing defaults.
 */
const UserMainLayout = ({
  title,
  showBottomNav = true,
  showHeader = true,
  notificationCount = 0,
  ...props
}) => {
  const location = useLocation();

  // Root/Tab views don't show the outer layout header since they have their own local headers/titles.
  const isRootView = ['/', '/groups', '/deals', '/profile', '/categories'].includes(location.pathname);
  const shouldShowHeader = showHeader && !isRootView;

  // Pages that already define their own internal padding in their components
  const hasInternalPadding = ['/', '/deals', '/profile', '/categories'].includes(location.pathname);
  const mainPaddingClass = hasInternalPadding ? 'px-0 py-0' : 'px-4 py-4';

  return (
    <div className="flex flex-col min-h-screen min-h-dvh bg-surface-alt pb-[76px] relative" {...props}>
      {shouldShowHeader && (
        <Header
          title={title}
          notificationCount={notificationCount}
        />
      )}
      
      <main className={`flex-1 w-full ${mainPaddingClass} overflow-y-auto no-scrollbar`}>
        <Outlet />
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default UserMainLayout;

