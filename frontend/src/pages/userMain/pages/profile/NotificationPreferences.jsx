import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationPreferences = () => {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({
    groupUpdates: true, dealAlerts: true, newMembers: false, chatMessages: true,
    vendorOffers: true, priceDrops: true, expiringDeals: true,
    promotions: false, newsletter: false, appUpdates: true,
  });

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const sections = [
    { title: 'Group Activity', items: [
      { key: 'groupUpdates', label: 'Group Updates', desc: 'When a group you joined has new activity' },
      { key: 'newMembers', label: 'New Members', desc: 'When someone joins your group' },
      { key: 'chatMessages', label: 'Chat Messages', desc: 'New messages in group chat' },
    ]},
    { title: 'Deals & Offers', items: [
      { key: 'dealAlerts', label: 'Deal Alerts', desc: 'When a new deal is available near you' },
      { key: 'vendorOffers', label: 'Vendor Offers', desc: 'Special offers from verified vendors' },
      { key: 'priceDrops', label: 'Price Drops', desc: 'Price drops on wishlisted items' },
      { key: 'expiringDeals', label: 'Expiring Deals', desc: 'Deals about to expire' },
    ]},
    { title: 'General', items: [
      { key: 'promotions', label: 'Promotions', desc: 'Promotional offers and campaigns' },
      { key: 'newsletter', label: 'Newsletter', desc: 'Weekly digest and community news' },
      { key: 'appUpdates', label: 'App Updates', desc: 'New features and improvements' },
    ]},
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-white border-b border-slate-100 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center active:scale-90 transition-all">
          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[15px] font-black text-slate-800">Notification Preferences</h1>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-5 pb-10">
        {sections.map(sec => (
          <div key={sec.title}>
            <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-wide mb-3">{sec.title}</h3>
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
              {sec.items.map((item, idx) => (
                <div key={item.key} className={`flex items-center justify-between px-4 py-3.5 ${idx !== sec.items.length - 1 ? 'border-b border-slate-50' : ''}`}>
                  <div className="flex-1 mr-4">
                    <p className="text-[13px] font-bold text-slate-700">{item.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <button onClick={() => toggle(item.key)} className={`w-11 h-6 rounded-full p-0.5 transition-all duration-200 ${prefs[item.key] ? 'bg-[#0D9488]' : 'bg-slate-200'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${prefs[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPreferences;
