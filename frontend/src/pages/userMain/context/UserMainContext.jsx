import React, { createContext, useContext, useState } from 'react';

const UserMainContext = createContext(null);

/**
 * Isolated Global State Provider for userMain module.
 * Protects core layout bindings, geographic coordinate feeds, and notification states.
 */
export const UserMainProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 28.6139, // Default coordinates (e.g. New Delhi)
    longitude: 77.2090,
    address: 'Connaught Place, New Delhi'
  });
  
  const [notificationCount, setNotificationCount] = useState(2);
  const [headerTitle, setHeaderTitle] = useState('');

  const updateLocation = (coords, addr) => {
    setCurrentLocation({
      latitude: coords.latitude,
      longitude: coords.longitude,
      address: addr
    });
  };

  const clearNotifications = () => {
    setNotificationCount(0);
  };

  return (
    <UserMainContext.Provider
      value={{
        currentLocation,
        notificationCount,
        headerTitle,
        updateLocation,
        clearNotifications,
        setHeaderTitle,
        setNotificationCount
      }}
    >
      {children}
    </UserMainContext.Provider>
  );
};

export const useUserMainContext = () => {
  const context = useContext(UserMainContext);
  if (!context) {
    throw new Error('useUserMainContext must be used within a UserMainProvider');
  }
  return context;
};

export default UserMainContext;
