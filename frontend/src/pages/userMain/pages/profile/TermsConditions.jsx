import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsConditions = () => {
  const navigate = useNavigate();
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By downloading, installing, or using BuyTogether ("the App"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the App.' },
    { title: '2. User Accounts', content: 'You must provide accurate and complete information when creating your account. You are responsible for maintaining the confidentiality of your account. You must be at least 18 years old to use BuyTogether.' },
    { title: '3. Group Buying Mechanism', content: 'BuyTogether facilitates group purchases by connecting buyers with similar interests. A deal is confirmed only when the minimum number of buyers is reached within the specified deadline. BuyTogether acts as a platform and is not a party to transactions between buyers and vendors.' },
    { title: '4. Payments & Pricing', content: 'All prices are in Indian Rupees (INR). Payment is collected only after a deal is confirmed. Prices shown are estimates and may vary based on vendor availability and group size. All transactions are processed through RBI-compliant payment gateways.' },
    { title: '5. Cancellations & Refunds', content: 'You may leave a group before the deal is confirmed at no cost. Once a deal is confirmed and payment is made, cancellations are subject to vendor policies. Refunds, if applicable, will be processed within 7-10 business days.' },
    { title: '6. User Conduct', content: 'Users must not engage in fraudulent activities, spam other users, create fake groups or accounts, harass other members, or post misleading product information. Violation may result in account suspension.' },
    { title: '7. Intellectual Property', content: 'All content, logos, and trademarks on BuyTogether are owned by us. You may not copy, modify, or distribute any content without prior written consent.' },
    { title: '8. Limitation of Liability', content: 'BuyTogether is not liable for any direct, indirect, incidental, or consequential damages arising from the use of the platform. We do not guarantee the quality of products purchased through vendor deals.' },
    { title: '9. Changes to Terms', content: 'We reserve the right to modify these terms at any time. Continued use of the App after changes constitutes acceptance of the new terms. Major changes will be notified via email or in-app notification.' },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-white border-b border-slate-100 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center active:scale-90 transition-all">
          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[15px] font-black text-slate-800">Terms & Conditions</h1>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-4 pb-10">
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

export default TermsConditions;
