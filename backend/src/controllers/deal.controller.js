const httpStatus = require('http-status');
const dealService = require('../services/deal.service');

const createDeal = async (req, res) => {
  const deal = await dealService.createDeal(req.body);
  res.status(httpStatus.CREATED).send(deal);
};

const getDeals = async (req, res) => {
  const deals = await dealService.queryDeals();
  res.send(deals);
};

module.exports = {
  createDeal,
  getDeals,
};
