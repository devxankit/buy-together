import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { c } from '../../design/tokens';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';

const Login = () => {
  const [role, setRole] = useState('user');
  const [mobile, setMobile] = useState('');
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/otp', { state: { role, mobile } });
  };

  return (
    <div style={{ minHeight: '100vh', background: c.surfaceAlt, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: 'max(44px, calc(env(safe-area-inset-top, 0px) + 20px)) 24px 32px', display: 'flex', flexDirection: 'column' }}>
        {/* Back */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/onboarding')}
            style={{
              width: 40, height: 40, borderRadius: 12, background: '#fff',
              border: `1px solid ${c.line}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="arrowL" size={18} color={c.ink} stroke={1.8} />
          </button>
          <span style={{ fontSize: 12, fontWeight: 400, color: c.muted }}>Need help?</span>
        </div>

        {/* Heading */}
        <div style={{ marginTop: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 99, background: c.primarySoft,
            border: `1px solid rgba(15,107,83,0.13)`,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.primary, display: 'inline-block' }} />
            <span style={{ fontSize: 10.5, fontWeight: 500, color: c.primaryDeep, letterSpacing: 1.4, textTransform: 'uppercase' }}>
              50,000+ buyers
            </span>
          </div>
          <div style={{ fontSize: 42, fontWeight: 400, letterSpacing: -1.4, lineHeight: 1.0, color: c.ink, marginTop: 20 }}>
            Welcome<br />
            <span style={{ color: c.primary }}>back, friend.</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 400, color: c.muted, marginTop: 12 }}>
            Sign in with your mobile number to continue saving together.
          </div>
        </div>

        {/* Role toggle */}
        <div style={{
          marginTop: 28, padding: 4, background: c.surfaceDeep,
          borderRadius: 14, display: 'flex', gap: 4,
        }}>
          {['user', 'vendor'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                flex: 1, padding: '11px 0', borderRadius: 10,
                background: role === r ? '#fff' : 'transparent',
                boxShadow: role === r ? '0 1px 2px rgba(15,15,18,0.04)' : 'none',
                fontSize: 13, fontWeight: role === r ? 500 : 400,
                color: role === r ? c.ink : c.muted, border: 'none', cursor: 'pointer',
              }}
            >
              {r === 'user' ? "I'm a buyer" : "I'm a vendor"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 500, color: c.muted, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 10 }}>
              Mobile number
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              border: `1.5px solid ${c.primary}`, borderRadius: 14,
              padding: '14px 16px', background: '#fff',
              boxShadow: `0 0 0 4px ${c.primaryGlow}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14 }}>🇮🇳</span>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: c.ink }}>+91</span>
                <Icon name="chevD" size={12} color={c.faint} stroke={2} />
              </div>
              <div style={{ height: 22, width: 1, background: c.line }} />
              <input
                type="tel"
                value={mobile}
                maxLength={10}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="98765 43210"
                style={{
                  flex: 1, fontSize: 16, fontWeight: 500, color: c.ink,
                  background: 'none', border: 'none', outline: 'none',
                  letterSpacing: 0.5, fontFamily: 'inherit',
                }}
                required
              />
              {mobile.length === 10 && <Icon name="check" size={18} color={c.primary} stroke={2.4} />}
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 6, cursor: 'pointer' }}>
            <div
              onClick={() => setAgreed(!agreed)}
              style={{
                width: 18, height: 18, borderRadius: 5,
                background: agreed ? c.primary : '#fff',
                border: `1.5px solid ${agreed ? c.primary : c.line}`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1, cursor: 'pointer',
              }}
            >
              {agreed && <Icon name="check" size={11} color="#fff" stroke={3} />}
            </div>
            <span style={{ fontSize: 12, fontWeight: 400, color: c.muted, lineHeight: 1.45 }}>
              I agree to the <span style={{ color: c.ink, fontWeight: 500 }}>Terms</span> and{' '}
              <span style={{ color: c.ink, fontWeight: 500 }}>Privacy Policy</span>. I consent to receive WhatsApp updates.
            </span>
          </label>

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
            <Button
              type="submit" variant="primary" size="lg" full
              iconRight={<Icon name="arrowR" size={16} color="#fff" stroke={2} />}
            >
              Send OTP
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: c.line }} />
              <span style={{ fontSize: 10, fontWeight: 500, color: c.muted, letterSpacing: 1.8, textTransform: 'uppercase' }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: c.line }} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" style={{
                flex: 1, height: 48, borderRadius: 12, background: '#fff',
                border: `1px solid ${c.line}`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, fontWeight: 500, fontSize: 13, color: c.ink, cursor: 'pointer',
              }}>
                Google
              </button>
              <button type="button" style={{
                flex: 1, height: 48, borderRadius: 12, background: c.ink,
                color: '#fff', border: 'none',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, fontWeight: 500, fontSize: 13, cursor: 'pointer',
              }}>
                Apple
              </button>
            </div>

            <div style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 400, color: c.muted }}>
              New here?{' '}
              <span
                onClick={() => navigate('/otp', { state: { role, mobile, flow: 'signup' } })}
                style={{ color: c.primary, fontWeight: 500, cursor: 'pointer' }}
              >
                Create an account
              </span>
            </div>

            {role === 'vendor' && (
              <div style={{ textAlign: 'center' }}>
                <Link to="/vendor/signup" style={{ fontSize: 12, color: c.muted, fontWeight: 500 }}>
                  Register as Business Partner →
                </Link>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
