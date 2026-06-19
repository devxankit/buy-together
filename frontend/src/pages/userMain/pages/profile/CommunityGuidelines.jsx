import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentPage } from './useContentPage';

const CommunityGuidelines = () => {
  const navigate = useNavigate();
  const { page, loading, error } = useContentPage('community-guidelines');
  const rules = page?.sections || [];

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-surface border-b border-line sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center active:scale-90 transition-all">
          <svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[15px] font-black text-ink">{page?.title || 'Community Guidelines'}</h1>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-3 pb-10">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
        ) : error ? (
          <p className="text-[12px] text-muted text-center py-12">{error}</p>
        ) : (
          <>
            {page?.intro && (
              <div className="bg-gradient-to-r from-[#097A6F] to-[#0D9488] rounded-2xl p-4 shadow-md">
                <h2 className="text-[15px] font-black text-white mb-1">Our Community Standards</h2>
                <p className="text-[11px] text-white/80 leading-snug">{page.intro}</p>
              </div>
            )}

            {rules.map((rule, idx) => (
              <div key={rule.id || idx} className="bg-surface border border-line rounded-2xl p-4 flex gap-3">
                {rule.icon && <span className="text-xl flex-shrink-0">{rule.icon}</span>}
                <div>
                  <h3 className="text-[13px] font-black text-ink mb-1">{rule.title}</h3>
                  <p className="text-[11px] text-faint leading-relaxed whitespace-pre-line">{rule.body}</p>
                </div>
              </div>
            ))}
            {rules.length === 0 && <p className="text-[12px] text-muted text-center py-12">No content available yet.</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default CommunityGuidelines;
