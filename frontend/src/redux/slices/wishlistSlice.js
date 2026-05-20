import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array of group objects
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const group = action.payload;
      const index = state.items.findIndex(item => item.id === group.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(group);
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    }
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
