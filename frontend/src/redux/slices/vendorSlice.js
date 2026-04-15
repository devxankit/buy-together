import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  vendorProfile: null,
  offers: [],
  loading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setVendor: (state, action) => {
      state.vendorProfile = action.payload;
    },
    setOffers: (state, action) => {
      state.offers = action.payload;
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

export const { setVendor, setOffers, setLoading, setError } = vendorSlice.actions;
export default vendorSlice.reducer;
