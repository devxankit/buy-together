import React from 'react';
import { useNavigate } from 'react-router-dom';

const CommunityGuidelines = () => {
  const navigate = useNavigate();
  const rules = [
    { icon: '🤝', title: 'Be Respectful', desc: 'Treat all members with courtesy. No hate speech, discrimination, or personal attacks. We\'re all here to save money together.' },
    { icon: '✅', title: 'Be Honest', desc: 'Provide accurate information about products and deals. Don\'t post misleading prices, fake reviews, or false claims about vendors.' },
    { icon: '🚫', title: 'No Spam', desc: 'Don\'t send unsolicited messages, promotions, or repetitive content in group chats. Keep discussions relevant to the group\'s purpose.' },
    { icon: '🔒', title: 'Protect Privacy', desc: 'Never share other members\' personal information without consent. Don\'t screenshot private conversations to share externally.' },
    { icon: '🛡️', title: 'No Fraud', desc: 'Any attempts at fraud, scams, or deceptive practices will result in immediate account termination and may be reported to authorities.' },
    { icon: '📦', title: 'Commit to Deals', desc: 'Once you join a group and a deal is confirmed, honor your commitment. Backing out affects all group members and may result in penalties.' },
    { icon: '🏪', title: 'Verified Vendors Only', desc: 'Only negotiate with and purchase from verified vendors on the platform. Avoid side deals outside of BuyTogether for your protection.' },
    { icon: '📢', title: 'Report Issues', desc: 'If you encounter inappropriate behavior, suspicious activity, or fraudulent vendors, report them immediately through the app.' },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-surface border-b border-line sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center active:scale-90 transition-all">
          <svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[15px] font-black text-ink">Community Guidelines</h1>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-3 pb-10">
        <div className="bg-gradient-to-r from-[#097A6F] to-[#0D9488] rounded-2xl p-4 shadow-md">
          <h2 className="text-[15px] font-black text-white mb-1">Our Community Standards</h2>
          <p className="text-[11px] text-white/80 leading-snug">BuyTogether is built on trust and collaboration. Follow these guidelines to keep our community safe, fair, and enjoyable for everyone.</p>
        </div>

        {rules.map((rule, idx) => (
          <div key={idx} className="bg-surface border border-line rounded-2xl p-4 flex gap-3">
            <span className="text-xl flex-shrink-0">{rule.icon}</span>
            <div>
              <h3 className="text-[13px] font-black text-ink mb-1">{rule.title}</h3>
              <p className="text-[11px] text-faint leading-relaxed">{rule.desc}</p>
            </div>
          </div>
        ))}

        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mt-2">
          <p className="text-[12px] font-bold text-red-600">⚠️ Violations</p>
          <p className="text-[11px] text-red-500 mt-1 leading-snug">Violations may result in warnings, temporary suspension, or permanent account ban depending on severity. Repeated violations will escalate enforcement.</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
