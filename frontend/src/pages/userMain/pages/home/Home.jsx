import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useUserMainContext } from '../../context';
import { getHomeSections } from '../../../../services/homeSection.api';
import { swr, swrPeek } from '../../../../services/swr';
import PromoBanner from './components/PromoBanner';
import CategoriesGrid from './components/CategoriesGrid';
import HotGroupsCarousel from './components/HotGroupsCarousel';
import TrustBadges from './components/TrustBadges';
import LiveActivitySection from './components/LiveActivitySection';
import ActiveGroupsList from './components/ActiveGroupsList';
import CreateGroupBanner from './components/CreateGroupBanner';

// Color palette cycled through for the "list" layout avatar backgrounds,
// preserving the original multi-colour look of that section.
const LIST_BG_PALETTE = ['bg-indigo-500', 'bg-orange-500', 'bg-red-500', 'bg-green-500', 'bg-blue-600', 'bg-pink-500', 'bg-blue-400', 'bg-black', 'bg-red-600'];

/**
 * Maps a populated Group document (from the API) onto the card shape the home
 * section components expect — covering both the carousel and list layouts.
 */
const mapGroupToCard = (group, i = 0) => {
  const joined = group.spotsJoined ?? 0;
  const total = group.spotsTotal ?? 0;
  return {
    id: group.id || group._id,
    title: group.title || '',
    subtitle: group.slogan || group.productName || group.location || '',
    image: group.image || '',
    spotsJoined: joined,
    spotsTotal: total,
    joined,
    needed: Math.max(total - joined, 0),
    daysLeft: group.daysLeft || '—',
    seriousCount: Math.floor(joined * 0.35),
    readyCount: Math.floor(joined * 0.18),
    bgColor: LIST_BG_PALETTE[i % LIST_BG_PALETTE.length],
  };
};

/**
 * Premium wholesale ad banner — interleaved between the curated sections to
 * preserve the original home-page rhythm.
 */
const WholesaleAdBanner = ({ onClick }) => (
  <div
    onClick={onClick}
    className="relative overflow-hidden bg-gradient-to-br from-[var(--ad-gradient-from)] via-[var(--ad-gradient-via)] to-[var(--ad-gradient-to)] rounded-[24px] p-4.5 shadow-md shadow-primary/10 border border-primary/20 flex flex-col justify-between min-h-[125px] cursor-pointer hover:shadow-lg transition-all duration-300 group active:scale-[0.99] select-none my-1"
  >
    {/* Modern glowing glassmorphism gradients */}
    <div className="absolute -top-10 -right-10 w-28 h-28 bg-surface/10 rounded-full blur-2xl group-hover:bg-surface/15 transition-all"></div>
    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>

    {/* Upper Banner Section */}
    <div className="relative z-10 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 bg-surface/12 backdrop-blur-md border border-surface/15 rounded-full px-2.5 py-0.5 w-fit">
        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
        <span className="text-[9px] font-black tracking-widest text-white/95 uppercase">Save Big Together</span>
      </div>

      <h2 className="text-[16px] font-black tracking-tight text-white leading-tight mt-0.5">
        Unlock Direct Wholesale Pricing
      </h2>

      <p className="text-[10.5px] font-bold text-white/85 leading-snug max-w-[95%]">
        Start a custom group buying pool, share with friends, and unlock massive manufacturing price cuts.
      </p>
    </div>

    {/* Lower Banner Section */}
    <div className="relative z-10 flex items-center justify-between mt-3 pt-2 border-t border-surface/10">
      <div className="flex items-baseline gap-1">
        <span className="text-[9.5px] font-semibold text-white/70">Discounts up to</span>
        <span className="text-[15px] font-black text-white leading-none">40% OFF</span>
      </div>

      <div className="bg-surface text-primary border border-line font-black text-[11px] px-4 py-2 rounded-xl shadow-sm group-hover:bg-surface-alt group-hover:scale-[1.03] transition-all flex items-center gap-1">
        <span>Start a Pool</span>
        <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
);

