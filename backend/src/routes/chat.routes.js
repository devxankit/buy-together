const express = require('express');
const chatController = require('../controllers/chat.controller');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const chatValidation = require('../validations/chat.validation');

const router = express.Router();

router.post('/messages', auth, validate(chatValidation.sendMessage), chatController.sendMessage);
router.get('/messages/:groupId', auth, validate(chatValidation.getMessages), chatController.getMessages);

module.exports = router;
