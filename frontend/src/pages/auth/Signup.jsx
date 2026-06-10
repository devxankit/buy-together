import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/asyncActions/authActions';

const Signup = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed || phone.length !== 10) return;
    try {
      const res = await dispatch(register({ name, phone })).unwrap();
      navigate('/otp', { state: { flow: 'signup', phone, name, devOtp: res.devOtp } });
    } catch {
      // error is surfaced via redux state below
    }
  };

  return (
    <div className="min-h-screen w-full max-w-[430px] mx-auto flex flex-col bg-[#EAF6F6] font-sans overflow-hidden">

      {/* === TOP HERO SECTION === */}
      <div className="flex-shrink-0 bg-gradient-to-br from-[#E0F5F3] to-[#C8EDE9] overflow-hidden px-6 pt-6 pb-2">
        {/* Decorative circles */}
        <div className="absolute top-4 right-12 w-20 h-20 rounded-full bg-[#B2E3DE]/40 pointer-events-none" />
        <div className="absolute top-10 right-0 w-12 h-12 rounded-full bg-[#B2E3DE]/30 pointer-events-none" />

        <div className="flex items-center justify-between gap-3">
          {/* Left: Icon + Text */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-[26px] font-black text-ink leading-tight">Join Us!</h1>
          </div>

          {/* Right: Phone + Shopping Illustration */}
          <div className="flex-shrink-0 w-[145px] h-[170px] flex items-start justify-center relative -mt-2">
            <div className="relative">
              <div className="w-[78px] h-[140px] bg-[#1E293B] rounded-[16px] shadow-xl flex flex-col overflow-hidden border-[3px] border-[#334155]">
                <div className="w-7 h-1 bg-[#334155] rounded-full mx-auto mt-1.5" />
                <div className="flex-1 bg-gradient-to-b from-[#E0F5F3] to-[#C8EDE9] flex flex-col items-center justify-center gap-1 p-1.5">
                  <div className="w-7 h-7 bg-primary rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-[8px] font-black text-ink">Group Deals</span>
                </div>
              </div>
              {/* Shopping bag */}
              <div className="absolute -left-8 bottom-3 w-9 h-11 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              {/* Star/Gift */}
              <div className="absolute -left-4 bottom-14 w-7 h-7 bg-surface rounded-lg flex items-center justify-center shadow-md border border-line">
                <span className="text-base">⭐</span>
              </div>
              {/* % */}
              <div className="absolute -right-4 bottom-6 w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg rotate-12">
                <span className="text-white text-[12px] font-black">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === FORM CARD === */}
      <div className="flex-1 bg-surface rounded-t-[28px] -mt-3 px-5 pt-5 pb-6 shadow-[0_-4px_30px_rgba(0,0,0,0.06)] flex flex-col overflow-y-auto">

        <h2 className="text-[17px] font-black text-ink">Create your account</h2>
        <p className="text-[12px] text-muted font-medium mt-0.5 mb-4">Fill in your details to get started</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">

          {/* Full Name */}
          <div className="flex items-center gap-3 bg-surface-alt border border-line rounded-2xl px-4 h-[50px] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
            <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="flex-1 bg-transparent text-[13px] font-medium text-ink placeholder:text-[#CBD5E1] outline-none"
              required
            />
          </div>


          {/* Phone */}
          <div className="flex items-center gap-3 bg-surface-alt border border-line rounded-2xl px-4 h-[50px] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all">
            <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Phone Number"
              className="flex-1 bg-transparent text-[13px] font-medium text-ink placeholder:text-[#CBD5E1] outline-none"
              required
            />
          </div>



          {/* Terms checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer mt-0.5" onClick={() => setAgreed(!agreed)}>
            <div className={`w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${agreed ? 'bg-primary border-primary' : 'bg-surface border-line'}`}>
              {agreed && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-[11.5px] text-[#475569] leading-relaxed">
              I agree to the{' '}
              <span className="text-primary font-bold">Terms & Conditions</span>
              {' '}and{' '}
              <span className="text-primary font-bold">Privacy Policy</span>
            </span>
          </label>

          {/* Error */}
          {error && (
            <p className="text-[11.5px] font-semibold text-red-500 px-1">{error}</p>
          )}

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={!agreed || loading || phone.length !== 10}
            className="w-full h-[52px] bg-primary rounded-2xl text-white text-[15px] font-black flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-95 transition-all mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending OTP…' : 'Create Account'}
            {!loading && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            )}
          </button>

          {/* Already have account */}
          <div className="flex items-center justify-between bg-primary-soft border border-[#CCFBF1] rounded-2xl px-4 py-3 mt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#CCFBF1] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-bold text-ink">Already have an account?</p>
                <p className="text-[10px] text-[#64748B]">Login and start saving today!</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex items-center gap-1 text-[12px] font-black text-primary whitespace-nowrap active:opacity-70 transition-all"
            >
              Login
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="flex flex-col items-center gap-1.5 mt-4">
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
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

export default Signup;
