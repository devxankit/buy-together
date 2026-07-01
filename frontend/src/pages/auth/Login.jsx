import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp } from '../../redux/asyncActions/authActions';
import Icon from '../../components/ui/Icon';

const Login = () => {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) return;
    try {
      const res = await dispatch(sendOtp({ phone })).unwrap();
      navigate('/otp', { state: { phone, isNewUser: res.isNewUser, devOtp: res.devOtp } });
    } catch {
      // error is surfaced via redux state below
    }
  };

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto flex flex-col justify-between bg-[#F3F8F8] font-sans overflow-hidden pb-4 relative">
      {/* === TOP HERO SECTION === */}
      <div className="flex-shrink-0 bg-gradient-to-b from-[#004D4E] to-[#007071] px-5 pt-5 pb-10 relative overflow-hidden">
        {/* Background Waves */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 430 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-20 50 C 120 20, 280 120, 480 70" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M-40 90 C 100 60, 240 160, 460 100" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Header Elements */}
        <div className="flex justify-between items-start relative z-10">
          <div className="flex flex-col gap-2.5">
            {/* Logo */}
            <div className="flex items-center gap-1.5 select-none">
              <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="9" r="3.5" stroke="#00F5D4" strokeWidth="2" />
                <circle cx="21" cy="9" r="3.5" stroke="#00F5D4" strokeWidth="2" />
                <path d="M16 28C16 28 7 21 7 15.5C7 12.5 9 10.5 11.5 10.5C13.5 10.5 15 12 16 13C17 12 18.5 10.5 20.5 10.5C23 10.5 25 12.5 25 15.5C25 21 16 28 16 28Z" stroke="#00F5D4" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <span className="text-[20px] font-extrabold text-white tracking-tight leading-none">
                Buy<span className="text-[#00F5D4]">Together</span>
              </span>
            </div>
            {/* Tagline */}
            <p className="text-[10px] text-white/90 font-medium leading-none">
              Shop more, Save more,{' '}
              <span className="text-[#00F5D4] font-semibold relative inline-block">
                Together!
                <svg className="absolute left-0 -bottom-[2px] w-full h-[2px]" viewBox="0 0 54 2" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path d="M1 1C18 0.5 36 0.5 53 1" stroke="#00F5D4" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </span>
            </p>

            {/* Welcome Headings */}
            <div className="mt-3">
              <h1 className="text-[19px] font-extrabold text-white leading-tight flex items-center gap-1">
                Welcome back! <span className="text-sm">👋</span>
              </h1>
              <p className="text-[10.5px] text-white/80 font-medium leading-none mt-0.5">
                Login to continue your shopping journey 🛍️
              </p>
            </div>
          </div>

          {/* Right Column: 3D Podium & Shopping Bag / Rajwada Outline */}
          <div className="relative w-[155px] h-[155px] flex items-center justify-center transform scale-125 translate-x-3 translate-y-1">
            {/* Heritage / Rajwada Outline in Background */}
            <div className="absolute -top-4 -right-3 opacity-25 text-white pointer-events-none">
              <svg viewBox="0 0 120 160" className="w-[110px] h-[145px]" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                <line x1="5" y1="150" x2="115" y2="150" strokeWidth="1" />
                <path d="M40 150 V80 H80 V150" strokeWidth="0.8" />
                <path d="M48 150 V130 A12 12 0 0 1 72 130 V150" strokeWidth="0.8" />
                <path d="M15 150 V95 H40" strokeWidth="0.6" />
                <path d="M80 95 H105 V150" strokeWidth="0.6" />
                <line x1="15" y1="135" x2="105" y2="135" strokeWidth="0.6" />
                <line x1="15" y1="120" x2="105" y2="120" strokeWidth="0.6" />
                <line x1="15" y1="108" x2="105" y2="108" strokeWidth="0.6" />
                <rect x="42" y="65" width="36" height="15" strokeWidth="0.6" />
                <rect x="44" y="50" width="32" height="15" strokeWidth="0.6" />
                <rect x="46" y="38" width="28" height="12" strokeWidth="0.6" />
                <rect x="48" y="28" width="24" height="10" strokeWidth="0.6" />
                <path d="M52 28 C52 20 68 20 68 28 Z" strokeWidth="1" />
                <path d="M18 95 C18 90 26 90 26 95 Z" strokeWidth="0.6" />
                <path d="M94 95 C94 90 102 90 102 95 Z" strokeWidth="0.6" />
              </svg>
            </div>

            {/* Green Location Pin in Hero Background */}
            <div className="absolute top-1 right-2 text-[#00F5D4] opacity-80 z-10">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>

            {/* Shopping Bag and Podium Container */}
            <div className="relative z-10">
              <svg viewBox="0 0 200 200" className="w-[150px] h-[150px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Cylinder Podium */}
                <ellipse cx="100" cy="148" rx="64" ry="22" fill="#003D3E" opacity="0.4" />
                <path d="M36 135 V146 C36 168 164 168 164 146 V135 Z" fill="url(#podiumGradientSide)" />
                <ellipse cx="100" cy="135" rx="64" ry="20" fill="#B9E8E5" stroke="#9AD3CF" strokeWidth="1" />
                <ellipse cx="100" cy="131" rx="59" ry="17" fill="#FFFFFF" />

                {/* The Shopping Bag */}
                <path d="M82 82 C82 62 118 62 118 82" stroke="#75B6B3" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M77 82 C77 57 123 57 123 82" stroke="#9AD3CF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M66 82 H134 L142 140 H58 Z" fill="url(#bagGradient)" />
                <path d="M134 82 H128 L133 140 H142 Z" fill="rgba(0,0,0,0.07)" />
                
                <g transform="translate(86, 96) scale(0.95)" stroke="#FFFFFF" strokeWidth="2.5" fill="none">
                  <circle cx="6" cy="6" r="2.5" />
                  <circle cx="18" cy="6" r="2.5" />
                  <path d="M12 22C12 22 3 16 3 11C3 8 5 6 7 6C9 6 11 8 12 9C13 8 15 6 17 6C19 6 21 8 21 11C21 16 12 22 12 22Z" strokeLinejoin="round" />
                </g>

                <defs>
                  <linearGradient id="podiumGradientSide" x1="36" y1="135" x2="36" y2="160" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#A1DED9" />
                    <stop offset="100%" stopColor="#75BBB5" />
                  </linearGradient>
                  <linearGradient id="bagGradient" x1="66" y1="82" x2="142" y2="140" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#00A2A4" />
                    <stop offset="100%" stopColor="#006C6E" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Wavy bottom divider of hero block */}
        <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none">
          <svg viewBox="0 0 430 32" fill="none" className="w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 32 H430 V12 C330 0 170 28 0 12 Z" fill="#F3F8F8" />
          </svg>
        </div>
      </div>

      {/* === FORM CARD === */}
      <div className="px-5 -mt-5 relative z-10 flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-[28px] px-5 py-4 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E3ECEC] flex flex-col items-center">
          {/* Circular Mobile/Bubble Icon */}
          <div className="w-[50px] h-[50px] rounded-full border border-dashed border-[#009294]/30 flex items-center justify-center bg-[#F2FAF9] mb-3">
            <div className="w-[36px] h-[36px] rounded-full bg-[#009294]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#009294]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2zM9 7h6M9 11h6" />
              </svg>
            </div>
          </div>

          <h2 className="text-[17px] font-extrabold text-[#0E1E1E] text-center leading-tight">Let’s get you in</h2>
          <p className="text-[11px] text-[#5A6E6E] font-medium mt-0.5 mb-4 text-center">
            Enter your mobile number to receive OTP
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            {/* Mobile Field with +91 block */}
            <div className="flex items-center bg-[#F7FBFB] border border-[#D5E2E2] rounded-2xl overflow-hidden h-[46px] focus-within:border-[#009294] focus-within:ring-2 focus-within:ring-[#009294]/10 transition-all">
              {/* Country Code Block */}
              <div className="bg-[#006C6E] text-white flex items-center justify-center gap-1 px-3 h-full select-none font-bold text-[13px] cursor-pointer active:bg-[#005B5C] transition-colors">
                <span>+91</span>
                <svg className="w-3.5 h-3.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Vertical divider */}
              <div className="w-px h-5 bg-[#D5E2E2]" />

              {/* Input Area */}
              <div className="flex-1 flex items-center gap-2 px-2.5">
                <svg className="w-4 h-4 text-[#788E8E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter mobile number"
                  className="flex-1 bg-transparent text-[13px] font-semibold text-[#0E1E1E] placeholder:text-[#9FB1B1] outline-none border-none py-1.5"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[11px] font-semibold text-red-500 -mt-1.5 px-1">{error}</p>
            )}

            {/* Send OTP Button */}
            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="w-full h-[46px] bg-gradient-to-r from-[#009294] to-[#006C6E] rounded-2xl text-white text-[14px] font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#009294]/15 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? 'Sending OTP…' : 'Send OTP'}
              {!loading && (
                <svg className="w-4 h-4 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>

            {/* Privacy Badge Block */}
            <div className="flex items-start gap-2.5 bg-[#F0FAF9] border border-[#DCF2F0] rounded-xl p-2.5 mt-0.5">
              <div className="w-[18px] h-[18px] rounded-full bg-[#14B8A6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[9.5px] text-[#5A6E6E] font-medium leading-snug">
                  <span className="font-bold text-[#0E1E1E]">We care about your privacy.</span> Your number will only be used to verify your account.
                </p>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer mt-1">
              <input
                type="checkbox"
                required
                className="w-3.5 h-3.5 rounded border-[#CBD5E1] text-[#009294] focus:ring-[#009294] mt-0.5 accent-[#009294]"
              />
              <span className="text-[10px] text-[#5A6E6E] font-semibold leading-tight">
                I agree to the <span onClick={() => navigate('/terms')} className="text-[#009294] font-bold cursor-pointer hover:underline">Terms</span> and <span onClick={() => navigate('/privacy-policy')} className="text-[#009294] font-bold cursor-pointer hover:underline">Privacy Policy</span>
              </span>
            </label>

            {/* Link to Signup */}
            <div className="flex items-center justify-center gap-1 mt-1 text-[11px] text-[#5A6E6E] font-medium">
              <span>New to BuyTogether?</span>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-[#009294] font-bold hover:underline"
              >
                Create an account
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* === INDORE HERO BANNER === */}
      <div className="px-5 mt-1 flex-shrink-0">
        <div className="bg-[#E6F0F0] rounded-[20px] p-3.5 border border-[#D5E2E2] relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          {/* Palace/Heritage outline background */}
          <div className="absolute right-[-10px] bottom-[-15px] opacity-45 text-[#006C6E] pointer-events-none">
            <svg viewBox="0 0 120 160" className="w-[140px] h-[175px]" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
              <line x1="5" y1="150" x2="115" y2="150" strokeWidth="1.2" />
              <path d="M40 150 V80 H80 V150" strokeWidth="1" />
              <path d="M48 150 V130 A12 12 0 0 1 72 130 V150" strokeWidth="1" fill="#E6F0F0" />
              <path d="M15 150 V95 H40" strokeWidth="0.8" />
              <path d="M80 95 H105 V150" strokeWidth="0.8" />
              <line x1="15" y1="135" x2="105" y2="135" strokeWidth="0.8" />
              <line x1="15" y1="120" x2="105" y2="120" strokeWidth="0.8" />
              <line x1="15" y1="108" x2="105" y2="108" strokeWidth="0.8" />
              <rect x="42" y="65" width="36" height="15" strokeWidth="0.8" />
              <rect x="44" y="50" width="32" height="15" strokeWidth="0.8" />
              <rect x="46" y="38" width="28" height="12" strokeWidth="0.8" />
              <rect x="48" y="28" width="24" height="10" strokeWidth="0.8" />
              <path d="M52 28 C52 20 68 20 68 28 Z" strokeWidth="1.2" fill="#E6F0F0" />
              <path d="M18 95 C18 90 26 90 26 95 Z" strokeWidth="0.8" />
              <path d="M94 95 C94 90 102 90 102 95 Z" strokeWidth="0.8" />
              <circle cx="60" cy="72" r="2" strokeWidth="0.8" />
              <circle cx="52" cy="72" r="1.5" strokeWidth="0.8" />
              <circle cx="68" cy="72" r="1.5" strokeWidth="0.8" />
              <circle cx="60" cy="57" r="2" strokeWidth="0.8" />
              <circle cx="52" cy="57" r="1.5" strokeWidth="0.8" />
              <circle cx="68" cy="57" r="1.5" strokeWidth="0.8" />
              <circle cx="60" cy="44" r="1.5" strokeWidth="0.8" />
              <rect x="20" y="138" width="5" height="8" rx="1.5" strokeWidth="0.6" />
              <rect x="30" y="138" width="5" height="8" rx="1.5" strokeWidth="0.6" />
              <rect x="85" y="138" width="5" height="8" rx="1.5" strokeWidth="0.6" />
              <rect x="95" y="138" width="5" height="8" rx="1.5" strokeWidth="0.6" />
              <rect x="20" y="123" width="5" height="8" rx="1.5" strokeWidth="0.6" />
              <rect x="30" y="123" width="5" height="8" rx="1.5" strokeWidth="0.6" />
              <rect x="85" y="123" width="5" height="8" rx="1.5" strokeWidth="0.6" />
              <rect x="95" y="123" width="5" height="8" rx="1.5" strokeWidth="0.6" />
              <rect x="20" y="111" width="5" height="6" rx="1" strokeWidth="0.6" />
              <rect x="30" y="111" width="5" height="6" rx="1" strokeWidth="0.6" />
              <rect x="85" y="111" width="5" height="6" rx="1" strokeWidth="0.6" />
              <rect x="95" y="111" width="5" height="6" rx="1" strokeWidth="0.6" />
            </svg>
          </div>

          {/* Location Pin */}
          <div className="absolute right-3.5 top-3.5 text-[#008B8B]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>

          <div className="relative z-10 max-w-[75%]">
            <h3 className="text-[10px] font-bold text-[#5A6E6E] tracking-wide leading-none">BuyTogether in</h3>
            
            {/* INDORE Heading */}
            <div className="flex items-center gap-1 mt-0.5">
              <div className="text-[20px] font-black tracking-tight leading-none flex select-none">
                <span className="text-[#FF9933]">IN</span>
                <span className="text-[#0E1E1E] relative">
                  D
                  <span className="absolute inset-0 flex items-center justify-center text-[5px] text-[#000080] font-normal top-[1px]">
                    ⚙️
                  </span>
                </span>
                <span className="text-[#138808]">ORE</span>
              </div>
              <svg className="w-4 h-4 text-[#009294] fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21C12 21 3 15 3 10C3 7 5 5 7.5 5C9.5 5 11 6.5 12 7.5C13 6.5 14.5 5 16.5 5C19 5 21 7 21 10C21 15 12 21 12 21Z" />
              </svg>
            </div>

            <p className="text-[9.5px] text-[#5A6E6E] font-medium leading-relaxed mt-1">
              Proudly from the heart of India, uniting <span className="text-[#006C6E] font-bold">Indore</span>, saving more <span className="text-[#006C6E] font-bold">together</span>.
            </p>
          </div>

          {/* Apna Indore Badge */}
          <div className="relative z-10 flex items-center gap-1.5 mt-2 bg-white/70 border border-[#D5E2E2]/60 rounded-lg px-2 py-1 self-start shadow-sm">
            <svg className="w-3.5 h-3.5 text-[#009294]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-[9px] font-bold text-[#006C6E]">Apna Indore, Apna BuyTogether</span>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-[#788E8E]">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>Need help?</span>
          <a href="mailto:support@buytogether.in?subject=Login%20help" className="text-[#009294] font-bold hover:underline">Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
