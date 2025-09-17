
import { GoogleGenAI } from "@google/genai";

// Per guideline, the API key must be obtained exclusively from process.env.API_KEY.
// Assume this variable is pre-configured and valid.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This warning is for developer feedback during setup, in case the env var is missing.
  console.warn("Gemini API key not found. AI features will be disabled. Please set the API_KEY environment variable.");
}

// The SDK will throw an error if a call is made without a key.
// Using API_KEY! is safe here as the function below checks for it before making a call.
const ai = new GoogleGenAI({ apiKey: API_KEY! });


export async function generateDrawingPrompt(): Promise<string> {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      // Fix: Translated prompt to English for consistency.
      contents: "Give me a simple, fun, and creative drawing idea. Be concise and provide only the idea itself. For example: 'A robot drinking coffee on the moon' or 'A dragon knitting a scarf'.",
      config: {
        temperature: 1,
        topP: 0.95,
        maxOutputTokens: 50,
        thinkingConfig: { thinkingBudget: 25 },
      }
    });
    
    // Fix: Per guidelines, access text directly from response.text
    const text = response.text.trim();
    // Clean up potential markdown or quotes
    return text.replace(/["*]/g, '');

  } catch (error) {
    console.error("Error generating drawing prompt from Gemini:", error);
    // Fix: Translated error message to English.
    throw new Error("Failed to communicate with the AI model.");
  }
}
