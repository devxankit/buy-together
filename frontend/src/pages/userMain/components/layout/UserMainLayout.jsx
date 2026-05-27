import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import { UserMainProvider, useUserMainContext } from '../../context';
import { LocationSelectorPage } from '../common';

/**
 * Main Layout wrapper inner component that consumes UserMainContext.
 */
const UserMainLayoutInner = ({
  title,
  showBottomNav = true,
  showHeader = true,
  notificationCount = 0,
  ...props
}) => {
  const location = useLocation();
  const { isLocationPickerOpen, setIsLocationPickerOpen, selectedCity, setSelectedCity } = useUserMainContext();

  // Root/Tab views don't show the outer layout header since they have their own local headers/titles.
  const isRootView = ['/', '/groups', '/deals', '/profile', '/categories', '/personal-info', '/wishlist', '/about', '/messages'].includes(location.pathname);
  const shouldShowHeader = showHeader && !isRootView;

  // Pages that already define their own internal padding in their components
  const hasInternalPadding = ['/', '/groups', '/deals', '/profile', '/categories', '/personal-info', '/wishlist', '/about', '/messages'].includes(location.pathname);
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

      {/* Premium Dedicated Global Location Selection Page Overlay */}
      {isLocationPickerOpen && (
        <LocationSelectorPage 
          selectedLocation={selectedCity} 
          setSelectedLocation={setSelectedCity} 
          onClose={() => setIsLocationPickerOpen(false)} 
        />
      )}
    </div>
  );
};

/**
 * Main Layout wrapper for userMain module.
 * Wraps the inner layout with UserMainProvider to expose global geographic & notification contexts.
 */
const UserMainLayout = (props) => {
  return (
    <UserMainProvider>
      <UserMainLayoutInner {...props} />
    </UserMainProvider>
  );
};

export default UserMainLayout;
