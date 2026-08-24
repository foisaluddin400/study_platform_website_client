import { apiClient } from "./client";
import { CommissionRecord } from "@/types";

export const commissionsApi = {
  getAll: async (params?: {
    status?: string;
    counselorName?: string;
    search?: string;
  }): Promise<CommissionRecord[]> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.counselorName) searchParams.append("counselorName", params.counselorName);
    if (params?.search) searchParams.append("search", params.search);

    const query = searchParams.toString();
    return apiClient<CommissionRecord[]>(`/commissions${query ? `?${query}` : ""}`);
  },

  update: async (id: string, data: Partial<CommissionRecord>): Promise<CommissionRecord> => {
    return apiClient<CommissionRecord>(`/commissions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
