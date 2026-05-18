/**
 * Visual text formatters specific to the userMain module.
 * Standardizes display structures for currency, percentages, and urgency meters.
 */

/**
 * Format standard prices with local currency symbol.
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Calculate and format percentage savings.
 */
export const calculateSavingsPercent = (original, group) => {
  if (!original || !group) return 0;
  return Math.round(((original - group) / original) * 100);
};

/**
 * Format dynamic remaining slots label.
 */
export const formatSpotsRemaining = (total, joined) => {
  const remaining = total - joined;
  if (remaining <= 0) return 'Pool full';
  if (remaining === 1) return 'Only 1 spot left! 🔥';
  return `${remaining} spots remaining`;
};

/**
 * Format duration to readable hours countdown.
 */
export const formatHoursCountdown = (hours) => {
  if (hours <= 0) return 'Expired';
  if (hours === 1) return 'Only 1 hour left';
  return `${hours} hours remaining`;
};
