import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { c } from '../../../design/tokens';
import Icon from '../../../components/ui/Icon';
import Chip from '../../../components/ui/Chip';
import Button from '../../../components/ui/Button';
import Progress from '../../../components/ui/Progress';

const CATEGORIES = ['Electronics', 'Smartphones', 'Laptops', 'Cars', 'Appliances', 'Gaming', 'Grocery', 'Property'];

const CreateGroup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(2);
  const [product, setProduct] = useState('iPhone 16 Pro 256GB');
  const [target, setTarget] = useState(10);
  const [price, setPrice] = useState('1,19,900');
  const [selectedCats, setSelectedCats] = useState(['Electronics', 'Smartphones']);

  const toggleCat = (cat) => {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  return (
    <div style={{ background: c.surfaceAlt, minHeight: '100vh', position: 'relative' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 14px', background: '#fff',
        borderBottom: `1px solid ${c.line}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 38, height: 38, borderRadius: 12, background: c.surfaceAlt, border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Icon name="arrowL" size={18} color={c.ink} stroke={1.8} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 500, color: c.ink, letterSpacing: -0.3 }}>New group</div>
          <div style={{ fontSize: 11.5, fontWeight: 400, color: c.faint, marginTop: 1 }}>Step {step} of 4</div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, color: c.faint, cursor: 'pointer' }}>Cancel</span>
      </div>

      {/* Stepper */}
      <div style={{ padding: '16px 20px 0', display: 'flex', gap: 6 }}>
        {[1,2,3,4].map(s => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? c.primary : c.line }} />
        ))}
      </div>

      {/* Form */}
      <div style={{ padding: '20px 20px 140px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: -0.6, color: c.ink, lineHeight: 1.1 }}>
            What are you<br />
            <span style={{ color: c.primary }}>buying together?</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 400, color: c.muted, marginTop: 8 }}>
            We'll suggest similar groups so you don't duplicate.
          </div>
        </div>

        {/* Product name */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Product</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#fff', border: `1.5px solid ${c.primary}`,
            borderRadius: 14, padding: '14px 16px',
            boxShadow: `0 0 0 4px ${c.primaryGlow}`,
          }}>
            <input
              value={product}
              onChange={e => setProduct(e.target.value)}
              style={{ flex: 1, fontSize: 14.5, fontWeight: 500, color: c.ink, background: 'none', border: 'none', outline: 'none', fontFamily: 'inherit' }}
              placeholder="e.g. iPhone 16 Pro 256GB"
            />
            <Icon name="check" size={18} color={c.saving} stroke={2.8} />
          </div>

          {/* AI suggestion */}
          <div style={{
            marginTop: 10, padding: 12, borderRadius: 14,
            background: c.infoSoft, border: `1px solid rgba(44,86,128,0.13)`,
            display: 'flex', gap: 10,
          }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: c.info, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="sparkle" size={14} color="#fff" stroke={2.6} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, fontWeight: 500, color: c.ink }}>3 similar groups already exist</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: c.muted, marginTop: 2, lineHeight: 1.35 }}>iPhone 16 Pro · 7/10 joined · Lajpat Nagar</div>
              <button style={{
                marginTop: 8, fontSize: 11, fontWeight: 500, color: c.info,
                background: 'transparent', border: `1px solid ${c.info}`,
                padding: '6px 10px', borderRadius: 99, cursor: 'pointer',
              }}>Join existing instead</button>
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Category</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCat(cat)}
                style={{
                  padding: '8px 12px', borderRadius: 99,
                  background: selectedCats.includes(cat) ? c.ink : '#fff',
                  color: selectedCats.includes(cat) ? '#fff' : c.ink,
                  fontSize: 12, fontWeight: 500,
                  border: selectedCats.includes(cat) ? 'none' : `1px solid ${c.line}`,
                  display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer',
                }}
              >
                {cat}
                {selectedCats.includes(cat) && <Icon name="check" size={12} color="#fff" stroke={3} />}
              </button>
            ))}
          </div>
        </div>

        {/* Target & price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Target buyers</div>
            <div style={{ background: '#fff', borderRadius: 14, padding: 14, border: `1px solid ${c.line}` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 500, color: c.ink, letterSpacing: -0.6 }}>{target}</span>
                <span style={{ fontSize: 12, fontWeight: 400, color: c.muted }}>people</span>
              </div>
              <div style={{ marginTop: 10 }}>
                <input
                  type="range" min={2} max={50} value={target}
                  onChange={e => setTarget(+e.target.value)}
                  style={{ width: '100%', accentColor: c.primary }}
                />
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Target price</div>
            <div style={{ background: '#fff', borderRadius: 14, padding: 14, border: `1px solid ${c.line}` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 500, color: c.ink }}>₹</span>
                <input
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  style={{ fontSize: 18, fontWeight: 500, color: c.ink, background: 'none', border: 'none', outline: 'none', width: '100%', letterSpacing: -0.4, fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 500, color: c.saving, marginTop: 6 }}>↓ ₹10,000 vs MRP</div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Location</div>
          <div style={{
            background: '#fff', borderRadius: 14, padding: '14px 16px',
            border: `1px solid ${c.line}`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <Icon name="pin" size={18} color={c.primary} stroke={2.4} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: c.ink }}>Lajpat Nagar, Delhi</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: c.faint, marginTop: 1 }}>Radius: 5 km · 12,400 users</div>
            </div>
            <Icon name="chevR" size={16} color={c.faint} stroke={2.4} />
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
        display: 'flex', gap: 10,
      }}>
        <Button variant="soft" size="lg" onClick={() => setStep(s => Math.max(1, s - 1))}>Back</Button>
        <Button
          variant="primary" size="lg"
          iconRight={<Icon name="arrowR" size={18} color="#fff" stroke={2.4} />}
          style={{ flex: 1 }}
          onClick={() => step < 4 ? setStep(s => s + 1) : navigate('/groups')}
        >
          {step < 4 ? 'Continue' : 'Review & launch'}
        </Button>
      </div>
    </div>
  );
};

export default CreateGroup;
