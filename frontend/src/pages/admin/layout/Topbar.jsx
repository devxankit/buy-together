import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronRight, Maximize2, ExternalLink, CircleDot } from 'lucide-react';
import { T, dims, radius } from '../theme/adminTheme';
import { routeMeta } from './navConfig';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../../services/notification.api';

const ACCENT = { amber: T.amber, danger: T.danger, violet: T.violet, primary: T.primary, info: T.info };

const Topbar = ({ onOpenMobileNav }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const meta = routeMeta[pathname] || { title: 'Admin', section: 'Console' };
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  // Live Notifications states
  const [notificationsList, setNotificationsList] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoadingNotifications(true);
    try {
      const { data } = await getNotifications();
      if (Array.isArray(data)) {
        setNotificationsList(data);
      }
    } catch (err) {
      console.warn('Failed to fetch notifications:', err);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 30000);
    return () => clearInterval(timer);
  }, [fetchNotifications]);

  const unread = notificationsList.filter(n => !n.read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotificationsList(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.warn('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.warn('Failed to mark all notifications as read:', err);
    }
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const colorForType = (type) => {
    if (type === 'success') return T.success;
    if (type === 'warning') return T.warning;
    if (type === 'error') return T.danger;
    return T.info;
  };

  // Global search states and refs
  const [searchQuery, setSearchQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const close = (e) => { if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  // Handle outside click for search dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Sync search input with global admin:search event (e.g. from page search inputs)
  useEffect(() => {
    const syncSearch = (e) => {
      if (e.detail !== searchQuery) setSearchQuery(e.detail);
    };
    window.addEventListener('admin:search', syncSearch);
    return () => window.removeEventListener('admin:search', syncSearch);
  }, [searchQuery]);

  // Global Ctrl/Cmd + K keybinding to focus search
  useEffect(() => {
    const handleKeyDownGlobally = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          setFocused(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDownGlobally);
    return () => window.removeEventListener('keydown', handleKeyDownGlobally);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    const searchablePaths = ['/admin/users', '/admin/groups', '/admin/vendors', '/admin/support'];
    if (searchablePaths.includes(pathname)) {
      window.dispatchEvent(new CustomEvent('admin:search', { detail: val }));
    }
  };

  const handleSelect = (targetPath) => {
    setFocused(false);
    if (searchQuery) {
      sessionStorage.setItem('admin_search_query', searchQuery);
    } else {
      sessionStorage.removeItem('admin_search_query');
    }
    navigate(targetPath);
    window.dispatchEvent(new CustomEvent('admin:search', { detail: searchQuery }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const searchablePaths = ['/admin/users', '/admin/groups', '/admin/vendors', '/admin/support'];
      if (searchablePaths.includes(pathname)) {
        e.target.blur();
        setFocused(false);
      } else {
        handleSelect('/admin/users');
      }
    }
    if (e.key === 'Escape') {
      e.target.blur();
      setFocused(false);
    }
  };

  const searchOptions = searchQuery ? [
    { label: 'Search Users', path: '/admin/users', prefix: 'Search in', suffix: 'Users' },
    { label: 'Search Groups', path: '/admin/groups', prefix: 'Search in', suffix: 'Groups' },
    { label: 'Search Vendors', path: '/admin/vendors', prefix: 'Search in', suffix: 'Vendors' },
    { label: 'Search Support Tickets', path: '/admin/support', prefix: 'Search in', suffix: 'Support Tickets' },
  ] : [
    { label: 'Users Management', path: '/admin/users', prefix: 'Go to', suffix: 'Users' },
    { label: 'Groups / Pools', path: '/admin/groups', prefix: 'Go to', suffix: 'Groups' },
    { label: 'Vendors List', path: '/admin/vendors', prefix: 'Go to', suffix: 'Vendors' },
    { label: 'Support Tickets', path: '/admin/support', prefix: 'Go to', suffix: 'Support Tickets' },
    { label: 'Dashboard Console', path: '/admin', prefix: 'Go to', suffix: 'Dashboard' },
  ];

  return (
    <header style={{
      height: dims.topbarHeight, flexShrink: 0,
      background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      borderBottom: `1px solid ${T.line}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 14, padding: '0 22px', position: 'sticky', top: 0, zIndex: 40,
    }}>
      {/* Left — breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <button
          onClick={onOpenMobileNav}
          className="admin-icon-btn"
          style={{ display: 'none', width: 38, height: 38, borderRadius: 10, border: `1px solid ${T.line}`, background: T.surface, color: T.ink, alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          data-mobile-only="true"
        >
          <Menu size={19} />
        </button>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: T.faint, fontWeight: 600 }}>
            <span>{meta.section}</span>
            <ChevronRight size={13} />
            <span style={{ color: T.muted }}>{meta.title}</span>
          </div>
          <h2 style={{ margin: '1px 0 0', fontSize: 17, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em' }}>{meta.title}</h2>
        </div>
      </div>

      {/* Right — actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Global search (desktop) */}
        <div
          ref={searchRef}
          className="admin-focusable"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            height: 38,
            padding: '0 13px',
            width: 240,
            background: T.surfaceAlt,
            border: `1px solid ${T.line}`,
            borderRadius: radius.lg,
            position: 'relative',
          }}
          data-hide-sm="true"
        >
          <Search size={16} color={T.faint} strokeWidth={2.2} />
          <input
            ref={inputRef}
            className="admin-input"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search anything…"
            style={{ flex: 1, minWidth: 0, fontSize: 13, color: T.ink, fontWeight: 500 }}
          />
          <kbd style={{ fontSize: 10, fontWeight: 700, color: T.faint, background: T.surface, border: `1px solid ${T.line}`, borderRadius: 5, padding: '1px 5px' }}>⌘K</kbd>

          {/* Search Dropdown Overlay */}
          {focused && (
            <div
              className="admin-fade-up"
              style={{
                position: 'absolute',
                top: 44,
                left: 0,
                right: 0,
                background: T.surface,
                border: `1px solid ${T.line}`,
                borderRadius: radius.xl,
                boxShadow: T.shadowLg,
                padding: '8px 0',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ fontSize: 10.5, fontWeight: 700, color: T.muted, padding: '6px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {searchQuery ? 'Search In' : 'Quick Links'}
              </div>
              {searchOptions.map((opt, idx) => (
                <div
                  key={opt.path + idx}
                  onMouseDown={(e) => {
                    // Prevent blur from closing before click is registered
                    e.preventDefault();
                  }}
                  onClick={() => handleSelect(opt.path)}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12.5px',
                    color: T.ink,
                    cursor: 'pointer',
                    background: hoveredIdx === idx ? T.surfaceAlt : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ color: T.muted }}>{opt.prefix}</span>
                  <span style={{ fontWeight: 600, color: T.primary }}>{opt.suffix}</span>
                  {searchQuery && <span style={{ fontSize: 11, color: T.faint }}>for "{searchQuery}"</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => window.open('/', '_blank')}
          title="Open user app"
          className="admin-icon-btn"
          style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${T.line}`, background: T.surface, color: T.inkSoft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          data-hide-sm="true"
        >
          <ExternalLink size={17} strokeWidth={2.1} />
        </button>

        {/* Notifications */}
        <div ref={bellRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setBellOpen(o => !o)}
            className="admin-icon-btn"
            style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${T.line}`, background: T.surface, color: T.inkSoft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
          >
            <Bell size={18} strokeWidth={2.1} />
            {unread > 0 && (
              <span style={{ position: 'absolute', top: 7, right: 8, width: 8, height: 8, borderRadius: 99, background: T.danger, border: `2px solid ${T.surface}` }} />
            )}
          </button>

          {bellOpen && (
            <div className="admin-fade-up" style={{
              position: 'absolute', right: 0, top: 46, width: 320, zIndex: 60,
              background: T.surface, border: `1px solid ${T.line}`, borderRadius: radius.xl, boxShadow: T.shadowLg, overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: `1px solid ${T.lineSoft}` }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>Notifications</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {unread > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      style={{ fontSize: 11, fontWeight: 700, color: T.primary, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      Mark all read
                    </button>
                  )}
                  <span style={{ fontSize: 11, fontWeight: 700, color: T.primary, background: T.primarySoft, padding: '2px 8px', borderRadius: 999 }}>{unread} new</span>
                </div>
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }} className="admin-scroll">
                {notificationsList.length === 0 ? (
                  <div style={{ textAlign: 'center', color: T.faint, fontSize: 12.5, padding: '30px 16px' }}>
                    No notifications
                  </div>
                ) : (
                  notificationsList.map(n => (
                    <div
                      key={n._id}
                      onClick={() => handleMarkAsRead(n._id)}
                      className="admin-row"
                      style={{
                        display: 'flex', gap: 11, padding: '12px 16px',
                        borderBottom: `1px solid ${T.lineSoft}`, cursor: 'pointer',
                        background: !n.read ? `${T.primary}08` : 'transparent',
                      }}
                    >
                      <CircleDot size={16} color={colorForType(n.type)} strokeWidth={2.4} style={{ marginTop: 1, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{n.title}</span>
                          {!n.read && <span style={{ width: 6, height: 6, borderRadius: 99, background: T.primary, flexShrink: 0 }} />}
                        </div>
                        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2, lineHeight: 1.4 }}>{n.message}</div>
                        <div style={{ fontSize: 10, color: T.faint, marginTop: 4 }}>{timeAgo(n.createdAt)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => { setBellOpen(false); navigate('/admin'); }}
                className="admin-btn"
                style={{ width: '100%', padding: '11px', border: 'none', background: T.surfaceAlt, color: T.primary, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                View all activity
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
