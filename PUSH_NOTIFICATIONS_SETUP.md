# Push Notifications — Setup & Credentials (Buy Together)

This project now has Firebase Cloud Messaging (FCM) push notifications wired end-to-end:

- **Admin console** → *System → Push Notifications*: compose & broadcast (title, message, image, deep link) to **Web**, **Mobile app**, or **Both**, with live preview, reach stats, and send history.
- **Backend** reuses the existing Firebase Admin service account (project **`but-together`**) to send via `admin.messaging()`.
- **FCM tokens** are saved per user, split into **web** and **mobile** pools, and registered automatically when a user logs in (web) or from the Flutter app (mobile).

You only need to drop in a few **public web credentials** (the backend is already configured). Steps below.

---

## 1. Backend — already done ✅

The backend signs notifications with the service account it already uses for chat:

- `backend/src/config/serviceAccountKey.json` (project `but-together`)
- env keys already present: `FIREBASE_SERVICE_ACCOUNT_KEY_PATH`, `FIREBASE_SERVICE_ACCOUNT_JSON`, `FIREBASE_DATABASE_URL`

**Nothing new to add on the backend.** Just make sure **Cloud Messaging API (V1)** is enabled for the project:
Firebase Console → ⚙ Project Settings → **Cloud Messaging** → ensure *Firebase Cloud Messaging API (V1)* is **Enabled**.

---

## 2. Web frontend — credentials to fill in

Web push needs the **public web config** + a **VAPID key**. These are *not secret* (they ship in the browser bundle), but they must be correct.

### Where to get them

1. Firebase Console → ⚙ **Project Settings** → **General** → *Your apps*.
   - If there's no **Web app** yet, click **Add app → Web (`</>`)**, give it a nickname, register. (You do *not* need Firebase Hosting.)
   - Copy the shown `firebaseConfig` values.
2. Firebase Console → ⚙ **Project Settings** → **Cloud Messaging** → **Web Push certificates** → **Generate key pair** (if none) → copy the **Key pair** value. That's your **VAPID key**.

### Where to put them

Edit **`frontend/.env`** — the keys are already stubbed (some pre-filled for project `but-together`; verify they match the console exactly, especially `storageBucket`):

```env
VITE_FIREBASE_API_KEY=            # ← paste
VITE_FIREBASE_AUTH_DOMAIN=but-together.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=but-together
VITE_FIREBASE_STORAGE_BUCKET=but-together.appspot.com   # ← confirm in console
VITE_FIREBASE_MESSAGING_SENDER_ID=   # ← paste
VITE_FIREBASE_APP_ID=                # ← paste
VITE_FIREBASE_MEASUREMENT_ID=        # ← paste (optional)
VITE_FIREBASE_VAPID_KEY=             # ← paste the VAPID key pair
```

Then restart the Vite dev server so it picks up the new env (`npm run dev` in `frontend/`).

> **No need to touch** `frontend/public/firebase-messaging-sw.js` — the service worker receives the config automatically (injected as query params at registration), so there are no keys to keep in sync.

### How it behaves

- On login (OTP verify), the browser asks for notification permission and registers its web token (`POST /v1/fcm/web/register`).
- Foreground messages show an in-page notification; background/closed messages are shown by the service worker. Tapping a notification opens/focuses the app at the notification's **deep link**.
- Web push requires **HTTPS** in production (`localhost` is allowed for development).

---

## 3. Mobile app (Flutter wrapper) — integration

The backend exposes a **separate mobile endpoint** so the Flutter app registers its own token pool.

### One-time Firebase project setup

1. Firebase Console → **Add app → Android** (and/or iOS). Use your app's package name.
2. Download **`google-services.json`** (Android) → place in `android/app/`.
   For iOS: **`GoogleService-Info.plist`** → add to the Xcode project, and enable the **Push Notifications** + **Background Modes (Remote notifications)** capabilities.
3. Run `flutterfire configure` (recommended) or follow the manual Gradle/Pod steps.

### Flutter dependencies

```yaml
dependencies:
  firebase_core: ^3.0.0
  firebase_messaging: ^15.0.0
  flutter_local_notifications: ^17.0.0   # to show foreground notifications
```

