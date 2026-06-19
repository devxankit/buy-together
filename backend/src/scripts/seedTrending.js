/**
 * Seed the consumer app's "Trending Right Now" carousel (Groups page) with the
 * same items it previously hard-coded — now flagged via `trending: true` so the
 * list is fully controllable from the admin Groups console.
 *
 *   npm run seed:trending
 *
 * Safe to re-run: previously seeded trending groups (tagged with SEED_MARKER)
 * are removed first, then recreated. Admin-created/flagged groups are untouched.
 *
 * The card's "joined" count comes from `members.length`, so each group is padded
 * with that many synthetic member ObjectIds to match the original numbers. The
 * trending feed never populates those ids, so no real users are created.
 */
const mongoose = require('mongoose');
const config = require('../config/env');
const logger = require('../utils/logger');
const Group = require('../models/Group');
const { GROUP_STATUS, GROUP_TYPE } = require('../utils/constants');

// Tag stamped on every group this script creates, so re-runs can clean up.
const SEED_MARKER = 'seed:trending';

const members = (n) => Array.from({ length: n }, () => new mongoose.Types.ObjectId());

// closesAt that renders as "<days>d left" via the Group virtual (which ceils
// the remaining days). Sitting half a day under keeps the ceiling stable.
const closesIn = (days) => new Date(Date.now() + (days - 0.5) * 86400000);

// `slogan` is what the trending card shows as its green "OFF" badge subtitle.
const TRENDING = [
  { title: 'iPhone 15 Pro', slogan: '₹8,000 OFF', category: 'Smartphones', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=150&q=80', joined: 28, spotsTotal: 50, days: 2 },
  { title: 'MacBook Air M3', slogan: '₹12,000 OFF', category: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=150&q=80', joined: 16, spotsTotal: 30, days: 3 },
  { title: 'LG 55" 4K TV', slogan: '₹6,500 OFF', category: 'Electronics', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=150&q=80', joined: 34, spotsTotal: 60, days: 4 },
  { title: 'Samsung Washer', slogan: '₹5,000 OFF', category: 'Appliances', image: 'https://images.unsplash.com/photo-1610557892470-76d74cd120a8?auto=format&fit=crop&w=150&q=80', joined: 18, spotsTotal: 40, days: 2 },
];

const run = async () => {
  await mongoose.connect(config.mongoose.url, config.mongoose.options);
  logger.info('Connected to MongoDB for trending seeding');

  // ── Clean previous seed run (leave admin-flagged groups alone) ──
  const del = await Group.deleteMany({ creatorName: SEED_MARKER });
  logger.info(`Cleared previous trending seed: ${del.deletedCount} groups`);

  // ── Recreate trending groups ──
  const created = await Group.insertMany(
    TRENDING.map((g) => ({
      title: g.title,
      slogan: g.slogan,
      productName: g.title,
      category: g.category,
      image: g.image,
      type: GROUP_TYPE.USER,
      status: GROUP_STATUS.ACTIVE,
      trending: true,
      spotsTotal: g.spotsTotal,
      members: members(g.joined),
      closesAt: closesIn(g.days),
      creatorName: SEED_MARKER,
    }))
  );

  logger.info(`Trending seed complete → ${created.length} groups flagged as trending`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (err) => {
  logger.error(`Trending seed failed: ${err.message}`);
  try {
    await mongoose.disconnect();
  } catch (_) {
    // ignore
  }
  process.exit(1);
});
