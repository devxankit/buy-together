/**
 * Cache-Control for slow-changing PUBLIC, non-personalized responses
 * (active categories, banners, home sections, public settings).
 *
 * `stale-while-revalidate` lets the browser (and any CDN in front) serve the
 * copy it already has instantly, then refresh it in the background — so a
 * returning user paints from disk cache with zero network wait. The window is
 * kept short because admin writes bust the in-process server cache immediately;
 * this header only governs how long a client may reuse an already-downloaded
 * copy before checking again.
 *
 * Only use on endpoints whose body is identical for every user.
 */
const publicCache = ({ maxAge = 60, swr = 300 } = {}) => (req, res, next) => {
  res.set('Cache-Control', `public, max-age=${maxAge}, stale-while-revalidate=${swr}`);
  next();
};

module.exports = { publicCache };
