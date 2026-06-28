import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: 3001,
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  isDev: process.env.NODE_ENV !== 'production'
};
