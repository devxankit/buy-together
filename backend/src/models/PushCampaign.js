const mongoose = require('mongoose');

/**
 * PushCampaign
 * ------------
 * An audit record of every push notification broadcast sent from the admin
 * console. Stores the composed content, the target platform, and the delivery
 * stats returned by FCM so the admin can review send history.
 */
const pushCampaignSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    image: { type: String, default: '', trim: true },
    link: { type: String, default: '', trim: true },
    // Which token pool(s) the broadcast targeted.
    platform: {
      type: String,
      enum: ['web', 'mobile', 'all'],
      default: 'all',
    },
    // Delivery outcome reported by FCM.
    stats: {
      recipients: { type: Number, default: 0 }, // unique tokens targeted
      success: { type: Number, default: 0 },
      failure: { type: Number, default: 0 },
    },
    // Admin who triggered the send.
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sentByName: { type: String, default: '', trim: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const PushCampaign = mongoose.model('PushCampaign', pushCampaignSchema);

module.exports = PushCampaign;
