import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from '../../hooks/useDispatch';
import { setAuth } from '../../redux/slices/authSlice';

const N = 6;

const OTP = () => {
  const [digits, setDigits] = useState(Array(N).fill(''));
  const [focusIdx, setFocusIdx] = useState(0);
  const [timer, setTimer] = useState(29);
  const refs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { role = 'user', mobile = '', name, email, flow } = location.state || {};

  const contactDisplay = email || (mobile ? `+91 ${mobile}` : 'your email/phone');

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
        name: name || 'Verified User',
        email: email || '',
        mobile,
        role,
        businessName: role === 'vendor' ? 'Apple India' : undefined,
      },
      token: 'mock-jwt-' + Date.now(),
    }));
    navigate(role === 'vendor' ? '/vendor/dashboard' : '/');
  };

  const filled = digits.filter(Boolean).length;
  const progress = (filled / N) * 100;

  return (
    <div className="min-h-screen w-full max-w-[430px] mx-auto flex flex-col bg-[#EAF6F6] font-sans">

      {/* === TOP SECTION === */}
      <div className="flex-shrink-0 bg-gradient-to-br from-[#E0F5F3] to-[#C8EDE9] px-6 pt-8 pb-10 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-2 right-10 w-24 h-24 rounded-full bg-[#B2E3DE]/40 pointer-events-none" />
        <div className="absolute -bottom-4 right-0 w-16 h-16 rounded-full bg-[#B2E3DE]/30 pointer-events-none" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-surface/70 backdrop-blur-sm rounded-xl flex items-center justify-center border border-surface/60 shadow-sm active:scale-90 transition-all mb-6"
        >
          <svg className="w-4 h-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Shield icon */}
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h1 className="text-[26px] font-black text-ink leading-tight">Verify OTP</h1>
        <p className="text-[12.5px] text-[#475569] mt-1.5 leading-snug">
          We've sent a 6-digit code to<br />
          <span className="font-bold text-primary">{contactDisplay}</span>
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-[11px] font-bold text-primary mt-1.5 active:opacity-70 transition-all"
        >
          Change →
        </button>
      </div>

      {/* === FORM CARD === */}
      <div className="flex-1 bg-surface rounded-t-[28px] -mt-5 px-5 pt-7 pb-8 shadow-[0_-4px_30px_rgba(0,0,0,0.06)]">

        <h2 className="text-[16px] font-black text-ink mb-1">Enter verification code</h2>
        <p className="text-[11.5px] text-muted font-medium mb-6">Type the 6-digit OTP sent to you</p>

        <form onSubmit={handleSubmit}>

          {/* OTP Boxes */}
          <div className="grid grid-cols-6 gap-2.5 mb-3">
            {digits.map((d, i) => {
              const isFocused = focusIdx === i;
              const isFilled = d !== '';
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
                  className="block w-full text-center text-[22px] font-black outline-none transition-all duration-150 rounded-2xl"
                  style={{
                    height: 54,
                    border: `2px solid ${isFocused ? 'var(--primary)' : isFilled ? 'var(--primary-soft)' : 'var(--line)'}`,
                    boxShadow: isFocused ? '0 0 0 3px rgba(13,148,136,0.15)' : 'none',
                    background: isFilled ? '#F0FDF9' : '#F8FAFC',
                    color: '#0F172A',
                    caretColor: 'transparent',
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield',
                  }}
                />
              );
            })}
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5 mb-5">
            {digits.map((d, i) => (
              <div
                key={i}
                className="flex-1 h-[3px] rounded-full transition-all duration-200"
                style={{ background: d ? 'var(--primary)' : 'var(--line)' }}
              />
            ))}
          </div>

          {/* Resend row */}
          <div className="flex items-center justify-between mb-6 bg-surface-alt rounded-2xl px-4 py-3 border border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              {timer > 0 ? (
                <>
                  <div className="w-7 h-7 rounded-full bg-primary-soft flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-[12px] text-[#64748B] font-medium">
                    Resend in <span className="font-black text-ink">0:{String(timer).padStart(2, '0')}</span>
                  </span>
                </>
              ) : (
                <span className="text-[12px] text-[#64748B] font-medium">Didn't receive the code?</span>
              )}
            </div>
            <button
              type="button"
              disabled={timer > 0}
              onClick={() => { setTimer(29); setDigits(Array(N).fill('')); focus(0); }}
              className={`text-[12px] font-black transition-all active:scale-95 ${timer > 0 ? 'text-faint cursor-default' : 'text-primary'}`}
            >
              Resend OTP
            </button>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={filled < N}
            className="w-full h-[52px] bg-primary rounded-2xl text-white text-[15px] font-black flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
          >
            <svg className="w-4.5 h-4.5 w-[18px] h-[18px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Verify & Continue
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-muted">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure · End-to-end encrypted · Never share your OTP
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTP;
