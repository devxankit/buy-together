import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Import newly updated modular sub-components
import CategoryHeader from './components/CategoryHeader';
import MyCategoriesCarousel from './components/MyCategoriesCarousel';
import SortTabs from './components/SortTabs';
import CategoryProductsList from './components/CategoryProductsList';
import BottomCTA from './components/BottomCTA';

/**
 * Premium mobile-first dynamic Categories Dashboard.
 * Rebuilt from scratch to match the exact visual layout of the user's mockup image,
 * strictly adapting to our project's teal branding color scheme (#0D9488).
 */
const Categories = () => {
  const location = useLocation();

  // 1. STATE MANAGEMENT
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationName, setLocationName] = useState('Indore');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync category state when location.state changes (from Home page navigation)
  useEffect(() => {
    if (location.state?.categoryId) {
      setSelectedCategory(location.state.categoryId);
    }
  }, [location.state]);

  // 2. COMPREHENSIVE DATASETS FOR POPULAR CATEGORIES (as per mockup image)
  const productsData = {
    'cars-bikes': [
      {
        id: 'car-g1',
        title: 'Thar ROXX Deal',
        status: 'active',
        brand: 'Mahindra',
        location: 'Indore, MP',
        slogan: 'Best possible deal on Thar ROXX in Indore.',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=260&q=80',
        spotsJoined: 324,
        spotsTotal: 500,
        creatorName: 'Rohit Sharma',
        creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
        hashtags: ['#Thar', '#SUV', '#Indore'],
        badgeType: 'hot',
        badgeLabel: 'HOT',
        daysLeft: '176 more needed'
      }
    ],
    smartphones: [
      {
        id: 'phone-g1',
        title: 'iPhone 16 Under ₹60K',
        status: 'active',
        brand: 'Apple',
        location: 'Indore, MP',
        slogan: "Let's get the best price on iPhone 16.",
        image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=260&q=80',
        spotsJoined: 612,
        spotsTotal: 1000,
        creatorName: 'Neha Joshi',
        creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
        hashtags: ['#iPhone16', '#Apple', '#Deal'],
        badgeType: 'hot',
        badgeLabel: 'HOT',
        daysLeft: '388 more needed'
      }
    ],
    travel: [
      {
        id: 'travel-g1',
        title: 'Goa Trip - June Plan',
        status: 'active',
        brand: 'IndoreTravel',
        location: 'Indore, MP',
        slogan: "Planning a trip to Goa in June. Let's go!",
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=260&q=80',
        spotsJoined: 281,
        spotsTotal: 350,
        creatorName: 'Aman Verma',
        creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
        hashtags: ['#Goa', '#Travel', '#Trip'],
        badgeType: 'rising',
        badgeLabel: 'RISING',
        daysLeft: '69 more needed'
      }
    ],
    'home-living': [
      {
        id: 'gym-g1',
        title: 'Gym Membership Indore',
        status: 'active',
        brand: 'GoldGym',
        location: 'Indore, MP',
        slogan: 'Find the best & affordable gym in Indore.',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=260&q=80',
        spotsJoined: 119,
        spotsTotal: 200,
        creatorName: 'Kunal Singh',
        creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
        hashtags: ['#Gym', '#Fitness', '#Indore'],
        badgeType: 'new',
        badgeLabel: 'NEW',
        daysLeft: '81 more needed'
      }
    ],
    electronics: [
      {
        id: 'elect-g1',
        title: 'PS5 Slim India Group',
        status: 'active',
        brand: 'Sony',
        location: 'Indore, MP',
        slogan: 'Looking for PS5 Slim at best price in India.',
        image: 'https://images.unsplash.com/photo-1606813907291-d86edd9b94db?auto=format&fit=crop&w=260&q=80',
        spotsJoined: 158,
        spotsTotal: 300,
        creatorName: 'Siddharth Yadav',
        creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80',
        hashtags: ['#PS5', '#Gaming', '#PlayStation'],
        badgeType: 'rising',
        badgeLabel: 'RISING',
        daysLeft: '142 more needed'
      },
      {
        id: 'elect-g2',
        title: 'Sony WH-1000XM5 Deal',
        status: 'active',
        brand: 'Sony',
        location: 'Delhi, DL',
        slogan: 'Secure minimum pricing on trending active noise cancellation WH-1000XM5 headsets.',
        image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=260&q=80',
        spotsJoined: 281,
        spotsTotal: 350,
        creatorName: 'Aman Verma',
        creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
        hashtags: ['#Sony', '#ANC', '#Audio'],
        badgeType: 'new',
        badgeLabel: 'NEW',
        daysLeft: '69 more needed'
      }
    ],
    appliances: [
      {
        id: 'appliance-g1',
        title: 'Samsung Washer Deal',
        status: 'active',
        brand: 'Samsung',
        location: 'Indore, MP',
        slogan: "Let's buy Samsung Washer in bulk and save up to ₹5,000.",
        image: 'https://images.unsplash.com/photo-1610557892470-76d74cd120a8?auto=format&fit=crop&w=260&q=80',
        spotsJoined: 158,
        spotsTotal: 300,
        creatorName: 'Siddharth Yadav',
        creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80',
        hashtags: ['#Samsung', '#HomeHub', '#Indore'],
        badgeType: 'rising',
        badgeLabel: 'RISING',
        daysLeft: '142 more needed'
      }
    ]
  };

  // Combine products for "All" filter selection
  const allProductsList = useMemo(() => {
    return Object.values(productsData).flat();
  }, []);

  // 3. OPTIMIZED SEARCH & TABS FILTER ENGINE
  const filteredProducts = useMemo(() => {
    let list = selectedCategory === 'all' || selectedCategory === 'more'
      ? allProductsList 
      : productsData[selectedCategory] || [];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.slogan.toLowerCase().includes(q) ||
        p.hashtags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Sort tabs filter
    if (activeSort === 'trending') {
      // Sort by members count descending
      return [...list].sort((a, b) => b.spotsJoined - a.spotsJoined);
    } else if (activeSort === 'nearby') {
      // Show only Indore, MP deals
      return list.filter(p => p.location.includes('Indore'));
    } else if (activeSort === 'new') {
      // Filter by 'new' or 'rising' badge
      return list.filter(p => p.badgeType === 'new' || p.badgeType === 'rising');
    } else if (activeSort === 'my-groups') {
      // Mock user groups (e.g. CreatorName "Rohit Sharma" or "Neha Joshi" representing items user is part of)
      return list.filter(p => p.spotsJoined > 300);
    }

    return list;
  }, [selectedCategory, activeSort, searchQuery, allProductsList]);

  return (
    <div className="flex flex-col gap-4 select-none min-h-screen bg-white relative overflow-hidden">
      {/* 1. Header with custom dynamic title & search */}
      <CategoryHeader
        title="Groups"
        currentLocation={locationName}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => setIsFilterOpen(true)}
      />

      {/* Dynamic Content Body Container */}
      <div className="flex flex-col gap-4 px-4 pb-24">
        
        {/* 2. Horizontal categories list */}
        <MyCategoriesCarousel
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
          onViewAll={() => setSelectedCategory('all')}
        />

        {/* 3. Sort options pills switcher */}
        <SortTabs
          activeTab={activeSort}
          onChange={setActiveSort}
        />

        {/* 4. Active category grid view */}
        {filteredProducts.length > 0 ? (
          <CategoryProductsList products={filteredProducts} />
        ) : (
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-[22px] p-10 text-center text-slate-400 text-xs font-semibold shadow-sm my-2">
            No active group deals found under this filter. Create one below!
          </div>
        )}

        {/* 5. Bottom banner group creator */}
        <BottomCTA />
      </div>

      {/* 6. Filter Bottom Sheet Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFilterOpen(false)}
          />
          {/* Slider Panel */}
          <div className="relative bg-white w-full rounded-t-[30px] p-6 shadow-2xl animate-[slideUp_0.3s_ease-out]">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-ink">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3">Price Range</h3>
                <div className="flex items-center gap-3">
                  <input type="text" placeholder="Min" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:border-teal-500 focus:outline-none" />
                  <span className="text-slate-400 font-bold">-</span>
                  <input type="text" placeholder="Max" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:border-teal-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3">Distance</h3>
                <input type="range" min="1" max="50" defaultValue="15" className="w-full accent-teal-500 h-1 bg-slate-200 rounded-lg appearance-none" />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                  <span>1 km</span>
                  <span>15 km</span>
                  <span>50+ km</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsFilterOpen(false)} className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-slate-500 font-bold text-sm active:scale-95 transition-all">
                Reset
              </button>
              <button onClick={() => setIsFilterOpen(false)} className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-500/30 active:scale-95 transition-all">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
