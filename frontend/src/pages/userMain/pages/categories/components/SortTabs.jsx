import React from 'react';

/**
 * Premium horizontal capsule tabs selector.
 * Adapts strictly to the project's teal signature branding color theme.
 */
const SortTabs = ({ activeTab, onChange }) => {
  const TABS = [
    {
      id: 'trending',
      label: 'Trending',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      id: 'nearby',
      label: 'Nearby',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 'new',
      label: 'New',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'my-groups',
      label: 'My Groups',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="flex items-center justify-between select-none relative -mx-4 px-4 py-1">
      {/* Horizontal Tabs scroll row */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[12px] text-[10px] font-black whitespace-nowrap transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-tr from-[rgba(11,122,112,0.06)] to-[rgba(13,148,136,0.06)] text-primary border border-primary/15 shadow-sm' 
                  : 'bg-surface-alt text-[#64748B] border border-line/70 hover:border-slate-300'
              }`}
            >
              <span className={isActive ? 'text-primary' : 'text-[#64748B]'}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SortTabs;
