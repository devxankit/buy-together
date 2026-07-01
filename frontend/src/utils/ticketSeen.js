/**
 * Tracks which support tickets the current viewer has already read, so we can
 * show unread badges when a reply arrives while the thread isn't open.
 *
 * "Seen" is stored per ticket as the timestamp of the last message the viewer
 * had visible when they last opened it. A ticket is unread when a NEWER message
 * from the other party has since arrived. Kept in localStorage — this is a
 * per-device read cursor, deliberately lightweight (no backend state).
 */
const KEY = 'ticket_seen_v1';

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
};

const write = (map) => {
  try { localStorage.setItem(KEY, JSON.stringify(map)); }
  catch { /* storage full / unavailable — ignore */ }
};

const toMs = (v) => {
  const n = new Date(v || 0).getTime();
  return Number.isNaN(n) ? 0 : n;
};

const ticketKey = (ticket) => String(ticket?.id || ticket?._id || ticket || '');

export const getSeenAt = (id) => read()[String(id)] || 0;

/** Mark a ticket read up to `at` (defaults to now). */
export const markTicketSeen = (id, at) => {
  const key = String(id || '');
  if (!key) return;
  const map = read();
  map[key] = at ? toMs(at) : Date.now();
  write(map);
};

/**
 * Is this ticket unread for `viewer` ('user' | 'admin')? True when its most
 * recent message came from the OTHER party after we last opened the thread.
 */
export const isTicketUnread = (ticket, viewer) => {
  if (!ticket) return false;
  const thread = ticket.thread || [];
  const last = thread[thread.length - 1];
  const lastAt = toMs(ticket.lastMessageAt || last?.createdAt || ticket.updatedAt);
  if (!lastAt) return false;

  // When we can see who sent the last message, only the other party counts.
  if (last?.sender) {
    const fromOther = viewer === 'admin' ? last.sender === 'user' : last.sender === 'admin';
    if (!fromOther) return false;
  }
  return lastAt > getSeenAt(ticketKey(ticket));
};

/** Count unread tickets in a list for the given viewer. */
export const countUnread = (tickets, viewer) =>
  (tickets || []).reduce((n, t) => (isTicketUnread(t, viewer) ? n + 1 : n), 0);
