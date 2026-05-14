import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { c } from '../../design/tokens';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';

const STEPS = ['Identity', 'Business', 'Location', 'Verify'];

const CATEGORIES = ['Electronics', 'Cars', 'Appliances', 'Fashion', 'Home Decor', 'Bikes', 'Furniture'];

const VendorSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '',
    businessName: '', businessType: 'Individual', category: 'Electronics',
    gstNumber: '', whatToSell: '',
    city: '', address: '', pincode: '',
    accountNumber: '', ifscCode: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const next = () => setStep(s => Math.min(s + 1, 4));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div style={{
      minHeight: '100vh', background: c.surfaceAlt,
      padding: 'max(44px, calc(env(safe-area-inset-top, 0px) + 20px)) 20px 40px',
      maxWidth: 430, margin: '0 auto',
    }}>
      {/* Back link */}
      <Link to="/login" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 12, fontWeight: 500, color: c.muted,
        textDecoration: 'none', marginBottom: 24,
      }}>
        <Icon name="arrowL" size={14} color={c.muted} stroke={2} />
        Back to login
      </Link>

      {/* Stepper */}
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <div style={{
          position: 'absolute', top: 14, left: 14, right: 14, height: 2,
          background: c.line, borderRadius: 1, zIndex: 0,
        }}>
          <div style={{ width: `${progress}%`, height: '100%', background: c.primary, borderRadius: 1, transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          {STEPS.map((s, i) => {
            const done = step > i + 1;
            const active = step === i + 1;
            return (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: done || active ? c.primary : '#fff',
                  border: `2px solid ${done || active ? c.primary : c.line}`,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: active ? `0 0 0 4px ${c.primaryGlow}` : 'none',
                  transition: 'all 0.2s',
                }}>
                  {done
                    ? <Icon name="check" size={12} color="#fff" stroke={2.8} />
                    : <span style={{ fontSize: 10, fontWeight: 600, color: active ? '#fff' : c.faint }}>{i + 1}</span>
                  }
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: 0.6,
                  textTransform: 'uppercase',
                  color: active ? c.primary : done ? c.ink : c.faint,
                }}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form card */}
      <div style={{
        background: '#fff', borderRadius: 24, padding: 22,
        border: `1px solid ${c.line}`,
      }}>
        {step === 1 && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 500, color: c.ink, letterSpacing: -0.4, marginBottom: 4 }}>Let's start with you</div>
            <div style={{ fontSize: 12, fontWeight: 400, color: c.muted, marginBottom: 22 }}>Personal details for account ownership</div>

            <Field label="Full name">
              <input
                value={form.fullName} onChange={e => set('fullName', e.target.value)}
                placeholder="Enter your legal name"
                style={inputStyle}
              />
            </Field>

            <Field label="Mobile number">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0 12px', height: 46, borderRadius: 12, background: c.surfaceAlt,
                  border: `1px solid ${c.line}`, flexShrink: 0, fontSize: 13, fontWeight: 500, color: c.ink,
                }}>
                  🇮🇳 +91
                </div>
                <input
                  type="tel" value={form.mobile} onChange={e => set('mobile', e.target.value)}
                  placeholder="98765 43210"
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
            </Field>

            <Field label="Email (optional)">
              <input
                type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="name@business.com"
                style={inputStyle}
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 500, color: c.ink, letterSpacing: -0.4, marginBottom: 4 }}>Business identity</div>
            <div style={{ fontSize: 12, fontWeight: 400, color: c.muted, marginBottom: 22 }}>Tell us about your brand and products</div>

            <Field label="Business name">
              <input
                value={form.businessName} onChange={e => set('businessName', e.target.value)}
                placeholder="e.g. Acme Tech Solutions"
                style={inputStyle}
              />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <Field label="Business type">
                <select
                  value={form.businessType} onChange={e => set('businessType', e.target.value)}
                  style={{ ...inputStyle, appearance: 'none' }}
                >
                  {['Individual', 'Shop', 'Company'].map(o => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Category">
                <select
                  value={form.category} onChange={e => set('category', e.target.value)}
                  style={{ ...inputStyle, appearance: 'none' }}
                >
                  {CATEGORIES.map(o => <option key={o}>{o}</option>)}
                </select>
              </Field>
            </div>

            <Field label="GST number (optional)">
              <input
                value={form.gstNumber} onChange={e => set('gstNumber', e.target.value)}
                placeholder="22AAAAA0000A1Z5"
                style={inputStyle}
              />
            </Field>

            <Field label="What do you want to sell?">
              <textarea
                value={form.whatToSell} onChange={e => set('whatToSell', e.target.value)}
                placeholder="Briefly describe your products..."
                style={{ ...inputStyle, height: 80, resize: 'none' }}
              />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 500, color: c.ink, letterSpacing: -0.4, marginBottom: 4 }}>Store location</div>
            <div style={{ fontSize: 12, fontWeight: 400, color: c.muted, marginBottom: 22 }}>Where can users find you or where do you ship from?</div>

            <Field label="City">
              <input
                value={form.city} onChange={e => set('city', e.target.value)}
                placeholder="e.g. Mumbai"
                style={inputStyle}
              />
            </Field>

            <Field label="Area / full address">
              <input
                value={form.address} onChange={e => set('address', e.target.value)}
                placeholder="Building, Street, Landmark"
                style={inputStyle}
              />
            </Field>

            <Field label="Pincode">
              <input
                type="number" value={form.pincode} onChange={e => set('pincode', e.target.value)}
                placeholder="400001"
                style={inputStyle}
              />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 500, color: c.ink, letterSpacing: -0.4, marginBottom: 4 }}>Final verification</div>
            <div style={{ fontSize: 12, fontWeight: 400, color: c.muted, marginBottom: 22 }}>Secure your payouts and verify your business</div>

            {/* Upload zones */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
              <UploadZone label="ID Proof (Aadhar/PAN)" />
              <UploadZone label="Business License / GST" />
            </div>

            {/* Banking */}
            <div style={{ paddingTop: 18, borderTop: `1px solid ${c.line}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Icon name="shield" size={16} color={c.primary} stroke={2} />
                <span style={{ fontSize: 13, fontWeight: 500, color: c.ink }}>Banking details</span>
              </div>
              <Field label="Account number">
                <input
                  type="password" value={form.accountNumber} onChange={e => set('accountNumber', e.target.value)}
                  placeholder="0000 1111 2222 3333"
                  style={inputStyle}
                />
              </Field>
              <Field label="IFSC code">
                <input
                  value={form.ifscCode} onChange={e => set('ifscCode', e.target.value)}
                  placeholder="SBIN0001234"
                  style={inputStyle}
                />
              </Field>
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {step > 1 && (
            <button
              onClick={prev}
              style={{
                flex: 1, height: 50, borderRadius: 14,
                background: c.surfaceAlt, border: `1px solid ${c.line}`,
                fontSize: 13, fontWeight: 500, color: c.ink,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: 'pointer',
              }}
            >
              <Icon name="arrowL" size={16} color={c.ink} stroke={2} />
              Back
            </button>
          )}
          <button
            onClick={step === 4 ? () => navigate('/vendor/dashboard') : next}
            style={{
              flex: 2, height: 50, borderRadius: 14,
              background: step === 4 ? c.saving : c.ink,
              border: 'none',
              fontSize: 13, fontWeight: 500, color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'pointer',
              boxShadow: step === 4 ? `0 8px 24px -8px ${c.saving}` : `0 8px 24px -8px rgba(15,15,18,0.3)`,
            }}
          >
            {step === 4 ? 'Complete registration' : 'Continue'}
            <Icon name="arrowR" size={16} color="#fff" stroke={2} />
          </button>
        </div>
      </div>

      {/* Login link */}
      <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: c.muted }}>
        Already a vendor?{' '}
        <Link to="/login" style={{ color: c.primary, fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 10, fontWeight: 600, color: c.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
    {children}
  </div>
);

const inputStyle = {
  width: '100%', height: 46, padding: '0 14px',
  background: c.surfaceAlt, border: `1px solid ${c.line}`,
  borderRadius: 12, outline: 'none',
  fontSize: 13.5, fontWeight: 500, color: c.ink,
  fontFamily: 'inherit', boxSizing: 'border-box',
};

const UploadZone = ({ label }) => (
  <div style={{
    border: `1.5px dashed ${c.line}`, borderRadius: 16,
    padding: '20px 12px', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
    background: c.surfaceAlt,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 11, background: '#fff',
      border: `1px solid ${c.line}`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name="image" size={16} color={c.muted} stroke={1.8} />
    </div>
    <span style={{ fontSize: 10, fontWeight: 500, color: c.muted, textAlign: 'center', letterSpacing: 0.2 }}>{label}</span>
    <span style={{ fontSize: 9, fontWeight: 400, color: c.faint }}>Tap to upload</span>
  </div>
);

export default VendorSignup;
