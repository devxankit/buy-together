import { useState, useCallback } from 'react';

/**
 * Custom scalable hook managing group pools and community buying rooms.
 * Decouples list caching, joint events, slots estimation, and creation workflows.
 */
export const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockList = [
        { id: 'g-101', title: 'Premium Organic Avocados', spotsTotal: 10, spotsJoined: 7, status: 'Active' },
        { id: 'g-102', title: 'Single Origin Arabica Coffee', spotsTotal: 5, spotsJoined: 4, status: 'Fast Filling' }
      ];
      setGroups(mockList);
    } catch (err) {
      setError(err.message || 'Error fetching group buys.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getGroupDetails = useCallback(async (groupId) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockDetails = {
        id: groupId,
        title: 'Premium Organic Avocados (Pack of 6)',
        vendor: 'Fresh Farms Ltd.',
        originalPrice: 499,
        groupPrice: 299,
        spotsTotal: 10,
        spotsJoined: 7,
        joinedUsers: [
          { name: 'Hritik (Host)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80', isHost: true }
        ]
      };
      setActiveGroup(mockDetails);
      return mockDetails;
    } catch (err) {
      setError(err.message || 'Error fetching group details.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newRoom = {
        id: `g-${Date.now()}`,
        ...payload,
        spotsJoined: 1,
        status: 'Active'
      };
      setGroups(prev => [newRoom, ...prev]);
      return { success: true, group: newRoom };
    } catch (err) {
      setError(err.message || 'Error creating group deal room.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const joinGroup = useCallback(async (groupId) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      setGroups(prev => prev.map(g => {
        if (g.id === groupId) {
          return { ...g, spotsJoined: Math.min(g.spotsTotal, g.spotsJoined + 1) };
        }
        return g;
      }));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Error joining pool.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    groups,
    activeGroup,
    loading,
    error,
    fetchGroups,
    getGroupDetails,
    createGroup,
    joinGroup
  };
};

export default useGroups;
