const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const groupService = require('../services/group.service');
const ApiError = require('../utils/ApiError');

const User = require('../models/User');
const pushService = require('../services/push.service');

const createGroup = catchAsync(async (req, res) => {
  const group = await groupService.createGroup({ ...req.body, admin: req.user.id });
  res.status(httpStatus.CREATED).send(group);
});

const getGroups = catchAsync(async (req, res) => {
  const groups = await groupService.queryGroups(req.user.id, req.query);
  res.send(groups);
});

// Public: admin-curated trending groups for the Groups page carousel.
const getTrending = catchAsync(async (req, res) => {
  const groups = await groupService.getTrendingGroups();
  res.send(groups);
});

const getGroup = catchAsync(async (req, res) => {
  const group = await groupService.getGroupById(req.params.groupId);
  res.send(group);
});

const joinGroup = catchAsync(async (req, res) => {
  const group = await groupService.addMember(req.params.groupId, req.user.id, { enforceOpen: true });
  
  // Send push notifications to all other group members about the new join
  try {
    const user = await User.findById(req.user.id).select('name');
    const userName = user?.name || 'Someone';

    const recipientIds = (group.members || []).map(m => String(m._id || m.id || m));
    if (group.admin) {
      recipientIds.push(String(group.admin._id || group.admin.id || group.admin));
    }

    const targets = [...new Set(recipientIds)].filter(id => id && id !== String(req.user.id));
    
    if (targets.length > 0) {
      const title = group.title || group.productName || 'Group Deal';
      const body = `${userName} has joined the group! 🎉`;
      const link = `/groups/${group.id || group._id}/chat`;
      const data = {
        type: 'group_join',
        roomId: String(group.id || group._id),
        userId: String(req.user.id),
        timestamp: String(Date.now()),
      };

      Promise.all(
        targets.map((id) => pushService.sendToUser(id, { title, body, link, data }))
      ).catch((err) => console.error('Error sending join notifications in batch:', err));
    }
  } catch (err) {
    console.error('Failed to notify group members about join:', err);
  }

  res.send(group);
});

const leaveGroup = catchAsync(async (req, res) => {
  const group = await groupService.removeMember(req.params.groupId, req.user.id);
  res.send(group);
});

const removeMember = catchAsync(async (req, res) => {
  const { groupId, userId } = req.params;
  const group = await groupService.getGroupById(groupId);
  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }

  const adminId = group.admin?._id || group.admin?.id || group.admin;
  if (String(adminId) !== String(req.user.id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only the group admin can remove members');
  }

  const updatedGroup = await groupService.removeMember(groupId, userId);
  res.send(updatedGroup);
});

module.exports = {
  createGroup,
  getGroups,
  getTrending,
  getGroup,
  joinGroup,
  leaveGroup,
  removeMember,
};
