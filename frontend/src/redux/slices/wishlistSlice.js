import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWishlist, toggleWishlistApi } from '../../services/wishlist.api';

const initialState = {
  items: [],     // Array of populated group objects (from the backend)
  loaded: false, // Whether the wishlist has been fetched at least once
};

// Load the user's saved groups from the backend.
export const fetchWishlist = createAsyncThunk('wishlist/fetch', async () => {
  const { data } = await getWishlist();
  return Array.isArray(data) ? data : [];
});

/**
 * Toggle a group in the wishlist. The UI updates optimistically for instant
 * feedback (heart fills/empties immediately), then reconciles with the
 * authoritative list returned by the server. On failure the optimistic change
 * is reverted.
 */
export const toggleWishlist = createAsyncThunk(
  'wishlist/toggle',
  async (group, { dispatch, rejectWithValue }) => {
    const id = group.id || group._id;
    dispatch(wishlistSlice.actions.optimisticToggle(group));
    try {
      const { data } = await toggleWishlistApi(id);
      return Array.isArray(data?.items) ? data.items : [];
    } catch (err) {
      // Revert the optimistic change.
      dispatch(wishlistSlice.actions.optimisticToggle(group));
      return rejectWithValue(err.response?.data?.message || 'Failed to update wishlist');
    }
  }
);

const sameId = (a, b) => String(a?.id || a?._id) === String(b?.id || b?._id);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Local-only instant toggle used for optimistic UX.
    optimisticToggle: (state, action) => {
      const group = action.payload;
      const index = state.items.findIndex((item) => sameId(item, group));
      if (index >= 0) state.items.splice(index, 1);
      else state.items.unshift(group);
    },
    clearWishlist: (state) => {
      state.items = [];
      state.loaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loaded = true;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        // Server list is authoritative.
        state.items = action.payload;
      })
      // Reset on logout so a saved wishlist never leaks to the next account.
      .addCase('auth/logout', () => initialState);
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
