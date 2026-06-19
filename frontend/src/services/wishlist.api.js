import api from './api';

// The current user's saved groups (fully populated for card rendering).
export const getWishlist = () => api.get('/users/wishlist');

// Toggle a group in the wishlist. Returns { items, wishlisted }.
export const toggleWishlistApi = (groupId) => api.post(`/users/wishlist/${groupId}`);