/**
 * Skeleton shown while the home sections load for the first time (no cache yet).
 * Mirrors the rough shape of a section heading + a row of group cards, so the
 * layout doesn't jump when the real content arrives.
 */
const HomeSectionsSkeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse" aria-hidden="true">
    {[0, 1].map((row) => (
      <div key={row} className="flex flex-col gap-3">
        {/* Heading + "view all" */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-36 bg-line/40 rounded-md" />
          <div className="h-3 w-14 bg-line/30 rounded-md" />
        </div>
        {/* Horizontal card row */}
        <div className="flex gap-3 overflow-hidden">
          {[0, 1, 2].map((card) => (
            <div key={card} className="flex-shrink-0 w-[150px] rounded-2xl bg-line/20 border border-line/20 p-3 flex flex-col gap-2.5">
              <div className="h-20 w-full bg-line/40 rounded-xl" />
              <div className="h-3 w-3/4 bg-line/40 rounded-md" />
              <div className="h-2.5 w-1/2 bg-line/30 rounded-md" />
              <div className="h-2 w-full bg-line/30 rounded-full mt-1" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

/**
 * High-performance, clean Homepage controller component.
 * Delegates actual view segments to individual optimized component files.
 */
const Home = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user) || {};

  // Search Placeholder Animation State
  const placeholders = [
    "Search 'iPhone 15 Pro'...",
    "Search 'Macbook Air M3'...",
    "Search 'Groceries'...",
    "Search 'Gym memberships'...",
    "Search 'Puma Shoes'..."
  ];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx(prev => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [placeholders.length]);

  // Shared Location Selection Context. The unread-message count is already
  // hydrated (and kept live via socket) by UserMainContext on mount, so Home
  // just reads it — no extra /chat/conversations fetch here.
  const { selectedCity, setIsLocationPickerOpen, notificationCount, unreadMessageCount, categories } = useUserMainContext();


  // ── Dynamic, admin-curated home sections ──────────────────────────
  // Sections (heading + chosen groups + layout) are managed from the admin
  // console (Home Sections page) and fetched live here.
  // Seed from cache so revisits paint instantly; `sectionsLoaded` lets us show a
  // skeleton on the first-ever load instead of flashing the empty-state blocks.
  const cachedSections = swrPeek('home-sections');
  const [sections, setSections] = useState(cachedSections || []);
  const [sectionsLoaded, setSectionsLoaded] = useState(cachedSections !== undefined);

  useEffect(() => {
    let active = true;
    // Stale-while-revalidate: render cached sections instantly, refresh silently.
    swr(
      'home-sections',
      async () => {
        const { data } = await getHomeSections();
        return Array.isArray(data) ? data : [];
      },
      { onData: (data) => { if (active) { setSections(data); setSectionsLoaded(true); } } }
    ).catch((err) => {
      console.warn('Failed to load home sections:', err);
      if (active) setSectionsLoaded(true);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="flex flex-col gap-5 pb-24 animate-fadeIn select-none bg-gradient-to-b from-[var(--home-gradient-from)] via-[var(--home-gradient-via)] to-[var(--home-gradient-to)] px-4 pt-0">
      
      {/* ── HEADER CONTAINER with gorgeous dark-to-light gradient (Optimized Spacing) ── */}
      <div className="flex flex-col gap-2.5 bg-gradient-to-r from-[var(--header-gradient-from)] to-[var(--header-gradient-to)] px-4 pt-5 pb-4 -mx-4 mt-0 rounded-b-[22px] shadow-lg shadow-primary/15">
        
        {/* ── 1. LOCATION & PROFILE HEADER ── */}
        <div className="flex items-center justify-between px-0.5">
          {/* Location trigger */}
          <div className="relative">
            <button
              onClick={() => setIsLocationPickerOpen(true)}
              className="flex items-center gap-0.5 text-white active:scale-95 transition-all flex-shrink-0"
            >
              <svg className="w-2.5 h-2.5 text-primary-soft flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] font-bold tracking-tight text-white/90 whitespace-nowrap truncate max-w-[130px]">{selectedCity.split(',')[0]}</span>
              <svg className="w-2.5 h-2.5 text-white/80 flex-shrink-0 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate('/messages')} className="w-[35px] h-[35px] bg-surface/12 backdrop-blur-md border border-surface/15 rounded-lg flex items-center justify-center relative active:scale-90 transition-all text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              {unreadMessageCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] px-0.5 bg-[#EF4444] text-white text-[8.5px] font-black rounded-full flex items-center justify-center border-1.5 border-[#0D9488] shadow-sm">
                  {unreadMessageCount}
                </span>
              )}
            </button>
            <button onClick={() => navigate('/notifications')} className="w-[35px] h-[35px] bg-surface/12 backdrop-blur-md border border-surface/15 rounded-lg flex items-center justify-center relative active:scale-90 transition-all text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] px-0.5 bg-[#EF4444] text-white text-[8.5px] font-black rounded-full flex items-center justify-center border-1.5 border-[#0D9488] shadow-sm animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>
            <img
              src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=random&color=fff`}
              alt="Profile Avatar"
              onClick={() => navigate('/profile')}
              className="w-[35px] h-[35px] rounded-full border border-surface/20 object-cover shadow-sm active:scale-95 transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* ── 2. BRAND LOGO ── */}
        <div className="px-0.5 mt-[-6px] mb-[-2px]">
          <h1 className="text-[21.5px] font-black tracking-tight leading-none flex items-center">
            <span className="text-white">Buy</span>
            <span className="text-primary-soft">Together</span>
            <sup className="text-primary-soft text-[10px] font-black ml-0.5 mt-0.5">+</sup>
          </h1>
        </div>

        {/* ── 3. SEARCH & FILTER ── */}
        <div className="flex gap-2.5 w-full px-0.5">
          <div className="relative flex-1 flex items-center bg-surface border border-line rounded-xl overflow-hidden h-10 shadow-inner cursor-text">
            <svg className="w-3.5 h-3.5 absolute left-3.5 text-faint z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchVal.trim()) {
                  navigate('/categories', { state: { searchQuery: searchVal } });
                }
              }}
              className="w-full h-full relative"
            >
              <input
                type="text"
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  if (e.target.value) e.target.parentElement.parentElement.classList.add('has-value');
                  else e.target.parentElement.parentElement.classList.remove('has-value');
                }}
                onFocus={(e) => e.target.parentElement.parentElement.classList.add('focused')}
                onBlur={(e) => {
                  if (!e.target.value) e.target.parentElement.parentElement.classList.remove('focused');
                }}
                className="w-full h-full text-[11.5px] font-semibold text-ink pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-soft transition-all border-none relative z-10 bg-transparent"
              />
            </form>
            {/* Animated Placeholder Wrapper */}
            <div className="absolute inset-0 pl-10 pr-3 flex flex-col justify-center pointer-events-none transition-opacity duration-200 [.focused_&]:opacity-0 [.has-value_&]:opacity-0">
              <div className="relative h-[16px] overflow-hidden">
                {placeholders.map((text, i) => (
                  <span
                    key={i}
                    className="absolute left-0 w-full text-[11.5px] font-semibold text-faint/80 truncate transition-all duration-500 ease-in-out"
                    style={{
                      top: 0,
                      transform: `translateY(${(i - placeholderIdx) * 100}%)`,
                      opacity: i === placeholderIdx ? 1 : 0
                    }}
                  >
                    {text}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── 4. AUTO-SLIDING BANNER ── */}
      <div className="-mt-1">
        <PromoBanner onExplore={() => navigate('/groups')} />
      </div>

      {/* ── 5. POPULAR CATEGORIES GRID ── */}
      <CategoriesGrid
        categories={categories}
        onCategoryClick={(id) => {
          navigate('/categories', { state: { categoryId: id } });
        }}
        onViewAll={() => navigate('/all-categories')}
      />

      {/* ── 5b. JOIN / CREATE GROUP ACTION BOX ── */}
      <div className="bg-gradient-to-r from-[#0D4F4A] to-[#0a3d39] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg shadow-teal-900/20 -mt-1">
        <div className="flex-1 flex flex-col gap-0.5">
          <p className="text-[11px] font-black text-white leading-tight">Start Saving Together</p>
          <p className="text-[9px] text-white/60 font-medium leading-tight">Join or create a buying group</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {/* Join Group */}
          <button
            onClick={() => navigate('/categories')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/15 rounded-xl active:scale-95 transition-all"
          >
            <svg className="w-3.5 h-3.5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10.5px] font-black text-white whitespace-nowrap">Join Group</span>
          </button>
          {/* Create Group */}
          <button
            onClick={() => navigate('/groups/create')}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary rounded-xl active:scale-95 transition-all shadow-md shadow-primary/30"
          >
            <svg className="w-3.5 h-3.5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-[10.5px] font-black text-white whitespace-nowrap">Create Group</span>
          </button>
        </div>
      </div>

      {/* ── 6+. ADMIN-CURATED HOME SECTIONS ──
          Each section's heading, layout, and groups are managed from the admin
          console. Decorative blocks are interleaved at the original positions
          to preserve the home-page rhythm. */}
      {!sectionsLoaded && sections.length === 0 ? (
        // First-ever load with no cache: show skeletons, not the empty-state blocks.
        <HomeSectionsSkeleton />
      ) : sections.length === 0 ? (
        <>
          <CreateGroupBanner />
          <WholesaleAdBanner onClick={() => navigate('/groups/create')} />
        </>
      ) : (
        sections.map((section, idx) => {
          const cards = (section.groups || []).map(mapGroupToCard);
          const viewAll = () =>
            section.viewAllLink ? navigate(section.viewAllLink) : navigate('/groups');
          const openGroup = (id) =>
            navigate(`/groups/${id}/chat`, {
              state: { group: cards.find((g) => g.id === id), isJoined: false },
            });

          return (
            <React.Fragment key={section.id}>
              {section.layout === 'list' ? (
                <ActiveGroupsList
                  title={section.title}
                  groups={cards}
                  onViewAll={viewAll}
                />
              ) : (
                <HotGroupsCarousel
                  title={section.title}
                  groups={cards}
                  onGroupClick={openGroup}
                  onViewAll={viewAll}
                />
              )}

              {/* Interleaved decorative blocks (original layout positions) */}

              {idx === 1 && <CreateGroupBanner />}
              {idx === 4 && <WholesaleAdBanner onClick={() => navigate('/groups/create')} />}
            </React.Fragment>
          );
        })
      )}

      {/* ── LIVE ACTIVITY MARQUEE (moved to bottom) ── */}
      <LiveActivitySection />

      {/* ── 15. PREMIUM MADE IN INDIA FOOTER ── */}
      <div className="mt-6 mb-6 flex flex-col items-center justify-center gap-3 text-center">
        <div className="text-[22px] font-black italic tracking-tight text-muted/50 select-none">
          #Buy<span className="text-primary/70">Together</span>
        </div>
        <div className="flex items-center gap-4 text-[10.5px] font-bold text-muted/80">
          <div className="flex items-center gap-1">
            <span>🇮🇳</span>
            <span>Made for India</span>
          </div>
          <span className="w-1.5 h-1.5 bg-line rounded-full"></span>
          <div className="flex items-center gap-1">
            <span>❤️</span>
            <span>Crafted with Love</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
