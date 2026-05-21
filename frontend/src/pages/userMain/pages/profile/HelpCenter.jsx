import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HelpCenter = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const faqs = [
    { q: 'How does group buying work?', a: 'When multiple buyers come together for the same product, BuyTogether negotiates a bulk discount from verified vendors. You join a group, wait for the minimum number of buyers, and then everyone gets the discounted price!' },
    { q: 'How do I create a buying group?', a: 'Tap the + icon in the bottom nav, fill in the product details, set your group goal (minimum buyers), choose a category, and publish. Others can then discover and join your group.' },
    { q: 'Is my payment secure?', a: 'Yes! All payments are processed through our secure payment gateway with end-to-end encryption. We use RBI-compliant payment processing and never store your card details.' },
    { q: 'What happens if a group doesn\'t reach its goal?', a: 'If the minimum number of buyers isn\'t reached before the deadline, the group expires and no one is charged. You\'ll be notified and can join or create another group.' },
    { q: 'How do I track my order?', a: 'Go to Profile → My Orders to see all your orders with real-time tracking updates. You\'ll also receive notifications at each stage of delivery.' },
    { q: 'Can I cancel after joining a group?', a: 'Yes, you can leave a group anytime before the deal is confirmed. Once the deal is locked and payment is made, cancellations follow our refund policy.' },
  ];
  const [openIdx, setOpenIdx] = useState(null);
  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-surface border-b border-line sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center active:scale-90 transition-all">
          <svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[15px] font-black text-ink">Help Center</h1>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-4 pb-10">
        {/* Search */}
        <div className="flex items-center gap-2 bg-surface border border-slate-200 rounded-2xl px-4 h-[44px] focus-within:border-primary transition-all">
          <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQs..." className="flex-1 text-[13px] font-medium text-ink placeholder:text-muted bg-transparent outline-none" />
        </div>

        {/* Quick Contact */}
        <div className="flex gap-2.5">
          {[
            { icon: '📧', label: 'Email Us', sub: 'support@buytogether.in' },
            { icon: '💬', label: 'Live Chat', sub: 'Available 9AM–9PM' },
          ].map(c => (
            <div key={c.label} className="flex-1 bg-surface border border-line rounded-2xl p-3.5 text-center active:scale-95 transition-all cursor-pointer">
              <span className="text-xl">{c.icon}</span>
              <p className="text-[12px] font-bold text-ink mt-1.5">{c.label}</p>
              <p className="text-[9px] text-muted mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <h3 className="text-[12px] font-black text-faint uppercase tracking-wide mt-1">Frequently Asked Questions</h3>
        <div className="flex flex-col gap-2.5">
          {filtered.map((faq, idx) => (
            <div key={idx} className="bg-surface border border-line rounded-2xl overflow-hidden">
              <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} className="w-full flex items-center justify-between px-4 py-3.5 text-left">
                <p className="text-[13px] font-bold text-ink flex-1 pr-3">{faq.q}</p>
                <svg className={`w-4 h-4 text-muted flex-shrink-0 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {openIdx === idx && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-[12px] text-faint leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
