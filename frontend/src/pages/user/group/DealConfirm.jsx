import { useNavigate, useParams } from 'react-router-dom';
import { c } from '../../../design/tokens';
import Icon from '../../../components/ui/Icon';
import { AvatarStack } from '../../../components/ui/Avatar';
import Button from '../../../components/ui/Button';
import ProductGlyph from '../../../components/ui/ProductGlyph';

const CONFETTI_COLORS = [c.primary, c.saving, c.info, c.muted, c.faint];

const DealConfirm = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();

  return (
    <div style={{ minHeight: '100vh', background: '#fff', position: 'relative' }}>
      {/* Hero celebration */}
      <div style={{
        padding: 'max(44px, calc(env(safe-area-inset-top, 0px) + 16px)) 20px 28px',
        background: `linear-gradient(180deg, ${c.primarySoft}, #fff 80%)`,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Confetti */}
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 53 + 7) % 100}%`,
            top: `${(i * 31 + 13) % 70}%`,
            width: 6 + (i % 3) * 2, height: 6 + (i % 3) * 2,
            borderRadius: i % 2 ? '50%' : 2,
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            opacity: 0.55,
            transform: `rotate(${i * 33}deg)`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'rgba(255,255,255,0.7)', border: `1px solid ${c.line}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Icon name="x" size={18} color={c.ink} stroke={2.4} />
          </button>
          <button style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'rgba(255,255,255,0.7)', border: `1px solid ${c.line}`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <Icon name="share" size={16} color={c.ink} stroke={2.2} />
          </button>
        </div>

        {/* Headline */}
        <div style={{ marginTop: 22, position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 99,
            background: c.ink, color: '#fff',
            fontSize: 10.5, fontWeight: 500, letterSpacing: 1.2,
          }}>
            <Icon name="lock" size={12} color={c.primary} stroke={2.4} fill={c.primary} />
            GROUP LOCKED
          </div>
          <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1.1, color: c.ink, lineHeight: 1.05, marginTop: 14 }}>
            You did it.<br /><span style={{ color: c.primary }}>Confirm your spot.</span>
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 400, color: c.muted, marginTop: 10, lineHeight: 1.5 }}>
            All 10 buyers are in. Apple India has released the deal. You have{' '}
            <span style={{ color: c.ink, fontWeight: 500 }}>24 hours</span> to confirm.
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px 120px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Product summary */}
        <div style={{
          background: c.surfaceAlt, borderRadius: 22, padding: 18,
          border: `1px solid ${c.line}`,
        }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, background: c.ink,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <ProductGlyph kind="phone" size={36} tone="rgba(255,255,255,0.75)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10.5, fontWeight: 500, color: c.faint, letterSpacing: 0.8, textTransform: 'uppercase' }}>Apple India</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: c.ink, letterSpacing: -0.3, marginTop: 2 }}>iPhone 16 Pro 256GB</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: c.muted, marginTop: 2 }}>Titanium Black · 10-buyer group</div>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: 12, borderRadius: 12, background: '#fff', border: `1px solid ${c.line}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 400, color: c.muted }}>MRP</span>
              <span style={{ fontSize: 12, fontWeight: 400, color: c.muted, textDecoration: 'line-through' }}>₹1,29,900</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 400, color: c.muted }}>Group price</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: c.ink }}>₹1,19,900</span>
            </div>
            <div style={{ height: 1, background: c.line, margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: c.primary }}>You save</span>
              <span style={{ fontSize: 18, fontWeight: 500, color: c.primary, letterSpacing: -0.3 }}>₹10,000</span>
            </div>
          </div>
        </div>

        {/* Group complete banner */}
        <div style={{
          background: c.savingSoft, border: `1px solid rgba(15,107,83,0.20)`,
          borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: c.saving,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="check" size={20} color="#fff" stroke={3} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: c.ink }}>10 / 10 buyers locked in</div>
            <div style={{ fontSize: 11, fontWeight: 400, color: c.muted, marginTop: 1 }}>8 confirmed · 2 pending including you</div>
          </div>
          <AvatarStack count={3} more={7} size={22} />
        </div>

        {/* Delivery info */}
        <div style={{
          background: c.surfaceAlt, borderRadius: 16, padding: 14,
          border: `1px solid ${c.line}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11, background: c.infoSoft,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="bag" size={18} color={c.info} stroke={2.2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: c.ink }}>Delivery in 5–7 days</div>
            <div style={{ fontSize: 11, fontWeight: 400, color: c.muted, marginTop: 1 }}>Apple Store · Lajpat Nagar · Pickup or home</div>
          </div>
          <Icon name="chevR" size={14} color={c.faint} stroke={2.4} />
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed-bottom-bar" style={{
        padding: '14px 20px',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom, 0px))',
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: `1px solid ${c.line}`,
      }}>
        <Button
          variant="primary" size="lg" full
          iconRight={<Icon name="arrowR" size={18} color="#fff" stroke={2.4} />}
          onClick={() => navigate('/')}
        >
          Confirm &amp; pay ₹1,19,900
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 }}>
          <Icon name="shield" size={12} color={c.muted} stroke={2.2} />
          <span style={{ fontSize: 11, fontWeight: 400, color: c.muted }}>Secured · Buyer protection included</span>
        </div>
      </div>
    </div>
  );
};

export default DealConfirm;
