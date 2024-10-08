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

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const Step = z.object({
  step: z.string(),
  description: z.string(),
  equation: z.string(),
  correct: z.boolean(),
  reason: z.string(),
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
            "You are a helpful assistant that processes math problems and provides structured solutions.",
        },
        {
          role: "user",
          content: `Given a question and an answer, the task is to organize the provided answer into a structured format. This format should consist of an array of JSON objects, each containing five fields: step, description, equation, correct, and reason. The step field should include a sequential identifier for each step in the solution. The description field should provide a detailed explanation of the step being performed. The equation field should contain any relevant equations used in that step; if the step involves concepts rather than equations, this field should describe the principle or logic applied. The correct field should indicate whether the step is correct or not, using a boolean value. The reason field should provide the rationale behind the correctness or incorrectness of each step. It is crucial that the model does not alter the provided solution but simply breaks it down into steps, checks for the correctness of each step, and provides explanations for any errors found. The output should be in the specified JSON format, and no additional text should be included.Question:${question} \n\nAnswer:${answer}`,
        },
      ],
      response_format: zodResponseFormat(MathResponse, "math_response"),
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
