import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { reverseGeocode } from '../../../utils/googleMaps';
import { getNotifications } from '../../../services/notification.api';
import { getChatSocket } from '../../../services/socket';
import { getCategories } from '../../../services/category.api';
import { swr } from '../../../services/swr';
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
  const [categories, setCategories] = useState([]);

  // Global Location Selection States
  const [selectedCity, setSelectedCity] = useState('Detecting Location...');
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  // Fetch categories once on mount. Stale-while-revalidate: paints instantly
  // from the cached copy on repeat visits, then refreshes in the background.
  useEffect(() => {
    let active = true;
    swr(
      'categories',
      async () => {
        const { data } = await getCategories();
        return Array.isArray(data)
          ? data.map((c) => ({ id: c.slug, name: c.name, coverImage: c.image }))
          : [];
      },
      { onData: (cats) => { if (active) setCategories(cats); } }
    ).catch((err) => console.warn('Failed to load categories globally:', err));
    return () => { active = false; };
  }, []);

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
      const [convoRes, groupsRes] = await Promise.all([
        api.get('/chat/conversations'),
        api.get('/groups?joined=true').catch(() => ({ data: [] }))
      ]);
      const dmUnread = (convoRes.data || []).reduce((acc, convo) => acc + (convo.unread || 0), 0);
      
      let groupUnreadCount = 0;
      if (groupsRes && groupsRes.data && Array.isArray(groupsRes.data)) {
        groupsRes.data.forEach(group => {
          const groupId = group.id || group._id;
          const lastSeen = Number(localStorage.getItem(`buytogether_group_last_seen_${groupId}`) || 0);
          const groupTime = new Date(group.updatedAt || group.createdAt).getTime();
          if (groupTime > lastSeen) {
            groupUnreadCount++;
          }
        });
      }
      
      setUnreadMessageCount(dmUnread + groupUnreadCount);
    } catch (err) {
      console.error('Failed to fetch unread message count:', err);
    }
  }, []);

  useEffect(() => {
    refreshUnreadMessageCount();
  }, [refreshUnreadMessageCount]);

  // Live messages badge: when a DM or group message notification arrives, 
  // re-pull the unread total so the icon badge updates live.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return undefined;
    const socket = getChatSocket();
    const handleUpdate = () => refreshUnreadMessageCount();
    socket.on('dm_notification', handleUpdate);
    socket.on('group_notification', handleUpdate);
    return () => { 
      socket.off('dm_notification', handleUpdate); 
      socket.off('group_notification', handleUpdate); 
    };
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
        setIsLocationPickerOpen,
        categories
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
