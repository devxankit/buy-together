const Group = require('../models/Group');

const createGroup = async (groupBody) => {
  return Group.create(groupBody);
};

const queryGroups = async (userId) => {
  return Group.find({ members: userId });
};

const getGroupById = async (id) => {
  return Group.findById(id).populate('members', 'name email');
};

module.exports = {
  createGroup,
  queryGroups,
  getGroupById,
};
