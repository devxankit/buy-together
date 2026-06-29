/**
 * Redis-backed rate limiting.
 * ---------------------------
 * Protects the abuse-prone auth endpoints (OTP send/verify, login) from spam
 * and brute force, and shields MongoDB + the SMS provider from request floods.
 *
 * Backing store:
 *   - When Redis is up, counters live in Redis so the limit is enforced ACROSS
 *     all app instances/PM2 workers (a per-process memory counter would let an
 *     attacker get N× the limit by spreading requests across workers).
 *   - `insuranceLimiter` is an in-memory limiter that rate-limiter-flexible
 *     automatically falls back to if a Redis command errors mid-request — so a
 *     Redis hiccup degrades to per-process limiting instead of failing open.
 *   - If Redis isn't configured at all, we use the memory limiter directly.
 *
 * The limiter is built lazily on first use: routes are wired at require-time
 * (before Redis connects), and by the time the first request arrives Redis has
 * settled into ready or memory-only mode, so we pick the right backend then.
 */
const { RateLimiterRedis, RateLimiterMemory } = require('rate-limiter-flexible');
const httpStatus = require('http-status').status;
const redis = require('../config/redis');
const ApiError = require('../utils/ApiError');

/**
 * Build a rate-limit middleware.
 * @param {object} opts
 * @param {string} opts.keyPrefix  unique namespace for this limiter's counters
 * @param {number} opts.points     allowed hits per `duration`
 * @param {number} opts.duration   window length in seconds
 * @param {number} [opts.blockDuration] seconds to block once the limit is hit
 * @param {(req)=>string} [opts.keyResolver] what to key on (default: client IP)
 */
const createRateLimiter = ({ keyPrefix, points, duration, blockDuration = duration, keyResolver }) => {
  let limiter; // lazily initialised singleton

  const build = () => {
    const base = { keyPrefix, points, duration, blockDuration };
    if (redis.isReady() && redis.getClient()) {
      return new RateLimiterRedis({
        ...base,
        storeClient: redis.getClient(),
        // Fall back to per-process limiting if Redis errors during a request.
        insuranceLimiter: new RateLimiterMemory(base),
      });
    }
    return new RateLimiterMemory(base);
  };

  const resolveKey = keyResolver || ((req) => req.ip);

  return async (req, res, next) => {
    if (!limiter) limiter = build();
    const key = resolveKey(req) || req.ip || 'unknown';
    try {
      await limiter.consume(String(key));
      next();
    } catch (rejection) {
      // A thrown RateLimiterRes means the limit was exceeded; an actual error
      // (shouldn't happen thanks to insuranceLimiter) we also treat as 429.
      const retrySec = Math.max(1, Math.round((rejection?.msBeforeNext || 1000) / 1000));
      res.set('Retry-After', String(retrySec));
      next(new ApiError(httpStatus.TOO_MANY_REQUESTS, `Too many requests. Please try again in ${retrySec}s.`));
    }
  };
};

// Key OTP limits by phone number so abuse can't be spread across IPs (and SMS
// cost is bounded per number); fall back to IP if the body has no phone.
const phoneKey = (req) => (req.body && req.body.phone ? `phone:${req.body.phone}` : req.ip);

// 5 OTP sends per 10 min per phone; block 10 min once tripped.
const otpSendLimiter = createRateLimiter({
  keyPrefix: 'rl:otp-send',
  points: 5,
  duration: 600,
  blockDuration: 600,
  keyResolver: phoneKey,
});

// 10 OTP verification attempts per 10 min per phone.
const otpVerifyLimiter = createRateLimiter({
  keyPrefix: 'rl:otp-verify',
  points: 10,
  duration: 600,
  blockDuration: 600,
  keyResolver: phoneKey,
});

// 10 login attempts per 5 min per IP.
const loginLimiter = createRateLimiter({
  keyPrefix: 'rl:login',
  points: 10,
  duration: 300,
  blockDuration: 300,
});

module.exports = {
  createRateLimiter,
  otpSendLimiter,
  otpVerifyLimiter,
  loginLimiter,
};
