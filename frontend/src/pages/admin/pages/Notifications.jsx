import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
  Bell, 
  Trash2, 
  CheckCheck, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  PlusCircle, 
  ChevronDown, 
  Sparkles, 
  Dot 
} from 'lucide-react';
import { T, radius } from '../theme/adminTheme';
import { PageHeader, Panel, SegmentTabs, Button, ConfirmDialog } from '../components';
import { showToast } from '../../../utils/toast';
import {
  getNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../../../services/notification.api';
import { swr, swrPeek } from '../../../services/swr';

const Notifications = () => {
  // Authentication context
  const adminId = useSelector((s) => s.auth.user?.id) || 'admin';
  const notifKey = `admin:notifications:${adminId}`;

  // State definitions
  const cached = swrPeek(notifKey);
  const [notifications, setNotifications] = useState(cached || []);
  const [loading, setLoading] = useState(cached === undefined);
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showTestSuite, setShowTestSuite] = useState(false);
  
  // Test alert form state
  const [testForm, setTestForm] = useState({
    title: 'Server Alert: Memory Limit reached 85%',
    message: 'Node daemon buy-together-api is reaching system memory threshold.',
    type: 'warning',
  });
  const [sendingTest, setSendingTest] = useState(false);

  // Dialog state for deletions
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [deletingAllRead, setDeletingAllRead] = useState(false);

  // Load and refresh handler
  const loadNotifications = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      await swr(
        notifKey,
        async () => {
          const { data } = await getNotifications();
          return Array.isArray(data) ? data : [];
        },
        {
          ttl: 0, // always revalidate to get latest notifications
          onData: (data) => {
            setNotifications(data);
            setLoading(false);
          },
        }
      );
    } catch (err) {
      console.error('Failed to fetch admin notifications:', err);
      showToast('Failed to load notifications');
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  }, [notifKey]);

  // Initial mount and synchronization listener
  useEffect(() => {
    loadNotifications();

    const handleSync = () => {
      // Fetch silently when updated elsewhere to prevent infinite flashing
      loadNotifications(true);
    };

    window.addEventListener('admin:notifications_changed', handleSync);
    return () => {
      window.removeEventListener('admin:notifications_changed', handleSync);
    };
  }, [loadNotifications]);

  // Mark single item read
  const handleMarkRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      // Notify other components (Topbar)
      window.dispatchEvent(new CustomEvent('admin:notifications_changed'));
      showToast('Notification marked as read');
    } catch (err) {
      console.error('Failed to mark read:', err);
      showToast('Failed to update notification');
    }
  };

  // Mark all read
  const handleMarkAllRead = async () => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    if (unreadCount === 0) return;
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      window.dispatchEvent(new CustomEvent('admin:notifications_changed'));
      showToast('All notifications marked as read');
    } catch (err) {
      console.error('Failed to mark all read:', err);
      showToast('Failed to mark all read');
    }
  };

  // Delete notification
  const handleDeleteOne = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const { id } = deleteDialog;
    if (!id) return;
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      window.dispatchEvent(new CustomEvent('admin:notifications_changed'));
      showToast('Notification deleted');
    } catch (err) {
      console.error('Failed to delete notification:', err);
      showToast('Failed to delete notification');
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  // Clear all read notifications
  const handleClearRead = async () => {
    const readItems = notifications.filter((n) => n.read);
    if (readItems.length === 0) return;
    
    setDeletingAllRead(true);
    try {
      // Loop deletes sequentially on the real APIs
      for (const item of readItems) {
        await deleteNotification(item._id);
      }
      setNotifications((prev) => prev.filter((n) => !n.read));
      window.dispatchEvent(new CustomEvent('admin:notifications_changed'));
      showToast('Cleared read notifications');
    } catch (err) {
      console.error('Error clearing read notifications:', err);
      showToast('Failed to clear some notifications');
    } finally {
      setDeletingAllRead(false);
    }
  };

  // Trigger test notification
  const handleCreateTest = async (e) => {
    e.preventDefault();
    if (!testForm.title.trim() || !testForm.message.trim()) {
      showToast('Please fill in test fields');
      return;
    }
    setSendingTest(true);
    try {
      await createNotification({
        title: testForm.title,
        message: testForm.message,
        type: testForm.type,
      });
      showToast('Test notification generated');
      // Force refresh
      await loadNotifications();
      window.dispatchEvent(new CustomEvent('admin:notifications_changed'));
    } catch (err) {
      console.error('Failed to generate test notification:', err);
      showToast('Failed to create test notification');
    } finally {
      setSendingTest(false);
    }
  };

  // Filter logic
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'read') return n.read;
    return true;
  });

  // Relative time helper
  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (Number.isNaN(seconds)) return '';
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Icon mapping helper
  const iconForType = (type, read) => {
    const size = 18;
    const style = { flexShrink: 0, marginTop: 1 };
    
    switch (type) {
      case 'success':
        return <CheckCircle2 size={size} color={T.success} style={style} />;
      case 'warning':
        return <AlertTriangle size={size} color={T.warning} style={style} />;
      case 'error':
        return <XCircle size={size} color={T.danger} style={style} />;
      case 'info':
      default:
        return <Info size={size} color={T.info} style={style} />;
    }
  };

  // Statistics counters
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = totalCount - unreadCount;

  const tabs = [
    { id: 'all', label: 'All', count: totalCount },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'read', label: 'Read', count: readCount },
  ];

  return (
    <div style={{ padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: 22, minHeight: 'calc(100vh - 68px)', overflowY: 'auto' }} className="admin-scroll">
      <PageHeader 
        eyebrow="System" 
        title="Admin Notifications" 
        subtitle="Manage alerts, logs, and system events sent to your administrator profile."
      >
        <Button 
          variant="soft" 
          size="sm" 
          onClick={() => setShowTestSuite(s => !s)}
          icon={showTestSuite ? 'ChevronDown' : 'PlusCircle'}
        >
          {showTestSuite ? 'Hide Developer Tool' : 'Create Test Alert'}
        </Button>
        <Button 
          variant="soft" 
          size="sm" 
          onClick={() => loadNotifications(false)} 
          style={refreshing ? { pointerEvents: 'none' } : undefined}
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} style={{ marginRight: 6 }} />
          Refresh
        </Button>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={handleMarkAllRead} 
          disabled={unreadCount === 0}
          style={unreadCount === 0 ? { opacity: 0.5, cursor: 'not-allowed', boxShadow: 'none' } : undefined}
        >
          <CheckCheck size={14} style={{ marginRight: 6 }} />
          Mark All Read
        </Button>
      </PageHeader>

      {/* Developer Suite panel */}
      {showTestSuite && (
        <Panel 
          title="Developer Test Alert Suite" 
          subtitle="Generate alerts using real backend APIs to test real-time synchronization in this app."
          padded
          style={{ animation: 'admin-fade-up 0.2s ease out' }}
        >
          <form onSubmit={handleCreateTest} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 150px', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.inkSoft, display: 'block', marginBottom: 6 }}>Title</label>
                <input 
                  type="text" 
                  value={testForm.title}
                  onChange={(e) => setTestForm(prev => ({ ...prev, title: e.target.value }))}
                  style={{ width: '100%', height: 38, padding: '0 12px', fontSize: 13, border: `1px solid ${T.line}`, borderRadius: radius.md, background: T.surfaceAlt, color: T.ink, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.inkSoft, display: 'block', marginBottom: 6 }}>Message</label>
                <input 
                  type="text" 
                  value={testForm.message}
                  onChange={(e) => setTestForm(prev => ({ ...prev, message: e.target.value }))}
                  style={{ width: '100%', height: 38, padding: '0 12px', fontSize: 13, border: `1px solid ${T.line}`, borderRadius: radius.md, background: T.surfaceAlt, color: T.ink, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.inkSoft, display: 'block', marginBottom: 6 }}>Type</label>
                <select 
                  value={testForm.type}
                  onChange={(e) => setTestForm(prev => ({ ...prev, type: e.target.value }))}
                  style={{ width: '100%', height: 38, padding: '0 10px', fontSize: 13, border: `1px solid ${T.line}`, borderRadius: radius.md, background: T.surfaceAlt, color: T.ink, outline: 'none', cursor: 'pointer' }}
                >
                  <option value="info">Info (Blue)</option>
                  <option value="success">Success (Teal)</option>
                  <option value="warning">Warning (Orange)</option>
                  <option value="error">Error (Red)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="dark" size="sm" onClick={handleCreateTest} style={sendingTest ? { opacity: 0.6 } : undefined}>
                {sendingTest ? 'Sending...' : 'Publish Notification'}
              </Button>
            </div>
          </form>
        </Panel>
      )}

      {/* Toolbar / Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <SegmentTabs tabs={tabs} value={activeTab} onChange={setActiveTab} />
        {readCount > 0 && (
          <Button 
            variant="danger" 
            size="sm" 
            onClick={handleClearRead}
            style={deletingAllRead ? { opacity: 0.6, pointerEvents: 'none' } : undefined}
          >
            <Trash2 size={13} style={{ marginRight: 6 }} />
            {deletingAllRead ? 'Clearing...' : 'Clear All Read'}
          </Button>
        )}
      </div>

      {/* Notification List Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <div className="animate-spin" style={{ width: 30, height: 30, border: `3px solid ${T.primarySoft}`, borderTopColor: T.primary, borderRadius: '50%' }} />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '60px 20px', border: `1px dashed ${T.line}`, borderRadius: radius['2xl'],
            background: T.surface, textAlign: 'center',
          }}>
            <div style={{
              width: 54, height: 54, borderRadius: 18, background: T.surfaceAlt,
              color: T.faint, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Bell size={24} />
            </div>
            <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: T.ink }}>No notifications found</h3>
            <p style={{ margin: 0, fontSize: 13, color: T.muted, maxWidth: 360 }}>
              {activeTab === 'unread' 
                ? "You've read all notifications! Great job staying up to date." 
                : activeTab === 'read'
                  ? 'No notifications have been marked as read yet.'
                  : 'Your notification center is completely empty.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const isUnread = !n.read;
            return (
              <div
                key={n._id}
                onClick={() => handleMarkRead(n._id, n.read)}
                className="admin-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 20px',
                  background: T.surface,
                  border: `1px solid ${isUnread ? T.primarySoft : T.line}`,
                  borderLeft: isUnread ? `4px solid ${T.primary}` : `1px solid ${T.line}`,
                  borderRadius: radius.xl,
                  cursor: isUnread ? 'pointer' : 'default',
                  boxShadow: isUnread ? `0 2px 8px -2px ${T.primary}12` : 'none',
                  transition: 'all 0.18s ease',
                }}
              >
                {/* Status Indicator Icon */}
                <div style={{ position: 'relative' }}>
                  {iconForType(n.type, n.read)}
                  {isUnread && (
                    <span style={{
                      position: 'absolute', top: -3, right: -3, width: 7, height: 7,
                      borderRadius: '50%', background: T.primary, border: `1.5px solid ${T.surface}`,
                    }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: isUnread ? 800 : 700, color: T.ink }}>
                      {n.title}
                    </h4>
                    {isUnread && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '1px 6px',
                        background: T.primarySoft, color: T.primary, borderRadius: 6,
                      }}>
                        New
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 12.5, color: isUnread ? T.inkSoft : T.muted, lineHeight: 1.4 }}>
                    {n.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 11, color: T.faint, fontWeight: 500 }}>
                    <span title={n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}>
                      {timeAgo(n.createdAt)}
                    </span>
                    <span>•</span>
                    <span style={{ textTransform: 'capitalize' }}>
                      {n.type} log
                    </span>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                  {isUnread && (
                    <Button
                      variant="soft"
                      size="sm"
                      onClick={() => handleMarkRead(n._id, false)}
                      style={{ padding: '0 8px', height: 28, fontSize: 11.5, borderRadius: radius.md }}
                      title="Mark as read"
                    >
                      Mark read
                    </Button>
                  )}
                  <button
                    onClick={() => handleDeleteOne(n._id)}
                    className="admin-icon-btn"
                    style={{
                      width: 28, height: 28, borderRadius: radius.md, border: 'none',
                      background: 'transparent', color: T.muted, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}
                    title="Delete notification"
                  >
                    <Trash2 size={14} className="hover:text-red-500" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Dialog for single deletion */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Notification"
        message="Are you sure you want to permanently delete this notification? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      />
    </div>
  );
};

export default Notifications;
