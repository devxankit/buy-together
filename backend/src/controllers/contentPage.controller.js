const catchAsync = require('../utils/catchAsync');
const contentPageService = require('../services/contentPage.service');
const { pick } = require('../utils/helpers');

// Public: a single active page by slug for the consumer app.
const getPublicPage = catchAsync(async (req, res) => {
  const page = await contentPageService.getPublicPage(req.params.slug);
  res.send(page);
});

// Admin: list all editable pages.
const listPagesAdmin = catchAsync(async (req, res) => {
  const pages = await contentPageService.listPagesAdmin();
  res.send(pages);
});

const getPageAdmin = catchAsync(async (req, res) => {
  const page = await contentPageService.getPageBySlugAdmin(req.params.slug);
  res.send(page);
});

const updatePage = catchAsync(async (req, res) => {
  const body = pick(req.body, ['title', 'intro', 'lastUpdated', 'contactEmail', 'sections', 'isActive']);
  const page = await contentPageService.updatePageBySlug(req.params.slug, body);
  res.send(page);
});

module.exports = {
  getPublicPage,
  listPagesAdmin,
  getPageAdmin,
  updatePage,
};
