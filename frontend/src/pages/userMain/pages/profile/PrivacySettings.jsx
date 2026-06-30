import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../../../utils/toast';

const STORAGE_KEY = 'privacySettings';
const DEFAULT_PREFS = {
  profileVisible: true, showGroups: true, showActivity: false,
  shareLocation: true, showOnline: true, allowInvites: true,
};

const PrivacySettings = () => {
  const navigate = useNavigate();
  // Hydrate from the last saved settings so toggles survive navigation/reload.
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_PREFS, ...JSON.parse(saved) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });
  const [saving, setSaving] = useState(false);
  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    setSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    showToast('Privacy settings saved! 🔒');
    setTimeout(() => setSaving(false), 400);
  };

  const items = [
    { key: 'profileVisible', label: 'Public Profile', desc: 'Allow others to see your profile' },
    { key: 'showGroups', label: 'Show My Groups', desc: 'Let others see which groups you joined' },
    { key: 'showActivity', label: 'Activity Status', desc: 'Show your recent activity to group members' },
    { key: 'shareLocation', label: 'Share Location', desc: 'Share approximate location for nearby deals' },
    { key: 'showOnline', label: 'Online Status', desc: 'Show when you are online in group chat' },
    { key: 'allowInvites', label: 'Allow Group Invites', desc: 'Let others invite you to their groups' },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-surface border-b border-line sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center active:scale-90 transition-all">
          <svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[15px] font-black text-ink">Privacy Settings</h1>
      </div>

      <div className="flex-1 px-5 py-5">
        <div className="bg-surface border border-line rounded-2xl overflow-hidden">
          {items.map((item, idx) => (
            <div key={item.key} className={`flex items-center justify-between px-4 py-3.5 ${idx !== items.length - 1 ? 'border-b border-line' : ''}`}>
              <div className="flex-1 mr-4">
                <p className="text-[13px] font-bold text-ink">{item.label}</p>
                <p className="text-[10px] text-muted mt-0.5">{item.desc}</p>
              </div>
              <button onClick={() => toggle(item.key)} className={`w-11 h-6 rounded-full p-0.5 transition-all duration-200 ${prefs[item.key] ? 'bg-primary' : 'bg-slate-200'}`}>
                <div className={`w-5 h-5 bg-surface rounded-full shadow-sm transition-all duration-200 ${prefs[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-[12px] font-bold text-amber-700">🔒 Data Protection</p>
          <p className="text-[11px] text-amber-600 mt-1 leading-snug">Your data is encrypted and never shared with third parties. We comply with all Indian data protection regulations.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-5 w-full h-[50px] bg-primary rounded-2xl text-white text-[14px] font-black flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default PrivacySettings;
