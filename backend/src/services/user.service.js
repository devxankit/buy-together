const User = require('../models/User');
const Group = require('../models/Group');

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

const getUserStats = async (userId) => {
  const groupsJoined = await Group.countDocuments({
    members: userId,
    admin: { $ne: userId }
  });
  const groupsCreated = await Group.countDocuments({
    admin: userId
  });
  const dealsBooked = await Group.countDocuments({
    members: userId,
    status: { $in: ['completed', 'locked'] }
  });
  const activePools = await Group.countDocuments({
    members: userId,
    status: { $in: ['active', 'closing'] }
  });
  return {
    groupsJoined,
    groupsCreated,
    dealsBooked,
    activePools
  };
};

// ── Wishlist ────────────────────────────────────────────────────────

// The user's saved groups, fully populated for card rendering. Any groups that
// were since deleted are dropped so the UI never renders holes.
const getWishlist = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'wishlist',
    populate: { path: 'admin', select: 'name' },
  });
  if (!user) throw new Error('User not found');
  return (user.wishlist || []).filter(Boolean);
};

// Add the group if absent, remove it if present. Returns the refreshed list and
// whether the group is now wishlisted.
const toggleWishlist = async (userId, groupId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const idx = user.wishlist.findIndex((g) => String(g) === String(groupId));
  let wishlisted;
  if (idx >= 0) {
    user.wishlist.splice(idx, 1);
    wishlisted = false;
  } else {
    user.wishlist.unshift(groupId);
    wishlisted = true;
  }
  await user.save();

  const items = await getWishlist(userId);
  return { items, wishlisted };
};

module.exports = {
  getUserById,
  updateUserById,
  getUserStats,
  getWishlist,
  toggleWishlist,
};
