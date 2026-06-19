# Push Notification Flow — Reference Guide

> A battle-tested **Firebase Cloud Messaging (FCM)** web-push setup for a React (Vite)
> frontend + Node/Express + MongoDB (Mongoose) backend with **multiple user types**.
>
> This document is a **reference for implementing the same flow in another project**.
> It explains the architecture, every file's responsibility, the exact message
> shape that avoids duplicate notifications, and the gotchas already solved here.
>
> ⚠️ **No real credentials are included.** All keys/values are shown as placeholders.
> Copy your own from the Firebase Console into `.env` files (never commit them).

---

## 1. High-level architecture

```
                          ┌─────────────────────────────────────────┐
                          │              FRONTEND (Vite)             │
                          │                                          │
  User logs in  ─────────►│  authService → registerFCMToken(true)    │
                          │       │                                  │
                          │       ▼                                  │
                          │  firebase.js (init app + messaging)      │
                          │       │  getToken({ vapidKey, swReg })   │
                          │       ▼                                  │
                          │  firebase-messaging-sw.js (service worker)│
                          │   - onBackgroundMessage → showNotification│
                          │   - notificationclick → focus/open tab   │
                          │                                          │
                          │  POST /api/fcm-tokens/save  ────────────┐│
                          └──────────────────────────────────────────┘
                                                                    │
                          ┌─────────────────────────────────────────▼┐
                          │              BACKEND (Express)            │
                          │                                           │
                          │  fcmTokenRoutes.js                        │
                          │   - /save   → $addToSet token on user     │
                          │   - /remove → $pull token                 │
                          │   - /test   → send a welcome push         │
                          │   - /status, /purge-all                   │
                          │                                           │
                          │  Mongoose user models store:              │
                          │     fcmTokens[]       (web)                │
                          │     fcmTokenMobile[]  (mobile/PWA)         │
                          │                                           │
   Some event happens ───►│  controller → sendNotificationToUser()    │
   (notice, lead, etc.)   │            or sendPushNotification()      │
                          │            │                              │
                          │            ▼                              │
                          │  firebaseAdmin.js                         │
                          │   admin.messaging().sendEachForMulticast  │
                          │   → prunes invalid tokens automatically   │
                          └───────────────────────────────────────────┘
```

**Key design choices baked in:**

1. **Web tokens and mobile tokens are stored separately** (`fcmTokens` vs `fcmTokenMobile`) so you can target one platform or both.
2. **The send payload deliberately omits the top-level `notification` field** and uses `data` + `webpush.notification` instead. This is the single most important fix — it prevents duplicate notifications on Android. (See §6.)
3. **Invalid/expired tokens are pruned automatically** every time a send fails with a token error.
4. **Tokens are cached client-side with a TTL + VAPID fingerprint** so a token rotation forces a refresh and stale tokens self-heal.

---

## 2. File map (what to copy / recreate)

### Backend
| File | Responsibility |
|------|----------------|
| `services/firebaseAdmin.js` | Initializes Firebase Admin SDK; exposes `sendPushNotification(tokens, payload)` and `isInitialized()`. The core sender. |
| `utils/pushNotificationHelper.js` | `sendNotificationToUser(userId, userType, payload, includeMobile)` — looks up a user, gathers their tokens, sends, prunes invalid ones. |
| `utils/userHelper.js` | `getUserModel(userType)`, `findUserAndModelById(id)`, `removeFCMTokensGlobally(tokens)`. Maps user types → Mongoose models. |
| `routes/fcmTokenRoutes.js` | REST endpoints: `/save`, `/remove`, `/test`, `/status`, `/purge-all`. |
| `models/*.js` | Each user model has `fcmTokens: [String]` and `fcmTokenMobile: [String]`. |
| `config/firebase-service-account.json` | **Service account key (gitignored).** Dev fallback only. |

