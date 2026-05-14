import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from '../../hooks/useDispatch';
import { setAuth } from '../../redux/slices/authSlice';
import { c } from '../../design/tokens';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';

const N = 6;

const OTP = () => {
  const [digits, setDigits] = useState(Array(N).fill(''));
  const [focusIdx, setFocusIdx] = useState(0);
  const [timer, setTimer] = useState(29);
  const refs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { role = 'user', mobile = '', name, email } = location.state || {};

  /* countdown timer */
  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  /* focus first box on mount */
  useEffect(() => { refs.current[0]?.focus(); }, []);

  const focus = (i) => {
    const el = refs.current[i];
    if (!el) return;
    el.focus();
    /* place cursor at end so typing replaces cleanly */
    setTimeout(() => el.setSelectionRange(1, 1), 0);
  };

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;
    const d = val.slice(-1);
    const next = [...digits];
    next[i] = d;
    setDigits(next);
    if (i < N - 1) focus(i + 1);
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (digits[i]) {
        next[i] = '';
        setDigits(next);
      } else if (i > 0) {
        next[i - 1] = '';
        setDigits(next);
        focus(i - 1);
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      focus(i - 1);
    } else if (e.key === 'ArrowRight' && i < N - 1) {
      focus(i + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const raw = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, N);
    if (!raw) return;
    const next = Array(N).fill('');
    [...raw].forEach((ch, idx) => { next[idx] = ch; });
    setDigits(next);
    focus(Math.min(raw.length, N - 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (digits.join('').length < N) return;
    dispatch(setAuth({
      user: {
        name: name || (role === 'vendor' ? 'Apple India' : 'Verified User'),
        email: email || '',
        mobile,
        role,
        businessName: role === 'vendor' ? 'Apple India' : undefined,
      },
      token: 'mock-jwt-' + Date.now(),
    }));
    navigate(role === 'vendor' ? '/vendor/dashboard' : '/location');
  };

  const filled = digits.filter(Boolean).length;

  return (
    <div style={{ minHeight: '100dvh', background: c.surfaceAlt }}>
      <div style={{
        maxWidth: 430,
        margin: '0 auto',
        padding: 'calc(env(safe-area-inset-top, 0px) + 20px) 24px 48px',
      }}>

        {/* Back + step indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              width: 40, height: 40, borderRadius: 12, background: '#fff',
              border: `1px solid ${c.line}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <Icon name="arrowL" size={18} color={c.ink} stroke={1.8} />
          </button>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {[0, 1, 2].map(s => (
              <div key={s} style={{
                height: 6, borderRadius: 3,
                width: s === 1 ? 22 : 6,
                background: s <= 1 ? c.primary : c.line,
              }} />
            ))}
          </div>
        </div>

        {/* Icon */}
        <div style={{ marginTop: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 17,
            background: c.primarySoft,
            border: `1px solid rgba(15,107,83,0.18)`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="shield" size={24} color={c.primary} stroke={1.8} />
          </div>
        </div>

        {/* Heading */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 32, fontWeight: 400, letterSpacing: -1, lineHeight: 1.08, color: c.ink }}>
            One step<br />
            <span style={{ color: c.primary }}>to go.</span>
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 400, color: c.muted, marginTop: 10, lineHeight: 1.6 }}>
            Code sent to{' '}
            <span style={{ fontWeight: 500, color: c.ink }}>+91 {mobile || 'your number'}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              background: 'none', border: 'none', padding: 0, marginTop: 4,
              fontSize: 12.5, fontWeight: 500, color: c.primary, cursor: 'pointer',
            }}
          >
            Change number
          </button>
        </div>

        {/* ── OTP form ── */}
        <form onSubmit={handleSubmit} style={{ marginTop: 36 }}>

          {/* Boxes — grid so each cell is always exactly 1/6 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${N}, 1fr)`,
            gap: 8,
          }}>
            {digits.map((d, i) => {
              const isFocused = focusIdx === i;
              const isFilled  = d !== '';
              return (
                <input
                  key={i}
                  ref={el => { refs.current[i] = el; }}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={d}
                  autoComplete={i === 0 ? 'one-time-code' : 'off'}
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  onChange={e => handleChange(i, e)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onFocus={() => setFocusIdx(i)}
                  onBlur={() => setFocusIdx(-1)}
                  onPaste={handlePaste}
                  style={{
                    /* layout */
                    display: 'block',
                    width: '100%',
                    height: 56,
                    boxSizing: 'border-box',
                    padding: 0,
                    /* look */
                    borderRadius: 14,
                    border: `2px solid ${isFocused ? c.primary : isFilled ? 'rgba(15,107,83,0.55)' : c.line}`,
                    boxShadow: isFocused ? `0 0 0 3px ${c.primaryGlow}` : 'none',
                    background: isFilled ? c.primarySoft : '#fff',
                    /* text — no color transition to avoid dark-on-dark flash */
                    textAlign: 'center',
                    fontSize: 22,
                    fontWeight: 600,
                    color: c.ink,
                    fontFamily: 'inherit',
                    /* remove default input chrome */
                    outline: 'none',
                    caretColor: 'transparent',
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield',
                    /* only transition border + shadow, NOT background or color */
                    transition: 'border-color 0.14s ease, box-shadow 0.14s ease',
                  }}
                />
              );
            })}
          </div>

          {/* Progress bar */}
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {digits.map((d, i) => (
              <div key={i} style={{
                flex: 1, height: 2.5, borderRadius: 2,
                background: d ? c.primary : c.line,
                transition: 'background 0.12s',
              }} />
            ))}
          </div>

          {/* Resend */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 16,
          }}>
            <span style={{ fontSize: 13, fontWeight: 400, color: c.muted }}>
              {timer > 0
                ? <>Resend in{' '}<span style={{ fontWeight: 500, color: c.ink }}>0:{String(timer).padStart(2, '0')}</span></>
                : "Didn't receive it?"
              }
            </span>
            <button
              type="button"
              disabled={timer > 0}
              onClick={() => {
                setTimer(29);
                setDigits(Array(N).fill(''));
                focus(0);
              }}
              style={{
                background: 'none', border: 'none', padding: 0,
                fontSize: 13, fontWeight: 500,
                color: timer > 0 ? c.faint : c.primary,
                cursor: timer > 0 ? 'default' : 'pointer',
                transition: 'color 0.15s',
              }}
            >
              Resend OTP
            </button>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 32 }}>
            <Button
              type="submit"
              variant="primary" size="lg" full
              iconRight={<Icon name="arrowR" size={16} color="#fff" stroke={2} />}
              style={{ opacity: filled === N ? 1 : 0.45, transition: 'opacity 0.18s' }}
            >
              Verify &amp; continue
            </Button>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, marginTop: 14,
              fontSize: 11.5, fontWeight: 400, color: c.muted,
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
