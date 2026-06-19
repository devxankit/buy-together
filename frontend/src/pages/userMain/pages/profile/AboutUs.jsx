import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentPage } from './useContentPage';

const AboutUs = () => {
  const navigate = useNavigate();
  const { page, loading, error } = useContentPage('about');
  const sections = page?.sections || [];

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#FAFAFA] font-sans">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-surface border-b border-line sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center active:scale-90 transition-all">
          <svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-[15px] font-black text-ink">{page?.title || 'About Us'}</h1>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-5 pb-10">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
        ) : error ? (
          <p className="text-[12px] text-muted text-center py-12">{error}</p>
        ) : (
          <>
            {/* Brand card — identity is fixed; tagline/version come from the page intro */}
            <div className="bg-gradient-to-br from-[#097A6F] to-[#0D9488] rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-surface opacity-5 rounded-full -mr-10 -mt-10 blur-xl" />
              <h2 className="text-[28px] font-black tracking-tight leading-none flex items-center justify-center">
                <span className="text-white">Buy</span>
                <span className="text-teal-200">Together</span>
                <sup className="text-teal-200 text-[14px] font-black ml-0.5">+</sup>
              </h2>
              {page?.intro && <p className="text-[11px] text-white/70 font-medium mt-2 whitespace-pre-line">{page.intro}</p>}
            </div>

            {/* Dynamic content sections (mission, how-it-works steps, contact, …) */}
            {sections.map((sec, idx) => (
              <div key={sec.id || idx} className="bg-surface border border-line rounded-2xl p-4">
                <h3 className="text-[13px] font-black text-ink mb-2 flex items-center gap-2">
                  {sec.icon && <span>{sec.icon}</span>}
                  <span>{sec.title}</span>
                </h3>
                <p className="text-[12px] text-faint leading-relaxed whitespace-pre-line">{sec.body}</p>
              </div>
            ))}

            {page?.contactEmail && (
              <a href={`mailto:${page.contactEmail}`} className="text-center text-[12px] font-bold text-primary">
                {page.contactEmail}
              </a>
            )}
            {sections.length === 0 && <p className="text-[12px] text-muted text-center py-12">No content available yet.</p>}

            <p className="text-center text-[10px] text-muted mt-2">Made with ❤️ in India</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AboutUs;
