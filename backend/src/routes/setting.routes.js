const express = require('express');
const Setting = require('../models/Setting');
const catchAsync = require('../utils/catchAsync');
const { publicCache } = require('../middlewares/cacheControl.middleware');

const router = express.Router();

router.get('/public', publicCache(), catchAsync(async (req, res) => {
  const settings = await Setting.getSingleton();
  res.send({
    platformName: settings.platformName,
    liveStatsActiveGroups: settings.liveStatsActiveGroups,
    liveStatsActiveGroupsTrend: settings.liveStatsActiveGroupsTrend,
    liveStatsPeopleInterested: settings.liveStatsPeopleInterested,
    liveStatsPeopleInterestedTrend: settings.liveStatsPeopleInterestedTrend,
    liveStatsGroupsGrowing: settings.liveStatsGroupsGrowing,
    liveStatsGroupsGrowingTrend: settings.liveStatsGroupsGrowingTrend,
    liveStatsTopCity: settings.liveStatsTopCity,
    liveStatsTopCityTrend: settings.liveStatsTopCityTrend,
  });
}));

module.exports = router;
