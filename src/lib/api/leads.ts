import { apiClient } from "./client";
import { Lead } from "@/types";

export const leadsApi = {
  getAll: async (params?: {
    status?: string;
    country?: string;
    studyLevel?: string;
    counselorId?: string;
    search?: string;
  }): Promise<Lead[]> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.country) searchParams.append("country", params.country);
    if (params?.studyLevel) searchParams.append("studyLevel", params.studyLevel);
    if (params?.counselorId) searchParams.append("counselorId", params.counselorId);
    if (params?.search) searchParams.append("search", params.search);

    const query = searchParams.toString();
    return apiClient<Lead[]>(`/leads${query ? `?${query}` : ""}`);
  },

  getById: async (id: string): Promise<Lead> => {
    return apiClient<Lead>(`/leads/${id}`);
  },

  create: async (data: Partial<Lead> & { assignedCounselorId?: string }): Promise<Lead> => {
    return apiClient<Lead>("/leads", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Lead>): Promise<Lead> => {
    return apiClient<Lead>(`/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  convert: async (id: string): Promise<{ lead: Lead; student: any }> => {
    return apiClient<{ lead: Lead; student: any }>(`/leads/${id}/convert`, {
      method: "POST",
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient<void>(`/leads/${id}`, {
      method: "DELETE",
    });
  },
};
