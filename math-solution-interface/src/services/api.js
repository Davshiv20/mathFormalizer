import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api"; // Update this if your backend URL is different

export const processMathSolution = async (question,answer) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/process-math`, {
      question,
      answer,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
