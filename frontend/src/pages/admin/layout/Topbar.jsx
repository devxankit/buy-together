import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronRight, Maximize2, ExternalLink, CircleDot } from 'lucide-react';
import { T, dims, radius } from '../theme/adminTheme';
import { routeMeta } from './navConfig';
import { notifications } from '../data/mockData';

const ACCENT = { amber: T.amber, danger: T.danger, violet: T.violet, primary: T.primary, info: T.info };

const Topbar = ({ onOpenMobileNav }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const meta = routeMeta[pathname] || { title: 'Admin', section: 'Console' };
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);
  const unread = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const close = (e) => { if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

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
          className="admin-focusable"
          style={{ display: 'flex', alignItems: 'center', gap: 9, height: 38, padding: '0 13px', width: 240, background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg }}
          data-hide-sm="true"
        >
          <Search size={16} color={T.faint} strokeWidth={2.2} />
          <input className="admin-input" placeholder="Search anything…" style={{ flex: 1, minWidth: 0, fontSize: 13, color: T.ink, fontWeight: 500 }} />
          <kbd style={{ fontSize: 10, fontWeight: 700, color: T.faint, background: T.surface, border: `1px solid ${T.line}`, borderRadius: 5, padding: '1px 5px' }}>⌘K</kbd>
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
                <span style={{ fontSize: 11, fontWeight: 700, color: T.primary, background: T.primarySoft, padding: '2px 8px', borderRadius: 999 }}>{unread} new</span>
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }} className="admin-scroll">
                {notifications.map(n => (
                  <div key={n.id} className="admin-row" style={{ display: 'flex', gap: 11, padding: '12px 16px', borderBottom: `1px solid ${T.lineSoft}`, cursor: 'pointer' }}>
                    <CircleDot size={16} color={ACCENT[n.accent] || T.muted} strokeWidth={2.4} style={{ marginTop: 1, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: n.unread ? 600 : 500, color: T.inkSoft, lineHeight: 1.4 }}>{n.title}</div>
                      <div style={{ fontSize: 11, color: T.faint, marginTop: 2 }}>{n.time}</div>
                    </div>
                    {n.unread && <span style={{ width: 7, height: 7, borderRadius: 99, background: T.primary, marginTop: 5, flexShrink: 0 }} />}
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setBellOpen(false); navigate('/admin/fraud'); }}
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
