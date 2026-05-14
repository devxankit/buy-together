import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { c } from '../../../design/tokens';
import Icon from '../../../components/ui/Icon';
import Chip from '../../../components/ui/Chip';
import Button from '../../../components/ui/Button';
import ProductGlyph from '../../../components/ui/ProductGlyph';

const CreateOffer = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState('Maruti Baleno Zeta · 2026');
  const [dealPrice, setDealPrice] = useState('8,00,000');
  const [mrp, setMrp] = useState('8,90,000');
  const [target, setTarget] = useState(10);

  return (
    <div style={{ background: c.surfaceAlt, minHeight: '100vh', position: 'relative' }}>
      {/* Header */}
      <div style={{
        padding: 'max(44px, calc(env(safe-area-inset-top, 0px) + 16px)) 20px 14px', background: '#fff',
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
          <div style={{ fontSize: 17, fontWeight: 500, color: c.ink, letterSpacing: -0.3 }}>New offer</div>
          <div style={{ fontSize: 11.5, fontWeight: 400, color: c.faint, marginTop: 1 }}>Draft · auto-saved</div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 500, color: c.faint, letterSpacing: 0.6, textTransform: 'uppercase', cursor: 'pointer' }}>
          SAVE & EXIT
        </span>
      </div>

      <div style={{ padding: '20px 20px 140px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Preview card */}
        <div style={{
          background: c.ink, color: '#fff', borderRadius: 22, padding: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -16, top: -10, opacity: 0.18 }}>
            <ProductGlyph kind="car" size={170} tone="rgba(255,255,255,0.8)" />
          </div>
          <Chip tone="primary" size="xs">PREVIEW</Chip>
          <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.6, marginTop: 10 }}>{product}</div>
          <div style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
            Petrol · 5-seater · Delhi NCR
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
            <span style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.6 }}>₹{dealPrice}</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>₹{mrp}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Target: {target} buyers</span>
            <span style={{ width: 4, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: c.primarySoft }}>↓ ~10% off</span>
          </div>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Product</div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: `1px solid ${c.line}` }}>
              <input
                value={product}
                onChange={e => setProduct(e.target.value)}
                style={{ fontSize: 13.5, fontWeight: 500, color: c.ink, background: 'none', border: 'none', outline: 'none', width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Deal price</div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: `1.5px solid ${c.primary}`, boxShadow: `0 0 0 4px ${c.primaryGlow}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 500, color: c.ink }}>₹</span>
                  <input
                    value={dealPrice}
                    onChange={e => setDealPrice(e.target.value)}
                    style={{ fontSize: 16, fontWeight: 500, color: c.ink, background: 'none', border: 'none', outline: 'none', width: '100%', letterSpacing: -0.3, fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>MRP</div>
              <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: `1px solid ${c.line}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 500, color: c.ink }}>₹</span>
                  <input
                    value={mrp}
                    onChange={e => setMrp(e.target.value)}
                    style={{ fontSize: 16, fontWeight: 500, color: c.ink, background: 'none', border: 'none', outline: 'none', width: '100%', letterSpacing: -0.3, fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Target slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: c.muted, letterSpacing: 0.6, textTransform: 'uppercase' }}>Target buyers</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: c.primary }}>{target} people</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: `1px solid ${c.line}` }}>
              <input
                type="range" min={2} max={50} value={target}
                onChange={e => setTarget(+e.target.value)}
                style={{ width: '100%', accentColor: c.primary }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, fontWeight: 500, color: c.faint }}>
                <span>2</span><span>25</span><span>50</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>Categories</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Chip tone="ink" size="sm">Cars</Chip>
              <Chip tone="ink" size="sm">Maruti</Chip>
              <button style={{
                padding: '5px 10px', borderRadius: 999, background: '#fff',
                border: `1px solid ${c.line}`, fontSize: 10.5, fontWeight: 600,
                color: c.muted, letterSpacing: 0.6, textTransform: 'uppercase', cursor: 'pointer',
              }}>+ Add tag</button>
            </div>
          </div>

          {/* Validity */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: c.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Offer valid till</div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: `1px solid ${c.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon name="clock" size={18} color={c.muted} stroke={2.2} />
                <span style={{ fontSize: 13.5, fontWeight: 500, color: c.ink }}>15 Dec 2026 · 11:59 PM</span>
              </div>
              <Icon name="chevR" size={16} color={c.faint} stroke={2.4} />
            </div>
          </div>
        </div>

        {/* Estimate banner */}
        <div style={{
          background: c.savingSoft, border: `1px solid rgba(15,107,83,0.20)`,
          borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: c.saving, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="trending" size={18} color="#fff" stroke={2.4} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: c.ink }}>Est. fill time: 4–7 days</div>
            <div style={{ fontSize: 11, fontWeight: 400, color: c.muted, marginTop: 1 }}>Based on similar groups in Delhi NCR</div>
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
        <Button variant="soft" size="lg">Preview</Button>
        <Button
          variant="primary" size="lg"
          iconRight={<Icon name="bolt" size={18} color="#fff" stroke={2.4} />}
          style={{ flex: 1 }}
          onClick={() => navigate('/vendor/dashboard')}
        >
          Launch offer
        </Button>
      </div>
    </div>
  );
};

export default CreateOffer;
