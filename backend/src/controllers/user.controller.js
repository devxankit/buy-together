const httpStatus = require('http-status').status;
const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');

const getProfile = async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res.send(user);
};

const updateProfile = async (req, res) => {
  const user = await userService.updateUserById(req.user.id, req.body);
  res.send(user);
};

const getUserPublicProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  res.send({
    id: user.id || user._id,
    name: user.name,
    avatar: user.avatar,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getUserPublicProfile,
};
