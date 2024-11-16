const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const axios = require("axios");
const { parse } = require("dotenv");  
require("dotenv").config();
const { z } = require("zod");
const { zodResponseFormat } = require("openai/helpers/zod");
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));


const Step = z.object({
  step: z.string(),
  description: z.string(),
  correct: z.boolean(),
  // equation: z.string(),
  reason: z.string(),
  given_solution: z.string(),
  correct_solution: z.string(),
});

const MathResponse = z.object({
  steps: z.array(Step),
});

// OpenAI route
app.post("/api/process-math", async (req, res) => {
  try {
    const { question, answer, apiKey, model } = req.body;
    const openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that processes all types of math problems and provides structured solutions by breaking the given solution into steps. You don't change the content of the solution, even if it is wrong according to you",
        },
        {
          role: "user",
          content: `Given a question and a user-provided answer, your task is to organize the solution into a structured JSON format. Each part of the solution should be represented by an object containing the fields: step, description, correct, reason, given_solution, and correct_solution. The step field should contain a sequential identifier to indicate the correct order of the solution. The description field should provide a brief, clear explanation of the operation performed in that step. The correct field should be a boolean value (true for correct, false for incorrect) indicating whether the step is correct mathematically, logically, and in all other relevant aspects. The reason field should explain why the step is correct or incorrect; if incorrect, detail the specific mistake or misstep. Additionally, include two fields: given_solution and correct_solution. The given_solution field should capture the user's original solution text exactly as they provided it. If the solution is correct, the correct_solution should match the given_solution. However, if the provided solution is incorrect, the correct_solution should contain the corrected answer for that specific step. Use the following process to ensure clarity and accuracy: 1. Break down the user's solution into logical steps, assigning each a separate JSON object. 2. Verify the accuracy of each step from a mathematical, logical, and conceptual perspective, providing explanations in the reason field. 3. If a step is correct, confirm this in the reason field; if incorrect, give a clear rationale and show the corrected solution in the correct_solution field. 4. Ensure that given_solution remains exactly as provided by the user, while correct_solution reflects any necessary corrections. Question:${question} \n\nAnswer:${answer}`,
        },
      ],
      response_format: zodResponseFormat(MathResponse, "math_response"),
      temperature: 0.3,
    });
    console.log("Model:", model);
    console.log("Question:", question);
    console.log("Answer:", answer);
    console.log("OpenAI Response:", completion.choices[0].message.parsed);

    // let cleanedResponse = completion.choices[0].message.content.trim();
    // if (cleanedResponse.startsWith("```json")) {
    //   cleanedResponse = cleanedResponse
    //     .replace("```json", "")
    //     .replace("```", "")
    //     .trim();
    // }

    // const parsedSolution = JSON.parse(cleanedResponse);

    res.json({ solution: completion.choices[0].message.parsed });
  } catch (error) {
    console.error("Error processing math solution:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the math solution" });
  }
});

app.post("/api/mathpix", async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: "No image provided" });
  }

  try {
    const response = await axios.post(
      "https://api.mathpix.com/v3/latex",
      {
        src: image,
        formats: ["latex_simplified"],
      },
      {
        headers: {
          app_id: process.env.MATHPIX_APP_ID,
          app_key: process.env.MATHPIX_APP_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ latex: response.data.latex_simplified });
  } catch (error) {
    console.error(
      "MathPix Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "MathPix processing failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));