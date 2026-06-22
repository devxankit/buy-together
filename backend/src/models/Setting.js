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
    liveStatsActiveGroups: { type: String, trim: true, default: '8,642' },
    liveStatsActiveGroupsTrend: { type: String, trim: true, default: '+12% today' },
    liveStatsPeopleInterested: { type: String, trim: true, default: '1,23,876' },
    liveStatsPeopleInterestedTrend: { type: String, trim: true, default: '+18% today' },
    liveStatsGroupsGrowing: { type: String, trim: true, default: '312' },
    liveStatsGroupsGrowingTrend: { type: String, trim: true, default: '+24% today' },
    liveStatsTopCity: { type: String, trim: true, default: 'Indore' },
    liveStatsTopCityTrend: { type: String, trim: true, default: 'This Week' },
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
