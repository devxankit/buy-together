const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const adminService = require('../services/admin.service');
const { pick } = require('../utils/helpers');

const getStats = catchAsync(async (req, res) => {
  const stats = await adminService.getStats();
  res.send(stats);
});

const listUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'status', 'role', 'page', 'limit', 'sortBy']);
  const result = await adminService.queryUsers(filter);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await adminService.getUserById(req.params.userId);
  res.send(user);
});

const createUser = catchAsync(async (req, res) => {
  const user = await adminService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await adminService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await adminService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getStats,
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
