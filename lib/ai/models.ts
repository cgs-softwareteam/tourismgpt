export const DEFAULT_CHAT_MODEL: string = "chat-gpt";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-gpt",
    name: "ChatGPT",
    description: "Optimized for conversational travel planning with GPT-4o.",
  },
];
