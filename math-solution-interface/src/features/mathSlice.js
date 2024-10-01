import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { processMathSolution } from '../services/api';

export const processSolution = createAsyncThunk(
  'math/processSolution',
  async (input, { rejectWithValue }) => {
    try {
      const response = await processMathSolution(input);
      return response.solution;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'An error occurred');
    }
  }
);

const mathSlice = createSlice({
  name: 'math',
  initialState: {
    input: '',
    structuredSolution: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processSolution.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(processSolution.fulfilled, (state, action) => {
        state.isLoading = false;
        state.structuredSolution = action.payload;
      })
      .addCase(processSolution.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setInput } = mathSlice.actions;
export default mathSlice.reducer;