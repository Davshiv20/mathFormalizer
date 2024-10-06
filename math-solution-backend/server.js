const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const axios = require("axios");
const { parse } = require("dotenv");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// OpenAI route
app.post("/api/process-math", async (req, res) => {
  try {
    const { question, answer, apiKey, model } = req.body;
    const openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: model || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that processes math problems and provides structured solutions.",
        },
        {
          role: "user",
          content: `Given a question and a provided answer, start by validating the input. If the input is invalid, return an error message in the form of a JSON array containing a single object with step as "error", description containing the error message, and equation as the specific issue identified. If the provided answer is incorrect, similarly return a JSON array with one object, where step is "error", description details why the answer is incorrect, and equation provides the context of the error. For valid inputs, validate the provided answer by checking if each step logically follows from the previous one and is accurate. Break down the problem into its essential components, applying relevant formulas, principles, or logical deductions. As you solve the problem, perform necessary simplifications, solve for unknowns, and handle multi-step processes logically. Continuously check for potential errors like division by zero or incorrect unit conversions, returning a structured error message when needed. After arriving at a correct answer, structure the final response as a JSON array of objects, where each object contains step, description, and equation, representing any relevant equation or concept. Ensure that the output is always in array format, even for single outputs, and that only this structured output is provided without additional text or commentary.\n\n Question: ${question}\nAnswer: ${answer}`,
        },
      ],
    });
    console.log("Model:", model);
    console.log("Question:", question);
    console.log("Answer:", answer);
    console.log("OpenAI Response:", completion.choices[0].message.content);
    let cleanedResponse = completion.choices[0].message.content.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse
        .replace("```json", "")
        .replace("```", "")
        .trim();
    }

    const parsedSolution = JSON.parse(cleanedResponse);

    res.json({ solution: parsedSolution });
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
