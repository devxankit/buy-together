import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from '../../hooks/useDispatch';
import { setAuth } from '../../redux/slices/authSlice';

const OTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { role, mobile } = location.state || { role: 'user', mobile: '' };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length === 6) {
      // Mock Login logic
      dispatch(setAuth({
        user: { 
          name: role === 'vendor' ? 'Premium Vendor' : 'Verified User',
          mobile: mobile,
          role: role 
        },
        token: 'mock-jwt-token-' + Date.now()
      }));

      // Redirect to home page
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-7 rounded-[1.5rem] shadow-xl shadow-orange-500/5 border border-gray-100 w-full max-w-[400px]"
      >
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-black text-gray-900">Security Verification</h1>
          <p className="text-gray-400 text-xs font-semibold mt-1">Enter the 6-digit code sent to your mobile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-1.5">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-11 h-11 text-center text-lg font-black border-2 border-gray-100 rounded-xl focus:border-primary bg-gray-50/30 outline-none transition-all"
              />
            ))}
          </div>
          <button 
            type="submit"
            className="w-full bg-primary text-white py-3.5 rounded-xl font-black shadow-lg shadow-orange-500/10 hover:bg-orange-600 transition-all transform active:scale-95"
          >
            Verify Code
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default OTP;
