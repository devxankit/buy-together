import { useNavigate } from 'react-router-dom';
import { useSelector } from '../../../../hooks/useSelector';
import { useDispatch } from '../../../../hooks/useDispatch';
import { logout } from '../../../../redux/slices/authSlice';
import { c } from '../../../../design/tokens';
import Icon from '../../../../components/ui/Icon';
import { Avatar } from '../../../../components/ui/Avatar';
import Chip from '../../../../components/ui/Chip';
import Progress from '../../../../components/ui/Progress';

const MENU = [
  { icon: 'users',    label: 'My groups',    sub: '4 active · 8 completed',      to: '/groups' },
  { icon: 'bag',      label: 'My deals',     sub: '2 pending confirmation',       to: '/deals' },
  { icon: 'heart',    label: 'Wishlist',     sub: '12 saved items',               to: '/' },
  { icon: 'qr',       label: 'Invite friends', sub: 'Earn 1 month Premium',      to: '/', accent: true },
];

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div style={{ background: c.surfaceAlt, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 19, fontWeight: 500, color: c.ink, letterSpacing: -0.4 }}>My profile</span>
        <button style={{ width: 38, height: 38, borderRadius: 12, background: '#fff', border: `1px solid ${c.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="settings" size={18} color={c.ink} stroke={2.2} />
        </button>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Profile card */}
        <div style={{
          background: '#fff', borderRadius: 24, padding: 22,
          border: `1px solid ${c.line}`, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -50, top: -50, width: 180, height: 180, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(15,107,83,0.10), transparent 70%)',
          }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
            <Avatar seed={1} size={68} ring name={user?.name} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 18, fontWeight: 500, color: c.ink, letterSpacing: -0.4 }}>
                  {user?.name || 'Rahul Khanna'}
                </span>
                <Icon name="verified" size={16} color={c.info} fill={c.info} stroke={0} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 400, color: c.muted }}>{user?.mobile || '+91 98765 43210'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <Icon name="pin" size={12} color={c.faint} stroke={2.4} />
                <span style={{ fontSize: 11, fontWeight: 500, color: c.faint }}>Lajpat Nagar, Delhi</span>
              </div>
            </div>
            <button style={{ width: 34, height: 34, borderRadius: 11, background: c.surfaceAlt, border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Icon name="edit" size={14} color={c.ink} stroke={2.2} />
            </button>
          </div>

          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <Chip tone="saving" size="sm">Bulk buyer</Chip>
            <Chip tone="info" size="sm">Top contributor</Chip>
            <Chip tone="primary" size="sm">5 deals</Chip>
          </div>

          <div style={{ marginTop: 16, padding: 12, borderRadius: 14, background: c.surfaceAlt, border: `1px solid ${c.line}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: c.ink }}>LEVEL 3 · GROUP LEADER</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: c.primary }}>2 / 5 to L4</span>
            </div>
            <Progress value={2} total={5} height={6} />
          </div>
        </div>

        {/* Total savings */}
        <div style={{
          background: c.ink, color: '#fff', borderRadius: 22, padding: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -30, bottom: -30, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,107,83,0.4), transparent 65%)' }} />
          <div style={{ fontSize: 10.5, fontWeight: 500, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.2, textTransform: 'uppercase' }}>
            Total saved with Buy Together
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6, position: 'relative' }}>
            <span style={{ fontSize: 40, fontWeight: 500, letterSpacing: -1.4 }}>₹24,820</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: c.primarySoft }}>across 5 deals</span>
          </div>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, position: 'relative' }}>
            {[{ v: '12', l: 'Joined' }, { v: '3', l: 'Created' }, { v: '8', l: 'Confirmed' }].map((s, i) => (
              <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 500 }}>{s.v}</div>
                <div style={{ fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.4, textTransform: 'uppercase' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${c.line}`, overflow: 'hidden' }}>
          {MENU.map((it, i, arr) => (
            <button
              key={i}
              onClick={() => navigate(it.to)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                padding: '14px 16px',
                borderBottom: i < arr.length - 1 ? `1px solid ${c.line}` : 'none',
                background: 'transparent', cursor: 'pointer',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 11,
                background: it.accent ? c.primarySoft : c.surfaceAlt,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={it.icon} size={17} color={it.accent ? c.primary : c.muted} stroke={2.2} />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: c.ink }}>{it.label}</div>
                <div style={{ fontSize: 11, fontWeight: 400, color: c.faint, marginTop: 1 }}>{it.sub}</div>
              </div>
              <Icon name="chevR" size={14} color={c.faint} stroke={2.4} />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%', background: 'transparent', color: c.danger,
            padding: '14px 16px', borderRadius: 16, border: `1px solid ${c.line}`,
            display: 'flex', alignItems: 'center', gap: 10,
            fontWeight: 500, fontSize: 13, cursor: 'pointer', marginBottom: 8,
          }}
        >
          <Icon name="log" size={16} color={c.danger} stroke={1.8} />
          Log out
        </button>
      </div>
    </div>
  );
};

export default Profile;
