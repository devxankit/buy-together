import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserMainContext } from '../../context';
import newAssetImg from '../../../../assets/7f4a33ac63a8121e371d2b2d1473ae55.jpg';
import PromoBanner from './components/PromoBanner';
import CategoriesGrid from './components/CategoriesGrid';
import HotGroupsCarousel from './components/HotGroupsCarousel';
import TrustBadges from './components/TrustBadges';
import LiveActivitySection from './components/LiveActivitySection';
import ActiveGroupsList from './components/ActiveGroupsList';
import CreateGroupBanner from './components/CreateGroupBanner';

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
  const { selectedCity, setIsLocationPickerOpen, notificationCount } = useUserMainContext();

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


  // Hot buying groups list
  const hotGroups = [
    {
      id: 'g-h1',
      title: 'iPhone 15 Pro',
      subtitle: 'Get up to ₹8,000 OFF',
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=180&q=80',
      spotsJoined: 28,
      spotsTotal: 50,
      daysLeft: '2d left'
    },
    {
      id: 'g-h2',
      title: 'MacBook Air M3',
      subtitle: 'Save up to ₹12,000',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=180&q=80',
      spotsJoined: 16,
      spotsTotal: 30,
      daysLeft: '3d left'
    },
    {
      id: 'g-h3',
      title: 'LG 55" 4K TV',
      subtitle: 'Save up to ₹6,500',
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=180&q=80',
      spotsJoined: 34,
      spotsTotal: 60,
      daysLeft: '4d left'
    },
    {
      id: 'g-h4',
      title: 'Samsung Washer',
      subtitle: 'Save up to ₹5,500',
      image: 'https://images.unsplash.com/photo-1610557892470-76d74cd120a8?auto=format&fit=crop&w=180&q=80',
      spotsJoined: 18,
      spotsTotal: 40,
      daysLeft: '2d left'
    }
  ];



  const fashionGroups = [
    {
      id: 5,
      title: 'Puma Running Shoes',
      subtitle: 'Puma Factory Outlet',
      spotsJoined: 15,
      spotsTotal: 20,
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=200&q=80',
      daysLeft: '3d left'
    },
    {
      id: 6,
      title: 'H&M Summer Collection',
      subtitle: 'H&M Infinity Mall',
      spotsJoined: 40,
      spotsTotal: 50,
      image: 'https://images.unsplash.com/photo-1489987707023-af827052efa1?auto=format&fit=crop&w=200&q=80',
      daysLeft: '1d left'
    },
    {
      id: 7,
      title: 'Levi\'s Denim Jackets',
      subtitle: 'Levi\'s Phoenix Market',
      spotsJoined: 8,
      spotsTotal: 15,
      image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=200&q=80',
      daysLeft: '4h left'
    }
  ];

  const groceriesGroups = [
    {
      id: 8,
      title: 'Aashirvaad Atta 10kg',
      subtitle: 'DMart Malad',
      spotsJoined: 85,
      spotsTotal: 100,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80',
      daysLeft: '5d left'
    },
    {
      id: 9,
      title: 'Fresh Alphonso Mangoes',
      subtitle: 'APMC Market',
      spotsJoined: 42,
      spotsTotal: 50,
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=200&q=80',
      daysLeft: '12h left'
    },
    {
      id: 10,
      title: 'Amul Butter 500g',
      subtitle: 'Star Bazaar',
      spotsJoined: 120,
      spotsTotal: 150,
      image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=200&q=80',
      daysLeft: '2d left'
    }
  ];

  const propertyGroups = [
    {
      id: 'prop-1',
      title: 'Fractional Beach Villa',
      subtitle: 'Goa co-buy: 10% Share',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80',
      spotsJoined: 4,
      spotsTotal: 10,
      daysLeft: '15d left'
    },
    {
      id: 'prop-2',
      title: 'Commercial Office Space',
      subtitle: 'Bengaluru Tech Park',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80',
      spotsJoined: 7,
      spotsTotal: 15,
      daysLeft: '8d left'
    },
    {
      id: 'prop-3',
      title: 'Premium Co-Living Hub',
      subtitle: 'Mumbai Rent & Deposit Split',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=200&q=80',
      spotsJoined: 3,
      spotsTotal: 4,
      daysLeft: '2d left'
    }
  ];

  const vehicleGroups = [
    {
      id: 'veh-1',
      title: 'Tesla Model Y Lease',
      subtitle: 'Pune premium co-lease pool',
      image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=200&q=80',
      spotsJoined: 2,
      spotsTotal: 5,
      daysLeft: '12d left'
    },
    {
      id: 'veh-2',
      title: 'Ather 450X EV Scooter',
      subtitle: 'Bulk discount of ₹15,000',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=200&q=80',
      spotsJoined: 12,
      spotsTotal: 20,
      daysLeft: '4d left'
    },
    {
      id: 'veh-3',
      title: 'Thar Roxx Offroader',
      subtitle: 'Indore club bulk deal',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=200&q=80',
      spotsJoined: 18,
      spotsTotal: 25,
      daysLeft: '6d left'
    }
  ];

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
              <span className="absolute top-1 right-1 w-3 h-3 bg-danger text-white text-[7.5px] font-black rounded-full flex items-center justify-center border border-surface">
                2
              </span>
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
          <button 
            onClick={() => navigate('/categories')} 
            className="w-10 h-10 bg-surface border border-line text-primary rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
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

      {/* ── 6. HOT BUYING GROUPS CAROUSEL ── */}
      <HotGroupsCarousel
        groups={hotGroups}
        onGroupClick={(id) => navigate(`/groups/${id}/chat`, { state: { group: hotGroups.find(g => g.id === id), isJoined: false } })}
        onViewAll={() => navigate('/groups')}
      />

      {/* ── 8. LIVE ACTIVITY ── */}
      <LiveActivitySection />

      {/* ── 9. ACTIVE GROUPS YOU MIGHT LIKE ── */}
      <ActiveGroupsList />

      {/* ── 14. CREATE GROUP BANNER (Shifted here as requested) ── */}
      <CreateGroupBanner />

      {/* ── 10. TRENDING IN FASHION ── */}
      <HotGroupsCarousel
        title="Trending in Fashion"
        groups={fashionGroups}
        onGroupClick={(id) => navigate(`/groups/${id}/chat`, { state: { group: fashionGroups.find(g => g.id === id), isJoined: false } })}
        onViewAll={() => navigate('/categories', { state: { categoryId: 'fashion' } })}
      />

      {/* ── 11. WEEKLY GROCERIES DEALS ── */}
      <HotGroupsCarousel
        title="Weekly Groceries Deals"
        groups={groceriesGroups}
        onGroupClick={(id) => navigate(`/groups/${id}/chat`, { state: { group: groceriesGroups.find(g => g.id === id), isJoined: false } })}
        onViewAll={() => navigate('/categories', { state: { categoryId: 'groceries' } })}
      />

      {/* ── 12. CO-OWN REAL ESTATE & PROPERTIES ── */}
      <HotGroupsCarousel
        title="Co-Own Properties & Spaces"
        groups={propertyGroups}
        onGroupClick={(id) => navigate(`/groups/${id}/chat`, { state: { group: propertyGroups.find(g => g.id === id), isJoined: false } })}
        onViewAll={() => navigate('/categories', { state: { categoryId: 'properties' } })}
      />

      {/* ── PREMIUM CO-BUYING AD BANNER (COMPACT & MODERN REDESIGN) ── */}
      <div 
        onClick={() => navigate('/groups/create')}
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

      {/* ── 13. VEHICLE CO-LEASING & BULK BUYS ── */}
      <HotGroupsCarousel
        title="Vehicle Co-Leasing & EV Pools"
        groups={vehicleGroups}
        onGroupClick={(id) => navigate(`/groups/${id}/chat`, { state: { group: vehicleGroups.find(g => g.id === id), isJoined: false } })}
        onViewAll={() => navigate('/categories', { state: { categoryId: 'cars-bikes' } })}
      />

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
