/**
 * Seed the home page with real groups + curated home sections that reproduce
 * the original hard-coded mock layout (same headings, groups, images, counts
 * and order) — now fully backed by the database.
 *
 *   npm run seed:home
 *
 * Safe to re-run: previously seeded groups/sections (tagged with SEED_MARKER /
 * matching titles) are removed first, then recreated. Admin-created groups and
 * sections are left untouched.
 *
 * The "joined" count on each card is derived from `members.length`, so we pad
 * each group with that many synthetic member ObjectIds to match the original
 * numbers exactly. The public home feed only counts these ids (never populates
 * them), so no real user records are created or polluted.
 */
const mongoose = require('mongoose');
const config = require('../config/env');
const logger = require('../utils/logger');
const Group = require('../models/Group');
const HomeSection = require('../models/HomeSection');
const { GROUP_STATUS, GROUP_TYPE } = require('../utils/constants');

// Tag stamped on every group this script creates, so re-runs can clean up.
const SEED_MARKER = 'seed:home';

// Build N synthetic member ids so `spotsJoined` (members.length) matches.
const members = (n) => Array.from({ length: n }, () => new mongoose.Types.ObjectId());

// closesAt that renders as exactly "<days>d left" via the Group virtual,
// which ceils the remaining days. Sitting half a day under the target keeps
// the ceiling on `days` for the whole first day after seeding.
const closesIn = (days) => new Date(Date.now() + (days - 0.5) * 86400000);

/**
 * Each section: heading, layout, order, optional See-All link, and its groups.
 * Group fields mirror the old mock cards 1:1 — `slogan` becomes the card
 * subtitle, `image` the cover, `spotsTotal` the target, members → joined count.
 */