### Frontend
| File | Responsibility |
|------|----------------|
| `src/firebase.js` | Initializes the Firebase JS SDK + messaging; re-exports `getToken`, `onMessage`, `deleteToken`. |
| `src/services/pushNotificationService.js` | All client logic: SW registration, permission request, get/register/remove token, foreground handler, token caching. |
| `public/firebase-messaging-sw.js` | Service worker: background message handler + notification-click handler. **Must be in `public/` (served at site root).** |
| `src/App.jsx` | Calls `initializePushNotifications()` + `setupForegroundNotificationHandler()` once on mount. |
| `src/modules/**/authService.js` | After successful login, calls `registerFCMToken(true)`. |

---

## 3. Environment variables

> Get these from **Firebase Console → Project Settings**. Never commit real values.

### Frontend `.env` (Vite — must be prefixed `VITE_`)
```env
VITE_FIREBASE_API_KEY=<your-web-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<project-id>
VITE_FIREBASE_STORAGE_BUCKET=<project>.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=<sender-id>
VITE_FIREBASE_APP_ID=<app-id>
VITE_FIREBASE_MEASUREMENT_ID=<measurement-id>
VITE_FIREBASE_VAPID_KEY=<web-push-certificate-key-pair>   # Cloud Messaging → Web Push certificates
```

### Backend `.env`
```env
# Option 1 (dev): path to a service-account JSON file
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json

# Option 2 (production, recommended): the whole service-account JSON as one string
# FIREBASE_CONFIG={"type":"service_account","project_id":"...", ... }
```

> ⚠️ **The service worker cannot read `.env`.** `public/firebase-messaging-sw.js` runs
> outside the bundler, so its `firebaseConfig` is hardcoded. These web-config values
> (apiKey, projectId, etc.) are **not secret** — they are shipped to every browser anyway.
> The **VAPID key** and the **service account JSON** are the sensitive parts; keep those out of git.

---

## 4. Frontend flow in detail

### 4.1 Initialize Firebase — `src/firebase.js`
- Reads all `VITE_FIREBASE_*` values (each `.trim()`-ed to survive copy/paste whitespace).
- Calls `initializeApp(config)` then `getMessaging(app)` — but only when `window` and `serviceWorker` exist (guards SSR / unsupported browsers).
- Exports `messaging` plus `getToken / onMessage / deleteToken`.

### 4.2 Register a token after login — `pushNotificationService.js`
`registerFCMToken(forceUpdate)`:
1. If a cached token exists and `isCachedTokenValid()` (same VAPID fingerprint, not past 30-day TTL) → reuse it, skip everything.
2. Request `Notification.requestPermission()`.
3. `getOrRegisterServiceWorker()` — reuses an existing `/` registration, otherwise registers `/firebase-messaging-sw.js` at scope `/`. **Never calls `registration.update()`** (that caused storage-lock errors and post-login reloads).
4. `getToken(messaging, { vapidKey, serviceWorkerRegistration })`.
5. Pick the **auth token for the current context** (`/admin` → `adminToken`, `/sales` → `salesToken`, …) so the right user gets the token.
6. `POST /api/fcm-tokens/save` with `{ token, platform: 'web' }`.
7. On success, cache token + meta (`fcm_token_web`, `fcm_token_meta`) and (optionally) fire a test push after a short delay.

`removeFCMToken()` (call on logout): `deleteToken(messaging)` on Firebase, `DELETE /api/fcm-tokens/remove`, then clear localStorage.

### 4.3 App bootstrap — `src/App.jsx`
```jsx
useEffect(() => {
  initializePushNotifications();                 // registers SW in background, no reload
  setupForegroundNotificationHandler((payload) => {
    // app is in foreground — show a toast / update UI. Do NOT auto-navigate (it reloads).
  });
}, []);
```

### 4.4 Foreground vs background
- **Background / tab closed** → handled by `onBackgroundMessage` in the **service worker**.
- **Foreground (tab focused)** → handled by `onMessage` in `setupForegroundNotificationHandler`, which shows the notification via `serviceWorker.ready.showNotification(...)` (so clicks are handled consistently) and falls back to the page `Notification` API.

