const express = require('express');
const chatController = require('../controllers/chat.controller');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const chatValidation = require('../validations/chat.validation');

const router = express.Router();

router.post('/messages', auth, validate(chatValidation.sendMessage), chatController.sendMessage);
router.post('/messages/:groupId/:messageId/vote', auth, chatController.voteMessage);
router.post('/messages/:groupId/:messageId/pin', auth, chatController.pinMessage);
router.delete('/messages/:groupId/pin', auth, chatController.unpinMessage);
router.get('/messages/:groupId/pin', auth, chatController.getPinnedMessage);
router.get('/messages/:groupId', auth, validate(chatValidation.getMessages), chatController.getMessages);
router.get('/conversations', auth, chatController.getConversations);

module.exports = router;
