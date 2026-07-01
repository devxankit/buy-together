/**
 * Bridge to the Flutter (flutter_inappwebview) native layer.
 *
 * Inside the Flutter wrapper the WebView's own <input type="file"> camera path
 * doesn't reliably hand the captured photo back to the web page. To work around
 * that, the Flutter app registers a JavaScript handler that opens the native
 * camera via image_picker and returns the photo as base64:
 *
 *   inAppWebViewController.addJavaScriptHandler(
 *     handlerName: 'openCamera',
 *     callback: (args) async {
 *       final image = await ImagePicker().pickImage(
 *         source: ImageSource.camera, imageQuality: 80);
 *       if (image != null) {
 *         final bytes = await image.readAsBytes();
 *         return {
 *           'success': true,
 *           'base64': base64Encode(bytes),
 *           'mimeType': 'image/jpeg',
 *           'fileName': image.name,
 *         };
 *       }
 *       return {'success': false};
 *     });
 *
 * This module detects that bridge and exposes the camera as a normal File so the
 * rest of the web upload flow doesn't need to know it came from native code. In
 * a plain browser (no bridge) `captureImageViaFlutter` returns null so callers
 * can fall back to a standard file input.
 */

/** True only when running inside the Flutter InAppWebView with the JS bridge. */
export const isFlutterCameraBridge = () =>
  typeof window !== 'undefined' &&
  !!window.flutter_inappwebview &&
  typeof window.flutter_inappwebview.callHandler === 'function';

/**
 * Ask the native layer to open the camera and return the photo as a File.
 * @returns {Promise<File|null>} the captured photo, or null if unavailable /
 *   cancelled by the user.
 */
export const captureImageViaFlutter = async () => {
  if (!isFlutterCameraBridge()) return null;

  const result = await window.flutter_inappwebview.callHandler('openCamera');
  if (!result || result.success !== true || !result.base64) return null;

  return base64ToFile(
    result.base64,
    result.fileName || `camera-${Date.now()}.jpg`,
    result.mimeType || 'image/jpeg'
  );
};

/**
 * Convert a base64 string (with or without a `data:` URL prefix) into a File.
 */
export const base64ToFile = (base64, fileName, mimeType) => {
  // Tolerate a full data URL as well as a bare base64 payload.
  const commaIdx = base64.indexOf(',');
  const raw = base64.startsWith('data:') && commaIdx !== -1 ? base64.slice(commaIdx + 1) : base64;

  const binary = atob(raw);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);

  return new File([bytes], fileName, { type: mimeType });
};
