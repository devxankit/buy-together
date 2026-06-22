const joi = require('joi');
const { GROUP_TYPE } = require('../utils/constants');

// Consumer-app group creation. Mirrors the admin create-group field set so a
// group created by a buyer and one created by an admin share the same shape —
// only the admin-only management fields (status, slogan, image, location,
// creatorName) are omitted here and default on the server.
const createGroup = {
  body: joi
    .object()
    .keys({
      // `name` is the legacy alias the consumer app posted; `title` is canonical.
      name: joi.string().trim().max(120),
      title: joi.string().trim().max(120),
      productName: joi.string().trim().max(120).allow('', null),
      description: joi.string().max(1000).allow('', null),
      category: joi.string().trim().max(60).allow('', null),
      subCategory: joi.string().trim().max(60).allow('', null),
      type: joi.string().valid(...Object.values(GROUP_TYPE)),
      image: joi.string().uri().allow('', null),
      location: joi.string().max(120).allow('', null),
      // Exact device pinpoint captured at creation so distance sorting on the
      // Explore page can rank each group precisely (not just by city center).
      coordinates: joi.object({ lat: joi.number().allow(null), lng: joi.number().allow(null) }).allow(null),
      spotsTotal: joi.number().integer().min(0).max(100000),
      closesAt: joi.date().allow('', null),
    })
    .or('name', 'title'),
};

module.exports = {
  createGroup,
};
