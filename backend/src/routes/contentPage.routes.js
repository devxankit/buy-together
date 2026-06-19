const express = require('express');
const contentPageController = require('../controllers/contentPage.controller');
const auth = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const contentPageValidation = require('../validations/contentPage.validation');

const router = express.Router();

// ── Admin (auth + admin role) ───────────────────────────────────────
// Declared before the public `/:slug` route so `/admin/...` matches first.
router.get('/admin/list', auth, adminOnly, contentPageController.listPagesAdmin);

router
  .route('/admin/:slug')
  .get(auth, adminOnly, validate(contentPageValidation.getPage), contentPageController.getPageAdmin)
  .patch(auth, adminOnly, validate(contentPageValidation.updatePage), contentPageController.updatePage);

// ── Public ──────────────────────────────────────────────────────────
// Active content page by slug for the consumer app.
router.get('/:slug', validate(contentPageValidation.getPublicPage), contentPageController.getPublicPage);

module.exports = router;
