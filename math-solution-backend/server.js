const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const axios = require("axios");
const { parse } = require("dotenv");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI route
app.post("/api/process-math", async (req, res) => {
  try {
    const { question, answer } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that processes math problems and provides structured solutions.",
        },
        {
          role: "user",
          content: `Question: ${question}\nAnswer: ${answer}\n\nProcess this math problem and provide a structured solution in form of json collection where each document represents a step in the solution and the fields should be step, then description and then an equation representing the description. Give no other text other than the response that consists of only an array of json documents that contain 3 fields step, description and equation`,
        },
      ],
    });

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
