import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

let client;

if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  client = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-pro' });
}

export const getAIClient = () => client;

export const generateAIResponse = async (prompt) => {
  if (!client) {
    throw new Error('AI client not initialized');
  }
  
  try {
    const result = await client.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw error;
  }
};
