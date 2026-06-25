import React, { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { registerWebPush, listenForegroundPush } from './services/push';

// Scroll to top helper component to prevent pages from sharing scroll position
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        mainEl.scrollTop = 0;
      }
    };

    // Run immediately
    scrollToTop();

    // Run on next frames
    const animId1 = requestAnimationFrame(scrollToTop);
    const animId2 = requestAnimationFrame(() => requestAnimationFrame(scrollToTop));

    // Run at intervals to catch late loads
    const t1 = setTimeout(scrollToTop, 50);
    const t2 = setTimeout(scrollToTop, 150);
    const t3 = setTimeout(scrollToTop, 350);

    return () => {
      cancelAnimationFrame(animId1);
      cancelAnimationFrame(animId2);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  return null;
}

function App() {
  useEffect(() => {
    // Surface foreground push notifications, and (re)register this browser if a
    // session already exists (e.g. returning user with a stored token).
    listenForegroundPush();
    if (localStorage.getItem('token')) {
      registerWebPush();
    }

    // Completely lock pinch zooming in mobile browsers (like iOS Safari)
    const preventZoom = (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchstart', preventZoom, { passive: false });
    
    const preventGesture = (e) => {
      e.preventDefault();
    };
    document.addEventListener('gesturestart', preventGesture);

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('gesturestart', preventGesture);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
}

export default App;
