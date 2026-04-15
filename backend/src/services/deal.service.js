const Deal = require('../models/Deal');

const createDeal = async (dealBody) => {
  return Deal.create(dealBody);
};

const queryDeals = async () => {
  return Deal.find().populate('vendor');
};

module.exports = {
  createDeal,
  queryDeals,
};
