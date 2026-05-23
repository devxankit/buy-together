import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserMainContext } from '../../context';

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Shared Location Selection Context
  const { selectedCity, setIsLocationPickerOpen } = useUserMainContext();
  
  // Custom Co-Buying Filters
  const [discountFilter, setDiscountFilter] = useState('all'); // 'all', '10', '25', '50'
  const [sizeFilter, setSizeFilter] = useState('all'); // 'all', 'small', 'medium', 'large'
  const [locationFilter, setLocationFilter] = useState('all'); // 'all', 'indore', 'delhi', 'mumbai', 'goa'

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
        slogan: "Let's buy Samsung Washer in bulk and save up to ₹5,500.",
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
    ],
    properties: [
      {
        id: 'prop-g1',
        title: 'Fractional Beach Villa Goa',
        status: 'active',
        brand: 'CoBuy Properties',
        location: 'Goa, IN',
        slogan: 'Fractional ownership of luxurious 4BHK beach villa in Goa.',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=260&q=80',
        spotsJoined: 4,
        spotsTotal: 10,
        creatorName: 'Aarav Mehta',
        creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
        hashtags: ['#GoaVilla', '#Fractional', '#CoOwn'],
        badgeType: 'hot',
        badgeLabel: 'HOT',
        daysLeft: '6 more slots'
      },
      {
        id: 'prop-g2',
        title: 'Premium IT Park Office Space',
        status: 'active',
        brand: 'Indore PropTech',
        location: 'Indore, MP',
        slogan: 'Commercial co-ownership investment in Indore IT Park.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=260&q=80',
        spotsJoined: 7,
        spotsTotal: 15,
        creatorName: 'Vikram Joshi',
        creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
        hashtags: ['#Commercial', '#OfficeSpace', '#Indore'],
        badgeType: 'rising',
        badgeLabel: 'RISING',
        daysLeft: '8 more slots'
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

    // Apply Group Size Filter
    if (sizeFilter !== 'all') {
      list = list.filter(p => {
        if (sizeFilter === 'small') return p.spotsTotal < 15;
        if (sizeFilter === 'medium') return p.spotsTotal >= 15 && p.spotsTotal < 100;
        if (sizeFilter === 'large') return p.spotsTotal >= 100;
        return true;
      });
    }

    // Apply Discount Target Level Filter (Ratio of spots filled)
    if (discountFilter !== 'all') {
      const minPercentage = parseInt(discountFilter);
      list = list.filter(p => {
        const ratio = (p.spotsJoined / p.spotsTotal) * 100;
        return ratio >= minPercentage;
      });
    }

    // Apply Location Filter
    if (locationFilter !== 'all') {
      list = list.filter(p => p.location.toLowerCase().includes(locationFilter));
    }

    // Sort tabs filter
    if (activeSort === 'trending') {
      // Sort by members count descending
      return [...list].sort((a, b) => b.spotsJoined - a.spotsJoined);
    } else if (activeSort === 'nearby') {
      // Show only dynamic selected city deals
      return list.filter(p => p.location.toLowerCase().includes(selectedCity.split(',')[0].toLowerCase()));
    } else if (activeSort === 'new') {
      // Filter by 'new' or 'rising' badge
      return list.filter(p => p.badgeType === 'new' || p.badgeType === 'rising');
    } else if (activeSort === 'my-groups') {
      // Mock user groups
      return list.filter(p => p.spotsJoined > 300);
    }

    return list;
  }, [selectedCategory, activeSort, searchQuery, allProductsList, discountFilter, sizeFilter, locationFilter, selectedCity]);

  return (
    <div className="flex flex-col gap-4 select-none min-h-screen bg-surface relative overflow-hidden">
      {/* 1. Header with custom dynamic title & search */}
      <CategoryHeader
        title="Groups"
        currentLocation={selectedCity}
        onLocationClick={() => setIsLocationPickerOpen(true)}
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
          <div className="bg-surface-alt border border-line rounded-[22px] p-10 text-center text-muted text-xs font-semibold shadow-sm my-2">
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
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fadeIn"
            onClick={() => setIsFilterOpen(false)}
          />
          {/* Slider Panel */}
          <div className="relative bg-surface w-full rounded-t-[30px] p-6 shadow-2xl animate-slideUp">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-ink">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center active:scale-95 text-faint">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {/* Group Size Target */}
              <div>
                <h3 className="text-[13px] font-black text-ink tracking-tight mb-3">Group Size Target</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Sizes' },
                    { id: 'small', label: 'Micro (<15)' },
                    { id: 'medium', label: 'Medium (<100)' },
                    { id: 'large', label: 'Wholesale (100+)' }
                  ].map((sz) => {
                    const isSel = sizeFilter === sz.id;
                    return (
                      <button
                        key={sz.id}
                        onClick={() => setSizeFilter(sz.id)}
                        className={`py-2.5 px-3.5 rounded-xl text-[11px] font-bold text-center border transition-all active:scale-[0.97] ${
                          isSel
                            ? 'bg-primary-soft text-primary border-primary/30 shadow-sm font-black'
                            : 'bg-surface-alt text-faint border-slate-200/70 hover:bg-surface-alt'
                        }`}
                      >
                        {sz.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Discount Target Level */}
              <div>
                <h3 className="text-[13px] font-black text-ink tracking-tight mb-3">Discount Level Target</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Levels' },
                    { id: '10', label: 'Basic (10%+ OFF)' },
                    { id: '25', label: 'Super (25%+ OFF)' },
                    { id: '50', label: 'Mega (50%+ OFF)' }
                  ].map((d) => {
                    const isSel = discountFilter === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setDiscountFilter(d.id)}
                        className={`py-2.5 px-3.5 rounded-xl text-[11px] font-bold text-center border transition-all active:scale-[0.97] ${
                          isSel
                            ? 'bg-primary-soft text-primary border-primary/30 shadow-sm font-black'
                            : 'bg-surface-alt text-faint border-slate-200/70 hover:bg-surface-alt'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Location Filter */}
              <div>
                <h3 className="text-[13px] font-black text-ink tracking-tight mb-3">Location</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Cities' },
                    { id: 'indore', label: '📍 Indore' },
                    { id: 'delhi', label: '📍 Delhi' },
                    { id: 'mumbai', label: '📍 Mumbai' },
                    { id: 'goa', label: '📍 Goa' }
                  ].map((loc) => {
                    const isSel = locationFilter === loc.id;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => setLocationFilter(loc.id)}
                        className={`py-2.5 px-3.5 rounded-xl text-[11px] font-bold text-center border transition-all active:scale-[0.97] ${
                          isSel
                            ? 'bg-primary-soft text-primary border-primary/30 shadow-sm font-black'
                            : 'bg-surface-alt text-faint border-slate-200/70 hover:bg-surface-alt'
                        }`}
                      >
                        {loc.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => {
                  setSizeFilter('all');
                  setDiscountFilter('all');
                  setLocationFilter('all');
                  setIsFilterOpen(false);
                }} 
                className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 text-faint font-bold text-sm active:scale-95 transition-all"
              >
                Reset
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)} 
                className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold text-sm shadow-lg shadow-primary/30 active:scale-95 transition-all"
              >
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
