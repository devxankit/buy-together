import { createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../../services/auth.api';
import { setAuth, setError, setLoading } from '../slices/authSlice';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const response = await authApi.login(credentials);
      dispatch(setAuth(response.data));
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch(setError(message));
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const response = await authApi.register(userData);
      dispatch(setAuth(response.data));
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch(setError(message));
      return rejectWithValue(message);
    }
  }
);
