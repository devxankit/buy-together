import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Store, User, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../hooks/useDispatch';
import { login } from '../../redux/asyncActions/authActions';

const Login = () => {
  const [role, setRole] = useState('user'); // 'user' or 'vendor'
  const [mobile, setMobile] = useState('');
  const [step, setStep] = useState(1); // 1: Mobile Input, 2: OTP (if you want to keep it on one page)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (mobile.length >= 10) {
      // In a real app, this would trigger the OTP SMS
      console.log(`Sending OTP to ${mobile} for role ${role}`);
      navigate('/otp', { state: { role, mobile } }); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-7 rounded-[1.5rem] shadow-xl shadow-orange-500/5 border border-gray-100 w-full max-w-[400px] relative overflow-hidden"
      >
        {/* Top Branding Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-1.5 mb-4 scale-90">
            <span className="text-secondary font-black text-xl tracking-tighter">Buy</span>
            <span className="text-primary font-black text-xl tracking-tighter">together</span>
          </div>
          
          <h1 className="text-xl font-black text-gray-900 mb-1">Welcome Back</h1>
          <p className="text-gray-400 text-xs font-semibold text-center">Securely access your account</p>
        </div>

        {/* Role Switcher */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-6 relative">
          {/* Animated Background Pill */}
          <motion.div
            initial={false}
            animate={{ 
              x: role === 'user' ? 0 : '100%',
            }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.25 }}
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
          />

          <button 
            type="button"
            onClick={() => setRole('user')}
            className={`relative flex-1 py-2 rounded-lg text-sm font-black transition-colors duration-200 z-10 flex items-center justify-center gap-2 ${
              role === 'user' ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <User size={16} />
            Individual
          </button>
          <button 
            type="button"
            onClick={() => setRole('vendor')}
            className={`relative flex-1 py-2 rounded-lg text-sm font-black transition-colors duration-200 z-10 flex items-center justify-center gap-2 ${
              role === 'vendor' ? 'text-secondary' : 'text-gray-400'
            }`}
          >
            <Store size={16} />
            Business
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSendOTP} className="space-y-5">
          <div className="relative group">
            <label className="block text-[10px] font-black text-gray-400 mb-1.5 px-1 uppercase tracking-widest">
              Mobile Number
            </label>
            <div className="flex items-center border-2 border-gray-100 rounded-xl focus-within:border-primary focus-within:bg-white bg-gray-50/30 transition-all pr-4 pl-4 py-0.5">
              <span className="pr-2 text-gray-400 font-bold border-r border-gray-100 my-2.5 text-sm">+91</span>
              <input 
                type="tel" 
                maxLength="10"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2.5 bg-transparent outline-none font-bold text-gray-900 tracking-widest text-sm placeholder:text-gray-200 placeholder:font-medium placeholder:tracking-normal"
                placeholder="Ex: 98765 43210"
                required
              />
              <Phone className="text-gray-200 group-focus-within:text-primary transition-colors" size={16} />
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-3.5 rounded-xl font-black text-base flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg ${
              role === 'user' 
                ? 'bg-primary text-white shadow-orange-500/20 hover:bg-orange-600' 
                : 'bg-secondary text-white shadow-blue-500/20 hover:bg-blue-700'
            }`}
          >
            Continue 
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col items-center gap-4">
          {role === 'vendor' ? (
            <div className="text-center">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1">New to our marketplace?</p>
              <Link to="/vendor/signup" className="text-secondary font-black text-sm hover:underline flex items-center gap-1 justify-center">
                Register as Business Partner <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-400 text-[10px] font-medium">By logging in, you agree to our <Link to="/terms" className="text-primary font-bold">Terms of Service</Link></p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
