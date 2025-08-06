// File: services/gemini.service.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
  // Your system instruction remains the same
  systemInstruction: `You are a helpful, general-purpose AI assistant...`
});

export const generateResult = async (contents) => {
  try {
    const result = await model.generateContent(contents);
    const responseString = result.response.text();
    
    // This file is responsible for parsing the JSON and handling errors
    const parsedResponse = JSON.parse(responseString);
    return parsedResponse;
  } catch (error) {
    console.error("Error in generateResult:", error);
    // If there's an error (e.g., parsing error), return a structured object.
    // This ensures the controller always receives a valid object.
    return { text: "I'm sorry, I encountered an error while processing the response." };
  }
};
