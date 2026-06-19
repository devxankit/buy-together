const User = require('../models/User');
const Group = require('../models/Group');
const { ROLES, USER_STATUS, GROUP_STATUS } = require('../utils/constants');

/**
 * Fraud & risk detection.
 *
 * Rather than mock signals, this derives genuine risk indicators from real data
 * (users, groups, membership). Each detector emits a signal with a 0–100 risk
 * score; severity buckets are derived from the score. Everything is read-only;
 * enforcement (suspend/flag) is done via the existing admin user/group routes.
 */

const normalize = (str) =>
  String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const severityFor = (score) => (score >= 75 ? 'high' : score >= 45 ? 'medium' : 'low');

const DAY = 24 * 60 * 60 * 1000;

const getRiskSignals = async () => {
  const [groups, users] = await Promise.all([
    Group.find({})
      .select('title productName category location members admin status createdAt spotsTotal')
      .lean(),
    User.find({ role: ROLES.USER })
      .select('name phone email status isPhoneVerified lastLoginAt createdAt')
      .lean(),
  ]);

  const userMap = new Map(users.map((u) => [String(u._id), u]));
  const signals = [];
  const now = Date.now();

  // 1) Duplicate groups — several groups sharing a normalized title.
  const byTitle = {};
  groups.forEach((g) => {
    const key = normalize(g.title);
    if (key) (byTitle[key] = byTitle[key] || []).push(g);
  });
  Object.values(byTitle)
    .filter((arr) => arr.length > 1)
    .forEach((arr) => {
      const latest = arr.reduce((a, b) => (new Date(a.createdAt) > new Date(b.createdAt) ? a : b));
      const score = Math.min(95, 48 + arr.length * 12);
      signals.push({
        id: `dupgroup-${normalize(arr[0].title).replace(/\s+/g, '-')}`,
        type: 'Duplicate group',
        severity: severityFor(score),
        score,
        detail: `${arr.length} groups share the title "${arr[0].title}" — possible spam or scam duplication.`,
        entity: arr[0].title,
        entityType: 'group',
        entityId: String(latest._id),
        createdAt: latest.createdAt,
      });
    });

  // 2) Signup velocity — a burst of accounts created within the same hour.
  const hourBuckets = {};
  users.forEach((u) => {
    if (!u.createdAt) return;
    const key = new Date(u.createdAt).toISOString().slice(0, 13); // yyyy-mm-ddTHH
    (hourBuckets[key] = hourBuckets[key] || []).push(u);
  });
  Object.entries(hourBuckets)
    .filter(([, arr]) => arr.length >= 5)
    .forEach(([key, arr]) => {
      const score = Math.min(98, 38 + arr.length * 8);
      signals.push({
        id: `velocity-${key}`,
        type: 'Signup velocity',
        severity: severityFor(score),
        score,
        detail: `${arr.length} accounts were created within one hour (${key.replace('T', ' ')}:00 UTC) — possible automated sign-ups.`,
        entity: `${arr.length} accounts in 1 hour`,
        entityType: 'none',
        entityId: null,
        createdAt: arr[arr.length - 1].createdAt,
      });
    });

  // 3) Unverified-heavy groups — most members never verified their phone.
  groups.forEach((g) => {
    const members = (g.members || []).map((id) => userMap.get(String(id))).filter(Boolean);
    if (members.length < 3) return;
    const unverified = members.filter((m) => !m.isPhoneVerified);
    const ratio = unverified.length / members.length;
    if (unverified.length >= 3 && ratio >= 0.5) {
      const score = Math.min(90, 40 + unverified.length * 6);
      signals.push({
        id: `unverified-${g._id}`,
        type: 'Unverified members',
        severity: severityFor(score),
        score,
        detail: `${unverified.length}/${members.length} members (${Math.round(ratio * 100)}%) of "${g.title}" have unverified phone numbers.`,
        entity: g.title,
        entityType: 'group',
        entityId: String(g._id),
        createdAt: g.createdAt,
      });
    }
  });

  // 4) Low-intent ring — a group padded with accounts that never logged in.
  groups.forEach((g) => {
    const members = (g.members || []).map((id) => userMap.get(String(id))).filter(Boolean);
    if (members.length < 3) return;
    const dormant = members.filter((m) => !m.lastLoginAt);
    const ratio = dormant.length / members.length;
    if (dormant.length >= 3 && ratio >= 0.6) {
      const score = Math.min(85, 34 + dormant.length * 5);
      signals.push({
        id: `dormant-${g._id}`,
        type: 'Low-intent ring',
        severity: severityFor(score),
        score,
        detail: `${dormant.length}/${members.length} members (${Math.round(ratio * 100)}%) of "${g.title}" have never logged in — likely padded membership.`,
        entity: g.title,
        entityType: 'group',
        entityId: String(g._id),
        createdAt: g.createdAt,
      });
    }
  });

  // 5) Duplicate identity — multiple accounts sharing one email.
  const byEmail = {};
  users.forEach((u) => {
    if (u.email) (byEmail[u.email] = byEmail[u.email] || []).push(u);
  });
  Object.entries(byEmail)
    .filter(([, arr]) => arr.length > 1)
    .forEach(([email, arr]) => {
      const score = Math.min(92, 55 + arr.length * 10);
      signals.push({
        id: `dupemail-${normalize(email).replace(/\s+/g, '-')}`,
        type: 'Duplicate identity',
        severity: severityFor(score),
        score,
        detail: `${arr.length} accounts share the email ${email} — possible multi-accounting.`,
        entity: email,
        entityType: 'user',
        entityId: String(arr[0]._id),
        createdAt: arr[arr.length - 1].createdAt,
      });
    });

  // 6) Flagged/suspended member active in a live group.
  const liveStatuses = [GROUP_STATUS.ACTIVE, GROUP_STATUS.CLOSING];
  groups
    .filter((g) => liveStatuses.includes(g.status))
    .forEach((g) => {
      (g.members || []).forEach((id) => {
        const u = userMap.get(String(id));
        if (!u) return;
        if (u.status === USER_STATUS.SUSPENDED || u.status === USER_STATUS.FLAGGED) {
          const score = u.status === USER_STATUS.SUSPENDED ? 82 : 60;
          signals.push({
            id: `badmember-${g._id}-${u._id}`,
            type: 'Flagged member active',
            severity: severityFor(score),
            score,
            detail: `${u.status === USER_STATUS.SUSPENDED ? 'Suspended' : 'Flagged'} account "${u.name}" is an active member of "${g.title}".`,
            entity: u.name,
            entityType: 'user',
            entityId: String(u._id),
            createdAt: g.createdAt,
          });
        }
      });
    });

  // 7) New account already in many groups — joined-everything pattern.
  const membershipCount = {};
  groups.forEach((g) => (g.members || []).forEach((id) => {
    const k = String(id);
    membershipCount[k] = (membershipCount[k] || 0) + 1;
  }));
  Object.entries(membershipCount).forEach(([uid, count]) => {
    const u = userMap.get(uid);
    if (!u || count < 5) return;
    const ageDays = u.createdAt ? (now - new Date(u.createdAt).getTime()) / DAY : 999;
    if (ageDays <= 3) {
      const score = Math.min(88, 45 + count * 5);
      signals.push({
        id: `joinall-${uid}`,
        type: 'Aggressive joining',
        severity: severityFor(score),
        score,
        detail: `"${u.name}" joined ${count} groups within ${Math.max(1, Math.round(ageDays))} day(s) of signing up — unusual for a genuine buyer.`,
        entity: u.name,
        entityType: 'user',
        entityId: uid,
        createdAt: u.createdAt,
      });
    }
  });

  signals.sort((a, b) => b.score - a.score);

  const distinct = (type) =>
    new Set(signals.filter((s) => s.entityType === type && s.entityId).map((s) => s.entityId)).size;

  const summary = {
    open: signals.length,
    high: signals.filter((s) => s.severity === 'high').length,
    medium: signals.filter((s) => s.severity === 'medium').length,
    low: signals.filter((s) => s.severity === 'low').length,
    groupsAffected: distinct('group'),
    accountsAtRisk: distinct('user'),
  };

  return { signals, summary };
};

module.exports = { getRiskSignals };
