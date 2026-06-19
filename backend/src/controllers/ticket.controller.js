const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const ticketService = require('../services/ticket.service');
const { pick } = require('../utils/helpers');

// ── User-facing ─────────────────────────────────────────────────────
const createTicket = catchAsync(async (req, res) => {
  const ticket = await ticketService.createTicket(req.user, req.body);
  res.status(httpStatus.CREATED).send(ticket);
});

const getMyTickets = catchAsync(async (req, res) => {
  const tickets = await ticketService.getMyTickets(req.user.id);
  res.send(tickets);
});

const getMyTicket = catchAsync(async (req, res) => {
  const ticket = await ticketService.getMyTicketById(req.user.id, req.params.ticketId);
  res.send(ticket);
});

const replyToMyTicket = catchAsync(async (req, res) => {
  const ticket = await ticketService.addUserReply(req.user, req.params.ticketId, req.body.body);
  res.send(ticket);
});

// ── Admin ───────────────────────────────────────────────────────────
const listTicketsAdmin = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'status', 'priority', 'page', 'limit']);
  const result = await ticketService.queryTicketsAdmin(filter);
  res.send(result);
});

const getTicketAdmin = catchAsync(async (req, res) => {
  const ticket = await ticketService.getTicketByIdAdmin(req.params.ticketId);
  res.send(ticket);
});

const replyToTicketAdmin = catchAsync(async (req, res) => {
  const ticket = await ticketService.addAdminReply(req.user, req.params.ticketId, req.body.body);
  res.send(ticket);
});

const updateTicketAdmin = catchAsync(async (req, res) => {
  const ticket = await ticketService.updateTicketAdmin(req.params.ticketId, req.body);
  res.send(ticket);
});

const deleteTicketAdmin = catchAsync(async (req, res) => {
  await ticketService.deleteTicketAdmin(req.params.ticketId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTicket,
  getMyTickets,
  getMyTicket,
  replyToMyTicket,
  listTicketsAdmin,
  getTicketAdmin,
  replyToTicketAdmin,
  updateTicketAdmin,
  deleteTicketAdmin,
};
