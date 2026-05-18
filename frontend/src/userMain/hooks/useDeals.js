import { useState, useCallback } from 'react';

/**
 * Custom scalable hook managing products and group-buying deals catalog.
 * Handles categorizations, search filters, and pricing thresholds.
 */
export const useDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchDeals = useCallback(async (category = 'All') => {
    setLoading(true);
    setError(null);
    setActiveCategory(category);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockDeals = [
        { id: 'd-1', title: 'Fresh Strawberries (500g)', originalPrice: 350, groupPrice: 199, spotsTotal: 8, spotsJoined: 6, tag: 'Fruits' },
        { id: 'd-2', title: 'Basmati Rice (5kg)', originalPrice: 990, groupPrice: 650, spotsTotal: 15, spotsJoined: 12, tag: 'Groceries' }
      ];
      const filtered = category === 'All' ? mockDeals : mockDeals.filter(d => d.tag === category);
      setDeals(filtered);
    } catch (err) {
      setError(err.message || 'Error fetching deals feed.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deals,
    loading,
    error,
    activeCategory,
    fetchDeals
  };
};

export default useDeals;
