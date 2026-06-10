const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const adminService = require('../services/admin.service');
const vendorService = require('../services/vendor.service');
const groupService = require('../services/group.service');
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

// ── Vendors ─────────────────────────────────────────────────────────
const listVendors = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'status', 'kyc', 'category', 'page', 'limit', 'sortBy']);
  const result = await vendorService.queryVendorsAdmin(filter);
  res.send(result);
});

const getVendor = catchAsync(async (req, res) => {
  const vendor = await vendorService.getVendorByIdAdmin(req.params.vendorId);
  res.send(vendor);
});

const createVendor = catchAsync(async (req, res) => {
  const vendor = await vendorService.createVendorAdmin(req.body);
  res.status(httpStatus.CREATED).send(vendor);
});

const updateVendor = catchAsync(async (req, res) => {
  const vendor = await vendorService.updateVendorByIdAdmin(req.params.vendorId, req.body);
  res.send(vendor);
});

const deleteVendor = catchAsync(async (req, res) => {
  await vendorService.deleteVendorByIdAdmin(req.params.vendorId);
  res.status(httpStatus.NO_CONTENT).send();
});

const approveVendor = catchAsync(async (req, res) => {
  const vendor = await vendorService.approveVendor(req.params.vendorId);
  res.send(vendor);
});

const rejectVendor = catchAsync(async (req, res) => {
  const vendor = await vendorService.rejectVendor(req.params.vendorId, req.body?.reason);
  res.send(vendor);
});

// ── Groups ──────────────────────────────────────────────────────────
const listGroups = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'status', 'category', 'page', 'limit', 'sortBy']);
  const result = await groupService.queryGroupsAdmin(filter);
  res.send(result);
});

const getGroup = catchAsync(async (req, res) => {
  const group = await groupService.getGroupByIdAdmin(req.params.groupId);
  res.send(group);
});

const createGroup = catchAsync(async (req, res) => {
  const group = await groupService.createGroupAdmin(req.body);
  res.status(httpStatus.CREATED).send(group);
});

const updateGroup = catchAsync(async (req, res) => {
  const group = await groupService.updateGroupByIdAdmin(req.params.groupId, req.body);
  res.send(group);
});

const deleteGroup = catchAsync(async (req, res) => {
  await groupService.deleteGroupByIdAdmin(req.params.groupId);
  res.status(httpStatus.NO_CONTENT).send();
});

const addGroupMember = catchAsync(async (req, res) => {
  const group = await groupService.addMember(req.params.groupId, req.body.userId);
  res.send(group);
});

const removeGroupMember = catchAsync(async (req, res) => {
  const group = await groupService.removeMember(req.params.groupId, req.params.userId);
  res.send(group);
});

module.exports = {
  getStats,
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  listVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
  approveVendor,
  rejectVendor,
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  addGroupMember,
  removeGroupMember,
};
