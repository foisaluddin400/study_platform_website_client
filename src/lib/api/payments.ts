import { apiClient } from "./client";
import { PaymentRecord } from "@/types";

export const paymentsApi = {
  getAll: async (params?: {
    status?: string;
    type?: string;
    studentId?: string;
    search?: string;
  }): Promise<PaymentRecord[]> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.type) searchParams.append("type", params.type);
    if (params?.studentId) searchParams.append("studentId", params.studentId);
    if (params?.search) searchParams.append("search", params.search);

    const query = searchParams.toString();
    return apiClient<PaymentRecord[]>(`/payments${query ? `?${query}` : ""}`);
  },

  getMyPayments: async (): Promise<PaymentRecord[]> => {
    return apiClient<PaymentRecord[]>("/payments/my-payments");
  },

  create: async (data: Partial<PaymentRecord> & { studentId: string }): Promise<PaymentRecord> => {
    return apiClient<PaymentRecord>("/payments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<PaymentRecord>): Promise<PaymentRecord> => {
    return apiClient<PaymentRecord>(`/payments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient<void>(`/payments/${id}`, {
      method: "DELETE",
    });
  },
};
