const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const categoryService = require('../services/category.service');
const { pick } = require('../utils/helpers');

// Public: active categories for the user app (carousel/filters).
const listPublic = catchAsync(async (req, res) => {
  const categories = await categoryService.getActiveCategories();
  res.send(categories);
});

// Admin: full list (active + hidden) with group usage counts.
const listAdmin = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'status']);
  const result = await categoryService.queryCategories(filter);
  res.send(result);
});

const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);
  res.send(category);
});

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).send(category);
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);
  res.send(category);
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.categoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  listPublic,
  listAdmin,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
