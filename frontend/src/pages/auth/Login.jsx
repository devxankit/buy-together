import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, User, Mail, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../hooks/useDispatch';
import { login, register } from '../../redux/asyncActions/authActions';

const Login = () => {
  const [role, setRole] = useState('user'); // 'user' or 'vendor'
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const primaryColor = role === 'vendor' ? '#0052cc' : '#ff7a00';
  const hoverColor = role === 'vendor' ? '#0041a3' : '#e66e00';
  const shadowColor = role === 'vendor' ? 'rgba(0, 82, 204, 0.2)' : 'rgba(255, 122, 0, 0.2)';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (isLogin) {
      navigate('/otp', { state: { role, mobile: formData.mobile, flow: 'login' } });
    } else {
      navigate('/otp', { state: { ...formData, role, flow: 'signup' } });
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-[#f8f9fa] md:flex md:items-center md:justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white min-h-screen w-full md:min-h-0 md:h-auto md:max-w-[440px] md:rounded-[3rem] md:shadow-2xl md:shadow-black/5 overflow-hidden flex flex-col relative"
      >
        {/* Header with Deeper Curve */}
        <div 
          className="relative h-80 shrink-0 overflow-hidden transition-colors duration-500"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="absolute bottom-24 left-10 z-10">
            <h1 className="text-[40px] font-bold text-white mb-2 leading-tight tracking-tight">
              {role === 'vendor' ? 'Business' : (isLogin ? <>Welcome <br /> Back</> : <>Create <br /> Account</>)}
              {role === 'vendor' && <div className="text-xl opacity-80 -mt-1">Partner Portal</div>}
            </h1>
            <p className="text-white/90 font-medium text-[15px]">
              {isLogin ? "Sign in to your account" : "Sign up to get started"}
            </p>
          </div>

          {/* Curve SVG - Deepened */}
          <div className="absolute bottom-0 left-0 w-full leading-[0] z-0">
            <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-44">
              <path d="M0,80 C150,160 350,0 500,80 L500,150 L0,150 Z" className="fill-white"></path>
            </svg>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-10 pb-12 pt-10 -mt-12 relative z-10 bg-white flex-1 md:flex-none">
          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-500 ml-1">Full Name</label>
                    <div className="relative">
                      <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-900 transition-all focus:bg-white focus:ring-4 placeholder:text-gray-300"
                        style={{ '--tw-ring-color': `${primaryColor}0D`, borderColor: 'var(--tw-border-opacity) transparent' }}
                        onFocus={(e) => {
                          e.target.style.borderColor = primaryColor;
                          e.target.style.boxShadow = `0 0 0 4px ${primaryColor}1A`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#f3f4f6';
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="e.g. Alex Johnson"
                        required={!isLogin}
                      />
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-500 ml-1">Email Address</label>
                    <div className="relative">
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-900 transition-all focus:bg-white focus:ring-4 placeholder:text-gray-300"
                        onFocus={(e) => {
                          e.target.style.borderColor = primaryColor;
                          e.target.style.boxShadow = `0 0 0 4px ${primaryColor}1A`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#f3f4f6';
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="alex@example.com"
                      />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-gray-500 ml-1">Mobile Number</label>
              <div 
                className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl transition-all px-5"
                id="mobile-container"
              >
                <span className="text-gray-400 font-bold text-sm mr-2">+91</span>
                <input 
                  type="tel"
                  name="mobile"
                  maxLength="10"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                  onFocus={() => {
                    const el = document.getElementById('mobile-container');
                    el.style.borderColor = primaryColor;
                    el.style.backgroundColor = 'white';
                    el.style.boxShadow = `0 0 0 4px ${primaryColor}1A`;
                  }}
                  onBlur={() => {
                    const el = document.getElementById('mobile-container');
                    el.style.borderColor = '#f3f4f6';
                    el.style.backgroundColor = '#f9fafb';
                    el.style.boxShadow = 'none';
                  }}
                  className="flex-1 py-4 bg-transparent outline-none font-bold text-gray-900 placeholder:text-gray-300 tracking-wider"
                  placeholder="98765 43210"
                  required
                />
                <Phone className="text-gray-300" size={18} />
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                className="w-full text-white py-4.5 rounded-2xl font-bold text-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-xl"
                style={{ backgroundColor: primaryColor, shadowColor: shadowColor }}
              >
                <span className="tracking-tight">{isLogin ? "Sign In" : "Create Account"}</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </form>

          <div className="mt-12 text-center space-y-4">
            {role === 'user' && (
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-400 text-[15px] font-medium transition-colors"
                style={{ color: isLogin ? '' : primaryColor }}
              >
                {isLogin ? (
                  <>New to Buytogether? <span className="font-bold" style={{ color: primaryColor }}>Sign up here</span></>
                ) : (
                  <>Already have an account? <span className="font-bold" style={{ color: primaryColor }}>Sign in here</span></>
                )}
              </button>
            )}

            <div className="pt-4 border-t border-gray-50 flex flex-col items-center gap-3">
              <button 
                onClick={() => {
                  setRole(role === 'user' ? 'vendor' : 'user');
                  setIsLogin(true);
                }}
                className="text-sm font-bold flex items-center gap-2 hover:opacity-80 transition-opacity"
                style={{ color: role === 'user' ? '#0052cc' : '#ff7a00' }}
              >
                {role === 'user' ? 'Login as Vendor' : 'Login as Individual User'}
                <ArrowRight size={14} />
              </button>

              {role === 'vendor' && (
                <Link to="/vendor/signup" className="text-xs text-gray-400 font-bold uppercase tracking-widest hover:text-secondary transition-colors">
                  Register as Business Partner
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
