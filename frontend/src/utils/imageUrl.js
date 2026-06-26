/**
 * Optimized image URLs.
 *
 * Project images are uploaded to Cloudinary. By default the stored URL serves
 * the FULL original (often 1–3 MB) on every screen, which dominates first-load
 * time on image-heavy pages. `cldImg` injects Cloudinary delivery transforms so
 * the browser instead downloads a right-sized, modern-format (WebP/AVIF),
 * auto-quality image:
 *
 *   f_auto    → best format the browser supports (AVIF/WebP)
 *   q_auto    → automatic quality (visually lossless, much smaller)
 *   dpr_auto  → serve a sharper image on retina without hardcoding 2x
 *   w_<n>/c_  → cap the pixel width to what's actually rendered
 *
 * Non-Cloudinary URLs (Unsplash fallbacks, ui-avatars) are returned unchanged.
 * Idempotent — safe to call on an already-transformed URL.
 *
 *   cldImg(url, { w: 128 })          // ~128px wide
 *   cldImg(url, { w: 320, h: 190 })  // fixed box, cropped to fill
 */
export const cldImg = (url, { w, h, crop = 'fill' } = {}) => {
  if (!url || typeof url !== 'string') return url;

  const marker = '/image/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url; // not a Cloudinary delivery URL

  const after = url.slice(idx + marker.length);
  if (after.startsWith('f_auto')) return url; // already transformed — leave it

  const parts = ['f_auto', 'q_auto', 'dpr_auto'];
  if (w) parts.push(`w_${Math.round(w)}`);
  if (h) parts.push(`h_${Math.round(h)}`);
  if ((w || h) && crop) parts.push(`c_${crop}`);

  return `${url.slice(0, idx + marker.length)}${parts.join(',')}/${after}`;
};

export default cldImg;
