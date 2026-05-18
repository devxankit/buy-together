import React from 'react';
import { Card } from '../../../components';

/**
 * Modular component for trust factors (Secure, verified buyers, bulk rates) bar.
 */
const TrustBadges = () => {
  return (
    <Card padding="p-3.5" className="bg-[#EAEFF4]/30 border-none rounded-2xl mt-1">
      <div className="grid grid-cols-3 gap-3">
        
        {/* Bigger group */}
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-info-soft flex items-center justify-center text-info">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[9.5px] font-black text-ink">Bigger the group</span>
            <span className="text-[8px] font-bold text-muted mt-0.5">Better the discount</span>
          </div>
        </div>

        {/* 100% Secure */}
        <div className="flex flex-col items-center text-center gap-1.5 border-x border-line/45">
          <div className="w-8 h-8 rounded-full bg-info-soft flex items-center justify-center text-info">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[9.5px] font-black text-ink">100% Secure</span>
            <span className="text-[8px] font-bold text-muted mt-0.5">Safe payments</span>
          </div>
        </div>

        {/* Verified Members */}
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-info-soft flex items-center justify-center text-info">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[9.5px] font-black text-ink">Verified Members</span>
            <span className="text-[8px] font-bold text-muted mt-0.5">Real buyers only</span>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default TrustBadges;
