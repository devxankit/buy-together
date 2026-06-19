const express = require('express');
const adminController = require('../controllers/admin.controller');
const chatController = require('../controllers/chat.controller');
const pushController = require('../controllers/push.controller');
const auth = require('../middlewares/auth.middleware');
const { adminOnly, superAdminOnly } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const adminValidation = require('../validations/admin.validation');
const pushValidation = require('../validations/push.validation');

const router = express.Router();

// Every admin route requires a valid token AND the admin role.
router.use(auth, adminOnly);

router.get('/stats', adminController.getStats);

// ── Settings, account & admin team ──────────────────────────────────
// General platform settings: any admin can read; only a super admin can update.
router
  .route('/settings')
  .get(adminController.getSettings)
  .patch(superAdminOnly, validate(adminValidation.updateSettings), adminController.updateSettings);

// Any admin can change their own password.
router.patch('/account/password', validate(adminValidation.changePassword), adminController.changePassword);

// Admin team management — super admin only.
router
  .route('/admins')
  .get(superAdminOnly, adminController.listAdmins)
  .post(superAdminOnly, validate(adminValidation.createAdminMember), adminController.createAdmin);

router
  .route('/admins/:adminId')
  .patch(superAdminOnly, validate(adminValidation.updateAdminMember), adminController.updateAdmin)
  .delete(superAdminOnly, validate(adminValidation.adminMemberId), adminController.deleteAdmin);

router
  .route('/users')
  .get(validate(adminValidation.listUsers), adminController.listUsers)
  .post(validate(adminValidation.createUser), adminController.createUser);

// Detailed buyer statistics for the Users dashboard. Must precede `/users/:userId`.
router.get('/users/stats', adminController.getUserStats);

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

// ── Chat moderation (read-only) ─────────────────────────────────────
// Read any group's chat transcript.
router.get('/groups/:groupId/messages', validate(adminValidation.groupId), chatController.adminGetGroupMessages);
// List a user's one-to-one conversations, and read a specific DM transcript.
router.get('/users/:userId/conversations', validate(adminValidation.userId), chatController.adminGetUserConversations);
router.get('/users/:userId/conversations/:otherUserId/messages', validate(adminValidation.userDmMessages), chatController.adminGetDmMessages);

// ── Fraud & risk ────────────────────────────────────────────────────
// Computes genuine risk signals from users/groups/membership data.
router.get('/fraud/signals', adminController.getFraudSignals);

// ── Push notifications ──────────────────────────────────────────────
// Separate endpoints for web vs. mobile-app delivery (plus an "all" combo).
router.post('/push/web', validate(pushValidation.sendBroadcast), pushController.sendWeb);
router.post('/push/mobile', validate(pushValidation.sendBroadcast), pushController.sendMobile);
router.post('/push/all', validate(pushValidation.sendBroadcast), pushController.sendAll);
router.get('/push/coverage', pushController.coverage);
router.get('/push/campaigns', validate(pushValidation.listCampaigns), pushController.campaigns);
router.post('/push/campaigns/bulk-delete', validate(pushValidation.bulkDeleteCampaigns), pushController.deleteCampaigns);
router.delete('/push/campaigns/:campaignId', validate(pushValidation.campaignId), pushController.deleteCampaign);

module.exports = router;
