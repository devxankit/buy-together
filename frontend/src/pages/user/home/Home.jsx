import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from '../../../hooks/useSelector';
import { c } from '../../../design/tokens';
import Icon from '../../../components/ui/Icon';
import { Avatar, AvatarStack } from '../../../components/ui/Avatar';
import Progress from '../../../components/ui/Progress';
import Chip from '../../../components/ui/Chip';
import SearchBar from '../../../components/ui/SearchBar';
import ProductGlyph from '../../../components/ui/ProductGlyph';
import Button from '../../../components/ui/Button';

const CATEGORIES = [
  { glyph: 'phone', label: 'Phones',     dot: true,  path: '/categories?cat=phones' },
  { glyph: 'laptop', label: 'Laptops',              path: '/categories?cat=laptops' },
  { glyph: 'car',   label: 'Cars',                  path: '/categories?cat=cars' },
  { glyph: 'home',  label: 'Property',              path: '/categories?cat=property' },
  { glyph: 'fridge',label: 'Appliances',            path: '/categories?cat=appliances' },
  { glyph: 'bike',  label: 'Bikes',                 path: '/categories?cat=bikes' },
  { glyph: 'game',  label: 'Gaming',                path: '/categories?cat=gaming' },
  { icon:  'grid',  label: 'View all',              path: '/categories' },
];

const TRENDING = [
  { title: 'iPhone 16 Pro 256GB', vendor: 'Apple India', price: '₹1,19,900', original: '₹1,29,900', joined: 7, total: 10, tag: '3 LEFT', tagTone: 'ink', glyph: 'phone', bg: '#1F1F25' },
  { title: 'Sony PlayStation 5',  vendor: 'Sony',        price: '₹44,990',   original: '₹54,990',   joined: 4, total: 6,  tag: 'HOT',    tagTone: 'primary', glyph: 'game', bg: null },
  { title: 'MacBook Air M4',      vendor: 'Apple India', price: '₹89,990',   original: '₹1,09,990', joined: 8, total: 10, tag: '2 LEFT', tagTone: 'ink', glyph: 'laptop', bg: null },
];

const BANNERS = [
  {
    kicker: 'Featured · Electronics',
    pre: 'Pool 9 friends.',
    mid: 'iPhone 16 Pro',
    post: 'for 22% less.',
    bg: c.surfaceInk,
    dark: true,
    orb: 'radial-gradient(circle at 85% 20%, rgba(15,107,83,0.42), transparent 58%)',
    glyph: 'phone',
  },
  {
    kicker: 'Vendor · Maruti Suzuki',
    pre: 'A new deal:',
    mid: 'Baleno @ ₹8L',
    post: 'for 10 buyers.',
    bg: c.primary,
    dark: true,
    orb: 'radial-gradient(circle at 90% 80%, rgba(255,255,255,0.16), transparent 50%)',
    glyph: 'car',
  },
];

const BannerCard = ({ v }) => {
  const text = v.dark ? '#fff' : c.ink;
  const sub  = v.dark ? 'rgba(255,255,255,0.62)' : c.muted;
  return (
    <div style={{
      width: 290, height: 180, flexShrink: 0, marginRight: 12,
      borderRadius: 22, background: v.bg, color: text,
      padding: 20, position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: v.orb }} />
      <div style={{ position: 'absolute', right: -12, bottom: -12, transform: 'rotate(-8deg)', opacity: 0.18 }}>
        <ProductGlyph kind={v.glyph} size={160} tone="rgba(255,255,255,0.8)" />
      </div>
      <div style={{ position: 'relative' }}>
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 1.8, textTransform: 'uppercase', color: sub }}>{v.kicker}</span>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 12, fontWeight: 400, color: sub, marginBottom: 2 }}>{v.pre}</div>
        <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.8, lineHeight: 1.0, color: text }}>{v.mid}</div>
        <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: -0.2, marginTop: 4, color: text }}>{v.post}</div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 11px', borderRadius: 99,
            background: v.dark ? 'rgba(255,255,255,0.12)' : c.ink,
            color: '#fff', fontSize: 11, fontWeight: 500,
            backdropFilter: v.dark ? 'blur(8px)' : 'none',
            border: v.dark ? '1px solid rgba(255,255,255,0.14)' : 'none',
          }}>
            Explore <Icon name="arrowR" size={11} color="#fff" stroke={2} />
          </div>
          <AvatarStack count={3} more={4} size={22} />
        </div>
      </div>
    </div>
  );
};

const TrendingCard = ({ item }) => (
  <div style={{
    minWidth: 210, marginRight: 12, flexShrink: 0,
    background: '#fff', borderRadius: 22, overflow: 'hidden',
    border: `1px solid ${c.line}`,
  }}>
    <div style={{
      height: 120, position: 'relative',
      background: item.bg ? `linear-gradient(170deg, ${item.bg}, #1F1F25)` : `linear-gradient(170deg, ${c.surface}, ${c.surfaceDeep})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ position: 'absolute', top: 10, left: 10 }}>
        <Chip tone={item.tagTone} size="xs">{item.tag}</Chip>
      </div>
      <button style={{
        position: 'absolute', top: 10, right: 10,
        width: 30, height: 30, borderRadius: 10,
        background: 'rgba(255,255,255,0.85)', border: `1px solid ${c.line}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="heart" size={13} color={c.muted} stroke={1.8} />
      </button>
      <ProductGlyph kind={item.glyph} size={80} tone={item.bg ? 'rgba(255,255,255,0.55)' : c.muted} />
    </div>
    <div style={{ padding: '12px 14px 14px' }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: c.muted, letterSpacing: 0.4, textTransform: 'uppercase' }}>{item.vendor}</div>
      <div style={{ fontSize: 13.5, fontWeight: 500, color: c.ink, marginTop: 3, lineHeight: 1.2, letterSpacing: -0.3 }}>{item.title}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: c.ink, letterSpacing: -0.4 }}>{item.price}</span>
        <span style={{ fontSize: 10.5, fontWeight: 500, color: c.faint, textDecoration: 'line-through' }}>{item.original}</span>
      </div>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Progress value={item.joined} total={item.total} height={4} />
        <span style={{ fontSize: 10, fontWeight: 500, color: c.ink, whiteSpace: 'nowrap' }}>{item.joined}/{item.total}</span>
      </div>
    </div>
  </div>
);

