import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import BottomNav from './BottomNav';
import { UserMainProvider, useUserMainContext } from '../../context';
import { LocationSelectorPage } from '../common';
import { fetchWishlist } from '../../../../redux/slices/wishlistSlice';

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
  const dispatch = useDispatch();
  const wishlistLoaded = useSelector((state) => state.wishlist.loaded);
  const { isLocationPickerOpen, setIsLocationPickerOpen, selectedCity, setSelectedCity } = useUserMainContext();

  // Hydrate the wishlist once when the user app shell mounts (covers both fresh
  // login and hard refresh), so saved groups persist and heart state is correct.
  useEffect(() => {
    if (!wishlistLoaded && localStorage.getItem('token')) {
      dispatch(fetchWishlist());
    }
  }, [wishlistLoaded, dispatch]);

  // Root/Tab views don't show the outer layout header since they have their own local headers/titles.
  const isRootView = ['/', '/groups', '/deals', '/profile', '/categories', '/all-categories', '/personal-info', '/wishlist', '/about', '/messages', '/notifications'].includes(location.pathname);
  const shouldShowHeader = showHeader && !isRootView;

  // Pages that already define their own internal padding in their components
  const hasInternalPadding = ['/', '/groups', '/deals', '/profile', '/categories', '/all-categories', '/personal-info', '/wishlist', '/about', '/messages', '/notifications'].includes(location.pathname);
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
