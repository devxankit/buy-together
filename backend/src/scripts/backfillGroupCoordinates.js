/**
 * Backfill `coordinates { lat, lng }` for groups that were created before the
 * Explore page started sorting by distance. Older groups only have a `location`
 * string (e.g. "Indore, Madhya Pradesh") — this script geocodes that string into
 * a pinpoint via the Google Geocoding API so they can be ranked by distance.
 *
 *   npm run backfill:coords
 *
 * Safe to re-run: only groups that have a `location` but no usable coordinates
 * are touched. Groups already carrying coordinates (admin-picked or previously
 * backfilled) are skipped. Groups without any location string are left as-is —
 * there's nothing to geocode.
 *
 * Requires MAPS_API_KEY in the backend .env (the Geocoding API must be enabled
 * for that key in the Google Cloud console). Requests are throttled to stay
 * comfortably under Google's per-second quota.
 */
const mongoose = require('mongoose');
const config = require('../config/env');
const logger = require('../utils/logger');
const Group = require('../models/Group');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Geocode a free-text address into { lat, lng } via the Google Geocoding HTTP
 * API. Returns null when the address can't be resolved or the request fails.
 */
const geocode = async (address, key) => {
  const url =
    'https://maps.googleapis.com/maps/api/geocode/json' +
    `?address=${encodeURIComponent(address)}&key=${encodeURIComponent(key)}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status === 'OK' && data.results[0]) {
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  }
  // OVER_QUERY_LIMIT / REQUEST_DENIED / INVALID_REQUEST / ZERO_RESULTS
  logger.warn(`  geocode "${address}" → ${data.status}${data.error_message ? `: ${data.error_message}` : ''}`);
  return null;
};

const run = async () => {
  const key = config.maps.apiKey;
  if (!key) {
    logger.error('MAPS_API_KEY is not set — cannot geocode. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(config.mongoose.url, config.mongoose.options);
  logger.info('Connected to MongoDB for coordinate backfill');

  // Groups that have a location string but no usable pinpoint yet.
  const pending = await Group.find({
    location: { $exists: true, $nin: [null, ''] },
    $or: [
      { coordinates: { $exists: false } },
      { 'coordinates.lat': null },
      { 'coordinates.lat': { $exists: false } },
    ],
  }).select('title location coordinates');

  logger.info(`Found ${pending.length} group(s) needing coordinates`);

  let updated = 0;
  let failed = 0;

  for (const group of pending) {
    const coords = await geocode(group.location, key);
    if (coords) {
      group.coordinates = coords;
      await group.save();
      updated += 1;
      logger.info(`  ✓ ${group.title} (${group.location}) → ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
    } else {
      failed += 1;
    }
    // Throttle: ~5 requests/sec, well within Google's default quota.
    await sleep(200);
  }

  logger.info(`Backfill complete → ${updated} updated, ${failed} could not be geocoded, ${pending.length} total`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (err) => {
  logger.error(`Coordinate backfill failed: ${err.message}`);
  try {
    await mongoose.disconnect();
  } catch (_) {
    // ignore
  }
  process.exit(1);
});
