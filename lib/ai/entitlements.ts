import type { UserType } from "@/app/(auth)/auth";
import type { ChatModel } from "./models";

type Entitlements = {
  maxMessagesPerDay: number;
  availableChatModelIds: ChatModel["id"][];
};

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users without an account (not logged in)
   */
  guest: {
    maxMessagesPerDay: 5,
    availableChatModelIds: ["chat-gpt"],
  },

  /*
   * For users with an account
   */
  regular: {
    maxMessagesPerDay: 100,
    availableChatModelIds: ["chat-gpt"],
  },

  /*
   * TODO: For users with an account and a paid membership
   */
};
