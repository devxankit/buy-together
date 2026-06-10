import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useUserMainContext } from '../../context';
import { getCategories } from '../../../../services/category.api';
import { getGroups, joinGroup } from '../../../../services/group.api';
import { showToast } from '../../../../utils/toast';

// Import modular sub-components
import CategoryHeader from './components/CategoryHeader';
import MyCategoriesCarousel from './components/MyCategoriesCarousel';
import SortTabs from './components/SortTabs';
import CategoryProductsList from './components/CategoryProductsList';
import BottomCTA from './components/BottomCTA';

/**
 * Premium mobile-first Categories / Explore Dashboard.
 * Integrates directly with real database groups and categories collections,
 * mapping variables dynamically so that the UI remains identical to the mockup layout.
 */
const Categories = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redux Auth Selector
  const currentUser = useSelector((state) => state.auth.user) || {};

  // 1. STATE MANAGEMENT
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch live groups and categories
  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const [catsRes, groupsRes] = await Promise.all([
          getCategories(),
          getGroups()
        ]);
        if (active) {
          setCategories(catsRes.data || []);
          setGroups(groupsRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load categories/groups:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadData();
    return () => { active = false; };
  }, []);

  // Sync category state when location.state changes (from Home page navigation)
  useEffect(() => {
    if (location.state?.categoryId) {
      setSelectedCategory(location.state.categoryId);
    }
  }, [location.state]);

  // Join group API action handler
  const handleJoinGroup = async (e, prod) => {
    e.stopPropagation();
    try {
      const { data } = await joinGroup(prod.id);
      
      // Update local state headcount
      setGroups(prev => prev.map(g => g.id === prod.id ? data : g));
      showToast('Successfully joined group!');
      
      // Redirect to chat room
      navigate(`/groups/${prod.id}/chat`, { state: { group: prod, isJoined: true } });
    } catch (err) {
      console.error('Failed to join group:', err);
      showToast(err.response?.data?.message || 'Failed to join group.');
    }
  };

  // 2. DYNAMIC GROUP MAPPING ENGINE (Aligns Mongoose object properties to visual card tags)
  const mappedGroups = useMemo(() => {
    return groups.map(g => {
      const spotsJoined = g.spotsJoined || 0;
      const spotsTotal = g.spotsTotal || 0;
      const slotsNeeded = spotsTotal - spotsJoined;
      const neededText = slotsNeeded > 0 ? `${slotsNeeded} more needed` : 'Goal reached!';

      const ratio = spotsTotal > 0 ? spotsJoined / spotsTotal : 0;
      let badgeType = 'new';
      let badgeLabel = 'NEW';
      if (ratio >= 0.5) {
        badgeType = 'hot';
        badgeLabel = 'HOT';
      } else if (spotsJoined > 15) {
        badgeType = 'rising';
        badgeLabel = 'RISING';
      }

      // Default tags fallback
      const hashtags = ['#' + (g.category || 'Group'), '#' + (g.subCategory || 'Deal'), '#CoBuy'];

      return {
        id: g.id,
        title: g.title,
        status: g.status,
        brand: g.productName || g.title,
        location: g.location || 'India',
        slogan: g.slogan || g.description || 'Join to save big together!',
        image: g.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=150&q=80',
        spotsJoined,
        spotsTotal,
        creatorName: (g.creator && g.creator !== '—') ? g.creator : (g.admin && g.admin.name) || 'Platform Creator',
        creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
        hashtags,
        badgeType,
        badgeLabel,
        daysLeft: neededText,
        category: g.category || 'all',
        members: g.members || []
      };
    });
  }, [groups]);

  // 3. SEARCH & TABS FILTER ENGINE
  const filteredProducts = useMemo(() => {
    let list = mappedGroups;

    // Filter by Selected Category slug
    if (selectedCategory !== 'all' && selectedCategory !== 'more') {
      list = list.filter(p => String(p.category).toLowerCase() === String(selectedCategory).toLowerCase());
    }

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

    // Apply Discount Target Level Filter
    if (discountFilter !== 'all') {
      const minPercentage = parseInt(discountFilter, 10);
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
      return [...list].sort((a, b) => b.spotsJoined - a.spotsJoined);
    } else if (activeSort === 'nearby') {
      return list.filter(p => p.location.toLowerCase().includes(selectedCity.split(',')[0].toLowerCase()));
    } else if (activeSort === 'new') {
      return list.filter(p => p.badgeType === 'new' || p.badgeType === 'rising');
    } else if (activeSort === 'my-groups') {
      const userId = currentUser.id || currentUser._id;
      return list.filter(p => p.members.some(m => String(m._id || m) === String(userId)));
    }

    return list;
  }, [selectedCategory, activeSort, searchQuery, mappedGroups, discountFilter, sizeFilter, locationFilter, selectedCity, currentUser]);

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
          categories={categories}
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-muted">Loading group pools...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <CategoryProductsList products={filteredProducts} onJoin={handleJoinGroup} />
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
