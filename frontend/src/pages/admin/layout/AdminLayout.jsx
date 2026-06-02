import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slices/authSlice';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { T } from '../theme/adminTheme';
import { fraudSignals } from '../data/mockData';
import { getAdminStats } from '../../../services/admin.api';
import '../admin.css';

// Custom window event the Vendors page (and other admin pages) can dispatch
// after a mutation so the sidebar badges refresh without a full route change.
export const ADMIN_STATS_REFRESH_EVENT = 'admin:stats-refresh';

/**
 * AdminLayout — the console shell.
 *
 * The mobile app pins #root to max-width:430px, so the admin dashboard escapes
 * that cage with position:fixed/inset:0 (safe: #root is position:relative with
 * no transform, so fixed anchors to the viewport). Sidebar is docked on desktop
 * and becomes a slide-over drawer below 900px.
 */
const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stats, setStats] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(s => s.auth);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const { data } = await getAdminStats();
      setStats(data);
    } catch {
      // Non-fatal — sidebar just won't show badges until the next refresh.
    }
  }, []);

  // Refresh on mount, on every admin route change, and when an admin page
  // explicitly dispatches `admin:stats-refresh` after a mutation.
  useEffect(() => {
    refreshStats();
  }, [refreshStats, location.pathname]);

  useEffect(() => {
    const handler = () => refreshStats();
    window.addEventListener(ADMIN_STATS_REFRESH_EVENT, handler);
    return () => window.removeEventListener(ADMIN_STATS_REFRESH_EVENT, handler);
  }, [refreshStats]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const badges = {
    vendors: stats?.pendingVendors || 0,
    fraud: fraudSignals.filter(f => f.severity === 'high').length,
  };

  return (
    <div
      className="admin-root"
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', background: T.bg, color: T.ink,
      }}
    >
      {/* Desktop docked sidebar */}
      {!isMobile && (
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(c => !c)}
          badges={badges}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {/* Mobile slide-over sidebar */}
      {isMobile && mobileOpen && (
        <>
          <div className="admin-backdrop" onClick={() => setMobileOpen(false)} />
          <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 130, animation: 'admin-fade-up 0.22s ease both' }}>
            <Sidebar
              collapsed={false}
              mobile
              badges={badges}
              user={user}
              onLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main column */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Topbar onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="admin-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <div className="admin-page">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
