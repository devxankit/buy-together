const Vendor = require('../models/Vendor');

const createVendor = async (vendorBody) => {
  return Vendor.create(vendorBody);
};

const queryVendors = async () => {
  return Vendor.find();
};

module.exports = {
  createVendor,
  queryVendors,
};
