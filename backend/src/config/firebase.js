const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const config = require('./env');
const logger = require('../utils/logger');

/**
 * Firebase Admin bootstrap.
 *
 * Messages live in the Firebase Realtime Database; everything else stays in
 * MongoDB. This module initializes the Admin SDK once (using a service-account
 * key) and exposes helpers to read/write the message tree. If Firebase is not
 * configured, the app still boots — chat endpoints just report 503 until the
 * service-account credentials are provided.
 *
 * Credentials are resolved in this order:
 *   1. FIREBASE_SERVICE_ACCOUNT_JSON  — full JSON (or base64 of it) in one env var
 *   2. FIREBASE_SERVICE_ACCOUNT_KEY_PATH — path to a serviceAccountKey.json file
 */

let app = null;
let initError = null;

const loadServiceAccount = () => {
  const { serviceAccountJson, serviceAccountKeyPath } = config.firebase;

  if (serviceAccountJson) {
    const raw = serviceAccountJson.trim().startsWith('{')
      ? serviceAccountJson
      : Buffer.from(serviceAccountJson, 'base64').toString('utf8');
    return JSON.parse(raw);
  }

  if (serviceAccountKeyPath) {
    const resolved = path.isAbsolute(serviceAccountKeyPath)
      ? serviceAccountKeyPath
      : path.resolve(process.cwd(), serviceAccountKeyPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Service account file not found at ${resolved}`);
    }
    return JSON.parse(fs.readFileSync(resolved, 'utf8'));
  }

  return null;
};

const init = () => {
  if (app || initError) return;

  try {
    if (!config.firebase.databaseUrl) {
      throw new Error('FIREBASE_DATABASE_URL is not set');
    }
    const serviceAccount = loadServiceAccount();
    if (!serviceAccount) {
      throw new Error('No Firebase service-account credentials provided');
    }

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: config.firebase.databaseUrl,
    });
    logger.info('Firebase Admin initialized (Realtime Database ready)');
  } catch (error) {
    initError = error;
    logger.warn(`Firebase not configured — chat disabled: ${error.message}`);
  }
};

init();

const isConfigured = () => Boolean(app);

const getDatabase = () => {
  if (!app) {
    throw initError || new Error('Firebase is not configured');
  }
  return admin.database();
};

/** Ref to a single group's message list: `/messages/{groupId}`. */
const getGroupMessagesRef = (groupId) => getDatabase().ref(`messages/${groupId}`);

module.exports = {
  admin,
  isConfigured,
  getDatabase,
  getGroupMessagesRef,
  ServerValue: admin.database.ServerValue,
};
