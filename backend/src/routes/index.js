const express = require('express');
const authRoute = require('./auth.routes');
const userRoute = require('./user.routes');
const groupRoute = require('./group.routes');
const vendorRoute = require('./vendor.routes');
const dealRoute = require('./deal.routes');
const chatRoute = require('./chat.routes');
const adminRoute = require('./admin.routes');
const categoryRoute = require('./category.routes');
const uploadRoute = require('./upload.routes');
const bannerRoute = require('./banner.routes');
const homeSectionRoute = require('./homeSection.routes');
const fcmRoute = require('./fcm.routes');
const notificationRoute = require('./notification.routes');

const router = express.Router();

const defaultRoutes = [
  { path: '/auth', route: authRoute },
  { path: '/users', route: userRoute },
  { path: '/groups', route: groupRoute },
  { path: '/vendors', route: vendorRoute },
  { path: '/deals', route: dealRoute },
  { path: '/chat', route: chatRoute },
  { path: '/admin', route: adminRoute },
  { path: '/categories', route: categoryRoute },
  { path: '/uploads', route: uploadRoute },
  { path: '/banners', route: bannerRoute },
  { path: '/home-sections', route: homeSectionRoute },
  { path: '/fcm', route: fcmRoute },
  { path: '/notifications', route: notificationRoute },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
