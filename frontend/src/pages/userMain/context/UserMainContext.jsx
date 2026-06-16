import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { reverseGeocode } from '../../../utils/googleMaps';
import { getNotifications } from '../../../services/notification.api';
import api from '../../../services/api';

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
  
  const [notificationCount, setNotificationCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [headerTitle, setHeaderTitle] = useState('');

  // Global Location Selection States
  const [selectedCity, setSelectedCity] = useState('Detecting Location...');
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  // Auto-detect location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const locName = await reverseGeocode(lat, lng);
            setSelectedCity(locName);
            setCurrentLocation({
              latitude: lat,
              longitude: lng,
              address: locName
            });
          } catch (err) {
            console.error('Failed to reverse-geocode coordinates on mount:', err);
            setSelectedCity('Mumbai, Maharashtra'); // fallback on geocoding failure
          }
        },
        (error) => {
          console.warn('Geolocation denied or failed on mount:', error);
          setSelectedCity('Mumbai, Maharashtra'); // fallback on permission denied/error
        }
      );
    } else {
      setSelectedCity('Mumbai, Maharashtra'); // fallback if geolocation unsupported
    }
  }, []);

  // Fetch unread notifications count on mount
  useEffect(() => {
    let active = true;
    const fetchUnreadCount = async () => {
      try {
        const { data } = await getNotifications();
        if (active) {
          const unread = data.filter(n => !n.read).length;
          setNotificationCount(unread);
        }
      } catch (err) {
        console.error('Failed to fetch unread notifications count:', err);
      }
    };
    fetchUnreadCount();
    return () => { active = false; };
  }, []);

  const refreshUnreadMessageCount = useCallback(async () => {
    try {
      const { data } = await api.get('/chat/conversations');
      const totalUnread = (data || []).reduce((acc, convo) => acc + (convo.unread || 0), 0);
      setUnreadMessageCount(totalUnread);
    } catch (err) {
      console.error('Failed to fetch unread message count:', err);
    }
  }, []);

  useEffect(() => {
    refreshUnreadMessageCount();
  }, [refreshUnreadMessageCount]);


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
        unreadMessageCount,
        refreshUnreadMessageCount,
        headerTitle,
        updateLocation,
        clearNotifications,
        setHeaderTitle,
        setNotificationCount,
        selectedCity,
        setSelectedCity,
        isLocationPickerOpen,
        setIsLocationPickerOpen
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
