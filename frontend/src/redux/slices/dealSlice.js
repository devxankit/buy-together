import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  deals: [],
  loading: false,
  error: null,
};

const dealSlice = createSlice({
  name: 'deal',
  initialState,
  reducers: {
    setDeals: (state, action) => {
      state.deals = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setDeals, setLoading, setError } = dealSlice.actions;
export default dealSlice.reducer;
