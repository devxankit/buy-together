const Deal = require('../models/Deal');
const cache = require('../utils/cache');

const LIST_KEY = 'deals:list';
const LIST_TTL = 120 * 1000;

/** Invalidate the public deals list (called on deal writes and vendor changes). */
const bustDealsCache = () => cache.del(LIST_KEY);

const createDeal = async (dealBody) => {
  const deal = await Deal.create(dealBody);
  bustDealsCache();
  return deal;
};

const queryDeals = async () =>
  cache.wrap(LIST_KEY, LIST_TTL, async () => {
    const deals = await Deal.find().populate('vendor');
    // Serialise so L1 and L2 hold the same API-shaped value.
    return deals.map((d) => d.toJSON());
  });

module.exports = {
  createDeal,
  queryDeals,
  bustDealsCache,
};
