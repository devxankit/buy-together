const httpStatus = require('http-status').status;
const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');

const getProfile = async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  const stats = await userService.getUserStats(req.user.id);
  const userObj = user.toJSON();
  userObj.stats = stats;
  res.send(userObj);
};

const updateProfile = async (req, res) => {
  const user = await userService.updateUserById(req.user.id, req.body);
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  const stats = await userService.getUserStats(req.user.id);
  const userObj = user.toJSON();
  userObj.stats = stats;
  res.send(userObj);
};

const getWishlist = catchAsync(async (req, res) => {
  const items = await userService.getWishlist(req.user.id);
  res.send(items);
});

const toggleWishlist = catchAsync(async (req, res) => {
  const result = await userService.toggleWishlist(req.user.id, req.params.groupId);
  res.send(result);
});

const getUserPublicProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  // Expose the contact number + location so chat partners can see each other's
  // details (WhatsApp-style contact card). This is a buyer-to-buyer marketplace
  // where members deliberately share numbers to coordinate group purchases.
  res.send({
    id: user.id || user._id,
    name: user.name,
    avatar: user.avatar,
    phone: user.phone,
    location: user.location,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getWishlist,
  toggleWishlist,
  getUserPublicProfile,
};
