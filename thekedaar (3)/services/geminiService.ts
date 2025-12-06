
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are 'Thekedaar AI', a helpful and friendly assistant for a home services application called Thekedaar.
Your goal is to help users find the right professionals (Plumbers, Electricians, Carpenters, etc.) for their home issues.
- Be concise and helpful.
- If a user describes a problem (e.g., "leaky faucet"), suggest the "Plumber" category.
- If a user asks about pricing, give general estimates based on Indian market rates (e.g., ₹200-500 for basic visits) but mention it depends on the worker.
- Keep responses short, under 80 words if possible.
- Use emojis occasionally to be friendly.
`;

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
};

export const sendMessageStream = async (chat: Chat, message: string): Promise<AsyncIterable<GenerateContentResponse>> => {
  try {
    return await chat.sendMessageStream({ message });
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};
