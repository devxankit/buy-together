import api from './api';

/**
 * Service handler for product catalog and community deals in userMain module.
 */
export const dealService = {
  getFeaturedDeals: async () => {
    // return api.get('/deals/featured');
    return [
      { id: 'd-1', title: 'Farm Fresh Strawberries (500g)', originalPrice: 350, groupPrice: 199, tag: 'Fruits' }
    ];
  },

  getDealsByCategory: async (category) => {
    // return api.get(`/deals?category=${category}`);
    return [
      { id: 'd-2', title: 'Premium Basmati Rice (5kg)', originalPrice: 990, groupPrice: 650, tag: 'Groceries' }
    ];
  }
};

export default dealService;
