import { Link, useNavigate } from 'react-router-dom';
import { c } from '../../design/tokens';
import { Avatar } from '../ui/Avatar';
import Icon from '../ui/Icon';

const navItems = [
  { icon: 'home',     label: 'Home',           to: '/' },
  { icon: 'users',    label: 'My groups',       to: '/groups',       badge: null },
  { icon: 'bag',      label: 'My deals',        to: '/deals' },
  { icon: 'tag',      label: 'Vendor offers',   to: '/deals' },
  { icon: 'heart',    label: 'Wishlist',        to: '/groups' },
];

const secondaryItems = [
  { icon: 'bell',     label: 'Notifications',   to: '/notifications' },
  { icon: 'settings', label: 'Settings',        to: '/profile' },
  { icon: 'shield',   label: 'Privacy',         to: '/profile' },
  { icon: 'info',     label: 'Help & support',  to: '/profile' },
];

const Sidebar = ({ isOpen, onClose, user, isAuthenticated }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNav = (to) => { onClose(); navigate(to); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 70 }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(14,14,17,0.55)', backdropFilter: 'blur(4px)' }}
      />

      {/* Panel */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 310, background: c.surfaceAlt,
        display: 'flex', flexDirection: 'column',
        boxShadow: '20px 0 60px rgba(0,0,0,0.25)',
        overflowY: 'auto',
      }}>
        {/* Profile header */}
        <div style={{
          padding: '56px 22px 22px',
          background: '#fff',
          borderBottom: `1px solid ${c.line}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar seed={1} size={50} ring name={user?.name} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 500, color: c.ink, letterSpacing: -0.2 }}>
                    {isAuthenticated ? user?.name || 'User' : 'Guest User'}
                  </span>
                  {isAuthenticated && <Icon name="verified" size={13} color={c.info} fill={c.info} stroke={0} />}
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 400, color: c.muted, marginTop: 2 }}>
                  {isAuthenticated ? user?.mobile || user?.email : 'Login to join groups'}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: 10,
                background: c.surfaceAlt, border: `1px solid ${c.line}`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon name="x" size={14} color={c.muted} stroke={2} />
            </button>
          </div>

          {isAuthenticated ? (
            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[{ v: '12', l: 'Groups' }, { v: '₹2k', l: 'Saved' }, { v: '4.9', l: 'Rating' }].map((s, i) => (
                <div key={i} style={{
                  padding: '10px 8px', background: c.surfaceAlt,
                  borderRadius: 12, border: `1px solid ${c.line}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                }}>
                  <span style={{ fontSize: 16, fontWeight: 500, color: c.ink, letterSpacing: -0.3 }}>{s.v}</span>
                  <span style={{ fontSize: 9, fontWeight: 500, color: c.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>{s.l}</span>
                </div>
              ))}
            </div>
          ) : (
            <button
              onClick={() => handleNav('/login')}
              style={{
                marginTop: 16, width: '100%', height: 48, borderRadius: 14,
                background: c.primary, color: '#fff', border: 'none',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 18px 40px -16px rgba(15,107,83,0.50)',
              }}
            >
              Login / Register
            </button>
          )}
        </div>

        {/* Nav items */}
        <div style={{ padding: '14px 12px 0', flex: 1 }}>
          {navItems.map((it, i) => (
            <button key={i} onClick={() => handleNav(it.to)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 12,
              background: i === 0 ? '#fff' : 'transparent',
              border: i === 0 ? `1px solid ${c.line}` : '1px solid transparent',
              color: i === 0 ? c.ink : c.muted,
              marginBottom: 2, width: '100%', cursor: 'pointer',
            }}>
              <Icon name={it.icon} size={18} color={i === 0 ? c.primary : c.muted} stroke={1.8} />
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: i === 0 ? 500 : 400, textAlign: 'left' }}>{it.label}</span>
              <Icon name="chevR" size={13} color={c.faint} stroke={2} />
            </button>
          ))}

          <div style={{ height: 1, background: c.line, margin: '14px 14px' }} />

          {secondaryItems.map((it, i) => (
            <button key={i} onClick={() => handleNav(it.to)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', color: c.muted,
              background: 'transparent', border: 'none', width: '100%', cursor: 'pointer',
            }}>
              <Icon name={it.icon} size={17} color={c.muted} stroke={1.8} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 400, textAlign: 'left' }}>{it.label}</span>
            </button>
          ))}
        </div>

        {isAuthenticated && (
          <div style={{ padding: '0 22px 40px' }}>
            <button style={{
              width: '100%', background: 'transparent', color: c.danger,
              padding: '12px 14px', borderRadius: 12,
              display: 'flex', alignItems: 'center', gap: 10,
              fontWeight: 500, fontSize: 13, border: `1px solid ${c.line}`,
              cursor: 'pointer',
            }}>
              <Icon name="log" size={16} color={c.danger} stroke={1.8} />
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
