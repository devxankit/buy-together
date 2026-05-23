import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ChevronsLeft, Hexagon, LogOut, Wifi } from 'lucide-react';
import { T, dims } from '../theme/adminTheme';
import { navSections } from './navConfig';

const Sidebar = ({ collapsed, onToggleCollapse, badges = {}, user, onLogout, mobile, onNavigate }) => {
  const width = collapsed && !mobile ? dims.sidebarCollapsed : dims.sidebarWidth;

  return (
    <aside
      className="admin-scroll-dark"
      style={{
        width, flexShrink: 0, height: '100%',
        background: T.sidebar,
        borderRight: `1px solid ${T.sidebarLine}`,
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
        overflowY: 'auto', overflowX: 'hidden',
        ['--ad-side-text']: T.sidebarText,
      }}
    >
      {/* Brand */}
      <div style={{
        height: dims.topbarHeight, display: 'flex', alignItems: 'center',
        gap: 11, padding: collapsed && !mobile ? '0' : '0 18px',
        justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
        borderBottom: `1px solid ${T.sidebarLine}`, flexShrink: 0,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDeep})`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: T.shadowGlow,
        }}>
          <Hexagon size={19} color="#fff" strokeWidth={2.4} fill="rgba(255,255,255,0.18)" />
        </div>
        {(!collapsed || mobile) && (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Buy Together</div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: T.sidebarMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Console</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {navSections.map((sec) => (
          <div key={sec.title} style={{ marginBottom: 6 }}>
            {(!collapsed || mobile) && (
              <div style={{
                fontSize: 10, fontWeight: 700, color: T.sidebarMuted, textTransform: 'uppercase',
                letterSpacing: '0.1em', padding: '8px 12px 6px',
              }}>{sec.title}</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sec.items.map((item) => {
                const Icon = Icons[item.icon] || Icons.Circle;
                const badge = item.badge && badges[item.badge];
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin'}
                    onClick={onNavigate}
                    title={collapsed && !mobile ? item.label : undefined}
                    className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
                    style={{ justifyContent: collapsed && !mobile ? 'center' : 'flex-start' }}
                  >
                    <span className="admin-nav-rail" />
                    <Icon size={18} strokeWidth={2.1} style={{ flexShrink: 0 }} />
                    {(!collapsed || mobile) && <span style={{ flex: 1 }}>{item.label}</span>}
                    {(!collapsed || mobile) && badge ? (
                      <span className="font-mono-num" style={{
                        fontSize: 10.5, fontWeight: 700, padding: '1px 7px', borderRadius: 999,
                        background: T.danger, color: '#fff',
                      }}>{badge}</span>
                    ) : null}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* System status */}
      {(!collapsed || mobile) && (
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px',
            background: T.sidebarAlt, borderRadius: 11, border: `1px solid ${T.sidebarLine}`,
          }}>
            <Wifi size={15} color={T.primary} strokeWidth={2.4} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: '#E8E8EC' }}>All systems normal</div>
              <div style={{ fontSize: 10, color: T.sidebarMuted }}>API · 42ms · 99.98% uptime</div>
            </div>
            <span className="admin-live-dot" style={{ width: 7, height: 7, borderRadius: 99, background: T.primary, boxShadow: `0 0 0 3px ${T.primary}33` }} />
          </div>
        </div>
      )}

      {/* Account footer */}
      <div style={{ borderTop: `1px solid ${T.sidebarLine}`, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: `linear-gradient(135deg, ${T.violet}, ${T.info})`, color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13,
        }}>
          {(user?.name || 'Admin').slice(0, 2).toUpperCase()}
        </div>
        {(!collapsed || mobile) && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Admin User'}</div>
              <div style={{ fontSize: 10.5, color: T.sidebarMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || 'Super Admin'}</div>
            </div>
            <button
              onClick={onLogout} title="Sign out"
              className="admin-btn"
              style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'transparent', color: T.sidebarText, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
            >
              <LogOut size={16} strokeWidth={2.2} />
            </button>
          </>
        )}
      </div>

      {/* Collapse toggle (desktop only) */}
      {!mobile && (
        <button
          onClick={onToggleCollapse}
          className="admin-btn"
          style={{
            margin: 12, marginTop: 0, height: 34, borderRadius: 9,
            border: `1px solid ${T.sidebarLine}`, background: T.sidebarAlt, color: T.sidebarText,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, cursor: 'pointer',
            fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
          }}
        >
          <ChevronsLeft size={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s ease' }} />
          {!collapsed && 'Collapse'}
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
