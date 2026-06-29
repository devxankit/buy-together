import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

/**
 * Slim banner shown when the device loses network. The app shell + last-loaded
 * data still render (served by the PWA service worker), so this just tells the
 * user why fresh data / actions like joining a group may not work right now.
 */
const OfflineBanner = () => {
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div
      role="status"
      className="fixed top-0 inset-x-0 z-[60] flex items-center justify-center gap-2 bg-amber-500 px-4 py-1.5 text-center text-xs font-medium text-white shadow-md"
    >
      <WifiOff size={14} />
      <span>You're offline — showing saved content. Some actions need a connection.</span>
    </div>
  );
};

export default OfflineBanner;
