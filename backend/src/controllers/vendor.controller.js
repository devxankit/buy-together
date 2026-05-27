const httpStatus = require('http-status').status;
const vendorService = require('../services/vendor.service');

const createVendor = async (req, res) => {
  const vendor = await vendorService.createVendor(req.body);
  res.status(httpStatus.CREATED).send(vendor);
};

const getVendors = async (req, res) => {
  const vendors = await vendorService.queryVendors();
  res.send(vendors);
};

module.exports = {
  createVendor,
  getVendors,
};
