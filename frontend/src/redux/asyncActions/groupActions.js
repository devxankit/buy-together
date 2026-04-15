import { createAsyncThunk } from '@reduxjs/toolkit';
import * as groupApi from '../../services/group.api';
import { setGroups, setCurrentGroup, setLoading, setError } from '../slices/groupSlice';

export const fetchGroups = createAsyncThunk(
  'group/fetchGroups',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const response = await groupApi.getGroups();
      dispatch(setGroups(response.data));
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch groups';
      dispatch(setError(message));
      return rejectWithValue(message);
    }
  }
);

export const createGroup = createAsyncThunk(
  'group/createGroup',
  async (groupData, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const response = await groupApi.createGroup(groupData);
      dispatch(setCurrentGroup(response.data));
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create group';
      dispatch(setError(message));
      return rejectWithValue(message);
    }
  }
);

export const joinGroup = createAsyncThunk(
  'group/joinGroup',
  async (groupId, { dispatch, rejectWithValue }) => {
    try {
      const response = await groupApi.joinGroup(groupId);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to join group';
      return rejectWithValue(message);
    }
  }
);
