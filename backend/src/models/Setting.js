const mongoose = require('mongoose');

/**
 * Setting
 * -------
 * Singleton document holding platform-wide general settings shown on the admin
 * Settings page (brand, support contact details). There is only ever one of
 * these — `getSingleton()` creates it on first access.
 */
const settingSchema = mongoose.Schema(
  {
    // A fixed key guarantees a single document.
    key: {
      type: String,
      default: 'global',
      unique: true,
    },
    platformName: { type: String, trim: true, default: 'Buy Together' },
    supportEmail: { type: String, trim: true, default: '' },
    contactNumber: { type: String, trim: true, default: '' },
    contactNumberAlt: { type: String, trim: true, default: '' },
    supportAddress: { type: String, trim: true, default: '' },
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

settingSchema.statics.getSingleton = async function () {
  let doc = await this.findOne({ key: 'global' });
  if (!doc) doc = await this.create({ key: 'global' });
  return doc;
};

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;
