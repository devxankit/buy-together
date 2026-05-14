import { Link, useLocation } from 'react-router-dom';
import { c } from '../../design/tokens';
import Icon from '../ui/Icon';

const TABS = [
  { id: 'home',    path: '/',             icon: 'home',     label: 'Home'    },
  { id: 'groups',  path: '/groups',        icon: 'users',    label: 'Groups'  },
  { id: 'create',  path: '/groups/create', icon: 'plus',     label: null,  create: true },
  { id: 'deals',   path: '/deals',         icon: 'tag',      label: 'Deals'   },
  { id: 'profile', path: '/profile',       icon: 'verified', label: 'Profile' },
];

const getActive = (pathname) => {
  if (pathname === '/')                   return 'home';
  if (pathname === '/groups/create')      return 'create';
  if (pathname.startsWith('/groups'))     return 'groups';
  if (pathname.startsWith('/deals'))      return 'deals';
  if (pathname.startsWith('/profile'))    return 'profile';
  if (pathname.startsWith('/notifications')) return 'home';
  return 'home';
};

const BottomNav = () => {
  const { pathname } = useLocation();
  const active = getActive(pathname);

  return (
    <nav
      className="fixed-bottom-bar"
      style={{
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        borderTop: '1px solid rgba(229,229,234,0.70)',
        boxShadow: '0 -6px 30px -8px rgba(15,15,18,0.07)',
      }}
    >
      {/* Tab row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        paddingInline: 4,
      }}>
        {TABS.map(tab => {
          const isActive = active === tab.id;

          /* ── Create (+) button ── */
          if (tab.create) {
            return (
              <div key={tab.id} className="bn-create-slot">
                <Link
                  to={tab.path}
                  className="bn-create"
                  aria-label="Create group"
                >
                  <Icon name="plus" size={22} color="#fff" stroke={2.6} />
                </Link>
              </div>
            );
          }

          /* ── Regular tab ── */
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`bn-tab${isActive ? ' active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Soft background pill */}
              <span className="bn-pill" />

              {/* Icon */}
              <span className="bn-icon">
                <Icon
                  name={tab.icon}
                  size={22}
                  stroke={isActive ? 2.2 : 1.5}
                  color={isActive ? c.primary : c.faint}
                />
              </span>

              {/* Label */}
              <span
                className="bn-label"
                style={{ color: isActive ? c.primary : c.faint }}
              >
                {tab.label}
              </span>

              {/* Active indicator pip */}
              <span className="bn-pip" />
            </Link>
          );
        })}
      </div>

      {/* iOS home-bar spacer */}
      <div style={{ height: 'max(16px, env(safe-area-inset-bottom, 0px))' }} />
    </nav>
  );
};

export default BottomNav;
