import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/otp', { state: { email } });
  };

  return (
    <div className="min-h-screen w-full max-w-[430px] mx-auto flex flex-col bg-[#EAF6F6] font-sans overflow-hidden">

      {/* === TOP HERO SECTION === */}
      <div className="flex-shrink-0 bg-gradient-to-br from-[#E0F5F3] to-[#C8EDE9] overflow-hidden px-6 pt-6 pb-6 relative shadow-sm">
        {/* Decorative circles */}
        <div className="absolute top-4 right-12 w-20 h-20 rounded-full bg-[#B2E3DE]/40 pointer-events-none" />
        <div className="absolute top-10 right-0 w-12 h-12 rounded-full bg-[#B2E3DE]/30 pointer-events-none" />

        <div className="flex flex-col items-center text-center gap-2 relative z-10 mt-2">
          {/* Icon */}
          <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-[25px] font-black text-ink leading-tight">Welcome Back!</h1>
          <p className="text-[11.5px] text-muted font-medium max-w-[280px] leading-tight">Join group pools to buy together & save big!</p>
        </div>
      </div>

      {/* === FORM CARD === */}
      <div className="flex-1 bg-surface px-5 pt-6 pb-6 flex flex-col justify-start gap-0 overflow-y-auto rounded-t-[32px] -mt-4 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">

        <h2 className="text-[17.5px] font-black text-ink text-center mt-2">Login to your account</h2>
        <p className="text-[11.5px] text-muted font-semibold mt-0.5 mb-4 text-center">Enter your details to continue</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

          {/* Email Field */}
          <div className="flex items-center gap-3 bg-surface-alt border border-line rounded-2xl px-4 h-[50px] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
            <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or Phone Number"
              className="flex-1 bg-transparent text-[13px] font-medium text-ink placeholder:text-muted/60 outline-none border-none"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full h-[52px] bg-primary rounded-2xl text-white text-[15px] font-black flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-95 transition-all mt-1"
          >
            Send OTP
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          {/* Sign Up Banner */}
          <div className="flex items-center justify-between bg-primary-soft border border-primary/10 rounded-2xl px-4 py-3 mt-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <p className="text-[12px] font-bold text-ink leading-tight">New here?</p>
                <p className="text-[10px] text-muted leading-tight mt-0.5">Create an account and start saving!</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="flex items-center gap-1 text-[12px] font-black text-primary whitespace-nowrap active:opacity-70 transition-all cursor-pointer"
            >
              Sign Up
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="flex flex-col items-center gap-2.5 mt-5">
          <div className="flex items-center gap-1.5 text-[11px] text-muted">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Need help?</span>
            <span className="text-primary font-bold">Contact Support</span>
          </div>
          <p className="text-[9.5px] text-muted text-center leading-snug">
            By continuing, you agree to our{' '}
            <span className="text-primary font-semibold">Terms & Conditions</span>
            {' '}and{' '}
            <span className="text-primary font-semibold">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
