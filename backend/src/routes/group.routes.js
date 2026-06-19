const express = require('express');
const groupController = require('../controllers/group.controller');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const groupValidation = require('../validations/group.validation');

const router = express.Router();

router.post('/', auth, validate(groupValidation.createGroup), groupController.createGroup);
router.get('/', auth, groupController.getGroups);
// Public trending list — declared before '/:groupId' so it isn't matched as one.
router.get('/trending', groupController.getTrending);
router.post('/:groupId/join', auth, groupController.joinGroup);
router.post('/:groupId/leave', auth, groupController.leaveGroup);
router.delete('/:groupId/members/:userId', auth, groupController.removeMember);
router.get('/:groupId', auth, groupController.getGroup);

module.exports = router;
