const httpStatus = require('http-status').status;
const firebase = require('../config/firebase');
const Group = require('../models/Group');
const ApiError = require('../utils/ApiError');

/**
 * Chat persistence. Messages are stored in the Firebase Realtime Database under
 * `/messages/{groupId}/{messageId}`; group/user data stays in MongoDB.
 *
 * Each stored message is self-contained (it embeds the sender's id + name) so a
 * client listening to RTDB can render it without a second lookup.
 */

const ensureFirebase = () => {
  if (!firebase.isConfigured()) {
    throw new ApiError(
      httpStatus.SERVICE_UNAVAILABLE,
      'Chat is unavailable: Firebase is not configured on the server'
    );
  }
};

/**
 * Confirms the user may post to / read this group.
 * If the group exists in MongoDB, the user must be a member or its admin.
 * If no such group exists, the id is treated as an opaque room (allowed) so the
 * feature works before groups are fully wired through the product.
 */
const verifyGroupAccess = async (groupId, userId) => {
  let group = null;
  if (/^[0-9a-fA-F]{24}$/.test(String(groupId))) {
    group = await Group.findById(groupId).select('members admin');
  }
  if (!group) return;

  const uid = String(userId);
  const isMember = group.members.some((m) => String(m) === uid);
  const isAdmin = String(group.admin) === uid;
  if (!isMember && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not a member of this group');
  }
};

/**
 * Persists a message to RTDB and returns it (with its generated id + timestamp).
 * @param {object} params
 * @param {string} params.groupId
 * @param {string} params.senderId
 * @param {string} params.senderName
 * @param {string} params.content
 * @param {object|null} [params.replyTo] - { id, name, content } of a quoted message
 */
const createMessage = async ({
  groupId,
  senderId,
  senderName,
  content,
  replyTo = null,
  image = null,
  documentData = null,
  locationData = null,
  voiceData = null,
  type = 'text',
  quoteData = null,
}) => {
  ensureFirebase();
  await verifyGroupAccess(groupId, senderId);

  const ref = firebase.getGroupMessagesRef(groupId).push();
  const message = {
    senderId: String(senderId),
    senderName: senderName || 'User',
    content: content || '',
    replyTo: replyTo || null,
    image: image || null,
    documentData: documentData || null,
    locationData: locationData || null,
    voiceData: voiceData || null,
    type: type || 'text',
    quoteData: quoteData || null,
    createdAt: Date.now(),
  };

  Object.keys(message).forEach((key) => {
    if (message[key] === null) {
      delete message[key];
    }
  });

  await ref.set(message);
  return { id: ref.key, groupId, ...message };
};

/**
 * Returns a group's messages, oldest-first, capped at `limit`.
 */
const queryMessages = async (groupId, { limit = 100 } = {}) => {
  ensureFirebase();
  const parsedLimit = parseInt(limit, 10) || 100;
  const snapshot = await firebase
    .getGroupMessagesRef(groupId)
    .orderByChild('createdAt')
    .limitToLast(parsedLimit)
    .once('value');

  const messages = [];
  snapshot.forEach((child) => {
    messages.push({ id: child.key, groupId, ...child.val() });
  });
  messages.sort((a, b) => a.createdAt - b.createdAt);
  return messages;
};

module.exports = {
  createMessage,
  queryMessages,
  verifyGroupAccess,
};
