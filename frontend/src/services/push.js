import {
  getMessagingInstance,
  getToken,
  deleteToken,
  onMessage,
  VAPID_KEY,
  isFirebaseConfigured,
} from '../firebase';
import { registerWebToken, unregisterToken } from './fcm.api';

const TOKEN_CACHE_KEY = 'fcm_token_web';
const VAPID_CACHE_KEY = 'fcm_vapid_web';

// The SW has its Firebase config hard-coded (a worker can't read Vite env), so
// we register it by plain path and wait until it's actually active before
// minting a token — an inactive worker means notifications never display.
const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return null;
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
  await navigator.serviceWorker.ready; // resolves once a worker controls the scope
  return registration;
};

const vapidPreview = () => (VAPID_KEY ? `${VAPID_KEY.slice(0, 12)}…(${VAPID_KEY.length})` : '(none)');

/**
 * Request permission, obtain the FCM token, and register it with the backend.
 * Always calls getToken (idempotent) so a corrected VAPID key self-heals.
 * Silently no-ops when Firebase isn't configured or the browser lacks support.
 */
export const registerWebPush = async () => {
  try {
    if (!isFirebaseConfigured()) {
      console.warn('[push] Firebase not fully configured — skipping. VAPID:', vapidPreview());
      return null;
    }
    if (!('Notification' in window)) return null;

    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.warn('[push] Messaging unsupported in this browser.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[push] Notification permission not granted:', permission);
      return null;
    }

    const registration = await registerServiceWorker();

    // If the VAPID key changed since we last minted a token, the old push
    // subscription is bound to the wrong key — delete it so getToken creates a
    // fresh subscription with the current key. This self-heals after fixing the
    // VAPID in .env: just reload, no manual steps.
    const lastVapid = localStorage.getItem(VAPID_CACHE_KEY);
    if (lastVapid && lastVapid !== VAPID_KEY) {
      console.info('[push] VAPID key changed — forcing fresh token.');
      try { await deleteToken(messaging); } catch { /* ignore */ }
      const stale = localStorage.getItem(TOKEN_CACHE_KEY);
      if (stale) { try { await unregisterToken(stale, 'web'); } catch { /* ignore */ } }
      localStorage.removeItem(TOKEN_CACHE_KEY);
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration || undefined,
    });
    if (!token) {
      console.warn('[push] getToken returned empty.');
      return null;
    }

    console.info('[push] FCM token:', token.slice(0, 24) + '…', '| using VAPID', vapidPreview());
    localStorage.setItem(VAPID_CACHE_KEY, VAPID_KEY);

    const cached = localStorage.getItem(TOKEN_CACHE_KEY);
    if (token !== cached) {
      if (cached) {
        try { await unregisterToken(cached, 'web'); } catch { /* best-effort */ }
      }
      await registerWebToken(token);
      localStorage.setItem(TOKEN_CACHE_KEY, token);
      console.info('[push] Token registered with backend.');
    }
    return token;
  } catch (err) {
    console.warn('Web push registration failed:', err?.message || err);
    return null;
  }
};

/**
 * Hard reset: deletes the browser's cached FCM token + push subscription,
 * unregisters the SW, clears local cache, then registers a brand-new token
 * with the CURRENT VAPID key. Use this when a token was minted with a wrong
 * VAPID key and the browser keeps serving the stale one. Returns the new token.
 *
 * Exposed as `window.__resetPush()` for easy manual triggering.
 */
export const resetWebPush = async () => {
  console.info('[push] Resetting… current VAPID', vapidPreview());
  try {
    const messaging = await getMessagingInstance();
    if (messaging) {
      try { await deleteToken(messaging); console.info('[push] Old FCM token deleted.'); } catch (e) { console.warn('[push] deleteToken:', e?.message); }
    }
    // Drop the stale token from the backend.
    const cached = localStorage.getItem(TOKEN_CACHE_KEY);
    if (cached) {
      try { await unregisterToken(cached, 'web'); } catch { /* ignore */ }
    }
    localStorage.removeItem(TOKEN_CACHE_KEY);

    // Tear down any existing push subscription + service workers so the next
    // getToken creates a fresh subscription bound to the current VAPID key.
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) {
        try {
          const sub = await reg.pushManager?.getSubscription?.();
          if (sub) await sub.unsubscribe();
        } catch { /* ignore */ }
        try { await reg.unregister(); } catch { /* ignore */ }
      }
      console.info('[push] Service workers + subscriptions cleared.');
    }
  } catch (err) {
    console.warn('[push] reset cleanup error:', err?.message || err);
  }

  const token = await registerWebPush();
  console.info('[push] Reset complete. New token:', token ? token.slice(0, 24) + '…' : '(failed)');
  return token;
};

/**
 * Foreground handler: browsers suppress FCM auto-display when the tab is
 * focused, so we surface the notification ourselves and forward the payload.
 */
export const listenForegroundPush = async (handler) => {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return;
    onMessage(messaging, async (payload) => {
      const n = payload.notification || {};
      const d = payload.data || {};
      const title = n.title || 'Buy Together';
      // No `icon` — an SVG icon makes Chrome/Windows silently drop the
      // notification. Let the browser use its default icon.
      const options = {
        body: n.body || '',
        data: d,
        tag: 'buy-together-push',
        renotify: true,
        ...(n.image || d.image ? { image: n.image || d.image } : {}),
      };

      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          // Show via the service worker registration — reliably surfaces in the
          // OS notification tray on desktop (unlike `new Notification`).
          const reg = await navigator.serviceWorker?.ready;
          if (reg?.showNotification) {
            await reg.showNotification(title, options);
          } else {
            new Notification(title, options);
          }
        } catch (e) {
          console.warn('[push] foreground show failed:', e?.message);
        }
      }
      if (handler) handler(payload);
    });
  } catch (err) {
    console.warn('Foreground push listener failed:', err?.message || err);
  }
};

/** Clear the cached web token (call on logout). */
export const clearWebPushCache = () => localStorage.removeItem(TOKEN_CACHE_KEY);

// Expose the reset helper for manual debugging from the browser console.
if (typeof window !== 'undefined') {
  window.__resetPush = resetWebPush;
}
