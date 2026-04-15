const express = require('express');
const adminController = require('../controllers/admin.controller');
const auth = require('../middlewares/auth.middleware');
// Note: We would typically have an admin-check middleware here
const router = express.Router();

router.get('/stats', auth, adminController.getStats);

module.exports = router;
