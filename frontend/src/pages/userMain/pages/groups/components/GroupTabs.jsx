import React from 'react';

const GroupTabs = ({ activeTab, onChange }) => {
  return (
    <div className="bg-[#F1F5F9] p-1.5 rounded-[18px] flex w-full relative select-none">
      {/* My Groups Tab */}
      <button
        onClick={() => onChange('my-groups')}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[13px] text-xs font-bold transition-all duration-300 ${
          activeTab === 'my-groups'
            ? 'bg-white text-[#0D9488] shadow-sm shadow-[#0F172A]/5 scale-[1.01]'
            : 'text-[#64748B] hover:text-[#475569]'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 transition-colors ${
            activeTab === 'my-groups' ? 'text-[#0D9488]' : 'text-[#94A3B8]'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span>My Groups</span>
      </button>

      {/* Joined Groups Tab */}
      <button
        onClick={() => onChange('joined-groups')}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[13px] text-xs font-bold transition-all duration-300 ${
          activeTab === 'joined-groups'
            ? 'bg-white text-[#0D9488] shadow-sm shadow-[#0F172A]/5 scale-[1.01]'
            : 'text-[#64748B] hover:text-[#475569]'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 transition-colors ${
            activeTab === 'joined-groups' ? 'text-[#0D9488]' : 'text-[#94A3B8]'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span>Joined Groups</span>
      </button>
    </div>
  );
};

export default GroupTabs;
