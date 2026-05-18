import api from './api';

/**
 * Service handler for group pools actions in userMain module.
 * Separates backend URLs and request payloads from functional views.
 */
export const groupService = {
  getJoinedGroups: async () => {
    // return api.get('/groups/joined');
    return [
      { id: 'g-101', title: 'Premium Organic Avocados', spotsTotal: 10, spotsJoined: 7 }
    ];
  },
  
  createGroupPool: async (payload) => {
    // return api.post('/groups/create', payload);
    return { success: true, groupId: `g-${Date.now()}` };
  },

  joinGroupPool: async (groupId) => {
    // return api.post(`/groups/${groupId}/join`);
    return { success: true };
  },

  getGroupDetails: async (groupId) => {
    // return api.get(`/groups/${groupId}`);
    return {
      id: groupId,
      title: 'Premium Organic Avocados (Pack of 6)',
      vendor: 'Fresh Farms Ltd.',
      originalPrice: 499,
      groupPrice: 299,
      spotsTotal: 10,
      spotsJoined: 7
    };
  }
};

export default groupService;
