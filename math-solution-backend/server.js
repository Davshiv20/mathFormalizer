// server.js
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/process-math', async (req, res) => {
  try {
    const { input } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4", 
      messages: [
        { role: "system", content: "You are a helpful assistant that processes math problems and provides structured solutions." },
        { role: "user", content: `Process this math problem and provide a structured solution in form of json collection where each document represents a step in the solution: ${input}` }
      ],
    });
    console.log(completion.choices[0].message.content);
    res.json({ solution: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error processing math solution:', error);
    res.status(500).json({ error: 'An error occurred while processing the math solution' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));