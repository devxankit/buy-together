import { Link } from 'react-router-dom';
import { c } from '../../../design/tokens';
import Icon from '../../../components/ui/Icon';
import Progress from '../../../components/ui/Progress';
import Chip from '../../../components/ui/Chip';
import ProductGlyph from '../../../components/ui/ProductGlyph';

const OFFERS = [
  { t: 'iPhone 16 Pro 256GB', p: '₹1,19,900', j: 7, total: 10, status: 'Filling',          tone: c.primary, time: '1d 13h', glyph: 'phone' },
  { t: 'MacBook Air M4',      p: '₹89,990',   j: 10, total: 10, status: 'Locked · pending', tone: c.saving,  time: 'Action needed', glyph: 'laptop' },
  { t: 'iPad Pro 11"',        p: '₹74,990',   j: 3,  total: 8,  status: 'New',              tone: c.info,    time: 'Just launched', glyph: 'tv' },
];

const AREAS = [
  { l: 'Lajpat Nagar', v: 86, c: 142 },
  { l: 'Saket',        v: 64, c: 98  },
  { l: 'Gurgaon 56',   v: 52, c: 78  },
  { l: 'Noida 62',     v: 38, c: 51  },
];

const VendorDashboard = () => (
  <div style={{ background: c.surfaceAlt, minHeight: '100vh' }}>
    <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Earnings hero */}
      <div style={{
        background: c.ink, color: '#fff', borderRadius: 24, padding: 22,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,107,83,0.40), transparent 70%)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.2, textTransform: 'uppercase' }}>This month · GMV</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
            <span style={{ fontSize: 38, fontWeight: 500, letterSpacing: -1.2 }}>₹18.4L</span>
            <Chip tone="saving" size="xs">↑ 32%</Chip>
          </div>
          <div style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>vs ₹13.9L last month · 142 deals</div>
          {/* Mini chart */}
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'flex-end', gap: 5, height: 48 }}>
            {[35, 48, 30, 62, 44, 70, 58, 78, 60, 88, 72, 96].map((h, i) => (
              <div key={i} style={{
                flex: 1, height: `${h}%`, borderRadius: 3,
                background: i >= 10 ? c.primary : i >= 6 ? 'rgba(15,107,83,0.45)' : 'rgba(255,255,255,0.18)',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { v: '12', l: 'Active groups', t: c.primary, bg: c.primarySoft },
          { v: '438', l: 'Buyers in',    t: c.info,    bg: c.infoSoft },
          { v: '4.9', l: 'Rating',       t: c.saving,  bg: c.savingSoft },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 14, border: `1px solid ${c.line}` }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: s.bg, marginBottom: 8 }} />
            <div style={{ fontSize: 20, fontWeight: 500, color: c.ink, letterSpacing: -0.4 }}>{s.v}</div>
            <div style={{ fontSize: 10, fontWeight: 500, color: c.faint, letterSpacing: 0.4, textTransform: 'uppercase', marginTop: 1 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Live offers */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: c.ink, letterSpacing: -0.2 }}>Live offers</span>
          <Link to="/vendor/create-offer" style={{
            background: c.ink, color: '#fff', fontSize: 11, fontWeight: 500,
            padding: '6px 12px', borderRadius: 99, border: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none',
            cursor: 'pointer',
          }}>
            <Icon name="plus" size={12} color="#fff" stroke={3} /> NEW
          </Link>
        </div>
        {OFFERS.map((o, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 18, padding: 14,
            border: `1px solid ${c.line}`, marginBottom: 10,
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: c.surfaceAlt,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${c.line}`, flexShrink: 0,
            }}>
              <ProductGlyph kind={o.glyph} size={28} tone={c.inkSoft} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: c.ink, letterSpacing: -0.2 }}>{o.t}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: c.ink }}>{o.p}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Progress value={o.j} total={o.total} height={4} />
                <span style={{ fontSize: 10, fontWeight: 500, color: c.ink, whiteSpace: 'nowrap' }}>{o.j}/{o.total}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: o.tone, display: 'inline-block' }} />
                <span style={{ fontSize: 10.5, fontWeight: 500, color: o.tone, letterSpacing: 0.4, textTransform: 'uppercase' }}>{o.status}</span>
                <span style={{ fontSize: 10, fontWeight: 500, color: c.faint, marginLeft: 'auto' }}>{o.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Demand heatmap */}
      <div style={{ background: '#fff', borderRadius: 18, padding: 16, border: `1px solid ${c.line}`, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: c.ink, letterSpacing: -0.2 }}>Demand by area</span>
          <span style={{ fontSize: 10.5, fontWeight: 500, color: c.faint, letterSpacing: 0.6, textTransform: 'uppercase' }}>LAST 7 DAYS</span>
        </div>
        {AREAS.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 11.5, fontWeight: 500, color: c.ink, width: 120, flexShrink: 0 }}>{a.l}</span>
            <div style={{ flex: 1, height: 8, background: c.line, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${a.v}%`, height: '100%', background: `linear-gradient(90deg, ${c.primary}, #12A276)`, borderRadius: 4 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: c.muted, width: 36, textAlign: 'right', flexShrink: 0 }}>{a.c}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default VendorDashboard;