### Register the token with the backend (after the user logs in)

```dart
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<void> registerFcmToken(String authToken, String apiBase) async {
  final messaging = FirebaseMessaging.instance;

  // Ask permission (iOS + Android 13+)
  await messaging.requestPermission();

  final token = await messaging.getToken();
  if (token == null) return;

  await http.post(
    Uri.parse('$apiBase/fcm/mobile/register'),   // e.g. https://api.yourhost.com/v1/fcm/mobile/register
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $authToken',
    },
    body: jsonEncode({'token': token}),
  );

  // Keep it fresh if FCM rotates the token
  messaging.onTokenRefresh.listen((t) {
    http.post(
      Uri.parse('$apiBase/fcm/mobile/register'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $authToken'},
      body: jsonEncode({'token': t}),
    );
  });
}
```

### Handling notification taps → deep link

Each notification carries `data.link` (e.g. `/groups`, `/deals`). Route the WebView/app to it:

```dart
FirebaseMessaging.onMessageOpenedApp.listen((msg) {
  final link = msg.data['link'];
  if (link != null) {
    // navigate your WebView / router to `link`
  }
});
```

> `apiBase` is your backend base **with the `/v1` prefix** (same as the web app's `VITE_API_URL`).

---

## 4. Sending from the admin console

1. Log in to the admin console → **System → Push Notifications**.
2. Pick **Target platform** (Web / Mobile App / Both) — the subtitle shows how many users are reachable.
3. Fill **Title**, **Message**, optional **Image** (uploaded to Cloudinary), optional **Deep link**.
4. **Send Notification** → you'll see delivered/total counts, and the broadcast is logged in *Recent broadcasts*.

Dead/expired tokens are pruned automatically after each send.

---

## 5. Testing checklist

- [ ] Backend running; **Cloud Messaging API (V1)** enabled in Firebase.
- [ ] `frontend/.env` filled with web config + VAPID; Vite restarted.
- [ ] Open the user app → allow notification permission → log in.
- [ ] Browser DevTools → *Application → Service Workers* shows `firebase-messaging-sw.js` active.
- [ ] Admin → Push Notifications shows **Users reachable on Web ≥ 1**.
- [ ] Send a test broadcast (Web) → with the app tab **backgrounded**, the OS notification appears; clicking it opens the deep link.
- [ ] (Mobile) Build the Flutter app, log in, confirm **Users reachable on Mobile** increments, then send a Mobile/Both broadcast.

---

## API reference

**User token endpoints** (require user auth — `Authorization: Bearer <token>`):

| Method | Path | Body | Purpose |
|--------|------|------|---------|
| POST | `/v1/fcm/web/register` | `{ token }` | Save a web browser token |
| POST | `/v1/fcm/mobile/register` | `{ token }` | Save a mobile-app token |
| DELETE | `/v1/fcm/unregister` | `{ token, platform? }` | Remove a token (logout) |
| POST | `/v1/fcm/test` | `{ title?, body?, link? }` | Send a test push to your own devices |

**Admin broadcast endpoints** (require admin JWT):

| Method | Path | Body | Purpose |
|--------|------|------|---------|
| POST | `/v1/admin/push/web` | `{ title, body, image?, link? }` | Broadcast to all web tokens |
| POST | `/v1/admin/push/mobile` | `{ title, body, image?, link? }` | Broadcast to all mobile tokens |
| POST | `/v1/admin/push/all` | `{ title, body, image?, link? }` | Broadcast to both |
| GET | `/v1/admin/push/coverage` | — | `{ webUsers, mobileUsers, totalUsers }` |
| GET | `/v1/admin/push/campaigns?limit=` | — | Recent broadcast history |

### Sending notifications from app code (server-side)

To notify a single user from any feature (e.g. when a group fills), use the helper:

```js
const pushService = require('../services/push.service');
await pushService.sendToUser(userId, {
  title: 'Your group is almost full!',
  body: 'Only 2 spots left on iPhone 15 Pro',
  link: `/groups/${groupId}`,
});
```
