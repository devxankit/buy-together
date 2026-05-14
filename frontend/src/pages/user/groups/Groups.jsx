import { Link } from 'react-router-dom';
import { c } from '../../../design/tokens';
import Icon from '../../../components/ui/Icon';
import { AvatarStack } from '../../../components/ui/Avatar';
import Progress from '../../../components/ui/Progress';
import Chip from '../../../components/ui/Chip';
import ProductGlyph from '../../../components/ui/ProductGlyph';
import Button from '../../../components/ui/Button';

const TABS = [
  { l: 'Active', n: 4, active: true },
  { l: 'Locked', n: 1 },
  { l: 'Completed', n: 8 },
  { l: 'Saved', n: 12 },
];

const MY_GROUPS = [
  {
    title: 'iPhone 16 Pro 256GB', vendor: 'Apple India', sub: '1d 13h left',
    joined: 9, total: 10, glyph: 'phone', glyphBg: c.ink, glyphTone: 'rgba(255,255,255,0.75)',
    highlight: true, tag: '90% full · 1 left', tagTone: 'primary',
  },
  {
    title: 'Sony PlayStation 5', vendor: 'Created by you', sub: '4 days ago',
    joined: 4, total: 6, glyph: 'game', glyphBg: c.primarySoft, glyphTone: c.primary,
  },
  {
    title: 'MacBook Air M4', vendor: 'Chat: "Anyone needs 16GB?"', sub: '',
    joined: 3, total: 10, glyph: 'laptop', glyphBg: c.surfaceAlt, glyphTone: c.muted,
    badge: '3 NEW',
  },
  {
    title: 'Monthly Grocery Haul', vendor: 'Big Bazaar · Lajpat Nagar', sub: '',
    joined: 6, total: 8, glyph: 'cart', glyphBg: c.primarySoft, glyphTone: c.primary,
  },
];

const GroupCard = ({ g }) => (
  <Link to="/groups/1" style={{ textDecoration: 'none' }}>
    <div style={{
      background: '#fff', borderRadius: 22, padding: 16,
      border: g.highlight ? `1.5px solid ${c.primary}` : `1px solid ${c.line}`,
      boxShadow: g.highlight ? `0 0 0 4px ${c.primaryGlow}` : 'none',
      position: 'relative', marginBottom: 12,
    }}>
      {g.tag && (
        <div style={{ position: 'absolute', top: 14, right: 14 }}>
          <Chip tone={g.tagTone} size="xs">{g.tag}</Chip>
        </div>
      )}
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16,
          background: g.glyphBg || c.surfaceAlt,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <ProductGlyph kind={g.glyph} size={28} tone={g.glyphTone} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14.5, fontWeight: 500, color: c.ink, letterSpacing: -0.3 }}>{g.title}</span>
            {g.badge && (
              <span style={{ fontSize: 9, fontWeight: 500, padding: '2px 6px', borderRadius: 99, background: c.danger, color: '#fff' }}>
                {g.badge}
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, fontWeight: 400, color: c.faint, marginTop: 2 }}>
            {g.vendor}{g.sub ? ` · ${g.sub}` : ''}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
            <Progress value={g.joined} total={g.total} height={5} />
            <span style={{ fontSize: 11, fontWeight: 500, color: c.ink, whiteSpace: 'nowrap' }}>{g.joined}/{g.total}</span>
          </div>
        </div>
      </div>
      {g.highlight && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <AvatarStack count={4} more={5} size={22} />
          <Button variant="primary" size="sm" iconRight={<Icon name="arrowR" size={12} color="#fff" stroke={2.6} />}>
            Invite 1 more
          </Button>
        </div>
      )}
    </div>
  </Link>
);

const Groups = () => (
  <div style={{ background: c.surfaceAlt, minHeight: '100vh' }}>
    <div style={{ padding: '20px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 19, fontWeight: 500, color: c.ink, letterSpacing: -0.4 }}>My groups</div>
        <div style={{ fontSize: 11.5, fontWeight: 400, color: c.faint, marginTop: 1 }}>4 active · 8 completed</div>
      </div>
      <Link to="/groups/create" style={{
        width: 38, height: 38, borderRadius: 12, background: c.primary,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 18px 40px -16px rgba(15,107,83,0.50)', textDecoration: 'none',
      }}>
        <Icon name="plus" size={18} color="#fff" stroke={2.6} />
      </Link>
    </div>

    <div style={{ padding: '0 20px 16px', display: 'flex', gap: 6, overflowX: 'auto' }} className="no-scrollbar">
      {TABS.map((t) => (
        <button key={t.l} style={{
          padding: '8px 14px', borderRadius: 99, flexShrink: 0,
          background: t.active ? c.ink : '#fff',
          color: t.active ? '#fff' : c.ink,
          border: t.active ? 'none' : `1px solid ${c.line}`,
          fontSize: 12, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
        }}>
          {t.l}
          <span style={{
            fontSize: 9, padding: '1px 6px', borderRadius: 99, fontWeight: 500,
            background: t.active ? 'rgba(255,255,255,0.18)' : c.surfaceAlt,
            color: t.active ? '#fff' : c.faint,
          }}>{t.n}</span>
        </button>
      ))}
    </div>

    <div style={{ padding: '0 20px' }}>
      {MY_GROUPS.map((g, i) => <GroupCard key={i} g={g} />)}
    </div>
  </div>
);

export default Groups;