const Home = () => {
  const { user } = useSelector(s => s.auth);
  const [actIdx, setActIdx] = useState(0);

  const activities = [
    { who: 'Priya', action: 'unlocked', amount: '₹8,400', group: 'MacBook group' },
    { who: 'Rahul', action: 'joined',   amount: null,      group: 'iPhone 16 Pro' },
    { who: 'Aman',  action: 'saved',    amount: '₹4,200',  group: 'PS5 group' },
  ];

  useEffect(() => {
    const t = setInterval(() => setActIdx(p => (p + 1) % activities.length), 3500);
    return () => clearInterval(t);
  }, []);

  const act = activities[actIdx];

  return (
    <div style={{ background: c.surfaceAlt }}>
      {/* Greeting */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 12.5, fontWeight: 400, color: c.muted }}>
          Good morning, {user?.name?.split(' ')[0] || 'friend'}.
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.0, color: c.ink, marginTop: 6, letterSpacing: -1, fontWeight: 500 }}>
          Find your group.<br />
          <span style={{ color: c.primary, fontSize: 36 }}>Save together.</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '18px 20px 0' }}>
        <SearchBar />
      </div>

      {/* Banner carousel */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', paddingLeft: 20, overflowX: 'auto' }} className="no-scrollbar">
          {BANNERS.map((v, i) => <BannerCard key={i} v={v} />)}
          <div style={{ width: 20, flexShrink: 0 }} />
        </div>
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 12 }}>
          <div style={{ width: 18, height: 3, background: c.ink, borderRadius: 2 }} />
          <div style={{ width: 3, height: 3, background: c.faint, borderRadius: 2 }} />
          <div style={{ width: 3, height: 3, background: c.faint, borderRadius: 2 }} />
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div style={{ fontSize: 17, fontWeight: 500, color: c.ink, letterSpacing: -0.3 }}>
            Browse <span style={{ color: c.primary }}>categories</span>
          </div>
          <Link to="/categories" style={{ fontSize: 10.5, fontWeight: 500, color: c.muted, letterSpacing: 1.4, textTransform: 'uppercase', textDecoration: 'none' }}>
            View all
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, rowGap: 16 }}>
          {CATEGORIES.map((cat, i) => (
            <Link key={i} to={cat.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{
                width: 62, height: 62, borderRadius: 18,
                background: '#fff', border: `1px solid ${c.line}`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                {cat.icon
                  ? <Icon name={cat.icon} size={22} color={c.muted} stroke={1.8} />
                  : <ProductGlyph kind={cat.glyph} size={40} tone={c.inkSoft} />
                }
                {cat.dot && (
                  <span style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 6, height: 6, background: c.primary, borderRadius: '50%',
                  }} />
                )}
              </div>
              <span style={{ fontSize: 10.5, fontWeight: 500, color: c.ink, letterSpacing: 0.2 }}>{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Live activity */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          background: '#fff', borderRadius: 14, padding: '12px 14px',
          border: `1px solid ${c.line}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Avatar seed={actIdx + 1} size={28} />
          <div style={{ flex: 1, fontSize: 12.5, fontWeight: 400, color: c.ink }}>
            <span style={{ fontWeight: 500 }}>{act.who}</span>{' '}
            {act.action}{' '}
            {act.amount && <span style={{ color: c.primary, fontWeight: 500 }}>{act.amount}</span>}
            {act.amount ? ' off in ' : ' '}{act.group}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 8px', borderRadius: 99,
            background: c.primary, color: '#fff',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.6 }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Trending */}
      <div style={{ padding: '24px 0 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px 14px', alignItems: 'baseline' }}>
          <div style={{ fontSize: 17, fontWeight: 500, color: c.ink, letterSpacing: -0.3 }}>
            Trending <span style={{ color: c.primary }}>now</span>
          </div>
          <Link to="/groups" style={{ fontSize: 10.5, fontWeight: 500, color: c.muted, letterSpacing: 1.4, textTransform: 'uppercase', textDecoration: 'none' }}>
            View all
          </Link>
        </div>
        <div style={{ display: 'flex', paddingLeft: 20, overflowX: 'auto' }} className="no-scrollbar">
          {TRENDING.map((item, i) => <TrendingCard key={i} item={item} />)}
          <div style={{ width: 20, flexShrink: 0 }} />
        </div>
      </div>

      {/* CTA banner */}
      <div style={{ padding: '24px 20px 32px' }}>
        <div style={{
          background: c.surfaceInk, color: '#fff', borderRadius: 20, padding: '20px 22px',
          display: 'flex', alignItems: 'center', gap: 16, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 100% 0%, rgba(15,107,83,0.35), transparent 55%)',
          }} />
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.4, lineHeight: 1.15 }}>
              Don't see your <span style={{ color: c.primarySoft }}>deal?</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
              Start a group · invite friends · save together
            </div>
          </div>
          <Link to="/groups/create" style={{
            position: 'relative', width: 44, height: 44, borderRadius: 12,
            background: c.primary, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 18px 40px -16px rgba(15,107,83,0.50)', textDecoration: 'none',
          }}>
            <Icon name="plus" size={20} color="#fff" stroke={2} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
