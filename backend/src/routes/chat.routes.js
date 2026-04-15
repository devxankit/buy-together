const express = require('express');
const chatController = require('../controllers/chat.controller');
const auth = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/messages', auth, chatController.sendMessage);
router.get('/messages/:groupId', auth, chatController.getMessages);

module.exports = router;
