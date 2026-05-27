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

module.exports = router;
