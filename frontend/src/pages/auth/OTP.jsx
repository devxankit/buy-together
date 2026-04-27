import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from '../../hooks/useDispatch';
import { setAuth } from '../../redux/slices/authSlice';

const OTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { role, mobile, name, email, flow } = location.state || { role: 'user', mobile: '', flow: 'login' };

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    
    // Auto focus next
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length === 6) {
      // Mock Login logic
      dispatch(setAuth({
        user: { 
          name: name || (role === 'vendor' ? 'Premium Vendor' : 'Verified User'),
          email: email || '',
          mobile: mobile,
          role: role 
        },
        token: 'mock-jwt-token-' + Date.now()
      }));

      // Redirect to home page
      navigate('/');
    }
  };

  const primaryColor = role === 'vendor' ? '#0052cc' : '#ff7a00';

  return (
    <div className="min-h-screen bg-white md:bg-[#f8f9fa] md:flex md:items-center md:justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white min-h-screen w-full md:min-h-0 md:h-auto md:max-w-[440px] md:rounded-[3rem] md:shadow-2xl md:shadow-black/5 overflow-hidden flex flex-col relative"
      >
        {/* Header with Curve */}
        <div 
          className="relative h-80 shrink-0 overflow-hidden transition-colors duration-500"
          style={{ backgroundColor: primaryColor }}
        >
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-10 left-10 z-20 inline-flex items-center gap-2 text-white/80 hover:text-white font-bold transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs uppercase tracking-widest">Back</span>
          </button>

          <div className="absolute bottom-24 left-10 z-10">
            <h1 className="text-[40px] font-bold text-white mb-2 leading-tight tracking-tight">Security <br /> Code</h1>
            <p className="text-white/90 font-medium text-[15px]">Sent to +91 {mobile}</p>
          </div>

          {/* Curve SVG - Deepened */}
          <div className="absolute bottom-0 left-0 w-full leading-[0] z-0">
            <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-44">
              <path d="M0,80 C150,160 350,0 500,80 L500,150 L0,150 Z" className="fill-white"></path>
            </svg>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-10 pb-12 pt-6 -mt-12 relative z-10 bg-white flex-1 md:flex-none">
          <div className="flex flex-col items-center mb-10">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-black/5 border border-gray-50"
              style={{ backgroundColor: `${primaryColor}08` }}
            >
              <ShieldCheck size={32} style={{ color: primaryColor }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
            <p className="text-gray-400 text-[15px] font-medium mt-1">Enter the 6-digit code</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="flex justify-center gap-2.5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={digit}
                  autoFocus={index === 0}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-[48px] h-[60px] text-center text-2xl font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none transition-all focus:bg-white focus:ring-4 placeholder:text-gray-200"
                  style={{ '--tw-ring-color': `${primaryColor}0D` }}
                  onFocus={(e) => {
                    e.target.style.borderColor = primaryColor;
                    e.target.style.boxShadow = `0 0 0 4px ${primaryColor}1A`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#f3f4f6';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              ))}
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full text-white py-4.5 rounded-2xl font-bold text-lg shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3"
                style={{ backgroundColor: primaryColor, boxShadow: `0 20px 40px -12px ${primaryColor}33` }}
              >
                <span>Verify & Continue</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-gray-400 text-[15px] font-medium">
              Didn't receive the code? <br />
              <button className="font-bold mt-2 hover:opacity-80 transition-opacity" style={{ color: primaryColor }}>
                Resend New Code
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OTP;
