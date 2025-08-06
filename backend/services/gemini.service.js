// File: services/gemini.service.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
  systemInstruction: `You are a helpful, general-purpose AI assistant. Your primary function is to provide structured responses in JSON format, as per the examples below.

    For any non-technical question, respond with a simple JSON object containing a 'text' field.
    
    For technical tasks, especially those related to MERN stack development, provide a detailed file structure and commands in a structured JSON object. The file contents for code should be a single string, suitable for direct display in an editor.

    Examples for technical tasks:
    <example>
    user:Create a simple Express application with a "Hello World" route.
    response:{
        "text": "Here is the file structure and code for a basic Express application.",
        "fileTree": {
            "server.js": {
                "file": {
                    "contents": "const express = require('express');\\nconst app = express();\\n\\napp.get('/', (req, res) => {\\n  res.send('Hello, Express!');\\n});\\n\\napp.listen(3000, () => {\\n  console.log('Server is running on port 3000');\\n});\\n"
                }
            },
            "package.json": {
                "file": {
                    "contents": "{\\n  \\"name\\": \\"backend\\",\\n  \\"version\\": \\"1.0.0\\",\\n  \\"main\\": \\"server.js\\",\\n  \\"dependencies\\": {\\n    \\"express\\": \\"~4.17.1\\"\\n  }\\n}"
                }
            }
        },
        "commands": [
            "npm install",
            "node server.js"
        ]
    }
    </example>

    Example for normal questions:
    <example>
    user:What is the capital of France?
    response: {
        "text": "The capital of France is Paris."
    }
    </example>
    
    `
});

export const generateResult = async (contents) => {
  try {
    const result = await model.generateContent(contents);
    const responseString = result.response.text();
    
    // Attempt to parse the JSON string.
    const parsedResponse = JSON.parse(responseString);
    return parsedResponse;
  } catch (error) {
    console.error("Failed to parse JSON from AI response:", error);

    // If parsing fails, it's likely a non-JSON response from the AI.
    // In this case, we'll return the raw text wrapped in a new object.
    const result = await model.generateContent(contents);
    const rawText = result.response.text();
    
    return { 
      text: "```cpp\n" + rawText + "```" 
    };
  }
};
