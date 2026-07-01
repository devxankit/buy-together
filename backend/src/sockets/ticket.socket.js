const logger = require('../utils/logger');
const pushService = require('../services/push.service');
const User = require('../models/User');
const { ROLES } = require('../utils/constants');
const { CHAT_NAMESPACE } = require('./chat.socket');

/**
 * Realtime support tickets.
 *
 * MongoDB is the ticket store; this rides the existing `/chat` Socket.IO
 * namespace (same authenticated connection the app already keeps open) to push
 * live updates so neither the user nor the admin has to refresh:
 *   • `ticket:<id>` room  — everyone currently viewing that thread (the owner
 *     and/or an admin) gets the full updated ticket via `ticket_update`.
 *   • `user:<id>` room    — the ticket owner gets `ticket_update` even when not
 *     on the thread (e.g. to refresh their ticket list / badge).
 *   • `admins` room       — all connected admins get a light `ticket_changed`
 *     ping so the support queue + counts re-fetch.
 *
 * Room membership is established by the `join_ticket` handler in chat.socket.js
 * and the role-based `admins` join on connection.
 */

// Pull just what the clients need to re-render — never the populated `user`
// object (avoids leaking unrelated account fields into the socket payload).
const ticketPayload = (ticket) => {
  const t = typeof ticket.toJSON === 'function' ? ticket.toJSON() : ticket;
  return {
    id: String(t.id || t._id),
    status: t.status,
    priority: t.priority,
    subject: t.subject,
    category: t.category,
    thread: t.thread,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    lastMessageAt: t.lastMessageAt,
  };
};

const ownerId = (ticket) => {
  const u = ticket.user;
  if (!u) return '';
  return String(u._id || u);
};

/**
 * Broadcast a ticket change (new reply, status/priority update) to its thread
 * viewers and owner, and ping the admin queue. Best-effort and non-throwing —
 * a socket hiccup must never break the REST request that triggered it.
 */
const emitTicketUpdate = (io, ticket) => {
  try {
    if (!io || !ticket) return;
    const ns = io.of(CHAT_NAMESPACE);
    const payload = ticketPayload(ticket);
    const uid = ownerId(ticket);

    ns.to(`ticket:${payload.id}`).emit('ticket_update', payload);
    if (uid) ns.to(`user:${uid}`).emit('ticket_update', payload);
    ns.to('admins').emit('ticket_changed', { id: payload.id });
  } catch (err) {
    logger.error(`emitTicketUpdate failed: ${err.message}`);
  }
};

/**
 * A brand-new ticket: nobody is viewing its thread yet, so we only ping the
 * admin queue so it surfaces in the support console without a refresh.
 */
const emitTicketCreated = (io, ticket) => {
  try {
    if (!io || !ticket) return;
    io.of(CHAT_NAMESPACE).to('admins').emit('ticket_changed', { id: String(ticket.id || ticket._id) });
  } catch (err) {
    logger.error(`emitTicketCreated failed: ${err.message}`);
  }
};

/** Short, human preview of the last reply for a push body. */
const lastReplyPreview = (ticket) => {
  const thread = ticket.thread || [];
  const last = thread[thread.length - 1];
  const body = (last && last.body) || ticket.message || '';
  const t = String(body).trim();
  if (!t) return 'New message';
  return t.length > 120 ? `${t.slice(0, 117)}…` : t;
};

/**
 * Who is currently viewing this ticket thread (socket joined to `ticket:<id>`)?
 * These recipients get the live in-thread update, so we skip a redundant push.
 */
const ticketViewers = async (io, ticketId) => {
  const set = new Set();
  try {
    const sockets = await io.of(CHAT_NAMESPACE).in(`ticket:${ticketId}`).fetchSockets();
    sockets.forEach((s) => { if (s.data?.userId) set.add(String(s.data.userId)); });
  } catch (e) { /* presence is best-effort */ }
  return set;
};

/**
 * Push notification for a ticket reply, so the OTHER party is buzzed even when
 * the app is closed/backgrounded. Admin reply → notify the ticket owner; user
 * reply → notify every admin. Anyone currently viewing the thread is skipped
 * (they already saw it live). Best-effort and non-throwing.
 *
 * @param {'user'|'admin'} senderRole who just replied
 */
const notifyTicketReply = async (io, ticket, senderRole) => {
  try {
    if (!io || !ticket) return;
    const id = String(ticket.id || ticket._id);
    const active = await ticketViewers(io, id);
    const preview = lastReplyPreview(ticket);

    if (senderRole === 'admin') {
      const uid = ownerId(ticket);
      if (!uid || active.has(uid)) return;
      await pushService.sendToUser(uid, {
        title: 'Support replied',
        body: preview,
        link: '/help-center',
        data: { type: 'ticket', ticketId: id },
      });
    } else {
      const admins = await User.find({ role: ROLES.ADMIN }).select('_id');
      const userName = (ticket.user && ticket.user.name) || ticket.name || 'A user';
      const targets = admins
        .map((a) => String(a._id))
        .filter((aid) => aid && !active.has(aid));
      await Promise.all(
        targets.map((aid) =>
          pushService.sendToUser(aid, {
            title: 'New ticket reply',
            body: `${userName}: ${preview}`,
            link: '/admin/support',
            data: { type: 'ticket', ticketId: id },
          })
        )
      );
    }
  } catch (err) {
    logger.error(`notifyTicketReply failed: ${err.message}`);
  }
};

module.exports = { emitTicketUpdate, emitTicketCreated, notifyTicketReply };
