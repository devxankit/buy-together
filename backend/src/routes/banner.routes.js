const express = require('express');
const bannerController = require('../controllers/banner.controller');
const auth = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const bannerValidation = require('../validations/banner.validation');
const { publicCache } = require('../middlewares/cacheControl.middleware');

const router = express.Router();

// ── Public ──────────────────────────────────────────────────────────
// Active banners for the user app home page slider.
router.get('/', publicCache(), bannerController.listPublic);

// ── Admin (auth + admin role required) ────────────────────────────────
router.get(
  '/admin/list',
  auth,
  adminOnly,
  validate(bannerValidation.listBanners),
  bannerController.listAdmin
);

router.post(
  '/',
  auth,
  adminOnly,
  validate(bannerValidation.createBanner),
  bannerController.createBanner
);

router
  .route('/:bannerId')
  .get(
    auth,
    adminOnly,
    validate(bannerValidation.bannerId),
    bannerController.getBanner
  )
  .patch(
    auth,
    adminOnly,
    validate(bannerValidation.updateBanner),
    bannerController.updateBanner
  )
  .delete(
    auth,
    adminOnly,
    validate(bannerValidation.bannerId),
    bannerController.deleteBanner
  );

module.exports = router;
