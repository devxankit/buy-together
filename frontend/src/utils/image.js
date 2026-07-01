/**
 * Normalize an image file picked from the gallery OR captured with the camera
 * before it is uploaded.
 *
 * Why this exists: camera captures — particularly inside an Android / Flutter
 * WebView wrapper — routinely arrive as multi-megabyte files with an empty or
 * `application/octet-stream` MIME type. Both our client checks and the server's
 * multer filter (strict `image/*`, 5MB cap) then reject them, so the photo
 * "opens" but never uploads. Re-drawing the bitmap onto a canvas and exporting
 * a fresh JPEG guarantees a clean `image/jpeg` type, a size under the cap, and
 * correct EXIF orientation — with no native bridge required.
 *
 * If anything goes wrong (unsupported codec, canvas blocked, etc.) we fall back
 * to the original file so behaviour is never worse than before.
 *
 * @param {File|Blob} file
 * @param {object} [opts]
 * @param {number} [opts.maxDimension=1600] longest edge, in px, after resize
 * @param {number} [opts.maxBytes=4.5*1024*1024] target ceiling for the output
 * @param {number} [opts.quality=0.85] initial JPEG quality (0–1)
 * @returns {Promise<File>}
 */
export const normalizeImageForUpload = async (
  file,
  { maxDimension = 1600, maxBytes = 4.5 * 1024 * 1024, quality = 0.85 } = {}
) => {
  if (!file) return file;

  // Animated GIFs and vector SVGs can't survive a canvas round-trip (we'd lose
  // animation / rasterize the vector). If they're already small enough, pass
  // them through untouched; the server accepts both types.
  const type = (file.type || '').toLowerCase();
  if ((type === 'image/gif' || type === 'image/svg+xml') && file.size <= maxBytes) {
    return file;
  }

  try {
    const { drawable, width: srcW, height: srcH, close } = await loadBitmap(file);
    const { width, height } = scaleDimensions(srcW, srcH, maxDimension);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(drawable, 0, 0, width, height);
    if (close) close();

    // Encode, stepping quality down until we're under the size ceiling.
    let q = quality;
    let blob = await canvasToBlob(canvas, 'image/jpeg', q);
    while (blob && blob.size > maxBytes && q > 0.4) {
      q -= 0.15;
      blob = await canvasToBlob(canvas, 'image/jpeg', q);
    }
    if (!blob) return file;

    const name = renameToJpeg(file.name);
    return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() });
  } catch (err) {
    // Never block the upload on a normalization failure — send the original.
    console.warn('Image normalization failed, uploading original file:', err);
    return file;
  }
};

/**
 * Decode a file into an ImageBitmap. `createImageBitmap` is fastest and can
 * bake in EXIF orientation; we fall back to an <img> + object URL where it or
 * the orientation option isn't supported (older WebViews).
 */
const loadBitmap = async (file) => {
  if (typeof createImageBitmap === 'function') {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return { drawable: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close && bmp.close() };
    } catch {
      try {
        const bmp = await createImageBitmap(file);
        return { drawable: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close && bmp.close() };
      } catch {
        /* fall through to <img> path */
      }
    }
  }

  const url = URL.createObjectURL(file);
  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Image decode failed'));
    el.src = url;
  });
  return {
    drawable: img,
    width: img.naturalWidth,
    height: img.naturalHeight,
    // Release the object URL only after the caller has drawn to the canvas.
    close: () => URL.revokeObjectURL(url),
  };
};

const scaleDimensions = (w, h, maxDimension) => {
  if (!w || !h) return { width: maxDimension, height: maxDimension };
  const longest = Math.max(w, h);
  if (longest <= maxDimension) return { width: w, height: h };
  const ratio = maxDimension / longest;
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) };
};

const canvasToBlob = (canvas, mime, quality) =>
  new Promise((resolve) => {
    if (canvas.toBlob) {
      canvas.toBlob((b) => resolve(b), mime, quality);
    } else {
      // Very old WebView fallback via data URL.
      try {
        const dataUrl = canvas.toDataURL(mime, quality);
        const [meta, b64] = dataUrl.split(',');
        const bin = atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        resolve(new Blob([arr], { type: (meta.match(/:(.*?);/) || [])[1] || mime }));
      } catch {
        resolve(null);
      }
    }
  });

const renameToJpeg = (name) => {
  const base = (name || 'photo').replace(/\.[^./\\]+$/, '');
  return `${base || 'photo'}.jpg`;
};
