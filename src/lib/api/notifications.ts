import { apiClient } from "./client";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  getAll: async (): Promise<{ notifications: NotificationItem[]; unreadCount: number }> => {
    return apiClient<{ notifications: NotificationItem[]; unreadCount: number }>("/notifications");
  },

  markAsRead: async (id: string): Promise<NotificationItem> => {
    return apiClient<NotificationItem>(`/notifications/${id}/read`, {
      method: "PATCH",
    });
  },

  markAllAsRead: async (): Promise<void> => {
    return apiClient<void>("/notifications/read-all", {
      method: "PATCH",
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient<void>(`/notifications/${id}`, {
      method: "DELETE",
    });
  },
};