const SECTIONS = [
  {
    title: 'Hot Buying Groups',
    layout: 'carousel',
    viewAllLink: '/groups',
    groups: [
      { title: 'iPhone 15 Pro', slogan: 'Get up to ₹8,000 OFF', category: 'Smartphones', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=180&q=80', joined: 28, spotsTotal: 50, days: 2 },
      { title: 'MacBook Air M3', slogan: 'Save up to ₹12,000', category: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=180&q=80', joined: 16, spotsTotal: 30, days: 3 },
      { title: 'LG 55" 4K TV', slogan: 'Save up to ₹6,500', category: 'Electronics', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=180&q=80', joined: 34, spotsTotal: 60, days: 4 },
      { title: 'Samsung Washer', slogan: 'Save up to ₹5,500', category: 'Appliances', image: 'https://images.unsplash.com/photo-1610557892470-76d74cd120a8?auto=format&fit=crop&w=180&q=80', joined: 18, spotsTotal: 40, days: 2 },
    ],
  },
  {
    title: 'Active Groups You Might Like',
    layout: 'list',
    viewAllLink: '/groups',
    groups: [
      { title: 'MacBook Air M3', slogan: 'Looking for the best student deal', category: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=120&q=80', joined: 45, spotsTotal: 55, days: 5 },
      { title: 'Gym Membership', slogan: 'Affordable gyms in Indore', category: 'Fitness', location: 'Indore', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=120&q=80', joined: 22, spotsTotal: 29, days: 6 },
      { title: 'Zomato Gold Group Buy', slogan: "Let's get maximum discount!", category: 'Subscriptions', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=120&q=80', joined: 112, spotsTotal: 132, days: 4 },
      { title: 'Spotify Premium Family', slogan: 'Need 3 more people', category: 'Subscriptions', image: 'https://images.unsplash.com/photo-1614680376593-902f74a9539d?auto=format&fit=crop&w=120&q=80', joined: 3, spotsTotal: 6, days: 7 },
      { title: 'Netflix 4K Plan', slogan: 'Looking to share screen limit', category: 'Subscriptions', image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=120&q=80', joined: 2, spotsTotal: 4, days: 8 },
      { title: 'Sony PS5 Disk Edition', slogan: 'Bulk buy for max discount', category: 'Electronics', image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=120&q=80', joined: 8, spotsTotal: 13, days: 5 },
      { title: 'Amazon Prime Yearly', slogan: 'Join to share benefits', category: 'Subscriptions', image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=120&q=80', joined: 1, spotsTotal: 5, days: 9 },
      { title: 'Myntra End of Reason Sale', slogan: 'Buy 5 get 50% OFF', category: 'Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=120&q=80', joined: 2, spotsTotal: 5, days: 3 },
      { title: 'Youtube Premium Family', slogan: 'No more ads, need 4 users', category: 'Subscriptions', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=120&q=80', joined: 2, spotsTotal: 6, days: 6 },
    ],
  },
  {
    title: 'Trending in Fashion',
    layout: 'carousel',
    viewAllLink: '/categories',
    groups: [
      { title: 'Puma Running Shoes', slogan: 'Puma Factory Outlet', category: 'Fashion', subCategory: 'Footwear', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=200&q=80', joined: 15, spotsTotal: 20, days: 3 },
      { title: 'H&M Summer Collection', slogan: 'H&M Infinity Mall', category: 'Fashion', image: 'https://images.unsplash.com/photo-1489987707023-af827052efa1?auto=format&fit=crop&w=200&q=80', joined: 40, spotsTotal: 50, days: 1 },
      { title: "Levi's Denim Jackets", slogan: "Levi's Phoenix Market", category: 'Fashion', image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=200&q=80', joined: 8, spotsTotal: 15, days: 1 },
    ],
  },
  {
    title: 'Weekly Groceries Deals',
    layout: 'carousel',
    viewAllLink: '/categories',
    groups: [
      { title: 'Aashirvaad Atta 10kg', slogan: 'DMart Malad', category: 'Groceries', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80', joined: 85, spotsTotal: 100, days: 5 },
      { title: 'Fresh Alphonso Mangoes', slogan: 'APMC Market', category: 'Groceries', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=200&q=80', joined: 42, spotsTotal: 50, days: 1 },
      { title: 'Amul Butter 500g', slogan: 'Star Bazaar', category: 'Groceries', image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=200&q=80', joined: 120, spotsTotal: 150, days: 2 },
    ],
  },
  {
    title: 'Co-Own Properties & Spaces',
    layout: 'carousel',
    viewAllLink: '/categories',
    groups: [
      { title: 'Fractional Beach Villa', slogan: 'Goa co-buy: 10% Share', category: 'Property', location: 'Goa', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80', joined: 4, spotsTotal: 10, days: 15 },
      { title: 'Commercial Office Space', slogan: 'Bengaluru Tech Park', category: 'Property', location: 'Bengaluru', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80', joined: 7, spotsTotal: 15, days: 8 },
      { title: 'Premium Co-Living Hub', slogan: 'Mumbai Rent & Deposit Split', category: 'Property', location: 'Mumbai', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=200&q=80', joined: 3, spotsTotal: 4, days: 2 },
    ],
  },
  {
    title: 'Vehicle Co-Leasing & EV Pools',
    layout: 'carousel',
    viewAllLink: '/categories',
    groups: [
      { title: 'Tesla Model Y Lease', slogan: 'Pune premium co-lease pool', category: 'Vehicles', location: 'Pune', image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=200&q=80', joined: 2, spotsTotal: 5, days: 12 },
      { title: 'Ather 450X EV Scooter', slogan: 'Bulk discount of ₹15,000', category: 'Vehicles', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=200&q=80', joined: 12, spotsTotal: 20, days: 4 },
      { title: 'Thar Roxx Offroader', slogan: 'Indore club bulk deal', category: 'Vehicles', location: 'Indore', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=200&q=80', joined: 18, spotsTotal: 25, days: 6 },
    ],
  },
];

const run = async () => {
  await mongoose.connect(config.mongoose.url, config.mongoose.options);
  logger.info('Connected to MongoDB for home seeding');

  // ── Clean previous seed run (leave admin-created content alone) ──
  const seededTitles = SECTIONS.map((s) => s.title);
  const delGroups = await Group.deleteMany({ creatorName: SEED_MARKER });
  const delSections = await HomeSection.deleteMany({ title: { $in: seededTitles } });
  logger.info(`Cleared previous seed: ${delGroups.deletedCount} groups, ${delSections.deletedCount} sections`);

  // ── Recreate groups + sections ──
  let order = 0;
  let totalGroups = 0;
  for (const section of SECTIONS) {
    const created = await Group.insertMany(
      section.groups.map((g) => ({
        title: g.title,
        slogan: g.slogan,
        productName: g.productName || g.title,
        category: g.category || '',
        subCategory: g.subCategory || '',
        location: g.location || '',
        image: g.image,
        type: GROUP_TYPE.USER,
        status: GROUP_STATUS.ACTIVE,
        spotsTotal: g.spotsTotal,
        members: members(g.joined),
        closesAt: closesIn(g.days),
        creatorName: SEED_MARKER,
      }))
    );
    totalGroups += created.length;

    await HomeSection.create({
      title: section.title,
      layout: section.layout,
      viewAllLink: section.viewAllLink || '',
      isActive: true,
      displayOrder: order,
      groups: created.map((g) => g._id),
    });

    logger.info(`Seeded section "${section.title}" (${section.layout}) with ${created.length} groups @ order ${order}`);
    order += 1;
  }

  logger.info(`Home seed complete → ${SECTIONS.length} sections, ${totalGroups} groups`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (err) => {
  logger.error(`Home seed failed: ${err.message}`);
  try {
    await mongoose.disconnect();
  } catch (_) {
    // ignore
  }
  process.exit(1);
});
