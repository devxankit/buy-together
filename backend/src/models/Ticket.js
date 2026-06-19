const mongoose = require('mongoose');
const { TICKET_STATUS, TICKET_PRIORITY, TICKET_CATEGORY } = require('../utils/constants');

/**
 * Ticket
 * ------
 * A support request raised by a user from the consumer app's Help Center. The
 * original request lives in `subject` + `message`; every subsequent exchange
 * (user follow-up or admin reply) is appended to `thread` so both the user and
 * the admin console render one continuous conversation. Admins move the ticket
 * through its lifecycle (`status`) and can flag urgency via `priority`.
 */
const replySchema = mongoose.Schema(
  {
    // Who wrote this message — 'user' (the requester) or 'admin' (support).
    sender: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
    },
    // Display name captured at write time (so the thread reads well even if the
    // account is later renamed or removed).
    senderName: {
      type: String,
      trim: true,
      default: '',
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true, _id: true }
);

const ticketSchema = mongoose.Schema(
  {
    // The user who raised the ticket (consumer app account).
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Contact snapshot at submission time.
    name: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    phone: { type: String, trim: true, default: '' },

    subject: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(TICKET_CATEGORY),
      default: TICKET_CATEGORY.GENERAL,
    },
    // Opening message body (also mirrored as the first item of `thread`).
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(TICKET_STATUS),
      default: TICKET_STATUS.OPEN,
      index: true,
    },
    priority: {
      type: String,
      enum: Object.values(TICKET_PRIORITY),
      default: TICKET_PRIORITY.MEDIUM,
    },
    // Full conversation, oldest first.
    thread: [replySchema],
    resolvedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        // Convenience flags for list/detail rendering.
        ret.lastMessageAt =
          ret.thread && ret.thread.length
            ? ret.thread[ret.thread.length - 1].createdAt
            : ret.createdAt;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Admin console sorts by most-recently-updated within a status filter.
ticketSchema.index({ status: 1, updatedAt: -1 });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
