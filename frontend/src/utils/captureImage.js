import { isFlutterCameraBridge, captureImageViaFlutter } from './flutterBridge';
import { normalizeImageForUpload } from './image';

/**
 * Capture a photo from the device camera and return it as a normalized image
 * File (a compressed JPEG under 5MB), or null if it was cancelled/unavailable.
 *
 * Inside the Flutter wrapper this goes through the native `openCamera` bridge,
 * because the WebView's own <input type="file"> camera path doesn't return the
 * photo. In a normal browser it opens the OS camera via a temporary capture
 * input. Callers get back a ready-to-upload File and don't need to know which
 * path was used.
 */
export const captureCameraPhoto = async () => {
  const file = isFlutterCameraBridge()
    ? await captureImageViaFlutter()
    : await openCaptureInput();

  if (!file) return null;

  try {
    return await normalizeImageForUpload(file);
  } catch {
    return file; // never block on normalization failure
  }
};

/**
 * Open the OS camera through a throwaway <input capture> element and resolve
 * with the chosen File (or null if dismissed). Used only outside the Flutter
 * wrapper, where the native bridge isn't available.
 */
const openCaptureInput = () =>
  new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.style.position = 'fixed';
    input.style.left = '-9999px';

    let settled = false;
    const finish = (f) => {
      if (settled) return;
      settled = true;
      resolve(f || null);
      setTimeout(() => input.remove(), 0);
    };

    input.addEventListener('change', () => finish(input.files?.[0] || null));

    // If the picker is dismissed without choosing, no `change` fires — detect
    // the window regaining focus and resolve null so callers aren't left hanging.
    window.addEventListener(
      'focus',
      () => setTimeout(() => finish(input.files?.[0] || null), 800),
      { once: true }
    );

    document.body.appendChild(input);
    input.click();
  });
