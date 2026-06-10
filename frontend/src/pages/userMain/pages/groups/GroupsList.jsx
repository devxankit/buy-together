import React, { useState, useMemo } from 'react';
import { useUserMainContext } from '../../context';
// My Groups sub-components
import GroupsHeader from './components/GroupsHeader';
import GroupTabs from './components/GroupTabs';
import SearchAndFilter from './components/SearchAndFilter';
import FilterBadges from './components/FilterBadges';
import PromoBanner from './components/PromoBanner';
import TrendingGroups from './components/TrendingGroups';
import AllGroupsList from './components/AllGroupsList';

// Joined Groups sub-components
import JoinedHeader from './components/JoinedHeader';
import JoinedTabs from './components/JoinedTabs';
import JoinedGroupsList from './components/JoinedGroupsList';

const GroupsList = () => {
  // 1. STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState('my-groups');
  const [selectedFilter, setSelectedFilter] = useState('all-groups');
  const [searchValue, setSearchValue] = useState('');
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [joinedSubTab, setJoinedSubTab] = useState('active');

  // Live Bottom Filter Drawer states
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSort, setFilterSort] = useState('default');

  // Shared Location Selection Context
  const { selectedCity, setIsLocationPickerOpen } = useUserMainContext();

  // 2. MOCK DATA MODELS (Exact match to mockups)
  const trendingGroupsData = [
    {
      id: 'iphone-15',
      title: 'iPhone 15 Pro',
      subtitle: '₹8,000 OFF',
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=150&q=80',
      spotsJoined: 28,
      spotsTotal: 50,
      daysLeft: '2d left'
    },
    {
      id: 'macbook-m3',
      title: 'MacBook Air M3',
      subtitle: '₹12,000 OFF',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=150&q=80',
      spotsJoined: 16,
      spotsTotal: 30,
      daysLeft: '3d left'
    },
    {
      id: 'lg-tv',
      title: 'LG 55" 4K TV',
      subtitle: '₹6,500 OFF',
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=150&q=80',
      spotsJoined: 34,
      spotsTotal: 60,
      daysLeft: '4d left'
    },
    {
      id: 'samsung-washer',
      title: 'Samsung Washer',
      subtitle: '₹5,000 OFF',
      image: 'https://images.unsplash.com/photo-1610557892470-76d74cd120a8?auto=format&fit=crop&w=150&q=80',
      spotsJoined: 18,
      spotsTotal: 40,
      daysLeft: '2d left'
    }
  ];

  const allGroupsData = [
    {
      id: 'all-g1',
      title: 'iPhone 15 Pro',
      status: 'active',
      category: 'Electronics',
      location: 'Mumbai',
      slogan: "Let's buy iPhone 15 Pro together and get the best possible deal from verified sellers.",
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=150&q=80',
      spotsJoined: 28,
      spotsTotal: 50,
      daysLeft: '2d left',
      isAdmin: true
    },
    {
      id: 'all-g2',
      title: 'MacBook Air M3',
      status: 'active',
      category: 'Electronics',
      location: 'Pune',
      slogan: 'Planning to buy MacBook Air M3. Join to get maximum discount.',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=150&q=80',
      spotsJoined: 16,
      spotsTotal: 30,
      daysLeft: '3d left'
    },
    {
      id: 'all-g3',
      title: 'LG 55" 4K TV',
      status: 'closing',
      category: 'Electronics',
      location: 'Thane',
      slogan: 'Group deal for LG 55 inch 4K TV. Hurry up! Limited time left.',
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=150&q=80',
      spotsJoined: 34,
      spotsTotal: 60,
      daysLeft: '12h left'
    },
    {
      id: 'all-g4',
      title: 'Samsung Washer',
      status: 'active',
      category: 'Home Appliances',
      location: 'Navi Mumbai',
      slogan: "Let's buy Samsung Washer in bulk and save more.",
      image: 'https://images.unsplash.com/photo-1610557892470-76d74cd120a8?auto=format&fit=crop&w=150&q=80',
      spotsJoined: 18,
      spotsTotal: 40,
      daysLeft: '2d left',
      isAdmin: true
    }
  ];

  const joinedGroupsData = [
    {
      id: 'joined-g1',
      title: 'iPhone 15 Pro',
      status: 'active',
      category: 'Electronics',
      location: 'Mumbai',
      slogan: "Let's buy iPhone 15 Pro together and get the best possible deal from verified sellers.",
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=150&q=80',
      spotsJoined: 28,
      spotsTotal: 50,
      daysLeft: '2d left',
      targetPrice: 'Under ₹72,000',
      bestOffer: '₹69,999 (8% OFF)',
      myInterest: '2 Units'
    },
    {
      id: 'joined-g2',
      title: 'MacBook Air M3',
      status: 'active',
      category: 'Electronics',
      location: 'Pune',
      slogan: 'Planning to buy MacBook Air M3. Join to get maximum discount.',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=150&q=80',
      spotsJoined: 16,
      spotsTotal: 30,
      daysLeft: '3d left',
      targetPrice: 'Under ₹95,000',
      bestOffer: '₹88,900 (7% OFF)',
      myInterest: '1 Unit'
    },
    {
      id: 'joined-g3',
      title: 'LG 55" 4K TV',
      status: 'closing',
      closingLabel: 'Closing in 12h',
      category: 'Electronics',
      location: 'Thane',
      slogan: 'Group deal for LG 55 inch 4K TV. Hurry up! Limited time left.',
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=150&q=80',
      spotsJoined: 18, // Badge count shows 18
      spotsTotal: 60,  // buyers pill shows 34/60
      daysLeft: '12h left',
      targetPrice: 'Under ₹40,000',
      bestOffer: '₹37,500 (6% OFF)',
      myInterest: '1 Unit'
    },
    {
      id: 'joined-g4',
      title: 'Samsung Washer',
      status: 'active',
      category: 'Home Appliances',
      location: 'Navi Mumbai',
      slogan: "Let's buy Samsung Washer in bulk and save more.",
      image: 'https://images.unsplash.com/photo-1610557892470-76d74cd120a8?auto=format&fit=crop&w=150&q=80',
      spotsJoined: 12, // Badge count shows 12
      spotsTotal: 40,  // buyers pill shows 18/40
      daysLeft: '2d left',
      targetPrice: 'Under ₹25,000',
      bestOffer: '₹23,200 (7% OFF)',
      myInterest: '2 Units'
    },
    {
      id: 'joined-g5',
      title: 'AirPods Pro (2nd Gen)',
      status: 'active',
      category: 'Accessories',
      location: 'Mumbai',
      slogan: 'Join the group to get AirPods Pro at the best price.',
      image: 'https://images.unsplash.com/photo-1588449668365-d15e397f6787?auto=format&fit=crop&w=150&q=80',
      spotsJoined: 12, // Badge count shows 12
      spotsTotal: 25,  // buyers pill shows 12/25
      daysLeft: '1d left',
      targetPrice: 'Under ₹20,000',
      bestOffer: '₹18,499 (7% OFF)',
      myInterest: '1 Unit'
    },
    {
      id: 'joined-g6',
      title: 'Sony WH-1000XM5',
      status: 'completed',
      category: 'Accessories',
      location: 'Delhi',
      slogan: 'Group successfully completed! Lock price secured.',
      image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=150&q=80',
      spotsJoined: 50,
      spotsTotal: 50,
      daysLeft: '0d left',
      targetPrice: 'Under ₹30,000',
      bestOffer: '₹26,999 (10% OFF)',
      myInterest: '1 Unit'
    }
  ];

  // 3. SEARCH & FILTER LOGIC (My Groups)
  const filteredGroups = useMemo(() => {
    let result = allGroupsData.filter((group) => {
      // Only show groups the user created in My Groups section
      if (!group.isAdmin) return false;

      const matchesSearch =
        group.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        group.category.toLowerCase().includes(searchValue.toLowerCase()) ||
        group.location.toLowerCase().includes(searchValue.toLowerCase()) ||
        group.slogan.toLowerCase().includes(searchValue.toLowerCase());

      if (!matchesSearch) return false;

      // Category filter
      if (filterCategory !== 'all' && group.category !== filterCategory) return false;

      // Status filter
      if (filterStatus !== 'all' && group.status !== filterStatus) return false;

      // Badges filter
      if (selectedFilter === 'all-groups') return true;
      if (selectedFilter === 'closing-soon') return group.status === 'closing';
      if (selectedFilter === 'new') return group.spotsJoined < 20;
      if (selectedFilter === 'popular') return group.spotsJoined >= 25;
      if (selectedFilter === 'nearby') return group.location.toLowerCase() === selectedCity.split(',')[0].toLowerCase();

      return true;
    });

    // Sorting logic
    if (filterSort === 'popularity') {
      result = [...result].sort((a, b) => b.spotsJoined - a.spotsJoined);
    } else if (filterSort === 'deadline') {
      const parseDeadline = (daysLeft) => {
        if (daysLeft.includes('h left')) return parseInt(daysLeft) / 24;
        if (daysLeft.includes('d left')) return parseInt(daysLeft);
        return 999;
      };
      result = [...result].sort((a, b) => parseDeadline(a.daysLeft) - parseDeadline(b.daysLeft));
    }

    return result;
  }, [searchValue, selectedFilter, selectedCity, filterCategory, filterStatus, filterSort]);

  // 4. SUB-TAB FILTER LOGIC (Joined Groups)
  const filteredJoinedGroups = useMemo(() => {
    return joinedGroupsData.filter((group) => {
      if (joinedSubTab === 'active') return group.status === 'active';
      if (joinedSubTab === 'closing-soon') return group.status === 'closing';
      if (joinedSubTab === 'completed') return group.status === 'completed';
      return true;
    });
  }, [joinedSubTab]);

  // 5. RENDER FLOW (Unified Page Layout)
  return (
    <div className="flex flex-col gap-3.5 px-3.5 pb-24 select-none animate-fadeIn relative">
      {/* Groups Title & Create Button */}
      <GroupsHeader selectedLocation={selectedCity} onLocationClick={() => setIsLocationPickerOpen(true)} />

      {/* Tabs Selector (My Groups / Joined Groups) */}
      <GroupTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'my-groups' ? (
        <>
          {/* Search Input & Filtering options */}
          <SearchAndFilter
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onFilterClick={() => setIsFilterDrawerOpen(true)}
          />

          {/* Horizontal pill filters */}
          <FilterBadges
            selectedFilter={selectedFilter}
            onChange={setSelectedFilter}
          />

          {/* Promo Alert Information Banner */}
          <PromoBanner
            isVisible={isBannerVisible}
            onClose={() => setIsBannerVisible(false)}
          />

          {/* All Groups List */}
          <AllGroupsList groups={filteredGroups} />

          {/* Trending Horizontal list */}
          <TrendingGroups groups={trendingGroupsData} />
        </>
      ) : (
        <div className="flex flex-col gap-4 mt-1">
          {/* Segmented Pills count filters */}
          <JoinedTabs selectedTab={joinedSubTab} onChange={setJoinedSubTab} />

          {/* Detailed joined groups list cards */}
          <JoinedGroupsList groups={filteredJoinedGroups} />
        </div>
      )}

      {/* Premium Glassmorphic Bottom Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/45 backdrop-blur-[4px] animate-fadeIn" onClick={() => setIsFilterDrawerOpen(false)}>
          <div 
            className="w-full max-w-[430px] bg-surface/90 backdrop-blur-md border-t border-line rounded-t-3xl shadow-2xl p-5 animate-slideUp flex flex-col gap-5 pb-32"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-1"></div>

            {/* Title */}
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-black text-ink">Filter Groups</h3>
              <button 
                type="button"
                onClick={() => {
                  setFilterCategory('all');
                  setFilterStatus('all');
                  setFilterSort('default');
                }}
                className="text-[11px] font-bold text-primary active:scale-95 transition-all"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-faint uppercase tracking-wider">Category</span>
              <div className="flex flex-wrap gap-2">
                {['all', 'Electronics', 'Home Appliances', 'Accessories'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                      filterCategory === cat 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'bg-surface-alt text-faint border border-line hover:text-ink'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-faint uppercase tracking-wider">Status</span>
              <div className="flex gap-2">
                {['all', 'active', 'closing'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilterStatus(status)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                      filterStatus === status 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'bg-surface-alt text-faint border border-line hover:text-ink'
                    }`}
                  >
                    {status === 'all' ? 'All' : status === 'active' ? 'Active' : 'Closing Soon'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-faint uppercase tracking-wider">Sort By</span>
              <div className="flex gap-2">
                {['default', 'popularity', 'deadline'].map(sort => (
                  <button
                    key={sort}
                    type="button"
                    onClick={() => setFilterSort(sort)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                      filterSort === sort 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'bg-surface-alt text-faint border border-line hover:text-ink'
                    }`}
                  >
                    {sort === 'default' ? 'Default' : sort === 'popularity' ? 'Popularity' : 'Deadline'}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(false)}
              className="w-full py-4 bg-primary text-white rounded-2xl font-black text-[13.5px] active:scale-95 transition-all text-center shadow-md shadow-primary/20 mt-2"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsList;
