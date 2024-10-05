import { configureStore } from '@reduxjs/toolkit';
import mathReducer from './features/mathSlice';
import settingsReducer from './features/settingSlice';

export const store = configureStore({
  reducer: {
    math: mathReducer,
    settings: settingsReducer,
  },
}); 