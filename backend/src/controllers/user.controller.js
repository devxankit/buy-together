const httpStatus = require('http-status');
const userService = require('../services/user.service');

const getProfile = async (req, res) => {
  const user = await userService.getUserById(req.user.sub);
  res.send(user);
};

const updateProfile = async (req, res) => {
  const user = await userService.updateUserById(req.user.sub, req.body);
  res.send(user);
};

module.exports = {
  getProfile,
  updateProfile,
};
