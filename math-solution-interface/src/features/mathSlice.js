import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { processMathSolution } from "../services/api";
import axios from "axios";

const parseStructuredSolution = (solution) => {
  if (typeof solution === "string") {
    try {
      solution = JSON.parse(solution);
    } catch (error) {
      console.error("Error parsing solution string:", error);
      return [];
    }
  }

  if (Array.isArray(solution)) {
    return solution;
  } else if (solution && solution.steps && Array.isArray(solution.steps)) {
    return solution.steps;
  } else if (solution && typeof solution === "object") {
    // If it's an object but not in the expected format, try to convert it to an array
    return Object.entries(solution).map(([key, value]) => ({
      step: key,
      ...value,
    }));
  }

  console.error("Unexpected solution format:", solution);
  return [];
};
export const processSolution = createAsyncThunk(
  "math/processSolution",
  async ({ question, answer }, { getState, rejectWithValue }) => {
    try {
      const { settings } = getState();
      const response = await processMathSolution(question, answer, {
        apiKey: settings.apiKey,
        model: settings.model,
      });
      console.log("Full response:", response);
      console.log("response:", response.solution);
      return parseStructuredSolution(response.solution);
    } catch (error) {
      console.log("Error details:", error);
      return rejectWithValue(
        error.response
          ? error.response.data.error
          : "An error occurred Please try again"
      );
    }
  }
);

const mathSlice = createSlice({
  name: "math",
  initialState: {
    question: "",
    input: "",
    structuredSolution: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload;
    },
    setQuestion: (state, action) => {
      state.question = action.payload;
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

export const { setInput, setQuestion } = mathSlice.actions;
export default mathSlice.reducer;
