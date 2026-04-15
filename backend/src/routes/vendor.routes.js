const express = require('express');
const vendorController = require('../controllers/vendor.controller');
const auth = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/', auth, vendorController.createVendor);
router.get('/', vendorController.getVendors);

module.exports = router;
