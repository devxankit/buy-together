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
    return allGroupsData.filter((group) => {
      const matchesSearch =
        group.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        group.category.toLowerCase().includes(searchValue.toLowerCase()) ||
        group.location.toLowerCase().includes(searchValue.toLowerCase()) ||
        group.slogan.toLowerCase().includes(searchValue.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedFilter === 'all-groups') return true;
      if (selectedFilter === 'closing-soon') return group.status === 'closing';
      if (selectedFilter === 'new') return group.spotsJoined < 20;
      if (selectedFilter === 'popular') return group.spotsJoined >= 25;
      if (selectedFilter === 'nearby') return group.location.toLowerCase() === selectedCity.split(',')[0].toLowerCase();

      return true;
    });
  }, [searchValue, selectedFilter, selectedCity]);

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
    </div>
  );
};

export default GroupsList;
