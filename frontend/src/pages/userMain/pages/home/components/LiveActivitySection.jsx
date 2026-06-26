import React, { useState, useEffect } from 'react';
import { getPublicSettings } from '../../../../../services/setting.api';
import { swr } from '../../../../../services/swr';

const LiveActivitySection = () => {
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    let active = true;
    // Stale-while-revalidate: show cached stats instantly, refresh silently.
    swr(
      'public-settings',
      async () => {
        const { data } = await getPublicSettings();
        return data;
      },
      { onData: (data) => { if (active) setStatsData(data); } }
    ).catch((err) => console.warn('Failed to load live stats:', err));
    return () => {
      active = false;
    };
  }, []);

  const stats = [
    {
      id: 1,
      icon: (
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        </div>
      ),
      value: statsData?.liveStatsActiveGroups || '8,642',
      label: 'Active Groups',
      trend: statsData?.liveStatsActiveGroupsTrend || '+12% today',
      trendColor: 'text-green-500',
      bg: 'bg-surface'
    },
    {
      id: 2,
      icon: (
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
        </div>
      ),
      value: statsData?.liveStatsPeopleInterested || '1,23,876',
      label: 'People Interested',
      trend: statsData?.liveStatsPeopleInterestedTrend || '+18% today',
      trendColor: 'text-green-500',
      bg: 'bg-blue-50/30'
    },
    {
      id: 3,
      icon: (
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-1.245-1.134-1.744-.15-.49-.15-1.01.07-1.503z" clipRule="evenodd" />
          </svg>
        </div>
      ),
      value: statsData?.liveStatsGroupsGrowing || '312',
      label: 'Groups Growing Fast',
      trend: statsData?.liveStatsGroupsGrowingTrend || '+24% today',
      trendColor: 'text-green-500',
      bg: 'bg-orange-50/30'
    },
    {
      id: 4,
      icon: (
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      ),
      value: statsData?.liveStatsTopCity || 'Indore',
      label: 'Top City',
      trend: statsData?.liveStatsTopCityTrend || 'This Week',
      trendColor: 'text-green-500',
      bg: 'bg-green-50/30'
    }
  ];

  return (
    <div className="flex flex-col overflow-hidden relative">
      {/* Left/Right fading gradients for smooth marquee entry/exit */}
      <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-[#EEF7F5] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-[#EEF7F5] to-transparent z-10 pointer-events-none" />

      <div className="flex gap-3 w-max animate-marquee pb-1 px-4 select-none">
        {[...stats, ...stats].map((stat, idx) => (
          <div key={`${stat.id}-${idx}`} className={`flex-shrink-0 w-[125px] rounded-xl ${stat.bg} border border-line p-2.5 shadow-sm flex flex-col justify-between`}>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="scale-75 origin-left -ml-1">
                {stat.icon}
              </div>
              <span className="text-[13px] font-black text-ink">{stat.value}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-faint leading-tight">{stat.label}</span>
              <span className={`text-[8.5px] font-extrabold ${stat.trendColor} mt-0.5 flex items-center gap-0.5`}>
                {stat.trend}
                {stat.trend.includes('%') && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2 h-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveActivitySection;
