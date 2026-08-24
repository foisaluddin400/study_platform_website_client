import { apiClient } from "./client";
import { Appointment } from "@/types";

export const appointmentsApi = {
  getAll: async (params?: {
    status?: string;
    type?: string;
    date?: string;
    studentId?: string;
  }): Promise<Appointment[]> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.type) searchParams.append("type", params.type);
    if (params?.date) searchParams.append("date", params.date);
    if (params?.studentId) searchParams.append("studentId", params.studentId);

    const query = searchParams.toString();
    return apiClient<Appointment[]>(`/appointments${query ? `?${query}` : ""}`);
  },

  create: async (data: Partial<Appointment>): Promise<Appointment> => {
    return apiClient<Appointment>("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    return apiClient<Appointment>(`/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient<void>(`/appointments/${id}`, {
      method: "DELETE",
    });
  },
};
