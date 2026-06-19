import {
  getMessagingInstance,
  getToken,
  deleteToken,
  onMessage,
  VAPID_KEY,
  isFirebaseConfigured,
  firebaseConfig,
} from '../firebase';
import { registerWebToken, unregisterToken } from './fcm.api';
import { showToast } from '../utils/toast';

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
export const registerWebPush = async ({ verbose = false } = {}) => {
  // When verbose, surface the exact stop-reason on-screen so a "no token saved"
  // problem is diagnosable without opening the browser console.
  const stop = (consoleMsg, toastMsg) => {
    console.warn('[push] ' + consoleMsg);
    if (verbose && toastMsg) showToast(toastMsg);
    return null;
  };

  try {
    // The FCM token store lives on the buyer (User) model only. Admins
    // authenticate against a separate Admin collection, so registering their
    // token hits "User not found" (404). Skip push for non-buyer sessions.
    let storedRole;
    try { storedRole = JSON.parse(localStorage.getItem('user') || 'null')?.role; } catch { /* ignore */ }
    if (storedRole && storedRole !== 'user') {
      return stop(`Skipping push registration for role "${storedRole}" (buyers only).`, null);
    }

    if (!isFirebaseConfigured()) {
      return stop(
        `Firebase not configured in this bundle (VAPID ${vapidPreview()}). Restart the Vite dev server after editing .env.`,
        'Push setup error: Firebase env not loaded. Restart the dev server.'
      );
    }
    if (!('Notification' in window)) {
      return stop('Notification API unavailable in this browser.', 'This browser does not support notifications.');
    }
    if (!window.isSecureContext) {
      return stop(
        `Insecure origin (${window.location.origin}). Push needs https or http://localhost — not a LAN IP.`,
        'Open the app on http://localhost to enable notifications (not a LAN IP).'
      );
    }

    const messaging = await getMessagingInstance();
    if (!messaging) {
      return stop('Messaging unsupported in this browser.', 'Notifications are not supported in this browser.');
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return stop(
        `Notification permission not granted: ${permission}`,
        permission === 'denied'
          ? 'Notifications are blocked. Click the lock icon in the address bar → allow Notifications.'
          : 'Please allow the notification prompt to receive updates.'
      );
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

    let token;
    try {
      token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration || undefined,
      });
    } catch (err) {
      // The decisive failure for "no token ever minted" — usually a VAPID key
      // that doesn't match this Firebase project, or a blocked push service.
      return stop(
        `getToken threw (${err?.code || 'error'}): ${err?.message || err}`,
        'Could not create a notification token (check the VAPID key matches this Firebase project).'
      );
    }
    if (!token) {
      return stop('getToken returned empty.', 'Could not create a notification token. Try reloading.');
    }

    console.info('[push] FCM token:', token.slice(0, 24) + '…', '| using VAPID', vapidPreview());
    localStorage.setItem(VAPID_CACHE_KEY, VAPID_KEY);

    // Always (re)register the CURRENT token with the backend. The local cache is
    // NOT proof the server has it — it drifts after a DB reset, a user-record
    // change, or an earlier save that failed — and a stale cache here was
    // silently skipping registration, leaving the DB with zero tokens. The
    // backend saveToken is idempotent, so re-asserting every login is cheap.
    const cached = localStorage.getItem(TOKEN_CACHE_KEY);
    if (cached && cached !== token) {
      try { await unregisterToken(cached, 'web'); } catch { /* best-effort */ }
    }
    try {
      await registerWebToken(token);
    } catch (err) {
      localStorage.removeItem(TOKEN_CACHE_KEY); // don't let a failed save poison the cache
      return stop(
        `backend /fcm/web/register failed: ${err?.response?.status || ''} ${err?.message || err}`,
        'Notification token created but the server rejected it. Are you logged in?'
      );
    }
    localStorage.setItem(TOKEN_CACHE_KEY, token);
    console.info('[push] Token registered with backend.');
    if (verbose) showToast('Notifications enabled');
    return token;
  } catch (err) {
    return stop(`unexpected: ${err?.message || err}`, 'Could not enable notifications. Please try again.');
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
      // title/body now travel in `data` (no top-level notification is sent).
      const title = n.title || d.title || 'Buy Together';
      // No `icon` — an SVG icon makes Chrome/Windows silently drop the
      // notification. Let the browser use its default icon.
      const options = {
        body: n.body || d.body || '',
        data: d,
        tag: (d.type || 'buy-together') + '-' + (d.timestamp || Date.now()),
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

/**
 * Step-by-step diagnostic. Runs every stage of web-push registration and
 * returns a plain object describing exactly where it succeeds or fails, so a
 * "no token is saved" problem can be pinpointed without reading swallowed logs.
 *
 * Run from the browser console (while logged in):  await window.__pushDebug()
 */
export const debugWebPush = async () => {
  const r = {};
  try {
    r.origin = window.location.origin;
    r.secureContext = window.isSecureContext;
    r.hasNotificationApi = 'Notification' in window;
    r.hasServiceWorker = 'serviceWorker' in navigator;
    r.permission = ('Notification' in window) ? Notification.permission : 'n/a';
    r.loggedIn = Boolean(localStorage.getItem('token'));

    // Which Firebase env values are actually present in the built bundle.
    r.env = {
      apiKey: Boolean(firebaseConfig?.apiKey),
      projectId: Boolean(firebaseConfig?.projectId),
      appId: Boolean(firebaseConfig?.appId),
      vapidKey: VAPID_KEY ? `present(${VAPID_KEY.length})` : 'MISSING',
    };
    r.firebaseConfigured = isFirebaseConfigured();
    if (!r.firebaseConfigured) {
      r.result = 'STOP: Firebase not configured in the running bundle. Restart the Vite dev server after editing .env.';
      console.table(r.env);
      console.warn('[pushDebug]', r.result);
      return r;
    }

    const messaging = await getMessagingInstance();
    r.messagingSupported = Boolean(messaging);
    if (!messaging) {
      r.result = 'STOP: Firebase Messaging unsupported here. Usually an insecure origin (use http://localhost, not a LAN IP) or an unsupported browser.';
      console.warn('[pushDebug]', r.result);
      return r;
    }

    r.permissionRequested = await Notification.requestPermission();
    if (r.permissionRequested !== 'granted') {
      r.result = `STOP: Notification permission is "${r.permissionRequested}". Click the lock icon → Site settings → allow Notifications, then re-run.`;
      console.warn('[pushDebug]', r.result);
      return r;
    }

    try {
      const reg = await registerServiceWorker();
      r.swRegistered = Boolean(reg);
      r.swScope = reg?.scope;
    } catch (e) {
      r.swError = e?.message || String(e);
    }

    try {
      const reg = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: reg || undefined,
      });
      r.token = token ? `${token.slice(0, 24)}…(${token.length})` : null;
      if (!token) {
        r.result = 'STOP: getToken returned empty (no token minted).';
        console.warn('[pushDebug]', r.result);
        return r;
      }

      try {
        await registerWebToken(token);
        r.backendRegistered = true;
        localStorage.setItem(TOKEN_CACHE_KEY, token);
        localStorage.setItem(VAPID_CACHE_KEY, VAPID_KEY);
        r.result = 'OK: token minted AND saved to backend. Re-run verify:push on the server to send a live test.';
      } catch (e) {
        r.backendRegistered = false;
        r.backendError = e?.response?.status
          ? `${e.response.status} ${JSON.stringify(e.response.data)}`
          : (e?.message || String(e));
        r.result = 'STOP: token minted but the backend /fcm/web/register call failed (see backendError).';
      }
    } catch (e) {
      // The decisive error for "no token ever": FCM code + message.
      r.tokenError = { code: e?.code, message: e?.message || String(e) };
      r.result = `STOP: getToken threw (${e?.code || 'error'}). A "token-subscribe-failed" / "invalid VAPID" means the VAPID key does not match this Firebase project.`;
    }
  } catch (e) {
    r.fatal = e?.message || String(e);
  }
  console.log('[pushDebug] result:', r.result || r.fatal);
  console.table({ ...r, env: undefined, tokenError: undefined });
  return r;
};

