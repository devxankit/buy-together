/**
 * Route mapping dictionary for the userMain module.
 * centralizes all sub-directories and URLs.
 */
export const USER_PATHS = {
  HOME: '/',
  EXPLORE_CATEGORIES: '/categories',
  DEALS: '/deals',
  GROUPS: '/groups',
  GROUP_DETAILS: '/groups/:groupId',
  CREATE_GROUP: '/groups/create',
  GROUP_CHAT: '/groups/:groupId/chat',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications'
};

export default USER_PATHS;
