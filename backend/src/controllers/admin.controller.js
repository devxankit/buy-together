const httpStatus = require('http-status');

const getStats = async (req, res) => {
  // Logic to get admin stats
  res.send({ users: 0, groups: 0, deals: 0 });
};

module.exports = {
  getStats,
};
