const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const groupService = require('../services/group.service');

const createGroup = catchAsync(async (req, res) => {
  const group = await groupService.createGroup({ ...req.body, admin: req.user.id });
  res.status(httpStatus.CREATED).send(group);
});

const getGroups = catchAsync(async (req, res) => {
  const groups = await groupService.queryGroups(req.user.id, req.query);
  res.send(groups);
});

const getGroup = catchAsync(async (req, res) => {
  const group = await groupService.getGroupById(req.params.groupId);
  res.send(group);
});

const joinGroup = catchAsync(async (req, res) => {
  const group = await groupService.addMember(req.params.groupId, req.user.id);
  res.send(group);
});

const leaveGroup = catchAsync(async (req, res) => {
  const group = await groupService.removeMember(req.params.groupId, req.user.id);
  res.send(group);
});

module.exports = {
  createGroup,
  getGroups,
  getGroup,
  joinGroup,
  leaveGroup,
};
