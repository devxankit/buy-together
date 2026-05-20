import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Language = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('English');
  const languages = [
    { name: 'English', native: 'English', flag: '🇬🇧' },
    { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
    { name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-white border-b border-slate-100 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center active:scale-90 transition-all">
          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[15px] font-black text-slate-800">Language</h1>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-3">
        <p className="text-[12px] text-slate-400 font-medium">Select your preferred language for the app.</p>
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          {languages.map((lang, idx) => (
            <button key={lang.name} onClick={() => setSelected(lang.name)} className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-all active:bg-slate-50 ${idx !== languages.length - 1 ? 'border-b border-slate-50' : ''} ${selected === lang.name ? 'bg-[#F0FDF9]' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-lg">{lang.flag}</span>
                <div>
                  <p className={`text-[13px] font-bold ${selected === lang.name ? 'text-[#0D9488]' : 'text-slate-700'}`}>{lang.name}</p>
                  <p className="text-[10px] text-slate-400">{lang.native}</p>
                </div>
              </div>
              {selected === lang.name && (
                <div className="w-5 h-5 bg-[#0D9488] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Language;
