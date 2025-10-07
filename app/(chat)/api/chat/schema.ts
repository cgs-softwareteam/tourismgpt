import { z } from "zod";

const textPartSchema = z.object({
  type: z.enum(["text"]),
  text: z.string().min(1).max(2000),
});

const partSchema = textPartSchema;

export const postRequestBodySchema = z.object({
  id: z.string().uuid(),
  message: z.object({
    id: z.string().uuid(),
    role: z.enum(["user"]),
    parts: z.array(partSchema),
  }),
  selectedChatModel: z.literal("chat-gpt"),
  selectedVisibilityType: z.literal("private"),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