---

## 5. Service worker — `public/firebase-messaging-sw.js`

```js
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({ /* hardcoded public web config — NO secrets */ });
const messaging = firebase.messaging();

messaging.onBackgroundMessage(async (payload) => {
  const title = payload.notification?.title || payload.data?.title || 'App Notification';
  await self.registration.showNotification(title, {
    body:  payload.notification?.body || payload.data?.body || '',
    icon:  payload.data?.icon || '/logo.png',
    badge: '/logo.png',
    data:  payload.data || {},
    tag:   (payload.data?.type || 'default') + '-' + (payload.data?.timestamp || Date.now()),
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = event.notification.data?.link || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) if (c.url.startsWith(self.location.origin) && 'focus' in c) return c.focus();
      return clients.openWindow(link.startsWith('http') ? link : new URL(link, self.location.origin).href);
    })
  );
});
```

Notes:
- The file **must live in `public/`** so it is served from the site root (`/firebase-messaging-sw.js`) — service worker scope rules require it.
- Use the **compat** Firebase builds inside the SW.
- `tag` de-dupes/replaces repeat notifications of the same type.

---

## 6. ⭐ The duplicate-notification fix (most important section)

When the backend sends a message, **do NOT include a top-level `notification` field.**
Here is the exact shape used in `firebaseAdmin.js`:

```js
const message = {
  tokens: uniqueTokens,

  // ❌ No top-level `notification` field.
  // On Android, a top-level `notification` makes the OS display the push itself,
  // AND onBackgroundMessage fires and calls showNotification → TWO notifications.

  data: {                       // FCM data values MUST all be strings (v1 API rule)
    title: payload.title,
    body:  payload.body,
    ...stringData,
  },

  webpush: {                    // Chrome's push service uses this; respects the SW handler
    notification: {
      title: payload.title,
      body:  payload.body,
      icon:  payload.data?.icon || '/logo.png',
      badge: '/logo.png',
    },
    fcmOptions: { link: payload.data?.link || '/' },
  },
};

await admin.messaging().sendEachForMulticast(message);
```

Why: Desktop Chrome suppresses the auto-display when `onBackgroundMessage` is registered,
so web "just works." Android does **not** suppress it, so a top-level `notification`
yields duplicates. Moving the display data into `data` + `webpush.notification` makes
Chrome's push service defer to the service worker on **all** platforms — single notification everywhere.

**Also:** every value inside `data` must be a string. The sender coerces them:
```js
const stringData = Object.fromEntries(
  Object.entries(payload.data || {}).map(([k, v]) => [k, v == null ? '' : String(v)])
);
```

---

## 7. Backend send paths

### 7.1 Send to one user — `sendNotificationToUser`
```js
await sendNotificationToUser(userId, userType, {
  title: 'New lead assigned',
  body:  'You have a new lead: John Doe',
  data:  { type: 'lead', link: '/sales/leads/123', timestamp: String(Date.now()) },
}, /* includeMobile = */ true);
```
It looks up the user via `getUserModel(userType)`, gathers `fcmTokens` (+ `fcmTokenMobile` if `includeMobile`), de-dupes, sends, and **removes any invalid tokens** returned from the send.

### 7.2 Broadcast to many users (e.g. a notice board)
Collect tokens across the relevant collections, then:
```js
const response = await sendPushNotification(uniqueTokens, payload);
if (response.invalidTokens?.length) {
  removeFCMTokensGlobally(response.invalidTokens).catch(() => {}); // background prune, don't block response
}
```

### 7.3 Automatic token hygiene
`sendPushNotification` inspects each per-token result and collects tokens whose error code is:
- `messaging/invalid-registration-token`
- `messaging/registration-token-not-registered`
- `messaging/third-party-auth-error` (usually a VAPID mismatch)

These are returned as `invalidTokens` so callers can `$pull` them from the DB.

---

