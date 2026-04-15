const User = require('../models/User');

const getUserById = async (id) => {
  return User.findById(id);
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

module.exports = {
  getUserById,
  updateUserById,
};
