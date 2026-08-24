import { apiClient } from "./client";
import { VisaCase } from "@/types";

export const visaCasesApi = {
  getAll: async (params?: {
    status?: string;
    country?: string;
    studentId?: string;
    search?: string;
  }): Promise<VisaCase[]> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.country) searchParams.append("country", params.country);
    if (params?.studentId) searchParams.append("studentId", params.studentId);
    if (params?.search) searchParams.append("search", params.search);

    const query = searchParams.toString();
    return apiClient<VisaCase[]>(`/visa-cases${query ? `?${query}` : ""}`);
  },

  getMyVisaCase: async (): Promise<VisaCase | null> => {
    return apiClient<VisaCase | null>("/visa-cases/my-case");
  },

  getById: async (id: string): Promise<VisaCase> => {
    return apiClient<VisaCase>(`/visa-cases/${id}`);
  },

  create: async (data: Partial<VisaCase> & { studentId: string }): Promise<VisaCase> => {
    return apiClient<VisaCase>("/visa-cases", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<VisaCase>): Promise<VisaCase> => {
    return apiClient<VisaCase>(`/visa-cases/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient<void>(`/visa-cases/${id}`, {
      method: "DELETE",
    });
  },
};
