const httpStatus = require('http-status').status;
const Ticket = require('../models/Ticket');
const ApiError = require('../utils/ApiError');
const { TICKET_STATUS } = require('../utils/constants');

// ── User-facing (consumer app) ──────────────────────────────────────

/**
 * Create a ticket on behalf of a user. The opening message is stored both as
 * `message` (for quick previews) and as the first entry of the conversation
 * `thread`, so the user/admin views render one continuous exchange.
 */
const createTicket = async (user, body) => {
  const openingBody = body.message.trim();
  return Ticket.create({
    user: user.id,
    name: body.name?.trim() || user.name || '',
    email: body.email?.trim() || user.email || '',
    phone: body.phone?.trim() || user.phone || '',
    subject: body.subject.trim(),
    category: body.category,
    message: openingBody,
    thread: [{ sender: 'user', senderName: user.name || '', body: openingBody }],
  });
};

// A user's own tickets, most recently updated first.
const getMyTickets = async (userId) =>
  Ticket.find({ user: userId }).sort({ updatedAt: -1 });

// Fetch a single ticket, asserting the requester owns it (admins use the admin
// path which skips this check).
const getMyTicketById = async (userId, ticketId) => {
  const ticket = await Ticket.findOne({ _id: ticketId, user: userId });
  if (!ticket) throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
  return ticket;
};

// Append a user reply to their own ticket. A reply on a resolved/closed ticket
// reopens it so support sees the new activity.
const addUserReply = async (user, ticketId, replyBody) => {
  const ticket = await getMyTicketById(user.id, ticketId);
  ticket.thread.push({ sender: 'user', senderName: user.name || '', body: replyBody.trim() });
  if ([TICKET_STATUS.RESOLVED, TICKET_STATUS.CLOSED].includes(ticket.status)) {
    ticket.status = TICKET_STATUS.OPEN;
    ticket.resolvedAt = undefined;
  }
  await ticket.save();
  return ticket;
};

// ── Admin console ───────────────────────────────────────────────────

/**
 * Admin listing with search (subject/name/email), status tab filter, and a
 * counts breakdown for the summary tabs.
 */
const queryTicketsAdmin = async (filter = {}) => {
  const { search, status, priority, category, page = 1, limit = 20 } = filter;

  const query = {};
  if (status && status !== 'all') query.status = status;
  if (priority && priority !== 'all') query.priority = priority;
  if (category && category !== 'all') query.category = category;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ subject: rx }, { name: rx }, { email: rx }, { message: rx }];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [results, totalResults, counts] = await Promise.all([
    Ticket.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name phone email avatar'),
    Ticket.countDocuments(query),
    Ticket.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  const raw = {};
  let all = 0;
  counts.forEach(({ _id, count }) => {
    raw[_id] = count;
    all += count;
  });

  return {
    results,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(totalResults / limitNum) || 1,
    totalResults,
    counts: {
      all,
      open: raw[TICKET_STATUS.OPEN] || 0,
      in_progress: raw[TICKET_STATUS.IN_PROGRESS] || 0,
      resolved: raw[TICKET_STATUS.RESOLVED] || 0,
      closed: raw[TICKET_STATUS.CLOSED] || 0,
    },
  };
};

const getTicketByIdAdmin = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId).populate('user', 'name phone email avatar');
  if (!ticket) throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
  return ticket;
};

// Admin reply. Posting a reply moves an untouched (open) ticket to in_progress
// so the queue reflects that support has engaged.
const addAdminReply = async (admin, ticketId, replyBody) => {
  const ticket = await getTicketByIdAdmin(ticketId);
  ticket.thread.push({ sender: 'admin', senderName: admin.name || 'Support', body: replyBody.trim() });
  if (ticket.status === TICKET_STATUS.OPEN) ticket.status = TICKET_STATUS.IN_PROGRESS;
  await ticket.save();
  return getTicketByIdAdmin(ticketId);
};

// Update status / priority. Stamps resolvedAt when moving to resolved/closed.
const updateTicketAdmin = async (ticketId, body) => {
  const ticket = await getTicketByIdAdmin(ticketId);
  if (body.status) {
    ticket.status = body.status;
    if ([TICKET_STATUS.RESOLVED, TICKET_STATUS.CLOSED].includes(body.status)) {
      ticket.resolvedAt = ticket.resolvedAt || new Date();
    } else {
      ticket.resolvedAt = undefined;
    }
  }
  if (body.priority) ticket.priority = body.priority;
  await ticket.save();
  return getTicketByIdAdmin(ticketId);
};

const deleteTicketAdmin = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
  await ticket.deleteOne();
  return ticket;
};

// Lightweight count for the sidebar badge (open + in_progress = needs action).
const countOpenTickets = () =>
  Ticket.countDocuments({ status: { $in: [TICKET_STATUS.OPEN, TICKET_STATUS.IN_PROGRESS] } });

module.exports = {
  createTicket,
  getMyTickets,
  getMyTicketById,
  addUserReply,
  queryTicketsAdmin,
  getTicketByIdAdmin,
  addAdminReply,
  updateTicketAdmin,
  deleteTicketAdmin,
  countOpenTickets,
};
