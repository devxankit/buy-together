const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const pushService = require('../services/push.service');

// Register a WEB browser FCM token for the logged-in user.
const registerWeb = catchAsync(async (req, res) => {
  await pushService.saveToken(req.user.id, req.body.token, 'web');
  res.send({ success: true, message: 'Web FCM token registered' });
});

// Register a MOBILE app (Flutter/native) FCM token for the logged-in user.
const registerMobile = catchAsync(async (req, res) => {
  await pushService.saveToken(req.user.id, req.body.token, 'mobile');
  res.send({ success: true, message: 'Mobile FCM token registered' });
});

// Remove a token (logout / permission revoked). Body: { token, platform? }
const unregister = catchAsync(async (req, res) => {
  await pushService.removeToken(req.user.id, req.body.token, req.body.platform || 'web');
  res.send({ success: true, message: 'FCM token removed' });
});

// Send a test notification to the caller's own devices.
const test = catchAsync(async (req, res) => {
  const result = await pushService.sendToUser(req.user.id, {
    title: req.body.title || 'Test notification 🔔',
    body: req.body.body || 'Push notifications are working!',
    link: req.body.link || '/',
  });
  res.send({ success: true, result: result || { success: 0, recipients: 0 } });
});

module.exports = { registerWeb, registerMobile, unregister, test };
