const jwt = require('jsonwebtoken');
const httpStatus = require('http-status').status;
const config = require('../config/env');
const User = require('../models/User');
const Admin = require('../models/Admin');
const ApiError = require('../utils/ApiError');
const { ROLES, USER_STATUS } = require('../utils/constants');

/**
 * Verify the Bearer token, load the user, and attach it to req.user.
 * Rejects missing/invalid tokens, deleted accounts, and suspended accounts.
 */
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    let user;
    if (decoded.role === ROLES.ADMIN) {
      user = await Admin.findById(decoded.sub);
    } else {
      user = await User.findById(decoded.sub);
    }

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User no longer exists');
    }
    if (user.status === USER_STATUS.SUSPENDED) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Account suspended');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
  }
};

/**
 * Role gate. Use after `auth`, e.g. router.get('/x', auth, authorize(ROLES.ADMIN), handler).
 * With no roles passed, only checks that a user is authenticated.
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required'));
  }
  if (roles.length && !roles.includes(req.user.role)) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to perform this action'));
  }
  return next();
};

const adminOnly = authorize(ROLES.ADMIN);

/**
 * Gate for super-admin-only actions (managing other admins, platform settings).
 * Use after `auth` + `adminOnly`.
 */
const superAdminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.ADMIN || !req.user.isSuperAdmin) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'Only a super admin can perform this action'));
  }
  return next();
};

module.exports = auth;
module.exports.auth = auth;
module.exports.authorize = authorize;
module.exports.adminOnly = adminOnly;
module.exports.superAdminOnly = superAdminOnly;
