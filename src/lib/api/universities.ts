import { apiClient } from "./client";
import { University, Course } from "@/types";

export const universitiesApi = {
  getAll: async (params?: {
    country?: string;
    agentStatus?: string;
    status?: string;
    search?: string;
  }): Promise<University[]> => {
    const searchParams = new URLSearchParams();
    if (params?.country) searchParams.append("country", params.country);
    if (params?.agentStatus) searchParams.append("agentStatus", params.agentStatus);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.search) searchParams.append("search", params.search);

    const query = searchParams.toString();
    return apiClient<University[]>(`/universities${query ? `?${query}` : ""}`);
  },

  getById: async (id: string): Promise<{ university: University; courses: Course[] }> => {
    return apiClient<{ university: University; courses: Course[] }>(`/universities/${id}`);
  },

  create: async (data: Partial<University>): Promise<University> => {
    return apiClient<University>("/universities", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<University>): Promise<University> => {
    return apiClient<University>(`/universities/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient<void>(`/universities/${id}`, {
      method: "DELETE",
    });
  },
};
