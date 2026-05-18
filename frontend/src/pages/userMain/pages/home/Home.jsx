import React from 'react';
import { useNavigate } from 'react-router-dom';
import PromoBanner from './components/PromoBanner';
import CategoriesGrid from './components/CategoriesGrid';
import HotGroupsCarousel from './components/HotGroupsCarousel';
import TrustBadges from './components/TrustBadges';
import NearYouCarousel from './components/NearYouCarousel';

/**
 * High-performance, clean Homepage controller component.
 * Delegates actual view segments to individual optimized component files.
 */
const Home = () => {
  const navigate = useNavigate();

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
      coverImage: 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?auto=format&fit=crop&w=120&q=80',
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
      id: 'more',
      name: 'More',
      coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=120&q=80',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <rect x="4" y="4" width="5" height="5" rx="1.2" />
          <rect x="15" y="4" width="5" height="5" rx="1.2" />
          <rect x="4" y="15" width="5" height="5" rx="1.2" />
          <rect x="15" y="15" width="5" height="5" rx="1.2" />
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

  // Regional buying groups list
  const groupsNearYou = [
    {
      id: 'n-1',
      title: 'South Mumbai Buyers',
      distance: '2.3 km away',
      buyersCount: 124,
      image: 'https://images.unsplash.com/photo-1598463216861-5942cb890214?auto=format&fit=crop&w=260&q=80'
    },
    {
      id: 'n-2',
      title: 'Bandra & Khar Group',
      distance: '3.1 km away',
      buyersCount: 98,
      image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=260&q=80'
    },
    {
      id: 'n-3',
      title: 'Andheri West Group',
      distance: '3.8 km away',
      buyersCount: 86,
      image: 'https://images.unsplash.com/photo-1529250856085-cdd6c31885bc?auto=format&fit=crop&w=260&q=80'
    },
    {
      id: 'n-4',
      title: 'Navi Mumbai Buyers',
      distance: '12 km away',
      buyersCount: 76,
      image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=260&q=80'
    },
    {
      id: 'n-5',
      title: 'Thane Buyers',
      distance: '15 km away',
      buyersCount: 65,
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=260&q=80'
    }
  ];

  return (
    <div className="flex flex-col gap-5 px-4 pb-24 animate-fadeIn select-none">
      
      {/* ── HEADER CONTAINER with gorgeous dark-to-light teal gradient (Optimized Spacing) ── */}
      <div className="flex flex-col gap-2.5 bg-gradient-to-r from-[#0B7A70] to-[#0D9488] px-4 pt-3.5 pb-4 -mx-4 mt-0 rounded-b-[22px] shadow-lg shadow-[#0D9488]/15">
        
        {/* ── 1. LOCATION & PROFILE HEADER ── */}
        <div className="flex items-center justify-between px-0.5">
          <button className="flex items-center gap-0.5 text-white active:scale-95 transition-all flex-shrink-0">
            <svg className="w-2.5 h-2.5 text-teal-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] font-bold tracking-tight text-white/90 whitespace-nowrap truncate max-w-[140px]">Mumbai, Maharashtra</span>
            <svg className="w-2 h-2 text-white/80 flex-shrink-0 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5">
            <button className="w-[35px] h-[35px] bg-white/12 backdrop-blur-md border border-white/15 rounded-lg flex items-center justify-center relative active:scale-90 transition-all text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-3 h-3 bg-danger text-white text-[7.5px] font-black rounded-full flex items-center justify-center border border-white">
                3
              </span>
            </button>
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"
              alt="Profile Avatar"
              className="w-[35px] h-[35px] rounded-full border border-white/20 object-cover shadow-sm active:scale-95 transition-all"
            />
          </div>
        </div>

        {/* ── 2. BRAND LOGO ── */}
        <div className="px-0.5 mt-[-6px] mb-[-2px]">
          <h1 className="text-[21.5px] font-black tracking-tight leading-none flex items-center">
            <span className="text-white">Buy</span>
            <span className="text-teal-200">Together</span>
            <sup className="text-teal-200 text-[10px] font-black ml-0.5 mt-0.5">+</sup>
          </h1>
        </div>

        {/* ── 3. SEARCH & FILTER ── */}
        <div className="flex gap-2.5 w-full px-0.5">
          <div className="relative flex-1 flex items-center">
            <svg className="w-3.5 h-3.5 absolute left-3.5 text-faint pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for a product you want to buy together..."
              className="w-full h-10 bg-white text-[11.5px] font-semibold text-ink placeholder:text-faint/80 rounded-xl pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all border-none"
            />
          </div>
          <button className="w-10 h-10 bg-white text-[#0D9488] rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all flex-shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── 4. AUTO-SLIDING BANNER ── */}
      <PromoBanner onExplore={() => navigate('/groups')} />

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

      {/* ── 6. HOT BUYING GROUPS CAROUSEL ── */}
      <HotGroupsCarousel
        groups={hotGroups}
        onGroupClick={(id) => navigate(`/groups/${id}`)}
        onViewAll={() => navigate('/groups')}
      />

      {/* ── 7. TRUST BADGES ROW ── */}
      <TrustBadges />

      {/* ── 8. GROUPS NEAR YOU CAROUSEL ── */}
      <NearYouCarousel
        groups={groupsNearYou}
        onGroupClick={(id) => navigate(`/groups/g-h1`)}
        onViewAll={() => navigate('/groups')}
      />

    </div>
  );
};

export default Home;
