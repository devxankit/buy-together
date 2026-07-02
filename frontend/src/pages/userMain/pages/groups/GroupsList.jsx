import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useUserMainContext } from '../../context';
import { getGroups, getTrendingGroups } from '../../../../services/group.api';
import { swr, swrPeek } from '../../../../services/swr';

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

import { useLocation } from 'react-router-dom';

const GroupsList = () => {
  const location = useLocation();
  // Remember the last tab so returning from a group lands back on the tab the
  // user came from (e.g. Joined), not always "My Groups".
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('groups_active_tab') || 'my-groups');
  useEffect(() => { sessionStorage.setItem('groups_active_tab', activeTab); }, [activeTab]);
  const [selectedFilter, setSelectedFilter] = useState(() => location.state?.filter || 'all-groups');
  const [searchValue, setSearchValue] = useState('');

  // Sync state filter from location state updates
  useEffect(() => {
    if (location.state?.filter) {
      setSelectedFilter(location.state.filter);
    }
  }, [location.state]);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [joinedSubTab, setJoinedSubTab] = useState('active');

  // Live Bottom Filter Drawer states
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSort, setFilterSort] = useState('default');

  // Shared Location Selection Context
  const { selectedCity, setIsLocationPickerOpen } = useUserMainContext();

  // Cache is keyed per user so one account never sees another's groups.
  const userId = useSelector((s) => s.auth.user?.id) || 'me';
  const myGroupsKey = `my-groups:${userId}`;

  // API Data States — seeded from the SWR cache so revisiting paints instantly
  // (no spinner) and is then revalidated silently in the background.
  const cachedMine = swrPeek(myGroupsKey);
  const [createdGroups, setCreatedGroups] = useState(() => {
    const cached = cachedMine?.created || [];
    return [...cached].sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0));
  });
  const [joinedGroups, setJoinedGroups] = useState(() => {
    const cached = cachedMine?.joined || [];
    return [...cached].sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0));
  });
  const [trendingGroups, setTrendingGroups] = useState(() => swrPeek('groups:trending') || []);
  const [loading, setLoading] = useState(cachedMine === undefined);

  // My created/joined groups (ttl: 0 → always revalidate, but cached copy shows
  // first so a newly created/joined group appears without a reload/flash).
  useEffect(() => {
    let active = true;
    swr(
      myGroupsKey,
      async () => {
        const [createdRes, joinedRes] = await Promise.all([
          getGroups({ created: 'true' }),
          getGroups({ joined: 'true' }),
        ]);
        return { created: createdRes.data || [], joined: joinedRes.data || [] };
      },
      {
        ttl: 0,
        onData: (d) => {
          if (!active) return;
          const sortedCreated = (d.created || []).sort((a, b) => {
            const timeA = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const timeB = new Date(b.createdAt || b.updatedAt || 0).getTime();
            return timeB - timeA;
          });
          const sortedJoined = (d.joined || []).sort((a, b) => {
            const timeA = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const timeB = new Date(b.createdAt || b.updatedAt || 0).getTime();
            return timeB - timeA;
          });
          setCreatedGroups(sortedCreated);
          setJoinedGroups(sortedJoined);
          setLoading(false);
        },
      }
    ).catch((err) => {
      console.error('Failed to fetch user groups:', err);
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [myGroupsKey]);

  // Trending list — admin-curated via the admin Groups console (trending flag).
  useEffect(() => {
    let active = true;
    swr(
      'groups:trending',
      async () => {
        const { data } = await getTrendingGroups();
        return Array.isArray(data) ? data : [];
      },
      { ttl: 0, onData: (d) => { if (active) setTrendingGroups(d); } }
    ).catch((err) => console.warn('Failed to load trending groups:', err));
    return () => { active = false; };
  }, []);

  // 2. DYNAMIC DATA MODELS (Loaded from database)
  // Trending carousel — maps admin-flagged groups onto the card shape. The
  // green "OFF" badge subtitle comes from each group's slogan.
  const trendingGroupsData = useMemo(() => {
    return trendingGroups.map((g) => ({
      id: g.id || g._id,
      title: g.title,
      subtitle: g.slogan || g.productName || '',
      image: g.image || 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=150&q=80',
      spotsJoined: g.spotsJoined || 0,
      spotsTotal: g.spotsTotal || 0,
      daysLeft: g.daysLeft || '—',
    }));
  }, [trendingGroups]);

  const allGroupsData = useMemo(() => {
    // "My Groups" shows only groups the user created — joined groups have their
    // own dedicated tab, so they're intentionally excluded here.
    const all = [...createdGroups];
    const uniqueGroups = [];
    const seen = new Set();
    for (const g of all) {
      if (!seen.has(g.id)) {
        seen.add(g.id);
        uniqueGroups.push(g);
      }
    }

    return uniqueGroups.map(g => {
      const spotsJoined = g.spotsJoined || 0;
      const spotsTotal = g.spotsTotal || 0;
      const isCreator = createdGroups.some(cg => cg.id === g.id);

      return {
        id: g.id,
        title: g.title,
        status: g.status,
        category: g.category || 'Group',
        location: g.location || 'India',
        slogan: g.slogan || g.description || 'Join to save big together!',
        image: g.image || 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=150&q=80',
        spotsJoined,
        spotsTotal,
        daysLeft: g.daysLeft || '—',
        members: Array.isArray(g.members) ? g.members : [],
        isAdmin: isCreator,
        createdAt: g.createdAt
      };
    });
  }, [createdGroups, joinedGroups]);

  const joinedGroupsData = useMemo(() => {
    return joinedGroups.map(g => {
      const spotsJoined = g.spotsJoined || 0;
      const spotsTotal = g.spotsTotal || 0;

      return {
        id: g.id,
        title: g.title,
        status: g.status,
        category: g.category || 'Group',
        location: g.location || 'India',
        slogan: g.slogan || g.description || 'Join to save big together!',
        image: g.image || 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=150&q=80',
        spotsJoined,
        spotsTotal,
        daysLeft: g.daysLeft || '—',
        members: Array.isArray(g.members) ? g.members : [],
        closingLabel: g.status === 'closing' ? 'Closing Soon' : null,
        createdAt: g.createdAt
      };
    });
  }, [joinedGroups]);

  // 3. SEARCH & FILTER LOGIC (My Groups)
  const filteredGroups = useMemo(() => {
    let result = allGroupsData.filter((group) => {
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
      if (selectedFilter === 'new') {
        const createdAtTime = new Date(group.createdAt || 0).getTime();
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        return createdAtTime > oneDayAgo;
      }
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
  }, [allGroupsData, searchValue, selectedFilter, selectedCity, filterCategory, filterStatus, filterSort]);

  // 4. SUB-TAB FILTER LOGIC (Joined Groups)
  // A finished deal can be either 'completed' or 'locked' (target met / deal
  // locked), so the Completed tab counts both — otherwise locked groups vanish.
  const isCompletedStatus = (s) => s === 'completed' || s === 'locked';
  const joinedSubTabCounts = useMemo(() => {
    return {
      active: joinedGroupsData.filter(g => g.status === 'active').length,
      'closing-soon': joinedGroupsData.filter(g => g.status === 'closing').length,
      completed: joinedGroupsData.filter(g => isCompletedStatus(g.status)).length,
    };
  }, [joinedGroupsData]);

  const filteredJoinedGroups = useMemo(() => {
    return joinedGroupsData.filter((group) => {
      if (joinedSubTab === 'active') return group.status === 'active';
      if (joinedSubTab === 'closing-soon') return group.status === 'closing';
      if (joinedSubTab === 'completed') return isCompletedStatus(group.status);
      return true;
    });
  }, [joinedGroupsData, joinedSubTab]);

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

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <span className="animate-spin inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
              <span className="text-[10px] font-bold text-muted">Loading groups...</span>
            </div>
          ) : (
            <>
              {/* All Groups List */}
              <AllGroupsList groups={filteredGroups} />

              {/* Trending Horizontal list — admin-curated; hidden when empty */}
              {trendingGroupsData.length > 0 && (
                <TrendingGroups 
                  groups={trendingGroupsData} 
                  onSeeAll={() => setSelectedFilter('all-groups')} 
                />
              )}
            </>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-4 mt-1">
          {/* Segmented Pills count filters */}
          <JoinedTabs selectedTab={joinedSubTab} onChange={setJoinedSubTab} counts={joinedSubTabCounts} />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <span className="animate-spin inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
              <span className="text-[10px] font-bold text-muted">Loading groups...</span>
            </div>
          ) : (
            /* Detailed joined groups list cards */
            <JoinedGroupsList groups={filteredJoinedGroups} />
          )}
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${filterCategory === cat
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
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${filterStatus === status
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
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${filterSort === sort
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
