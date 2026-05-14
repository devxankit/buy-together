import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from '../../hooks/useDispatch';
import { setAuth } from '../../redux/slices/authSlice';
import { c } from '../../design/tokens';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';

const OTP = () => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { role = 'user', mobile = '', name, email, flow = 'login' } = location.state || {};

  const handleChange = (i, val) => {
    if (isNaN(val)) return;
    const next = [...digits];
    next[i] = val.slice(-1);
    setDigits(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (digits.join('').length === 6) {
      dispatch(setAuth({
        user: {
          name: name || (role === 'vendor' ? 'Premium Vendor' : 'Verified User'),
          email: email || '',
          mobile,
          role,
        },
        token: 'mock-jwt-' + Date.now(),
      }));
      navigate(role === 'vendor' ? '/vendor/dashboard' : '/location');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: c.surfaceAlt, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: 'max(44px, calc(env(safe-area-inset-top, 0px) + 20px)) 24px 32px', display: 'flex', flexDirection: 'column' }}>
        {/* Back + progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 40, height: 40, borderRadius: 12, background: '#fff',
              border: `1px solid ${c.line}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="arrowL" size={18} color={c.ink} stroke={1.8} />
          </button>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1,2,3].map(s => (
              <div key={s} style={{ width: 22, height: 3, background: s <= 2 ? c.primary : c.line, borderRadius: 2 }} />
            ))}
          </div>
        </div>

        {/* Icon + heading */}
        <div style={{ marginTop: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: c.primarySoft, border: `1px solid rgba(15,107,83,0.20)`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="shield" size={24} color={c.primary} stroke={1.8} />
          </div>
          <div style={{ fontSize: 36, fontWeight: 400, letterSpacing: -1.2, lineHeight: 1.05, marginTop: 20, color: c.ink }}>
            Verify it's<br />
            <span style={{ color: c.primary }}>really you.</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 400, color: c.muted, marginTop: 12, lineHeight: 1.5 }}>
            We've sent a 6-digit code to{' '}
            <span style={{ color: c.ink, fontWeight: 500 }}>+91 {mobile}</span>.{' '}
            <span onClick={() => navigate(-1)} style={{ color: c.primary, fontWeight: 500, cursor: 'pointer' }}>Change number</span>
          </div>
        </div>

        {/* OTP inputs */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 8, marginTop: 32 }}>
            {digits.map((d, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={d}
                autoFocus={i === 0}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  flex: 1, height: 64, borderRadius: 14,
                  background: d ? '#fff' : '#fff',
                  border: `1.5px solid ${i === digits.findIndex(x => x === '') && d === '' ? c.primary : (d ? c.line : 'transparent')}`,
                  boxShadow: i === digits.findIndex(x => x === '') && d === '' ? `0 0 0 4px ${c.primaryGlow}` : 'none',
                  textAlign: 'center', fontSize: 26, fontWeight: 500, color: c.ink,
                  outline: 'none', fontFamily: 'inherit',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = c.primary;
                  e.target.style.boxShadow = `0 0 0 4px ${c.primaryGlow}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = d ? c.line : 'transparent';
                  e.target.style.boxShadow = 'none';
                }}
              />
            ))}
          </div>

          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12.5, fontWeight: 400, color: c.muted }}>Didn't get it?</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="clock" size={13} color={c.faint} stroke={1.8} />
              <span style={{ fontSize: 12.5, fontWeight: 500, color: c.muted }}>Resend in 0:24</span>
            </div>
          </div>

          {/* Auto-detect indicator */}
          <div style={{
            marginTop: 22, padding: 14, borderRadius: 14,
            background: c.primarySoft, border: `1px solid rgba(15,107,83,0.13)`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11,
              background: c.primary,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="check" size={17} color="#fff" stroke={2.6} />
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: c.ink }}>SMS detected · auto-filling</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: c.muted, marginTop: 2 }}>From DM-BUYTGR · 2 sec ago</div>
            </div>
          </div>

          <div style={{ flex: 1, marginTop: 'auto', paddingTop: 32 }}>
            <Button
              type="submit" variant="primary" size="lg" full
              iconRight={<Icon name="arrowR" size={16} color="#fff" stroke={2} />}
            >
              Verify & continue
            </Button>
            <div style={{
              textAlign: 'center', marginTop: 14, fontSize: 11.5, fontWeight: 400,
              color: c.muted, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
            }}>
              <Icon name="lock" size={11} color={c.muted} stroke={1.8} />
              Secure · end-to-end encrypted
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTP;
