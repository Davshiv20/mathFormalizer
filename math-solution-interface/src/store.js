import { configureStore } from '@reduxjs/toolkit';
import mathReducer from './features/mathSlice';

export const store = configureStore({
  reducer: {
    math: mathReducer,
  },
}); 