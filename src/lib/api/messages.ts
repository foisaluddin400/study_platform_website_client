import { apiClient } from "./client";
import { ChatMessage } from "@/types";

export const messagesApi = {
  getConversations: async (): Promise<any[]> => {
    return apiClient<any[]>("/messages/conversations");
  },

  getAll: async (studentId?: string): Promise<ChatMessage[]> => {
    return apiClient<ChatMessage[]>(`/messages${studentId ? `?studentId=${studentId}` : ""}`);
  },

  send: async (data: { text: string; studentId?: string; attachment?: any }): Promise<ChatMessage> => {
    return apiClient<ChatMessage>("/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  markSeen: async (studentId?: string): Promise<void> => {
    return apiClient<void>("/messages/seen", {
      method: "PATCH",
      body: JSON.stringify({ studentId }),
    });
  },

  delete: async (messageId: string): Promise<ChatMessage> => {
    return apiClient<ChatMessage>(`/messages/${messageId}`, {
      method: "DELETE",
    });
  },
};

