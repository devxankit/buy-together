const httpStatus = require('http-status').status;
const groupService = require('../services/group.service');

const createGroup = async (req, res) => {
  const group = await groupService.createGroup({ ...req.body, admin: req.user.sub });
  res.status(httpStatus.CREATED).send(group);
};

const getGroups = async (req, res) => {
  const groups = await groupService.queryGroups(req.user.sub);
  res.send(groups);
};

const getGroup = async (req, res) => {
  const group = await groupService.getGroupById(req.params.groupId);
  res.send(group);
};

module.exports = {
  createGroup,
  getGroups,
  getGroup,
};
