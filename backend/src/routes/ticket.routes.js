const express = require('express');
const ticketController = require('../controllers/ticket.controller');
const auth = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const ticketValidation = require('../validations/ticket.validation');

const router = express.Router();

// ── Admin (auth + admin role) ───────────────────────────────────────
// Declared before the user `/:ticketId` routes so the static `/admin` segment
// is matched first.
router.get(
  '/admin/list',
  auth,
  adminOnly,
  validate(ticketValidation.listTickets),
  ticketController.listTicketsAdmin
);

router
  .route('/admin/:ticketId')
  .get(auth, adminOnly, validate(ticketValidation.ticketId), ticketController.getTicketAdmin)
  .patch(auth, adminOnly, validate(ticketValidation.updateTicket), ticketController.updateTicketAdmin)
  .delete(auth, adminOnly, validate(ticketValidation.ticketId), ticketController.deleteTicketAdmin);

router.post(
  '/admin/:ticketId/reply',
  auth,
  adminOnly,
  validate(ticketValidation.reply),
  ticketController.replyToTicketAdmin
);

// ── User-facing (any authenticated user) ────────────────────────────
router.post('/', auth, validate(ticketValidation.createTicket), ticketController.createTicket);
router.get('/my', auth, ticketController.getMyTickets);
router.get('/:ticketId', auth, validate(ticketValidation.ticketId), ticketController.getMyTicket);
router.post(
  '/:ticketId/reply',
  auth,
  validate(ticketValidation.reply),
  ticketController.replyToMyTicket
);

module.exports = router;
