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
          content: `Question: ${question}\nAnswer: ${answer}\n\nSolve the given problem or organize an already provided answer into a structured format. For each problem ensure the input is valid. If the input is incorrect, return an error message explaining the issue and stop further processing if it is critical.If a answer is provided, validate it by checking whether each step logically follows the previous one and is accurate. If the answer provided if incorrect, then provide the explanation in the description for why is it incorrect and then process the new correct answer. Break down the problem into its essential components, ensuring that relevant formulas, principles, or logical deductions are applied correctly. At every step, perform any necessary simplifications, solve for unknowns, and handle multi-step problems logically, providing the correct sequence of operations. Continuously check for potential errors such as division by zero, incorrect unit conversions, or logical fallacies in reasoning. If such errors occur, generate an error message explaining the issue and correcting the mistake. After arriving at an answer, verify its correctness by substituting values back into the original problem or checking for consistency in units or assumptions.If an answer is already provided, correct it if necessary and structure it into clear, logical steps. Return the structured answer as an array of JSON objects, where each object contains three fields: step, description, and either equation or concept. This format must be maintained whether the problem is solved from scratch or if an existing answer is being corrected. . Continuously ensure that each step is accurate, clearly explained, and follows logically from the previous one. For any provided answer, correct and validate each step, returning an explanation for any mistakes and how they are resolved. For non-mathematical problems, the equation field should be replaced by concept, describing the logic or principles used. Each step of the answer should be clearly explained and free of errors, and if errors occur in the provided answer, a detailed explanation of the mistake and the correction should be given. The json fields should be step, description and equation only, for concept also give in as an equation only. Give no other text other than the response that consists of only an array of json documents that contain 3 fields step, description and equation.`,
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
