const express = require('express');
const groupController = require('../controllers/group.controller');
const auth = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/', auth, groupController.createGroup);
router.get('/', auth, groupController.getGroups);
router.get('/:groupId', auth, groupController.getGroup);

module.exports = router;
