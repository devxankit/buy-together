import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentPage } from './useContentPage';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { page, loading, error } = useContentPage('privacy');
  const sections = page?.sections || [];

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-surface border-b border-line sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center active:scale-90 transition-all">
          <svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[15px] font-black text-ink">{page?.title || 'Privacy Policy'}</h1>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-4 pb-10">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
        ) : error ? (
          <p className="text-[12px] text-muted text-center py-12">{error}</p>
        ) : (
          <>
            {page?.intro && (
              <div className="bg-primary-soft border border-teal-100 rounded-2xl p-4 flex gap-3">
                <span className="text-xl">🔒</span>
                <p className="text-[11px] text-teal-700 leading-snug">{page.intro}</p>
              </div>
            )}
            {page?.lastUpdated && <p className="text-[11px] text-muted font-medium">Last updated: {page.lastUpdated}</p>}
            {sections.map((sec, idx) => (
              <div key={sec.id || idx} className="bg-surface border border-line rounded-2xl p-4">
                <h3 className="text-[13px] font-black text-ink mb-2">{sec.title}</h3>
                <p className="text-[12px] text-faint leading-relaxed whitespace-pre-line">{sec.body}</p>
              </div>
            ))}
            {sections.length === 0 && <p className="text-[12px] text-muted text-center py-12">No content available yet.</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
