import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  model: 'gpt-3.5-turbo',
  apiKey: '',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      state.model = action.payload.model;
      state.apiKey = action.payload.apiKey;
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;