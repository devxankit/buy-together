import React, { useState, useMemo } from 'react';
import GroupsHeader from './components/GroupsHeader';
import GroupTabs from './components/GroupTabs';
import SearchAndFilter from './components/SearchAndFilter';
import FilterBadges from './components/FilterBadges';
import PromoBanner from './components/PromoBanner';
import TrendingGroups from './components/TrendingGroups';
import AllGroupsList from './components/AllGroupsList';

const GroupsList = () => {
  // 1. STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState('my-groups');
  const [selectedFilter, setSelectedFilter] = useState('all-groups');
  const [searchValue, setSearchValue] = useState('');
  const [isBannerVisible, setIsBannerVisible] = useState(true);

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
      daysLeft: '2d left'
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
      daysLeft: '2d left'
    }
  ];

  // 3. SEARCH & FILTER LOGIC
  const filteredGroups = useMemo(() => {
    return allGroupsData.filter((group) => {
      // Search matching text
      const matchesSearch =
        group.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        group.category.toLowerCase().includes(searchValue.toLowerCase()) ||
        group.location.toLowerCase().includes(searchValue.toLowerCase()) ||
        group.slogan.toLowerCase().includes(searchValue.toLowerCase());

      // Badge filter matching logic
      if (!matchesSearch) return false;
      if (selectedFilter === 'all-groups') return true;
      if (selectedFilter === 'closing-soon') return group.status === 'closing';
      if (selectedFilter === 'new') return group.spotsJoined < 20; // Example metric
      if (selectedFilter === 'popular') return group.spotsJoined >= 25; // Example metric
      if (selectedFilter === 'nearby') return group.location === 'Mumbai'; // Example regional constraint

      return true;
    });
  }, [searchValue, selectedFilter]);

  return (
    <div className="flex flex-col gap-3.5 px-3.5 pb-24 select-none animate-fadeIn">
      {/* Groups Title & Create Button */}
      <GroupsHeader />

      {/* Tabs Selector (My Groups / Joined Groups) */}
      <GroupTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* Search Input & Filtering options */}
      <SearchAndFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onFilterClick={() => setSelectedFilter('all-groups')}
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

      {/* Trending Horizontal list */}
      <TrendingGroups groups={trendingGroupsData} />

      {/* All Groups List */}
      <AllGroupsList groups={filteredGroups} />
    </div>
  );
};

export default GroupsList;
