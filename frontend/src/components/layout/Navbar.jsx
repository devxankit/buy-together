import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from '../../hooks/useSelector';
import { c } from '../../design/tokens';
import Icon from '../ui/Icon';
import Sidebar from './Sidebar';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${c.line}`,
        padding: '0 20px',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        height: 'calc(56px + env(safe-area-inset-top, 0px))',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            width: 40, height: 40, borderRadius: 12,
            background: '#fff', border: `1px solid ${c.line}`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="menu" size={18} color={c.ink} stroke={1.8} />
        </button>

        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: c.primary,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 18px 40px -16px rgba(15,107,83,0.50)',
          }}>
            <Icon name="users" size={15} color="#fff" stroke={2} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: c.ink, letterSpacing: -0.3 }}>
            buytogether
          </span>
        </Link>

        <Link to="/notifications" style={{
          width: 40, height: 40, borderRadius: 12,
          background: '#fff', border: `1px solid ${c.line}`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', textDecoration: 'none',
        }}>
          <Icon name="bell" size={17} color={c.ink} stroke={1.8} />
          <span style={{
            position: 'absolute', top: 9, right: 9,
            width: 6, height: 6, background: c.primary, borderRadius: '50%',
            border: '2px solid #fff',
          }} />
        </Link>
      </nav>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
};

export default Navbar;