/**
 * Show a notification DIRECTLY via the service worker, bypassing FCM entirely.
 * This isolates the layer: if this renders in the tray, display works and any
 * "delivered but not shown" issue is in the FCM message (icon/payload). If this
 * does NOT render, the block is at the OS/browser level (Windows Focus Assist,
 * or Chrome notifications disabled in Windows Settings) — not the app.
 *
 *   await window.__testNotification()
 */
export const testLocalNotification = async () => {
  if (!('Notification' in window)) { console.warn('[push] No Notification API'); return 'no-api'; }
  if (Notification.permission !== 'granted') {
    const p = await Notification.requestPermission();
    if (p !== 'granted') { console.warn('[push] permission:', p); return `permission-${p}`; }
  }
  try {
    const reg = await navigator.serviceWorker?.ready;
    // No icon on purpose — an SVG/missing icon silently drops the notification.
    await reg.showNotification('Buy Together — local test', {
      body: 'If you can see this, display works. The issue is the FCM payload, not your OS.',
      tag: 'bt-local-test-' + Date.now(),
      data: { link: '/' },
    });
    console.info('[push] Local showNotification called. If nothing appears, it is a Windows/Chrome setting (Focus Assist / notifications disabled).');
    return 'shown';
  } catch (e) {
    console.warn('[push] local showNotification failed:', e?.message || e);
    return 'error:' + (e?.message || e);
  }
};

// Expose helpers for manual debugging from the browser console.
if (typeof window !== 'undefined') {
  window.__resetPush = resetWebPush;
  window.__pushDebug = debugWebPush;
  window.__testNotification = testLocalNotification;
}
