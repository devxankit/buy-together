import { useState } from 'react';
import { Link } from 'react-router-dom';
import { c } from '../../../../design/tokens';
import Icon from '../../../../components/ui/Icon';
import Chip from '../../../../components/ui/Chip';
import Progress from '../../../../components/ui/Progress';
import ProductGlyph from '../../../../components/ui/ProductGlyph';
import Button from '../../../../components/ui/Button';

const TABS = ['All', 'Active', 'Confirmed', 'Expired'];

const DEALS = [
  {
    title: 'iPhone 16 Pro 256GB', vendor: 'Apple India', price: '₹1,19,900', mrp: '₹1,29,900',
    save: '₹10,000', joined: 7, total: 10, status: 'active', glyph: 'phone',
    deadline: '1d 13h',
  },
  {
    title: 'MacBook Air M4', vendor: 'Apple India', price: '₹89,990', mrp: '₹1,09,990',
    save: '₹20,000', joined: 10, total: 10, status: 'confirmed', glyph: 'laptop',
    deadline: 'Locked',
  },
  {
    title: 'Sony PlayStation 5', vendor: 'Sony', price: '₹44,990', mrp: '₹54,990',
    save: '₹10,000', joined: 4, total: 6, status: 'active', glyph: 'game',
    deadline: '3d 6h',
  },
  {
    title: 'Samsung TV 55"', vendor: 'Samsung', price: '₹44,990', mrp: '₹59,990',
    save: '₹15,000', joined: 5, total: 5, status: 'confirmed', glyph: 'tv',
    deadline: 'Confirmed',
  },
];

const statusColor = { active: c.primary, confirmed: c.saving, expired: c.faint };

const DealCard = ({ deal }) => (
  <Link to={`/groups/1`} style={{ textDecoration: 'none', display: 'block', marginBottom: 12 }}>
    <div style={{
      background: '#fff', borderRadius: 20, padding: 16,
      border: deal.status === 'confirmed' ? `1.5px solid ${c.primary}` : `1px solid ${c.line}`,
      boxShadow: deal.status === 'confirmed' ? `0 0 0 4px ${c.primaryGlow}` : 'none',
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: deal.status === 'confirmed' ? c.ink : c.surfaceAlt,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <ProductGlyph kind={deal.glyph} size={32} tone={deal.status === 'confirmed' ? 'rgba(255,255,255,0.75)' : c.muted} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 500, color: c.muted, letterSpacing: 0.4, textTransform: 'uppercase' }}>{deal.vendor}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: c.ink, marginTop: 2, letterSpacing: -0.3 }}>{deal.title}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: c.ink, letterSpacing: -0.4 }}>{deal.price}</div>
              <div style={{ fontSize: 10.5, fontWeight: 400, color: c.faint, textDecoration: 'line-through' }}>{deal.mrp}</div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Progress value={deal.joined} total={deal.total} height={4} />
              <span style={{ fontSize: 10, fontWeight: 500, color: c.ink, whiteSpace: 'nowrap' }}>{deal.joined}/{deal.total}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor[deal.status], display: 'inline-block' }} />
                <span style={{ fontSize: 10.5, fontWeight: 500, color: statusColor[deal.status], textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  {deal.status}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icon name="clock" size={11} color={c.faint} stroke={1.8} />
                <span style={{ fontSize: 10, fontWeight: 500, color: c.faint }}>{deal.deadline}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {deal.status === 'confirmed' && (
        <div style={{
          marginTop: 12, padding: '10px 12px', borderRadius: 12,
          background: c.savingSoft, border: `1px solid rgba(15,107,83,0.15)`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="check" size={14} color={c.saving} stroke={2.6} />
            <span style={{ fontSize: 12, fontWeight: 500, color: c.saving }}>You save {deal.save}</span>
          </div>
          <Button variant="primary" size="sm">Confirm & pay</Button>
        </div>
      )}
    </div>
  </Link>
);

const Deals = () => {
  const [activeTab, setActiveTab] = useState('All');
  const filtered = activeTab === 'All' ? DEALS : DEALS.filter(d => d.status === activeTab.toLowerCase());

  return (
    <div style={{ background: c.surfaceAlt, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 14px' }}>
        <div style={{ fontSize: 19, fontWeight: 500, color: c.ink, letterSpacing: -0.4 }}>My deals</div>
        <div style={{ fontSize: 11.5, fontWeight: 400, color: c.faint, marginTop: 1 }}>
          {DEALS.filter(d => d.status === 'confirmed').length} confirmed · {DEALS.filter(d => d.status === 'active').length} active
        </div>
      </div>

      {/* Savings hero */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          background: c.surfaceInk, color: '#fff', borderRadius: 22, padding: '18px 20px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,107,83,0.40), transparent 70%)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 10.5, fontWeight: 500, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.2, textTransform: 'uppercase' }}>Total saved this month</div>
            <div style={{ fontSize: 34, fontWeight: 500, letterSpacing: -1.2, marginTop: 4 }}>₹24,820</div>
            <div style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>across 4 confirmed deals</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 6 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '8px 14px', borderRadius: 99, flexShrink: 0,
            background: activeTab === t ? c.ink : '#fff',
            color: activeTab === t ? '#fff' : c.ink,
            border: activeTab === t ? 'none' : `1px solid ${c.line}`,
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}>{t}</button>
        ))}
      </div>

      {/* Deals list */}
      <div style={{ padding: '0 20px' }}>
        {filtered.map((d, i) => <DealCard key={i} deal={d} />)}
      </div>
    </div>
  );
};

export default Deals;
