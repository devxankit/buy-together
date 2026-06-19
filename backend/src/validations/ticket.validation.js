const joi = require('joi');
const { TICKET_STATUS, TICKET_PRIORITY, TICKET_CATEGORY } = require('../utils/constants');

const objectId = joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'Invalid id',
});

// ── User-facing ─────────────────────────────────────────────────────
const createTicket = {
  body: joi.object().keys({
    subject: joi.string().trim().min(3).max(120).required().messages({
      'any.required': 'A subject is required',
      'string.min': 'Subject must be at least 3 characters',
    }),
    message: joi.string().trim().min(5).max(4000).required().messages({
      'any.required': 'Please describe your issue',
      'string.min': 'Please add a little more detail (min 5 characters)',
    }),
    category: joi.string().valid(...Object.values(TICKET_CATEGORY)).default(TICKET_CATEGORY.GENERAL),
    // Optional contact overrides — default to the account's details server-side.
    name: joi.string().trim().max(80).allow('', null),
    email: joi.string().trim().email({ tlds: false }).max(120).allow('', null),
    phone: joi.string().trim().max(20).allow('', null),
  }),
};

const ticketId = {
  params: joi.object().keys({ ticketId: objectId.required() }),
};

const reply = {
  params: joi.object().keys({ ticketId: objectId.required() }),
  body: joi.object().keys({
    body: joi.string().trim().min(1).max(4000).required().messages({
      'any.required': 'Message cannot be empty',
    }),
  }),
};

// ── Admin ───────────────────────────────────────────────────────────
const listTickets = {
  query: joi.object().keys({
    search: joi.string().allow('', null),
    status: joi.string().valid('all', ...Object.values(TICKET_STATUS)),
    priority: joi.string().valid('all', ...Object.values(TICKET_PRIORITY)),
    page: joi.number().integer().min(1),
    limit: joi.number().integer().min(1).max(100),
  }),
};

const updateTicket = {
  params: joi.object().keys({ ticketId: objectId.required() }),
  body: joi
    .object()
    .keys({
      status: joi.string().valid(...Object.values(TICKET_STATUS)),
      priority: joi.string().valid(...Object.values(TICKET_PRIORITY)),
    })
    .min(1),
};

module.exports = {
  createTicket,
  ticketId,
  reply,
  listTickets,
  updateTicket,
};
