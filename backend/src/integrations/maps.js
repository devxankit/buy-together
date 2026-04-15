const logger = require('../utils/logger');

const getGeocode = async (address) => {
  logger.info(`Fetching geocode for: ${address}`);
  return { lat: 0, lng: 0 };
};

module.exports = {
  getGeocode,
};
