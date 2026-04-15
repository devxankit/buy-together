const express = require('express');
const dealController = require('../controllers/deal.controller');
const auth = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/', auth, dealController.createDeal);
router.get('/', dealController.getDeals);

module.exports = router;
