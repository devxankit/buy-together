const express = require('express');
const adminController = require('../controllers/admin.controller');
const auth = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const adminValidation = require('../validations/admin.validation');

const router = express.Router();

// Every admin route requires a valid token AND the admin role.
router.use(auth, adminOnly);

router.get('/stats', adminController.getStats);

router
  .route('/users')
  .get(validate(adminValidation.listUsers), adminController.listUsers)
  .post(validate(adminValidation.createUser), adminController.createUser);

router
  .route('/users/:userId')
  .get(validate(adminValidation.userId), adminController.getUser)
  .patch(validate(adminValidation.updateUser), adminController.updateUser)
  .delete(validate(adminValidation.userId), adminController.deleteUser);

// ── Vendors ─────────────────────────────────────────────────────────
router
  .route('/vendors')
  .get(validate(adminValidation.listVendors), adminController.listVendors)
  .post(validate(adminValidation.createVendor), adminController.createVendor);

router
  .route('/vendors/:vendorId')
  .get(validate(adminValidation.vendorId), adminController.getVendor)
  .patch(validate(adminValidation.updateVendor), adminController.updateVendor)
  .delete(validate(adminValidation.vendorId), adminController.deleteVendor);

router.post('/vendors/:vendorId/approve', validate(adminValidation.vendorId), adminController.approveVendor);
router.post('/vendors/:vendorId/reject', validate(adminValidation.rejectVendor), adminController.rejectVendor);

// ── Groups ──────────────────────────────────────────────────────────
router
  .route('/groups')
  .get(validate(adminValidation.listGroups), adminController.listGroups)
  .post(validate(adminValidation.createGroup), adminController.createGroup);

router
  .route('/groups/:groupId')
  .get(validate(adminValidation.groupId), adminController.getGroup)
  .patch(validate(adminValidation.updateGroup), adminController.updateGroup)
  .delete(validate(adminValidation.groupId), adminController.deleteGroup);

router
  .route('/groups/:groupId/members')
  .post(validate(adminValidation.addGroupMember), adminController.addGroupMember);

router
  .route('/groups/:groupId/members/:userId')
  .delete(validate(adminValidation.groupMember), adminController.removeGroupMember);

module.exports = router;
