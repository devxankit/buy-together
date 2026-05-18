/**
 * Application configurations specific to the userMain module.
 * Protects thresholds, ranges, and static defaults from magic-number problems.
 */
export const USER_CONFIG = {
  // Slots threshold for highlight styling
  URGENCY_THRESHOLD: 3,
  
  // Default range limits
  DEFAULT_SLOTS_OPTIONS: [3, 5, 8, 10],
  DEFAULT_DURATION_HOURS: [6, 12, 24],
  
  // Maximum geographical pool search radius in km
  POOL_RADIUS_LIMIT_KM: 5,
  
  // Storage keys
  STORAGE_KEYS: {
    USER_SESSION: 'user_main_session',
    ACTIVE_ROOM: 'user_main_active_room_id'
  }
};

export default USER_CONFIG;
