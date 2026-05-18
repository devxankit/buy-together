import React from 'react';

const JoinedTabs = ({ selectedTab, onChange }) => {
  const TABS = [
    { id: 'active', label: 'Active', count: 6 },
    { id: 'closing-soon', label: 'Closing Soon', count: 2 },
    { id: 'completed', label: 'Completed', count: 3 }
  ];

  return (
    <div className="bg-white border border-[#E2E8F0]/60 p-1.5 rounded-[20px] flex w-full justify-between items-center shadow-sm select-none relative z-10 mt-[-16px]">
      {TABS.map((tab) => {
        const isActive = selectedTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[15px] text-xs font-bold transition-all duration-300 ${
              isActive
                ? 'bg-[#0D9488] text-white shadow-sm shadow-[#0D9488]/15 scale-[1.01]'
                : 'text-[#64748B] hover:text-[#475569]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none transition-colors ${
                isActive ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#475569]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default JoinedTabs;
