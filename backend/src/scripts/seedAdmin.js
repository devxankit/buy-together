/**
 * Seed (or update) the first admin account from .env credentials.
 *
 *   npm run seed:admin
 *
 * Reads ADMIN_NAME / ADMIN_EMAIL / ADMIN_PHONE / ADMIN_PASSWORD. Safe to re-run:
 * if an admin with the same email exists, its password/role are refreshed.
 */
const mongoose = require('mongoose');
const config = require('../config/env');
const logger = require('../utils/logger');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { normalizePhone } = require('../services/auth.service');
const { ROLES, USER_STATUS } = require('../utils/constants');

const run = async () => {
  const { name, email, phone, password } = config.admin;

  if (!email || !password || !phone) {
    logger.error('Cannot seed admin: ADMIN_EMAIL, ADMIN_PHONE and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  await mongoose.connect(config.mongoose.url, config.mongoose.options);
  logger.info('Connected to MongoDB for seeding');

  const normalizedPhone = normalizePhone(phone);
  let admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

  if (admin) {
    admin.name = name;
    admin.password = password; // re-hashed by pre-save hook
    admin.role = ROLES.ADMIN;
    admin.status = USER_STATUS.ACTIVE;
    await admin.save();
    logger.info(`Updated existing admin: ${email}`);
  } else {
    admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password,
      role: ROLES.ADMIN,
      status: USER_STATUS.ACTIVE,
    });
    logger.info(`Created admin: ${email}`);
  }

  // Remove any legacy admin users from the users collection to keep the database clean
  const deletedLegacy = await User.deleteMany({ role: ROLES.ADMIN });
  if (deletedLegacy.deletedCount > 0) {
    logger.info(`Cleaned up ${deletedLegacy.deletedCount} legacy admin users from users collection`);
  }

  logger.info(`Admin ready → email: ${email} | id: ${admin.id}`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (err) => {
  logger.error(`Seed failed: ${err.message}`);
  try {
    await mongoose.disconnect();
  } catch (_) {
    // ignore
  }
  process.exit(1);
});
