/* Firebase Cloud Messaging service worker — shows WEB push while the app is
 * backgrounded/closed.
 *
 * NOTE: this config is PUBLIC (it ships in the browser anyway) and is hard-coded
 * here on purpose — a service worker cannot read Vite env vars. If you change
 * Firebase projects, update these values to match frontend/.env (VITE_FIREBASE_*).
 */

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBgjgcNOyJ_0G-aCxBfqMWRJkZ8Tv4fxy0',
  authDomain: 'but-together.firebaseapp.com',
  projectId: 'but-together',
  storageBucket: 'but-together.firebasestorage.app',
  messagingSenderId: '694115785084',
  appId: '1:694115785084:web:e2a9bfe87f8175e83eacf9',
});

const messaging = firebase.messaging();

// Activate immediately so notifications work on first load (no extra reload).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// Background messages: render the notification ourselves. NO `icon` is set —
// an SVG icon causes Chrome/Windows to silently drop the notification, so we
// let the browser use its default icon (reliable on every OS).
messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || {};
  const d = payload.data || {};
  // title/body now travel in `data` (no top-level notification is sent); fall
  // back to webpush.notification (surfaced as payload.notification) just in case.
  const title = n.title || d.title || 'Buy Together';
  const options = {
    body: n.body || d.body || '',
    data: d,
    tag: (d.type || 'buy-together') + '-' + (d.timestamp || Date.now()),
    renotify: true,
    requireInteraction: false,
  };
  const image = n.image || d.image;
  if (image) options.image = image;
  self.registration.showNotification(title, options);
});

// Focus an existing tab (or open one) and navigate to the notification's link.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = (event.notification.data && event.notification.data.link) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) {
          if ('navigate' in client) client.navigate(link);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(link);
    })
  );
});
