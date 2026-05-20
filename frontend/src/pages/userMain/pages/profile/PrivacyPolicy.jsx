import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const sections = [
    { title: '1. Information We Collect', content: 'We collect personal information you provide (name, email, phone number, location), device information (device type, OS), usage data (groups joined, interactions), and payment information (processed securely via third-party gateways).' },
    { title: '2. How We Use Your Data', content: 'Your data is used to facilitate group buying, send deal notifications, improve app experience, verify your identity, process transactions, and provide customer support. We analyze usage patterns to enhance our platform.' },
    { title: '3. Data Sharing', content: 'We share limited information with vendors to process confirmed deals, payment processors for transactions, and analytics providers (anonymized data only). We never sell your personal data to third parties.' },
    { title: '4. Data Storage & Security', content: 'Your data is stored on secure servers within India. We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. Regular security audits are conducted to ensure data protection.' },
    { title: '5. Your Rights', content: 'You have the right to access your personal data, request corrections or deletion, opt out of marketing communications, export your data, and withdraw consent at any time.' },
    { title: '6. Cookies & Tracking', content: 'We use essential cookies for app functionality, analytics cookies to understand usage patterns, and preference cookies to remember your settings. You can manage cookie preferences in your device settings.' },
    { title: '7. Children\'s Privacy', content: 'BuyTogether is not intended for users under 18 years of age. We do not knowingly collect data from minors. If you believe a minor has provided us with personal information, please contact us immediately.' },
    { title: '8. Contact Us', content: 'For privacy-related queries, contact our Data Protection Officer at privacy@buytogether.in or write to: BuyTogether Technologies Pvt. Ltd., Mumbai, Maharashtra, India.' },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-white border-b border-slate-100 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center active:scale-90 transition-all">
          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[15px] font-black text-slate-800">Privacy Policy</h1>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-4 pb-10">
        <div className="bg-[#F0FDF9] border border-teal-100 rounded-2xl p-4 flex gap-3">
          <span className="text-xl">🔒</span>
          <p className="text-[11px] text-teal-700 leading-snug">Your privacy is our priority. We are committed to protecting your personal information in compliance with Indian IT Act, 2000 and DPDP Act, 2023.</p>
        </div>
        <p className="text-[11px] text-slate-400 font-medium">Last updated: May 2026</p>
        {sections.map((sec, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4">
            <h3 className="text-[13px] font-black text-slate-700 mb-2">{sec.title}</h3>
            <p className="text-[12px] text-slate-500 leading-relaxed">{sec.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
