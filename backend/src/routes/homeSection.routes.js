const express = require('express');
const homeSectionController = require('../controllers/homeSection.controller');
const auth = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const homeSectionValidation = require('../validations/homeSection.validation');
const { publicCache } = require('../middlewares/cacheControl.middleware');

const router = express.Router();

// ── Public ──────────────────────────────────────────────────────────
// Active, curated sections for the user app home page.
router.get('/', publicCache(), homeSectionController.listPublic);

// ── Admin (auth + admin role required) ────────────────────────────────
router.get(
  '/admin/list',
  auth,
  adminOnly,
  validate(homeSectionValidation.listHomeSections),
  homeSectionController.listAdmin
);

router.post(
  '/',
  auth,
  adminOnly,
  validate(homeSectionValidation.createHomeSection),
  homeSectionController.createHomeSection
);

router
  .route('/:sectionId')
  .get(
    auth,
    adminOnly,
    validate(homeSectionValidation.sectionId),
    homeSectionController.getHomeSection
  )
  .patch(
    auth,
    adminOnly,
    validate(homeSectionValidation.updateHomeSection),
    homeSectionController.updateHomeSection
  )
  .delete(
    auth,
    adminOnly,
    validate(homeSectionValidation.sectionId),
    homeSectionController.deleteHomeSection
  );

module.exports = router;
