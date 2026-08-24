import { apiClient } from "./client";
import { TaskItem } from "@/types";

export const tasksApi = {
  getAll: async (params?: {
    status?: string;
    priority?: string;
    category?: string;
    search?: string;
  }): Promise<TaskItem[]> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.priority) searchParams.append("priority", params.priority);
    if (params?.category) searchParams.append("category", params.category);
    if (params?.search) searchParams.append("search", params.search);

    const query = searchParams.toString();
    return apiClient<TaskItem[]>(`/tasks${query ? `?${query}` : ""}`);
  },

  getMyTasks: async (): Promise<TaskItem[]> => {
    return apiClient<TaskItem[]>("/tasks/my-tasks");
  },

  create: async (data: Partial<TaskItem>): Promise<TaskItem> => {
    return apiClient<TaskItem>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<TaskItem>): Promise<TaskItem> => {
    return apiClient<TaskItem>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient<void>(`/tasks/${id}`, {
      method: "DELETE",
    });
  },
};
