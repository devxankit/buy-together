/**
 * Seed the admin-editable content pages (Help Center, Terms, Privacy, Community
 * Guidelines, About Us) with the exact copy the consumer app previously hard-
 * coded — now fully backed by the database and controllable from the admin
 * console (Content Pages).
 *
 *   npm run seed:content
 *
 * Safe to re-run: each page is upserted by slug, so existing pages are
 * overwritten with the seed copy. Run this once to populate the DB, then edit
 * the pages from the admin console (re-running will reset them to these
 * defaults).
 */
const mongoose = require('mongoose');
const config = require('../config/env');
const logger = require('../utils/logger');
const ContentPage = require('../models/ContentPage');

const PAGES = [
  // ── Help Center ───────────────────────────────────────────────────
  // Sections are rendered as a FAQ accordion (title = question, body = answer).
  {
    slug: 'help-center',
    title: 'Help Center',
    intro: '',
    contactEmail: 'support@buytogether.in',
    sections: [
      { title: 'How does group buying work?', body: 'When multiple buyers come together for the same product, BuyTogether negotiates a bulk discount from verified vendors. You join a group, wait for the minimum number of buyers, and then everyone gets the discounted price!' },
      { title: 'How do I create a buying group?', body: 'Tap the + icon in the bottom nav, fill in the product details, set your group goal (minimum buyers), choose a category, and publish. Others can then discover and join your group.' },
      { title: 'Is my payment secure?', body: 'Yes! All payments are processed through our secure payment gateway with end-to-end encryption. We use RBI-compliant payment processing and never store your card details.' },
      { title: "What happens if a group doesn't reach its goal?", body: "If the minimum number of buyers isn't reached before the deadline, the group expires and no one is charged. You'll be notified and can join or create another group." },
      { title: 'How do I track my order?', body: "Go to Profile → My Orders to see all your orders with real-time tracking updates. You'll also receive notifications at each stage of delivery." },
      { title: 'Can I cancel after joining a group?', body: 'Yes, you can leave a group anytime before the deal is confirmed. Once the deal is locked and payment is made, cancellations follow our refund policy.' },
    ],
  },

  // ── Terms & Conditions ────────────────────────────────────────────
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    lastUpdated: 'May 2026',
    sections: [
      { title: '1. Acceptance of Terms', body: 'By downloading, installing, or using BuyTogether ("the App"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the App.' },
      { title: '2. User Accounts', body: 'You must provide accurate and complete information when creating your account. You are responsible for maintaining the confidentiality of your account. You must be at least 18 years old to use BuyTogether.' },
      { title: '3. Group Buying Mechanism', body: 'BuyTogether facilitates group purchases by connecting buyers with similar interests. A deal is confirmed only when the minimum number of buyers is reached within the specified deadline. BuyTogether acts as a platform and is not a party to transactions between buyers and vendors.' },
      { title: '4. Payments & Pricing', body: 'All prices are in Indian Rupees (INR). Payment is collected only after a deal is confirmed. Prices shown are estimates and may vary based on vendor availability and group size. All transactions are processed through RBI-compliant payment gateways.' },
      { title: '5. Cancellations & Refunds', body: 'You may leave a group before the deal is confirmed at no cost. Once a deal is confirmed and payment is made, cancellations are subject to vendor policies. Refunds, if applicable, will be processed within 7-10 business days.' },
      { title: '6. User Conduct', body: 'Users must not engage in fraudulent activities, spam other users, create fake groups or accounts, harass other members, or post misleading product information. Violation may result in account suspension.' },
      { title: '7. Intellectual Property', body: 'All content, logos, and trademarks on BuyTogether are owned by us. You may not copy, modify, or distribute any content without prior written consent.' },
      { title: '8. Limitation of Liability', body: 'BuyTogether is not liable for any direct, indirect, incidental, or consequential damages arising from the use of the platform. We do not guarantee the quality of products purchased through vendor deals.' },
      { title: '9. Changes to Terms', body: 'We reserve the right to modify these terms at any time. Continued use of the App after changes constitutes acceptance of the new terms. Major changes will be notified via email or in-app notification.' },
    ],
  },

  // ── Privacy Policy ────────────────────────────────────────────────
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    intro: 'Your privacy is our priority. We are committed to protecting your personal information in compliance with Indian IT Act, 2000 and DPDP Act, 2023.',
    lastUpdated: 'May 2026',
    sections: [
      { title: '1. Information We Collect', body: 'We collect personal information you provide (name, email, phone number, location), device information (device type, OS), usage data (groups joined, interactions), and payment information (processed securely via third-party gateways).' },
      { title: '2. How We Use Your Data', body: 'Your data is used to facilitate group buying, send deal notifications, improve app experience, verify your identity, process transactions, and provide customer support. We analyze usage patterns to enhance our platform.' },
      { title: '3. Data Sharing', body: 'We share limited information with vendors to process confirmed deals, payment processors for transactions, and analytics providers (anonymized data only). We never sell your personal data to third parties.' },
      { title: '4. Data Storage & Security', body: 'Your data is stored on secure servers within India. We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. Regular security audits are conducted to ensure data protection.' },
      { title: '5. Your Rights', body: 'You have the right to access your personal data, request corrections or deletion, opt out of marketing communications, export your data, and withdraw consent at any time.' },
      { title: '6. Cookies & Tracking', body: 'We use essential cookies for app functionality, analytics cookies to understand usage patterns, and preference cookies to remember your settings. You can manage cookie preferences in your device settings.' },
      { title: "7. Children's Privacy", body: 'BuyTogether is not intended for users under 18 years of age. We do not knowingly collect data from minors. If you believe a minor has provided us with personal information, please contact us immediately.' },
      { title: '8. Contact Us', body: 'For privacy-related queries, contact our Data Protection Officer at privacy@buytogether.in or write to: BuyTogether Technologies Pvt. Ltd., Mumbai, Maharashtra, India.' },
    ],
  },

  // ── Community Guidelines ──────────────────────────────────────────
  // icon = leading emoji on each rule card.
  {
    slug: 'community-guidelines',
    title: 'Community Guidelines',
    intro: 'BuyTogether is built on trust and collaboration. Follow these guidelines to keep our community safe, fair, and enjoyable for everyone.',
    sections: [
      { icon: '🤝', title: 'Be Respectful', body: "Treat all members with courtesy. No hate speech, discrimination, or personal attacks. We're all here to save money together." },
      { icon: '✅', title: 'Be Honest', body: "Provide accurate information about products and deals. Don't post misleading prices, fake reviews, or false claims about vendors." },
      { icon: '🚫', title: 'No Spam', body: "Don't send unsolicited messages, promotions, or repetitive content in group chats. Keep discussions relevant to the group's purpose." },
      { icon: '🔒', title: 'Protect Privacy', body: "Never share other members' personal information without consent. Don't screenshot private conversations to share externally." },
      { icon: '🛡️', title: 'No Fraud', body: 'Any attempts at fraud, scams, or deceptive practices will result in immediate account termination and may be reported to authorities.' },
      { icon: '📦', title: 'Commit to Deals', body: 'Once you join a group and a deal is confirmed, honor your commitment. Backing out affects all group members and may result in penalties.' },
      { icon: '🏪', title: 'Verified Vendors Only', body: 'Only negotiate with and purchase from verified vendors on the platform. Avoid side deals outside of BuyTogether for your protection.' },
      { icon: '📢', title: 'Report Issues', body: 'If you encounter inappropriate behavior, suspicious activity, or fraudulent vendors, report them immediately through the app.' },
      { icon: '⚠️', title: 'Violations', body: 'Violations may result in warnings, temporary suspension, or permanent account ban depending on severity. Repeated violations will escalate enforcement.' },
    ],
  },

  // ── About Us ──────────────────────────────────────────────────────
  {
    slug: 'about',
    title: 'About BuyTogether',
    intro: 'Group Buying Made Simple — Version 2.3.1',
    contactEmail: 'hello@buytogether.in',
    sections: [
      { icon: '🎯', title: 'Our Mission', body: 'To empower consumers by bringing the power of collective buying to everyone. We believe that when people come together, they can unlock deals that are impossible individually.' },
      { icon: '1️⃣', title: 'Create or Join', body: 'Find a group for the product you want or create your own.' },
      { icon: '2️⃣', title: 'Reach the Goal', body: 'Invite friends & wait for minimum buyers to join.' },
      { icon: '3️⃣', title: 'Get the Deal', body: 'Once goal is reached, vendors provide bulk discount pricing.' },
      { icon: '4️⃣', title: 'Save Together', body: 'Everyone gets the discounted price. Win-win!' },
      { icon: '📬', title: 'Contact Us', body: 'Email: hello@buytogether.in\nSupport: support@buytogether.in\nLocation: Mumbai, Maharashtra, India' },
    ],
  },
];

const run = async () => {
  await mongoose.connect(config.mongoose.url, config.mongoose.options);
  logger.info('Connected to MongoDB for content seeding');

  for (const page of PAGES) {
    await ContentPage.findOneAndUpdate(
      { slug: page.slug },
      { $set: { ...page, isActive: true } },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );
    logger.info(`Seeded content page "${page.slug}" (${page.sections.length} sections)`);
  }

  logger.info(`Content seed complete → ${PAGES.length} pages`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (err) => {
  logger.error(`Content seed failed: ${err.message}`);
  try {
    await mongoose.disconnect();
  } catch (_) {
    // ignore
  }
  process.exit(1);
});
