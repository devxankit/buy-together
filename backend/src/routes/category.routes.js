const express = require('express');
const categoryController = require('../controllers/category.controller');
const auth = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const categoryValidation = require('../validations/category.validation');

const router = express.Router();

// ── Public ──────────────────────────────────────────────────────────
// Active categories for the user app.
router.get('/', categoryController.listPublic);

// ── Admin (auth + admin role) ───────────────────────────────────────
router.get(
  '/admin/list',
  auth,
  adminOnly,
  validate(categoryValidation.listCategories),
  categoryController.listAdmin
);

router.post(
  '/',
  auth,
  adminOnly,
  validate(categoryValidation.createCategory),
  categoryController.createCategory
);

router
  .route('/:categoryId')
  .get(auth, adminOnly, validate(categoryValidation.categoryId), categoryController.getCategory)
  .patch(auth, adminOnly, validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .delete(auth, adminOnly, validate(categoryValidation.categoryId), categoryController.deleteCategory);

module.exports = router;