## 8. REST API (`/api/fcm-tokens`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/save` | user JWT | Save a token: `$addToSet` into `fcmTokens` (web) or `fcmTokenMobile`. Has a recovery path that re-finds the user across all collections if the first update matches nothing. |
| DELETE | `/remove` | user JWT | `$pull` the token (call on logout). |
| POST | `/test` | user JWT | Send a "Welcome / it works" push to the caller. |
| GET | `/status` | user JWT | Return the caller's token counts. |
| DELETE | `/purge-all` | **admin** | Wipe all tokens from every collection. Use after rotating the VAPID key. |

Mounted in `server.js`:
```js
app.use('/api/fcm-tokens', fcmTokenRoutes);
```

---

## 9. Data model

Add to **every** user schema that can receive pushes:
```js
fcmTokens:      { type: [String], default: [] },  // web / desktop browser tokens
fcmTokenMobile: { type: [String], default: [] },  // mobile / installed PWA tokens
```
Arrays (not single strings) because one user may be logged in on several devices/browsers.

---

## 10. Implementation checklist for a new project

1. **Firebase Console** → create project → add a Web App → enable **Cloud Messaging** → generate a **Web Push certificate (VAPID key)** → download a **service account** key.
2. **Backend**
   - `npm i firebase-admin`
   - Add `services/firebaseAdmin.js`, `utils/pushNotificationHelper.js`, `utils/userHelper.js`, `routes/fcmTokenRoutes.js`.
   - Add `fcmTokens` + `fcmTokenMobile` to user schemas.
   - Mount `app.use('/api/fcm-tokens', fcmTokenRoutes)`.
   - Provide the service account via `FIREBASE_SERVICE_ACCOUNT_PATH` (dev) or `FIREBASE_CONFIG` (prod). **Gitignore the JSON.**
3. **Frontend**
   - `npm i firebase`
   - Add `src/firebase.js`, `src/services/pushNotificationService.js`.
   - Add `public/firebase-messaging-sw.js` (hardcode the public web config; it ships to browsers anyway).
   - Set all `VITE_FIREBASE_*` vars in `.env`.
   - Call `initializePushNotifications()` + `setupForegroundNotificationHandler()` in `App` mount.
   - Call `registerFCMToken(true)` after login; `removeFCMToken()` on logout.
4. **Send shape**: use `data` + `webpush.notification`, **never** a top-level `notification` (§6).
5. **Test**: log in → allow notifications → hit `POST /api/fcm-tokens/test` → confirm exactly **one** notification on desktop *and* mobile.

---

## 11. Gotchas already solved here (don't relearn them)

- **Duplicate notifications on Android** → caused by top-level `notification`. Fixed by `data` + `webpush.notification` only. (§6)
- **All `data` values must be strings** → non-strings make the FCM v1 API reject the message. Coerce everything.
- **`registration.update()` before `getToken`** → caused "Failed to access storage" errors and a post-login app reload. Removed; let the browser update the SW on its own.
- **Service worker must be in `public/` at root scope** → otherwise it can't control the page / receive pushes.
- **VAPID key rotation** → invalidates all existing tokens (`third-party-auth-error`). The client stores a VAPID *fingerprint*; if it changes, the cached token is dropped and refreshed. Use `/purge-all` to clear the DB server-side.
- **Token TTL** → client refreshes tokens older than 30 days even if nothing else changed.
- **Multi-user-type apps** → tokens live on each user collection; `getUserModel` maps the JWT's `userType` to the right model, with a `findUserAndModelById` recovery fallback.
- **Incognito / blocked storage** → `getToken` throws a storage error; handle gracefully (push is non-critical, never block login on it).
- **Don't auto-navigate on foreground messages** → it reloads the SPA. Show a toast instead; navigation belongs in the SW `notificationclick` handler.
- **Never block login on FCM** → all registration is wrapped in try/catch and deferred after the dashboard loads.
```

---

*This file is documentation only — it contains no live keys. Copy your own Firebase credentials into the `.env` files described in §3.*
