import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-surface border-b border-line sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center active:scale-90 transition-all">
          <svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[15px] font-black text-ink">Change Password</h1>
      </div>

      <div className="flex-1 px-5 py-6 flex flex-col gap-5">
        <div className="bg-primary-soft border border-teal-100 rounded-2xl p-4 flex gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <div>
            <p className="text-[13px] font-bold text-teal-800">OTP-Based Authentication</p>
            <p className="text-[11px] text-teal-600 mt-0.5 leading-snug">BuyTogether uses OTP verification for secure login. No passwords needed!</p>
          </div>
        </div>

        <div className="border-2 border-line rounded-2xl px-4 py-3.5 bg-surface focus-within:border-primary transition-all">
          <p className="text-[10px] font-bold text-muted mb-1.5">Registered Phone / Email</p>
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter phone or email" className="w-full text-[14px] font-bold text-ink placeholder:text-slate-300 bg-transparent outline-none" />
        </div>

        {sent && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
            <p className="text-[13px] font-bold text-green-700">✅ OTP Sent!</p>
            <p className="text-[11px] text-green-600 mt-1">Check your phone/email for the verification code.</p>
          </div>
        )}

        <button onClick={() => setSent(true)} className="w-full h-[50px] bg-primary rounded-2xl text-white text-[14px] font-black flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 active:scale-95 transition-all">
          Send Verification OTP
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
