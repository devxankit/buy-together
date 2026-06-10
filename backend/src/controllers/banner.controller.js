const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const bannerService = require('../services/banner.service');
const { pick } = require('../utils/helpers');

// Public: active banners for user homepage carousel
const listPublic = catchAsync(async (req, res) => {
  const banners = await bannerService.getActiveBanners();
  res.send(banners);
});

// Admin: full list (active + hidden) with search and status counts
const listAdmin = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'status']);
  const result = await bannerService.queryBanners(filter);
  res.send(result);
});

const getBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.getBannerById(req.params.bannerId);
  res.send(banner);
});

const createBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.createBanner(req.body);
  res.status(httpStatus.CREATED).send(banner);
});

const updateBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.updateBannerById(req.params.bannerId, req.body);
  res.send(banner);
});

const deleteBanner = catchAsync(async (req, res) => {
  await bannerService.deleteBannerById(req.params.bannerId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  listPublic,
  listAdmin,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
};
