import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Hexagon, Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { setAuth } from '../../../redux/slices/authSlice';
import { T, radius } from '../theme/adminTheme';
import '../admin.css';

/**
 * Admin sign-in — a desktop console gateway, separate from the mobile OTP flow
 * (which only ever issues role:'user'). Authenticates an admin session and lands
 * on /admin. Uses position:fixed/inset:0 to escape the app's 430px shell.
 */
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signIn = (e) => {
    e?.preventDefault();
    setLoading(true);
    // Mock auth — wire to a real admin endpoint later. Issues an admin session.
    setTimeout(() => {
      dispatch(setAuth({
        user: {
          name: (email.split('@')[0] || 'Admin').replace(/^\w/, c => c.toUpperCase()),
          email: email || 'admin@buytogether.in',
          role: 'admin',
        },
        token: 'mock-admin-jwt-' + Date.now(),
      }));
      navigate('/admin');
    }, 450);
  };

  return (
    <div className="admin-root" style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', background: T.bg }}>
      {/* Left brand panel */}
      <div
        data-hide-sm="true"
        style={{
          flex: 1, position: 'relative', overflow: 'hidden',
          background: `linear-gradient(150deg, ${T.ink} 0%, #14141A 55%, ${T.primaryDark} 140%)`,
          padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff',
        }}
      >
        <div style={{ position: 'absolute', top: -80, right: -60, width: 320, height: 320, borderRadius: 999, background: `radial-gradient(circle, ${T.primary}44, transparent 70%)` }} />
        <div style={{ position: 'absolute', bottom: -100, left: -40, width: 280, height: 280, borderRadius: 999, background: `radial-gradient(circle, ${T.violet}33, transparent 70%)` }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDeep})`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.shadowGlow }}>
            <Hexagon size={22} color="#fff" strokeWidth={2.4} fill="rgba(255,255,255,0.18)" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>Buy Together</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Console</div>
          </div>
        </div>

        <div style={{ position: 'relative', maxWidth: 440 }}>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
            The control room for your demand engine.
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.62)', marginTop: 18, lineHeight: 1.6 }}>
            Monitor groups, approve vendors, track deals and revenue, and act on fraud signals — all in real time.
          </p>
          <div style={{ display: 'flex', gap: 26, marginTop: 36 }}>
            {[['48K+', 'Users'], ['3.1K', 'Groups'], ['₹1.07Cr', 'Revenue']].map(([v, l]) => (
              <div key={l}>
                <div className="font-mono-num" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>{v}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
          <ShieldCheck size={15} color={T.primary} />
          Secured access · 2FA enforced · Activity audited
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ width: 'min(100%, 480px)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: T.surface, borderLeft: `1px solid ${T.line}` }}>
        <div className="admin-fade-up" style={{ width: '100%', maxWidth: 360 }}>
          <div data-mobile-only="true" style={{ marginBottom: 24, alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg, ${T.primary}, ${T.primaryDeep})`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hexagon size={20} color="#fff" strokeWidth={2.4} fill="rgba(255,255,255,0.18)" />
            </div>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 800, color: T.ink, letterSpacing: '-0.03em', margin: 0 }}>Sign in to console</h2>
          <p style={{ fontSize: 13.5, color: T.muted, marginTop: 6, fontWeight: 500 }}>Enter your admin credentials to continue.</p>

          <form onSubmit={signIn} style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ display: 'block' }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: T.inkSoft, display: 'block', marginBottom: 7 }}>Email</span>
              <div className="admin-focusable" style={{ display: 'flex', alignItems: 'center', gap: 10, height: 46, padding: '0 14px', background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg }}>
                <Mail size={17} color={T.faint} strokeWidth={2.1} />
                <input className="admin-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@buytogether.in" autoComplete="username" style={{ flex: 1, fontSize: 14, color: T.ink, fontWeight: 500 }} />
              </div>
            </label>

            <label style={{ display: 'block' }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: T.inkSoft, display: 'block', marginBottom: 7 }}>Password</span>
              <div className="admin-focusable" style={{ display: 'flex', alignItems: 'center', gap: 10, height: 46, padding: '0 14px', background: T.surfaceAlt, border: `1px solid ${T.line}`, borderRadius: radius.lg }}>
                <Lock size={17} color={T.faint} strokeWidth={2.1} />
                <input className="admin-input" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" style={{ flex: 1, fontSize: 14, color: T.ink, fontWeight: 500 }} />
                <button type="button" onClick={() => setShowPw(s => !s)} className="admin-icon-btn" style={{ border: 'none', background: 'transparent', color: T.faint, cursor: 'pointer', display: 'inline-flex', padding: 4, borderRadius: 6 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: T.muted, fontWeight: 500, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: T.primary, width: 15, height: 15 }} />
                Keep me signed in
              </label>
              <span style={{ fontSize: 12.5, color: T.primary, fontWeight: 600, cursor: 'pointer' }}>Forgot password?</span>
            </div>

            <button
              type="submit" disabled={loading}
              className="admin-btn"
              style={{ height: 46, marginTop: 4, borderRadius: radius.lg, border: 'none', cursor: 'pointer', background: T.ink, color: '#fff', fontSize: 14.5, fontWeight: 700, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: T.shadowSm, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? <span className="admin-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: 999 }} /> : <>Enter Console <ArrowRight size={17} strokeWidth={2.4} /></>}
            </button>
          </form>

          <div style={{ marginTop: 18, padding: '11px 14px', background: T.primaryTint, border: `1px solid ${T.primary}22`, borderRadius: radius.lg, fontSize: 12, color: T.primaryDeep, lineHeight: 1.5 }}>
            <strong style={{ fontWeight: 700 }}>Demo:</strong> any email/password signs you in as admin (mock auth — wire to a real endpoint later).
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
