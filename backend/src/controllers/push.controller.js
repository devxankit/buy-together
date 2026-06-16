const catchAsync = require('../utils/catchAsync');
const pushService = require('../services/push.service');

/**
 * Admin: broadcast a push notification. The target platform is taken from the
 * route ('web' | 'mobile' | 'all') so the console has explicit, separate
 * endpoints for browser vs. mobile-app delivery.
 */
const send = (platform) =>
  catchAsync(async (req, res) => {
    const { title, body, image, link } = req.body;
    const campaign = await pushService.broadcast({
      platform,
      title,
      body,
      image,
      link,
      sentBy: req.user.id,
      sentByName: req.user.name,
    });
    res.send({ success: true, campaign });
  });

const sendWeb = send('web');
const sendMobile = send('mobile');
const sendAll = send('all');

// Token coverage stats for the compose page.
const coverage = catchAsync(async (req, res) => {
  const stats = await pushService.getCoverage();
  res.send(stats);
});

// Recent broadcast history.
const campaigns = catchAsync(async (req, res) => {
  const list = await pushService.listCampaigns(Number(req.query.limit) || 20);
  res.send({ results: list });
});

module.exports = { sendWeb, sendMobile, sendAll, coverage, campaigns };
