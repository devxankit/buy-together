const express = require('express');
const authRoute = require('./auth.routes');
const userRoute = require('./user.routes');
const groupRoute = require('./group.routes');
const vendorRoute = require('./vendor.routes');
const dealRoute = require('./deal.routes');
const chatRoute = require('./chat.routes');
const adminRoute = require('./admin.routes');

const router = express.Router();

const defaultRoutes = [
  { path: '/auth', route: authRoute },
  { path: '/users', route: userRoute },
  { path: '/groups', route: groupRoute },
  { path: '/vendors', route: vendorRoute },
  { path: '/deals', route: dealRoute },
  { path: '/chat', route: chatRoute },
  { path: '/admin', route: adminRoute },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
