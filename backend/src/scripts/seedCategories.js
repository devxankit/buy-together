/**
 * Seed the Category collection with the popular categories (and their
 * sub-categories) that the app previously hard-coded on the Home screen and the
 * Create-Group flow — now fully backed by the database and admin-manageable.
 *
 *   npm run seed:categories
 *
 * Idempotent: each category is upserted by its slug, so re-running updates the
 * seeded records in place without creating duplicates. Categories created by an
 * admin (different slugs) are left untouched.
 */
const mongoose = require('mongoose');
const config = require('../config/env');
const logger = require('../utils/logger');
const Category = require('../models/Category');
const { slugify } = require('../services/category.service');

const UNSPLASH = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=200&q=80`;

// Popular categories shown in the Home grid + used by Create-Group. `icon` is a
// lucide-react icon name (used by the admin console). Order drives the carousel.
const CATEGORIES = [
  {
    name: 'Smartphones',
    image: UNSPLASH('photo-1511707171634-5f897ff02aa9'),
    icon: 'Smartphone',
    color: '#0D9488',
    description: 'Phones, tablets and wearables',
    subCategories: ['Android Phones', 'iPhone', 'Tablets', 'Smart Watches', 'Accessories'],
  },
  {
    name: 'Laptops',
    image: UNSPLASH('photo-1496181133206-80ce9b88a853'),
    icon: 'Laptop',
    color: '#2563EB',
    description: 'Laptops and computing',
    subCategories: ['Gaming Laptops', 'Ultrabooks', 'Business Laptops', '2-in-1 Laptops', 'Accessories'],
  },
  {
    name: 'Appliances',
    image: UNSPLASH('photo-1584622650111-993a426fbf0a'),
    icon: 'WashingMachine',
    color: '#7C3AED',
    description: 'Home and kitchen appliances',
    subCategories: ['Refrigerators', 'Washing Machines', 'Microwaves', 'Air Conditioners', 'Kitchen Appliances'],
  },
  {
    name: 'Electronics',
    image: UNSPLASH('photo-1498049794561-7780e7231661'),
    icon: 'Tv',
    color: '#DC2626',
    description: 'TVs, audio and gadgets',
    subCategories: ['Televisions', 'Audio & Speakers', 'Cameras', 'Gaming Consoles', 'Smart Home'],
  },
  {
    name: 'Home & Living',
    image: UNSPLASH('photo-1555041469-a586c61ea9bc'),
    icon: 'Sofa',
    color: '#D97706',
    description: 'Furniture and home decor',
    subCategories: ['Furniture', 'Home Decor', 'Bedding', 'Lighting', 'Storage'],
  },
  {
    name: 'Fashion',
    image: UNSPLASH('photo-1483985988355-763728e1935b'),
    icon: 'Shirt',
    color: '#DB2777',
    description: 'Clothing and footwear',
    subCategories: ["Men's Wear", "Women's Wear", 'Kids Wear', 'Footwear', 'Accessories'],
  },
  {
    name: 'Beauty & Care',
    image: UNSPLASH('photo-1596462502278-27bfdc403348'),
    icon: 'Sparkles',
    color: '#9333EA',
    description: 'Beauty, skincare and grooming',
    subCategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrances', 'Grooming'],
  },
  {
    name: 'Groceries',
    image: UNSPLASH('photo-1542838132-92c53300491e'),
    icon: 'ShoppingBasket',
    color: '#16A34A',
    description: 'Daily essentials and staples',
    subCategories: ['Staples & Grains', 'Snacks', 'Beverages', 'Personal Care', 'Household'],
  },
];

const run = async () => {
  await mongoose.connect(config.mongoose.url, config.mongoose.options);

  let created = 0;
  let updated = 0;

  for (let i = 0; i < CATEGORIES.length; i += 1) {
    const c = CATEGORIES[i];
    const slug = slugify(c.name);
    const doc = {
      name: c.name,
      slug,
      image: c.image,
      icon: c.icon || '',
      color: c.color || '',
      description: c.description || '',
      displayOrder: i,
      isActive: true,
      subCategories: c.subCategories || [],
    };

    // eslint-disable-next-line no-await-in-loop
    const existing = await Category.findOne({ slug });
    if (existing) {
      // eslint-disable-next-line no-await-in-loop
      await Category.updateOne({ _id: existing._id }, { $set: doc });
      updated += 1;
      logger.info(`↻ updated category: ${c.name} (${c.subCategories.length} sub-categories)`);
    } else {
      // eslint-disable-next-line no-await-in-loop
      await Category.create(doc);
      created += 1;
      logger.info(`＋ created category: ${c.name} (${c.subCategories.length} sub-categories)`);
    }
  }

  const total = await Category.countDocuments({});
  logger.info(`Done. created=${created}, updated=${updated}, total categories in DB=${total}`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (err) => {
  logger.error(`seed:categories failed: ${err.message}`);
  try { await mongoose.disconnect(); } catch (_) { /* ignore */ }
  process.exit(1);
});
