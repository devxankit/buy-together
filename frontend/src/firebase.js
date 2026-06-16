import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, deleteToken, onMessage, isSupported } from 'firebase/messaging';

// Public Firebase web config (safe to ship in client bundles). Values come from
// VITE_FIREBASE_* env vars — see PUSH_NOTIFICATIONS_SETUP.md for where to get them.
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/** True only when the minimum web-push config + VAPID key are present. */
export const isFirebaseConfigured = () =>
  Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId && VAPID_KEY);

let app = null;
let messagingInstance = null;

/** Lazily init Firebase + Messaging, returning null if unsupported/unconfigured. */
export const getMessagingInstance = async () => {
  if (!isFirebaseConfigured()) return null;
  try {
    if (!(await isSupported())) return null;
  } catch {
    return null;
  }
  if (!app) app = initializeApp(firebaseConfig);
  if (!messagingInstance) messagingInstance = getMessaging(app);
  return messagingInstance;
};

export { getToken, deleteToken, onMessage };
