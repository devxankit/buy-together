const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const homeSectionService = require('../services/homeSection.service');
const { pick } = require('../utils/helpers');

// Public: active sections (with populated groups) for the user home page.
const listPublic = catchAsync(async (req, res) => {
  const sections = await homeSectionService.getActiveHomeSections();
  res.send(sections);
});

// Admin: full list (active + hidden) with search and status counts.
const listAdmin = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'status']);
  const result = await homeSectionService.queryHomeSections(filter);
  res.send(result);
});

const getHomeSection = catchAsync(async (req, res) => {
  const section = await homeSectionService.getHomeSectionById(req.params.sectionId);
  res.send(section);
});

const createHomeSection = catchAsync(async (req, res) => {
  const section = await homeSectionService.createHomeSection(req.body);
  res.status(httpStatus.CREATED).send(section);
});

const updateHomeSection = catchAsync(async (req, res) => {
  const section = await homeSectionService.updateHomeSectionById(req.params.sectionId, req.body);
  res.send(section);
});

const deleteHomeSection = catchAsync(async (req, res) => {
  await homeSectionService.deleteHomeSectionById(req.params.sectionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  listPublic,
  listAdmin,
  getHomeSection,
  createHomeSection,
  updateHomeSection,
  deleteHomeSection,
};
