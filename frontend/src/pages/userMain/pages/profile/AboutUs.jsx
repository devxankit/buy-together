import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-white border-b border-slate-100 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center active:scale-90 transition-all">
          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[15px] font-black text-slate-800">About Us</h1>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-5 pb-10">
        {/* Brand card */}
        <div className="bg-gradient-to-br from-[#097A6F] to-[#0D9488] rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl" />
          <h2 className="text-[28px] font-black tracking-tight leading-none flex items-center justify-center">
            <span className="text-white">Buy</span>
            <span className="text-teal-200">Together</span>
            <sup className="text-teal-200 text-[14px] font-black ml-0.5">+</sup>
          </h2>
          <p className="text-[11px] text-white/70 font-medium mt-2">Group Buying Made Simple</p>
          <div className="mt-4 bg-white/10 rounded-xl px-4 py-2 inline-block">
            <p className="text-[11px] font-bold text-white">Version 2.3.1</p>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4">
          <h3 className="text-[13px] font-black text-slate-700 mb-2">🎯 Our Mission</h3>
          <p className="text-[12px] text-slate-500 leading-relaxed">To empower consumers by bringing the power of collective buying to everyone. We believe that when people come together, they can unlock deals that are impossible individually.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { val: '50K+', label: 'Users' },
            { val: '12K+', label: 'Groups' },
            { val: '₹2Cr+', label: 'Saved' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-100 rounded-2xl p-3.5 text-center">
              <p className="text-[18px] font-black text-[#0D9488]">{s.val}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4">
          <h3 className="text-[13px] font-black text-slate-700 mb-3">🔄 How It Works</h3>
          {[
            { step: '1', title: 'Create or Join', desc: 'Find a group for the product you want or create your own.' },
            { step: '2', title: 'Reach the Goal', desc: 'Invite friends & wait for minimum buyers to join.' },
            { step: '3', title: 'Get the Deal', desc: 'Once goal is reached, vendors provide bulk discount pricing.' },
            { step: '4', title: 'Save Together', desc: 'Everyone gets the discounted price. Win-win!' },
          ].map(item => (
            <div key={item.step} className="flex gap-3 mb-3 last:mb-0">
              <div className="w-7 h-7 bg-[#0D9488] rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[11px] font-black">{item.step}</div>
              <div>
                <p className="text-[12px] font-bold text-slate-700">{item.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4">
          <h3 className="text-[13px] font-black text-slate-700 mb-3">📬 Contact Us</h3>
          {[
            { label: 'Email', val: 'hello@buytogether.in' },
            { label: 'Support', val: 'support@buytogether.in' },
            { label: 'Location', val: 'Mumbai, Maharashtra, India' },
          ].map(c => (
            <div key={c.label} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
              <span className="text-[11px] text-slate-400 font-medium">{c.label}</span>
              <span className="text-[11px] font-bold text-slate-600">{c.val}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-2">Made with ❤️ in India</p>
      </div>
    </div>
  );
};

export default AboutUs;
