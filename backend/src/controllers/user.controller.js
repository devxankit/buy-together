const httpStatus = require('http-status').status;
const userService = require('../services/user.service');

const getProfile = async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res.send(user);
};

const updateProfile = async (req, res) => {
  const user = await userService.updateUserById(req.user.id, req.body);
  res.send(user);
};

module.exports = {
  getProfile,
  updateProfile,
};
