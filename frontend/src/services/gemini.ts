import { GoogleGenAI } from "@google/genai";
import { REVIEWS, BRANCHES } from '../data/mockData';

// Initialize Gemini API
// Note: In a real app, we would use a backend proxy to protect the key.
// For this demo, we use the client-side key provided by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeReview = async (reviewText: string) => {
  try {
    // Engine B: Deep Analysis
    const model = 'gemini-3.1-pro-preview';
    const prompt = `
      Analyze the following restaurant review.
      Review: "${reviewText}"
      
      Tasks:
      1. Determine Sentiment (Positive, Neutral, Negative).
      2. Categorize into: Food Quality, Staff Behavior, Ambience, Delivery, Hygiene.
      3. Translate to English if in Hinglish/Marathi.
      
      Output JSON format:
      {
        "sentiment": "string",
        "categories": ["string"],
        "translation": "string"
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error analyzing review:", error);
    return null;
  }
};

export const generateRecoveryMessage = async (reviewText: string, customerName: string) => {
  try {
    // Fast response for recovery
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Write a polite, empathetic apology message for a restaurant customer who left a negative review.
      Customer Name: ${customerName}
      Review: "${reviewText}"
      
      Include a unique discount code "REFLO20" for their next visit.
      Keep it short and professional.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating recovery:", error);
    return "We apologize for the inconvenience. Please visit us again for a better experience.";
  }
};

export const assistantQuery = async (query: string) => {
  try {
    // Engine A: Reflo AI Assistant
    const model = 'gemini-3-flash-preview';

    // Context injection (RAG-lite)
    const context = JSON.stringify({
      branches: BRANCHES,
      recent_reviews: REVIEWS,
      stats: {
        total_reviews: REVIEWS.length,
        average_rating: REVIEWS.reduce((acc, r) => acc + r.rating, 0) / REVIEWS.length
      }
    });

    const prompt = `
      You are the "Reflo AI Assistant" for Prasad Food Divine restaurant chain.
      Your persona: Professional, helpful, uses "Namaste" and Indian context.
      
      Context Data:
      ${context}
      
      User Query: "${query}"
      
      Task:
      1. Analyze the query.
      2. If the user asks about specific food issues (like "Misal Pav"), look for patterns in the reviews provided in context.
      3. Provide a summary and recommendation.
      4. If the query is in Hinglish, reply in English but acknowledge the context.
      
      Example Logic:
      Query: "Mere misal section ke bad reviews kyu aa rhe h?"
      Action: Filter context for 'Misal' + 'Negative'. Found 'Rassa' issues in Powai.
      Response: "Namaste Sir. I analyzed the reviews. 40% of negative misal reviews in Powai mention the 'Rassa' being too watery. Recommendation: Standardize the Rassa recipe across branches."
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error querying assistant:", error);
    return "Hi! I am having trouble connecting to the Reflo network right now. Please try again.";
  }
};
