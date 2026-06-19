import React from 'react';
import { motion } from 'framer-motion';

const JoinedTabs = ({ selectedTab, onChange, counts = {} }) => {
  const TABS = [
    { id: 'active', label: 'Active', count: counts.active ?? 0 },
    { id: 'closing-soon', label: 'Closing Soon', count: counts['closing-soon'] ?? 0 },
    { id: 'completed', label: 'Completed', count: counts.completed ?? 0 }
  ];

  return (
    <div className="bg-white border border-slate-100/85 p-1 rounded-full flex w-full justify-between items-center shadow-sm select-none relative z-10 mt-[-16px]">
      {TABS.map((tab) => {
        const isActive = selectedTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-[11px] font-extrabold relative transition-colors duration-300 z-10 ${
              isActive ? 'text-white' : 'text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeJoinedTabIndicator"
                className="absolute inset-0 bg-primary rounded-full -z-10 shadow-sm shadow-[#0D9488]/15"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span>{tab.label}</span>
            <span
              className={`text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none transition-colors duration-300 ${
                isActive ? 'bg-black/15 text-white/95' : 'bg-[#E2E8F0]/70 text-[#64748B]'
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
