import { useNavigate } from 'react-router-dom';
import { c } from '../../../design/tokens';
import Icon from '../../../components/ui/Icon';
import { AvatarStack, Avatar } from '../../../components/ui/Avatar';
import Progress from '../../../components/ui/Progress';
import Chip from '../../../components/ui/Chip';
import Button from '../../../components/ui/Button';
import ProductGlyph from '../../../components/ui/ProductGlyph';

const ACTIVITY = [
  { who: 'Priya',      what: 'joined the group',             when: 'Just now', vendor: false, seed: 3 },
  { who: 'Vendor',     what: 'confirmed stock for 10 units', when: '2 hrs',    vendor: true },
  { who: 'Aman',       what: 'voted in poll',                when: '3 hrs',    vendor: false, seed: 4 },
];

const GroupDetail = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: c.surfaceAlt, minHeight: '100vh', position: 'relative' }}>
      {/* Dark hero */}
      <div style={{
        position: 'relative', height: 300,
        background: 'linear-gradient(160deg, #1F1F25, #0F0F12)',
        padding: '16px 20px 0',
      }}>
        <div style={{
          position: 'absolute', right: -60, top: -40, width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15,107,83,0.45), transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 40, height: 40, borderRadius: 13,
              background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="arrowL" size={18} color="#fff" stroke={2.4} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {['share', 'bookmark'].map(name => (
              <button key={name} style={{
                width: 40, height: 40, borderRadius: 13,
                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={name} size={18} color="#fff" stroke={2.2} />
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', marginTop: 24, color: '#fff' }}>
          <Chip tone="primary" size="xs">Most popular · 3 left</Chip>
          <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.8, lineHeight: 1.05, marginTop: 10 }}>
            iPhone 16 Pro<br />256GB · Titanium
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.10)' }}>
              <Icon name="verified" size={12} color={c.info} fill={c.info} stroke={0} />
              <span style={{ fontSize: 10.5, fontWeight: 500 }}>Apple India</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="star" size={11} color="#F0B429" fill="#F0B429" stroke={0} />
              <span style={{ fontSize: 11, fontWeight: 500 }}>4.9 · 1.2k</span>
            </div>
          </div>
        </div>

        {/* Floating product image */}
        <div style={{
          position: 'absolute', top: 80, right: 16, width: 130, height: 170,
          borderRadius: 22, background: '#fff', boxShadow: '0 30px 60px -18px rgba(15,15,18,0.40)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'rotate(4deg)',
        }}>
          <ProductGlyph kind="phone" size={100} tone={c.inkSoft} />
        </div>
      </div>

      {/* Body */}
      <div style={{
        background: c.surfaceAlt, borderRadius: '24px 24px 0 0',
        padding: '22px 20px 110px',
        marginTop: -20,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {/* Price strip */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: 16,
          border: `1px solid ${c.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 500, color: c.ink, letterSpacing: -0.6 }}>₹1,19,900</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: c.faint, textDecoration: 'line-through' }}>₹1,29,900</span>
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 500, color: c.saving, marginTop: 2 }}>You save ₹10,000 · 8%</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10.5, fontWeight: 500, color: c.faint, letterSpacing: 0.6 }}>LOCKS IN</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: c.primary, letterSpacing: -0.3 }}>1d 13h</div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 18, border: `1px solid ${c.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="target" size={16} color={c.primary} stroke={2.4} />
              <span style={{ fontSize: 13, fontWeight: 500, color: c.ink }}>7 of 10 joined</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: c.primary, padding: '4px 10px', background: c.primarySoft, borderRadius: 99 }}>
              3 SPOTS LEFT
            </span>
          </div>
          <Progress value={7} total={10} height={10} />
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AvatarStack count={5} more={2} size={28} />
              <span style={{ fontSize: 11.5, fontWeight: 500, color: c.muted }}>+ 4 friends</span>
            </div>
            <button style={{
              fontSize: 11, fontWeight: 500, padding: '6px 12px', borderRadius: 99,
              background: c.surfaceAlt, border: `1px solid ${c.line}`, color: c.ink, cursor: 'pointer',
            }}>View all</button>
          </div>
        </div>

        {/* Activity */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 16, border: `1px solid ${c.line}` }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: c.faint, letterSpacing: 1, textTransform: 'uppercase' }}>Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {a.vendor ? (
                  <div style={{ width: 30, height: 30, borderRadius: 10, background: c.infoSoft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="verified" size={14} color={c.info} fill={c.info} stroke={0} />
                  </div>
                ) : <Avatar seed={a.seed} size={30} />}
                <div style={{ flex: 1, fontSize: 12.5, color: c.muted }}>
                  <span style={{ fontWeight: 500, color: c.ink }}>{a.who}</span> {a.what}
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 500, color: c.faint }}>{a.when}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed-bottom-bar" style={{
        padding: '14px 20px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom, 0px))',
        background: 'rgba(246,246,248,0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: `1px solid ${c.line}`,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <button
          onClick={() => navigate('/groups/1/chat')}
          style={{
            width: 52, height: 52, borderRadius: 16, background: '#fff',
            border: `1px solid ${c.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Icon name="chat" size={20} color={c.ink} stroke={2.2} />
        </button>
        <Button
          variant="primary" size="lg"
          iconRight={<Icon name="arrowR" size={18} color="#fff" stroke={2.4} />}
          style={{ flex: 1 }}
        >
          Join group · 3 left
        </Button>
      </div>
    </div>
  );
};

export default GroupDetail;
