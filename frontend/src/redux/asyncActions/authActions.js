import { createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../../services/auth.api';
import { setAuth, setError, setLoading, clearError } from '../slices/authSlice';
import { registerWebPush } from '../../services/push';

const msgFrom = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

// Clear any prior error and flip into the loading state.
const begin = (dispatch) => {
  dispatch(clearError());
  dispatch(setLoading(true));
};

/**
 * Step 1 (login): request an OTP for a mobile number.
 * Does NOT authenticate — returns { message, phone, isNewUser, devOtp? }.
 */
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (payload, { dispatch, rejectWithValue }) => {
    begin(dispatch);
    try {
      const { data } = await authApi.sendOtp(payload);
      dispatch(setLoading(false));
      return data;
    } catch (error) {
      const message = msgFrom(error, 'Could not send OTP. Please try again.');
      dispatch(setError(message));
      return rejectWithValue(message);
    }
  }
);

/**
 * Step 1 (signup): store profile details and send a verification OTP.
 * Returns { message, phone, devOtp? }.
 */
export const register = createAsyncThunk(
  'auth/register',
  async (payload, { dispatch, rejectWithValue }) => {
    begin(dispatch);
    try {
      const { data } = await authApi.register(payload);
      dispatch(setLoading(false));
      return data;
    } catch (error) {
      const message = msgFrom(error, 'Registration failed. Please try again.');
      dispatch(setError(message));
      return rejectWithValue(message);
    }
  }
);

/**
 * Step 2: verify the OTP. On success the session is stored via setAuth.
 * Returns { user, token }.
 */
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (payload, { dispatch, rejectWithValue }) => {
    begin(dispatch);
    try {
      const { data } = await authApi.verifyOtp(payload);
      dispatch(setAuth(data));
      // Register this browser for push notifications (non-blocking).
      registerWebPush();
      return data;
    } catch (error) {
      const message = msgFrom(error, 'OTP verification failed.');
      dispatch(setError(message));
      return rejectWithValue(message);
    }
  }
);

/** Re-issue an OTP for the current flow. */
export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.resendOtp(payload);
      return data;
    } catch (error) {
      return rejectWithValue(msgFrom(error, 'Could not resend OTP.'));
    }
  }
);

/** Admin console login (email + password). Stores the session via setAuth. */
export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async (payload, { dispatch, rejectWithValue }) => {
    begin(dispatch);
    try {
      const { data } = await authApi.adminLogin(payload);
      dispatch(setAuth(data));
      return data;
    } catch (error) {
      const message = msgFrom(error, 'Login failed. Check your credentials.');
      dispatch(setError(message));
      return rejectWithValue(message);
    }
  }
);
