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
          content: `Given a question and an answer, the task is to organize the provided answer into a structured format. This format should consist of an array of JSON objects, each containing five fields: step, description, equation, correct, and reason. The step field should include a sequential identifier for each step in the solution. The description field should provide a detailed explanation of the step being performed. The equation field should contain any relevant equations used in that step while finding the equation if the step involves concepts rather than equations, this field should describe the principle or logic applied. The equation field should not change or alter anything given in the solution even if it is incorrect, it should just give the reason and move to the next step. The correct field should indicate whether the step is correct or not, using a boolean value. The reason field should provide the rationale behind the correctness or incorrectness of each step. It is crucial that the model does not alter the provided solution but simply breaks it down into steps, checks for the correctness of each step, and provides explanations for any errors found. The output should be in the specified JSON format, and no additional text should be included. For example, consider the following input: Question: What is the area of a triangle with a base of 5 cm and a height of 10 cm? Answer: The area of a triangle is calculated using the formula \text{Area} = \frac{1}{2} \times \text{base} \times \text{height} Substituting the values, we get \text{Area} = \frac{1}{2} \times 5 \times 10 = 25 cm². The structured solution would be as follows: "[ { \"step\": 1,\"description\": \"Identify the formula for the area of a triangle.\", \"equation\": \"Area = 1/2 × base × height\", \"correct\": true, \"reason\": \"The formula for the area of a triangle is correctly identified.\" },{\n        \"step\": 2,\n        \"description\": \"Substitute the base and height values into the formula.\",\n        \"equation\": \"Area = 1/2 × 5 × 10\",\n        \"correct\": true,\n        \"reason\": \"The values for base and height have been correctly substituted.\"\n    },\n    {\n        \"step\": 3,\n        \"description\": \"Calculate the area.\",\n        \"equation\": \"Area = 1/2 × 5 × 10 = 25\",\n        \"correct\": true,\n        \"reason\": \"The calculation is performed correctly, yielding the area of 25 cm².\"\n    }\n]" In contrast, consider this incorrect input: Question: What is the area of a triangle with a base of 5 cm and a height of 10 cm? Answer: The area of a triangle is calculated using the formula \text{Area} = \text{base} \times \text{height} Substituting the values, we get \text{Area} = 5 \times 10 = 50 Area=5x10=50 cm². The structured solution would look like this: "[\n    {\n        \"step\": 1,\n        \"description\": \"Identify the formula for the area of a triangle.\",\n        \"equation\": \"Area = base x height\",\n        \"correct\": false,\n        \"reason\": \"The formula for the area of a triangle is incorrect; it should include a factor of 1/2.\"\n    },\n    {\n        \"step\": 2,\n        \"description\": \"Substitute the base and height values into the formula.\",\n        \"equation\": \"Area = 5 x 10\",\n        \"correct\": false,\n        \"reason\": \"The substitution is correct, but the formula used is incorrect.\"\n    },\n    {\n        \"step\": 3,\n        \"description\": \"Calculate the area.\",\n        \"equation\": \"Area = 5 x 10 = 50\",\n        \"correct\": false,\n        \"reason\": \"The calculation is incorrect because the formula was not applied properly.\"\n    }\n]" Question:${question} \n\nAnswer:${answer}`,
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
