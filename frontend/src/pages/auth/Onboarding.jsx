import { useNavigate } from 'react-router-dom';
import { c } from '../../design/tokens';
import { Avatar, AvatarStack } from '../../components/ui/Avatar';
import Icon from '../../components/ui/Icon';
import Progress from '../../components/ui/Progress';
import Button from '../../components/ui/Button';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: c.surfaceInk,
      display: 'flex', flexDirection: 'column',
      padding: 'max(44px, calc(env(safe-area-inset-top, 0px) + 20px)) 26px 40px',
      position: 'relative', overflow: 'hidden',
      maxWidth: 430, margin: '0 auto',
    }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute', top: -160, right: -120, width: 460, height: 460, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15,107,83,0.55), transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -140, left: -100, width: 360, height: 360, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15,107,83,0.20), transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, background: c.primary,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 18px 40px -16px rgba(15,107,83,0.50)',
          }}>
            <Icon name="users" size={16} color="#fff" stroke={2} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: -0.2, color: '#fff' }}>buytogether</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
        >
          Skip
        </button>
      </div>

      {/* Floating cards */}
      <div style={{ flex: 1, position: 'relative', marginTop: 36, zIndex: 2 }}>
        <div style={{
          position: 'absolute', left: 14, top: 0, transform: 'rotate(-5deg)',
          width: 210, padding: 16, borderRadius: 18,
          background: '#fff', boxShadow: '0 30px 60px -18px rgba(15,15,18,0.16)',
          border: `1px solid ${c.line}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11, background: c.surfaceAlt,
              border: `1px solid ${c.line}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="phone" size={18} color={c.inkSoft} stroke={1.8} />
            </div>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 500, color: c.ink }}>iPhone 16 Pro</div>
              <div style={{ fontSize: 10, fontWeight: 400, color: c.muted, marginTop: 1 }}>7 / 10 joined</div>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <Progress value={7} total={10} height={3} />
          </div>
        </div>

        <div style={{
          position: 'absolute', right: 8, top: 110, transform: 'rotate(4deg)',
          width: 190, padding: 16, borderRadius: 18,
          background: '#fff', boxShadow: '0 30px 60px -18px rgba(15,15,18,0.16)',
          border: `1px solid ${c.line}`,
        }}>
          <span style={{
            display: 'inline-flex', padding: '3px 7px', borderRadius: 999,
            background: c.savingSoft, color: c.primaryDeep,
            fontSize: 9.5, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
          }}>↓ ₹10,000</span>
          <div style={{ fontSize: 13, fontWeight: 500, marginTop: 8, letterSpacing: -0.2, color: c.ink }}>Sony PS5 group</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <AvatarStack count={3} more={1} size={20} />
            <span style={{ fontSize: 10, fontWeight: 500, color: c.muted }}>4 / 6</span>
          </div>
        </div>

        <div style={{
          position: 'absolute', left: 28, bottom: 24,
          padding: '11px 14px', borderRadius: 14,
          background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.14)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Avatar seed={3} size={22} />
          <span style={{ fontSize: 11.5, fontWeight: 400, color: '#fff' }}>
            Rahul just saved <span style={{ color: c.primarySoft, fontWeight: 500 }}>₹8,400</span>
          </span>
        </div>
      </div>

      {/* Tagline + CTA */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 16, height: 1, background: c.primarySoft, display: 'inline-block' }} />
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: c.primarySoft }}>
            The smarter way
          </div>
        </div>
        <div style={{ fontSize: 38, fontWeight: 400, lineHeight: 1.0, letterSpacing: -1.4, marginTop: 16, color: '#fff' }}>
          Buy alone,<br />
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>pay full price.</span>
        </div>
        <div style={{ fontSize: 38, fontWeight: 400, lineHeight: 1.0, letterSpacing: -1.4, marginTop: 4, color: '#fff' }}>
          Buy <span style={{ color: c.primarySoft }}>together,</span>
          <br />save 22%.
        </div>
        <div style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.62)', marginTop: 16, lineHeight: 1.5 }}>
          Join real buyer groups. The group hits target, the vendor drops the price.
        </div>

        {/* Page dots */}
        <div style={{ display: 'flex', gap: 6, marginTop: 22 }}>
          <div style={{ width: 24, height: 3, borderRadius: 2, background: c.primarySoft }} />
          <div style={{ width: 3, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }} />
          <div style={{ width: 3, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }} />
        </div>

        <div style={{ marginTop: 20 }}>
          <Button
            variant="primary" size="lg" full
            iconRight={<Icon name="arrowR" size={16} color="#fff" stroke={2} />}
            onClick={() => navigate('/login')}
          >
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
