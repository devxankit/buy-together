const express = require('express');
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/profile', auth, userController.getProfile);
router.patch('/profile', auth, userController.updateProfile);

// Wishlist — declared before '/:userId' so these segments aren't matched as ids.
router.get('/wishlist', auth, userController.getWishlist);
router.post('/wishlist/:groupId', auth, userController.toggleWishlist);

router.get('/:userId', auth, userController.getUserPublicProfile);

module.exports = router;
