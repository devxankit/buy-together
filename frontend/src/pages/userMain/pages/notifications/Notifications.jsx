import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useUserMainContext } from '../../context';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '../../../../services/notification.api';
import { swr, swrPeek } from '../../../../services/swr';
import { showToast } from '../../../../utils/toast';

const Notifications = () => {
  const navigate = useNavigate();
  const { setNotificationCount } = useUserMainContext();

  // Per-user cache: paints instantly on revisit, revalidates in the background.
  const userId = useSelector((s) => s.auth.user?.id) || 'me';
  const notifKey = `notifications:${userId}`;
  const cached = swrPeek(notifKey);
  const [notifications, setNotifications] = useState(cached || []);
  const [loading, setLoading] = useState(cached === undefined);

  // Fetch notifications on mount (instant from cache, then silent refresh)
  useEffect(() => {
    let active = true;
    swr(
      notifKey,
      async () => {
        const { data } = await getNotifications();
        return Array.isArray(data) ? data : [];
      },
      {
        ttl: 0,
        onData: (data) => {
          if (!active) return;
          setNotifications(data);
          setNotificationCount(data.filter((n) => !n.read).length);
          setLoading(false);
        },
      }
    ).catch((err) => {
      console.error('Failed to fetch notifications:', err);
      showToast('Failed to load notifications');
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [notifKey, setNotificationCount]);

  const handleMarkAsRead = async (id, isAlreadyRead) => {
    if (isAlreadyRead) return;
    try {
      await markNotificationAsRead(id);
      const updated = notifications.map(n => n._id === id ? { ...n, read: true } : n);
      setNotifications(updated);
      setNotificationCount(updated.filter(n => !n.read).length);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      const updated = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updated);
      setNotificationCount(0);
      showToast('All notifications marked as read');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      showToast('Failed to mark notifications as read');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent triggering read event
    try {
      await deleteNotification(id);
      const updated = notifications.filter(n => n._id !== id);
      setNotifications(updated);
      setNotificationCount(updated.filter(n => !n.read).length);
      showToast('Notification deleted');
    } catch (err) {
      console.error('Failed to delete notification:', err);
      showToast('Failed to delete notification');
    }
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const hasUnread = notifications.some(n => !n.read);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[var(--surface-deep)] font-sans pb-24">
      {/* Premium Local Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 bg-surface border-b border-line sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center active:scale-90 transition-all border border-line"
          >
            <svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-[15px] font-black text-ink">Notifications</h1>
        </div>

        {hasUnread && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-[10px] font-extrabold text-primary px-3 py-1.5 rounded-lg hover:bg-primary-soft/30 active:scale-95 transition-all"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="flex-1 flex flex-col px-4 py-4 gap-3">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
            <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-muted">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-surface-alt flex items-center justify-center mb-4 text-muted">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-sm font-black text-ink mb-1.5">All caught up!</h3>
            <p className="text-xs text-muted leading-relaxed max-w-[220px]">
              You have no notifications at this time. Active group events will appear here.
            </p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification._id} 
              onClick={() => handleMarkAsRead(notification._id, notification.read)}
              className={`bg-surface rounded-2xl p-4 flex gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.01)] border transition-all hover:border-primary/25 cursor-pointer relative group w-full ${
                notification.read ? 'border-line/60 opacity-85' : 'border-primary/20 shadow-md shadow-primary/5'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-surface-alt flex items-center justify-center flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 flex flex-col min-w-0 justify-center pr-6">
                <div className="flex justify-between items-baseline mb-0.5 gap-2">
                  <h4 className={`text-[12.5px] font-black truncate ${notification.read ? 'text-ink/80' : 'text-ink'}`}>
                    {notification.title}
                  </h4>
                  <span className="text-[8.5px] font-bold text-muted flex-shrink-0">
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </div>
                <p className="text-[10.5px] font-semibold text-muted leading-relaxed">
                  {notification.message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5">
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-danger flex-shrink-0" />
                )}
                <button
                  onClick={(e) => handleDelete(e, notification._id)}
                  className="w-6 h-6 rounded-md hover:bg-danger/10 text-muted hover:text-danger flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Delete notification"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
