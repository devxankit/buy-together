import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserMainContext } from '../../context';
import newAssetImg from '../../../../assets/7f4a33ac63a8121e371d2b2d1473ae55.jpg';
import { getHomeSections } from '../../../../services/homeSection.api';
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
 * High-performance, clean Homepage controller component.
 * Delegates actual view segments to individual optimized component files.
 */
const Home = () => {
  const navigate = useNavigate();

  // Search Placeholder Animation State
  const placeholders = [
    "Search 'iPhone 15 Pro'...",
    "Search 'Macbook Air M3'...",
    "Search 'Groceries'...",
    "Search 'Gym memberships'...",
    "Search 'Puma Shoes'..."
  ];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx(prev => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [placeholders.length]);

  // Shared Location Selection Context
  const { selectedCity, setIsLocationPickerOpen, notificationCount, unreadMessageCount, refreshUnreadMessageCount } = useUserMainContext();

  useEffect(() => {
    refreshUnreadMessageCount();
  }, [refreshUnreadMessageCount]);

  // Popular category configurations (exactly 7 categories for single-row layout)
  const categories = [
    {
      id: 'smartphones',
      name: 'Smartphones',
      coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=120&q=80',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <rect x="6" y="3" width="12" height="18" rx="3" />
          <path d="M12 17.5h.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 'laptops',
      name: 'Laptops',
      coverImage: newAssetImg,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <rect x="3" y="5" width="18" height="11" rx="1.5" />
          <path d="M2 19h20M9 16h6" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'appliances',
      name: 'Appliances',
      coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=120&q=80',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <rect x="6" y="3" width="12" height="18" rx="2" />
          <line x1="6" y1="7.5" x2="18" y2="7.5" />
          <circle cx="12" cy="13.5" r="3" />
          <circle cx="9" cy="5" r="0.5" fill="currentColor" />
          <circle cx="11.5" cy="5" r="0.5" fill="currentColor" />
        </svg>
      )
    },
    {
      id: 'electronics',
      name: 'Electronics',
      coverImage: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=120&q=80',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      )
    },
    {
      id: 'furniture',
      name: 'Furniture',
      coverImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=120&q=80',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <path d="M4 10v7a2 2 0 002 2h12a2 2 0 002-2v-7M3 13h18M6 10V6a2 2 0 012-2h8a2 2 0 012 2v4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 'fashion',
      name: 'Fashion',
      coverImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=120&q=80',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 'groceries',
      name: 'Groceries',
      coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      )
    },
    {
      id: 'properties',
      name: 'Property',
      coverImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=120&q=80',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    }
  ];


  // ── Dynamic, admin-curated home sections ──────────────────────────
  // Sections (heading + chosen groups + layout) are managed from the admin
  // console (Home Sections page) and fetched live here.
  const [sections, setSections] = useState([]);

  useEffect(() => {
    let active = true;
    const fetchSections = async () => {
      try {
        const { data } = await getHomeSections();
        if (active && Array.isArray(data)) setSections(data);
      } catch (err) {
        console.warn('Failed to load home sections:', err);
      }
    };
    fetchSections();
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
                <span className="absolute top-1 right-1 w-3 h-3 bg-danger text-white text-[7.5px] font-black rounded-full flex items-center justify-center border border-surface">
                  {unreadMessageCount}
                </span>
              )}
            </button>
            <button onClick={() => navigate('/notifications')} className="w-[35px] h-[35px] bg-surface/12 backdrop-blur-md border border-surface/15 rounded-lg flex items-center justify-center relative active:scale-90 transition-all text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-danger text-white text-[7.5px] font-black rounded-full flex items-center justify-center border border-surface animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"
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
            <input
              type="text"
              className="w-full h-full text-[11.5px] font-semibold text-ink pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary-soft transition-all border-none relative z-10 bg-transparent"
              onFocus={(e) => e.target.parentElement.classList.add('focused')}
              onBlur={(e) => {
                if (!e.target.value) e.target.parentElement.classList.remove('focused');
              }}
              onChange={(e) => {
                if (e.target.value) e.target.parentElement.classList.add('has-value');
                else e.target.parentElement.classList.remove('has-value');
              }}
            />
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
          let targetId = id;
          if (id === 'furniture') targetId = 'home-living';
          if (id === 'groceries') targetId = 'appliances';
          if (id === 'more') targetId = 'smartphones';
          navigate('/categories', { state: { categoryId: targetId } });
        }}
        onViewAll={() => navigate('/categories')}
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
      {sections.length === 0 ? (
        <>
          <LiveActivitySection />
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
              {idx === 0 && <LiveActivitySection />}
              {idx === 1 && <CreateGroupBanner />}
              {idx === 4 && <WholesaleAdBanner onClick={() => navigate('/groups/create')} />}
            </React.Fragment>
          );
        })
      )}

      {/* ── 15. PREMIUM MADE IN INDIA FOOTER ── */}
      <div className="mt-12 mb-6 flex flex-col items-center justify-center gap-3 text-center">
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
