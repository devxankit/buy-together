import { useNavigate } from 'react-router-dom';
import { c } from '../../design/tokens';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';

const Location = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', background: c.surfaceAlt,
      padding: '0 0 40px', maxWidth: 430, margin: '0 auto',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Map visual area */}
      <div style={{
        margin: 'calc(env(safe-area-inset-top, 0px) + 16px) 20px 0', borderRadius: 24, overflow: 'hidden',
        background: '#fff', position: 'relative', height: 300,
        border: `1px solid ${c.line}`,
      }}>
        {/* Grid pattern */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
          <defs>
            <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={c.line} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapgrid)" />
        </svg>
        {/* Road-like paths */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <path d="M -20 240 Q 100 180 170 160 T 340 60" stroke={c.lineSoft} strokeWidth="18" fill="none" strokeLinecap="round" />
          <path d="M 30 -10 Q 80 80 140 130 T 280 220" stroke={c.primaryGlow} strokeWidth="10" fill="none" strokeLinecap="round" />
        </svg>

        {/* Location pins */}
        {[
          { top: 50, left: 40, label: '3 groups' },
          { top: 180, left: 220, label: 'Vendor' },
          { top: 230, left: 80, label: '+7' },
        ].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', top: p.top, left: p.left,
            padding: '5px 10px 5px 6px', borderRadius: 99,
            background: i === 0 ? c.ink : i === 1 ? c.primary : '#fff',
            color: i === 2 ? c.ink : '#fff',
            display: 'flex', alignItems: 'center', gap: 5,
            boxShadow: '0 4px 12px -4px rgba(15,15,18,0.20)',
            fontSize: 11, fontWeight: 500,
            border: i === 2 ? `1px solid ${c.line}` : 'none',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 9,
              background: 'rgba(255,255,255,0.2)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="pin" size={10} color={i === 2 ? c.ink : '#fff'} stroke={2} />
            </div>
            {p.label}
          </div>
        ))}

        {/* Center pulsing marker */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div style={{
            position: 'absolute', inset: -28, borderRadius: '50%',
            background: c.primaryGlow,
          }} />
          <div style={{
            position: 'absolute', inset: -12, borderRadius: '50%',
            background: 'rgba(15,107,83,0.28)',
          }} />
          <div style={{
            position: 'relative', width: 48, height: 48, borderRadius: '50%',
            background: c.primary, boxShadow: '0 18px 40px -16px rgba(15,107,83,0.50)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            border: '3px solid #fff',
          }}>
            <Icon name="pin" size={20} color="#fff" stroke={2} />
          </div>
        </div>
      </div>

      {/* Text content */}
      <div style={{ padding: '28px 20px 0', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 16, height: 1, background: c.primary, display: 'inline-block' }} />
          <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', color: c.primary }}>
            One last thing
          </span>
        </div>
        <div style={{ fontSize: 34, fontWeight: 400, letterSpacing: -1.1, lineHeight: 1.0, marginTop: 14, color: c.ink }}>
          Find groups<br />buying <span style={{ color: c.primary }}>near you.</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 400, color: c.muted, marginTop: 14, lineHeight: 1.55 }}>
          We use your area to show local buyer groups and vendor offers. Never shared, never sold.
        </div>
      </div>

      {/* CTAs */}
      <div style={{ padding: '28px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button
          variant="primary" size="lg" full
          icon={<Icon name="pin" size={16} color="#fff" stroke={2} />}
          onClick={() => navigate('/')}
        >
          Use my location
        </Button>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent', border: 'none',
            fontSize: 13, fontWeight: 500, color: c.muted,
            padding: 10, fontFamily: 'inherit', cursor: 'pointer',
          }}
        >
          Enter pincode manually
        </button>
      </div>
    </div>
  );
};

export default Location;
