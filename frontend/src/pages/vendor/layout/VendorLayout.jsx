import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { c } from '../../../design/tokens';
import Icon from '../../../components/ui/Icon';
import { useSelector } from '../../../hooks/useSelector';

const vendorTabs = [
  { id: 'dashboard', icon: 'home',   label: 'Dashboard', path: '/vendor/dashboard' },
  { id: 'offers',    icon: 'tag',    label: 'Offers',    path: '/vendor/create-offer' },
  { id: 'groups',    icon: 'users',  label: 'Groups',    path: '/groups' },
  { id: 'profile',   icon: 'verified', label: 'Profile', path: '/profile' },
];

const VendorLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  const active = pathname.includes('create-offer') ? 'offers'
    : pathname.includes('dashboard') ? 'dashboard'
    : pathname.includes('groups') ? 'groups'
    : 'profile';

  return (
    <div style={{ minHeight: '100vh', background: c.surfaceAlt }}>
      {/* Vendor Top Bar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${c.line}`,
        padding: '0 20px',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        height: 'calc(60px + env(safe-area-inset-top, 0px))',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 11,
            background: c.ink, color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 600, fontSize: 13,
          }}>
            {user?.name?.slice(0, 2)?.toUpperCase() || 'VD'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: c.ink }}>
                {user?.businessName || user?.name || 'Vendor'}
              </span>
              <Icon name="verified" size={13} color={c.info} fill={c.info} stroke={0} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 500, color: c.faint, textTransform: 'uppercase', letterSpacing: 0.6 }}>
              Vendor · Premium
            </span>
          </div>
        </div>

        <button style={{
          width: 38, height: 38, borderRadius: 12,
          background: '#fff', border: `1px solid ${c.line}`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <Icon name="bell" size={17} color={c.ink} stroke={2.2} />
          <span style={{
            position: 'absolute', top: 8, right: 8,
            fontSize: 8, fontWeight: 500,
            background: c.primary, color: '#fff',
            padding: '1px 4px', borderRadius: 99,
          }}>4</span>
        </button>
      </nav>

      <main style={{ paddingBottom: 'calc(80px + max(20px, env(safe-area-inset-bottom, 0px)))' }}>
        <Outlet />
      </main>

      {/* Vendor Bottom Nav */}
      <nav className="fixed-bottom-bar" style={{
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        borderTop: `1px solid rgba(229,229,234,0.70)`,
        boxShadow: '0 -6px 30px -8px rgba(15,15,18,0.07)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
          paddingInline: 4,
        }}>
          {vendorTabs.map(tab => {
            const isActive = active === tab.id;
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`bn-tab${isActive ? ' active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="bn-pill" />
                <span className="bn-icon">
                  <Icon name={tab.icon} size={22} stroke={isActive ? 2.2 : 1.5} color={isActive ? c.primary : c.faint} />
                </span>
                <span className="bn-label" style={{ color: isActive ? c.primary : c.faint }}>
                  {tab.label}
                </span>
                <span className="bn-pip" />
              </Link>
            );
          })}
        </div>
        <div style={{ height: 'max(16px, env(safe-area-inset-bottom, 0px))' }} />
      </nav>
    </div>
  );
};

export default VendorLayout;
