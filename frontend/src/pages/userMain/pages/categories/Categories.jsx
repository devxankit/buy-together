import { useState } from 'react';
import { Link } from 'react-router-dom';
import { c } from '../../../../design/tokens';
import Icon from '../../../../components/ui/Icon';
import Chip from '../../../../components/ui/Chip';
import Progress from '../../../../components/ui/Progress';
import SearchBar from '../../../../components/ui/SearchBar';
import ProductGlyph from '../../../../components/ui/ProductGlyph';

const FILTERS = ['Sort · Trending', 'Price · Any', 'Near me', '< 10 joined', 'Verified only'];

const ITEMS = [
  { title: 'iPhone 16 Pro', sub: '256GB · Titanium', vendor: 'Apple', price: '₹1,19,900', orig: '₹1,29,900', joined: 7, total: 10, save: '8%', glyph: 'phone' },
  { title: 'Galaxy S24 Ultra', sub: '512GB · Stellar', vendor: 'Samsung', price: '₹1,09,999', orig: '₹1,29,999', joined: 3, total: 5, save: '15%', glyph: 'phone' },
  { title: 'OnePlus 12R', sub: '256GB · Flowy', vendor: 'OnePlus', price: '₹38,999', orig: '₹42,999', joined: 9, total: 10, save: '9%', glyph: 'phone' },
  { title: 'Nothing Phone 3', sub: '128GB · White', vendor: 'Nothing', price: '₹29,990', orig: '₹34,990', joined: 12, total: 15, save: '14%', glyph: 'phone' },
  { title: 'Pixel 9 Pro', sub: '256GB · Obsidian', vendor: 'Google', price: '₹1,09,999', orig: '₹1,19,999', joined: 5, total: 8, save: '8%', glyph: 'phone' },
  { title: 'iPhone 15 128GB', sub: '128GB · Black', vendor: 'Apple', price: '₹74,900', orig: '₹79,900', joined: 6, total: 10, save: '6%', glyph: 'phone' },
];

const Categories = () => {
  const [search, setSearch] = useState('');

  const filtered = ITEMS.filter(it =>
    it.title.toLowerCase().includes(search.toLowerCase()) ||
    it.vendor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: c.surfaceAlt, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 500, color: c.ink, letterSpacing: -0.4 }}>Phones</div>
          <div style={{ fontSize: 11.5, fontWeight: 400, color: c.faint, marginTop: 1 }}>284 active groups · 42 vendors</div>
        </div>
        <button style={{ width: 38, height: 38, borderRadius: 12, background: '#fff', border: `1px solid ${c.line}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="grid" size={17} color={c.ink} stroke={1.8} />
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '14px 20px 12px' }}>
        <SearchBar placeholder="iPhone 16 Pro, Samsung S24…" value={search} onChange={e => setSearch(e.target.value)} compact />
      </div>

      {/* Filters */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 6, overflowX: 'auto' }} className="no-scrollbar">
        {FILTERS.map((f, i) => (
          <button key={i} style={{
            padding: '8px 13px', borderRadius: 99, flexShrink: 0,
            background: i === 0 ? c.ink : '#fff',
            color: i === 0 ? '#fff' : c.ink,
            border: i === 0 ? 'none' : `1px solid ${c.line}`,
            fontSize: 11.5, fontWeight: 500,
            display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          }}>
            {f}
            {i === 0 && <Icon name="chevD" size={11} color="#fff" stroke={2} />}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {filtered.map((it, i) => (
          <Link key={i} to="/groups/1" style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', borderRadius: 18, overflow: 'hidden',
              border: `1px solid ${c.line}`,
            }}>
              <div style={{
                height: 100, background: c.surfaceAlt,
                position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ProductGlyph kind={it.glyph} size={72} tone={c.inkSoft} />
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  <Chip tone="saving" size="xs">↓ {it.save}</Chip>
                </div>
                <button style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 28, height: 28, borderRadius: 9, background: 'rgba(255,255,255,0.9)',
                  border: `1px solid ${c.line}`,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                  <Icon name="heart" size={13} color={c.muted} stroke={1.8} />
                </button>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 500, color: c.muted, letterSpacing: 0.4, textTransform: 'uppercase' }}>{it.vendor}</div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: c.ink, marginTop: 3, letterSpacing: -0.2, lineHeight: 1.2 }}>{it.title}</div>
                <div style={{ fontSize: 11, fontWeight: 400, color: c.muted, marginTop: 2 }}>{it.sub}</div>
                <div style={{ marginTop: 8, fontSize: 15, fontWeight: 500, color: c.ink, letterSpacing: -0.3 }}>{it.price}</div>
                <div style={{ fontSize: 10.5, fontWeight: 400, color: c.faint, textDecoration: 'line-through' }}>{it.orig}</div>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Progress value={it.joined} total={it.total} height={3} />
                  <span style={{ fontSize: 9.5, fontWeight: 500, color: c.ink, whiteSpace: 'nowrap' }}>{it.joined}/{it.total}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
