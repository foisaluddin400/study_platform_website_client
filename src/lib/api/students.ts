import { apiClient } from "./client";
import { Student, Application, Offer, DocumentItem, VisaCase } from "@/types";

export interface StudentDashboardSummary {
  student: Student;
  applications: Application[];
  offers: Offer[];
  documents: DocumentItem[];
  visaCase: VisaCase | null;
}

export const studentsApi = {
  getAll: async (params?: {
    stage?: string;
    country?: string;
    counselorId?: string;
    search?: string;
    status?: string;
  }): Promise<Student[]> => {
    const searchParams = new URLSearchParams();
    if (params?.stage) searchParams.append("stage", params.stage);
    if (params?.country) searchParams.append("country", params.country);
    if (params?.counselorId) searchParams.append("counselorId", params.counselorId);
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);

    const query = searchParams.toString();
    return apiClient<Student[]>(`/students${query ? `?${query}` : ""}`);
  },

  getById: async (id: string): Promise<Student> => {
    return apiClient<Student>(`/students/${id}`);
  },

  getMe: async (): Promise<Student> => {
    return apiClient<Student>("/students/me");
  },

  getDashboardSummary: async (): Promise<StudentDashboardSummary> => {
    return apiClient<StudentDashboardSummary>("/students/dashboard-summary");
  },

  create: async (
    data: Partial<Student> & {
      assignedCounselorId?: string;
      assignedCounselors?: string[];
      password?: string;
    }
  ): Promise<Student> => {
    return apiClient<Student>("/students", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Student> | FormData): Promise<Student> => {
    return apiClient<Student>(`/students/${id}`, {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  updateMe: async (data: Partial<Student> | FormData): Promise<Student> => {
    return apiClient<Student>("/students/me", {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  block: async (id: string): Promise<Student> => {
    return apiClient<Student>(`/students/${id}/block`, {
      method: "PATCH",
    });
  },

  unblock: async (id: string): Promise<Student> => {
    return apiClient<Student>(`/students/${id}/unblock`, {
      method: "PATCH",
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient<void>(`/students/${id}`, {
      method: "DELETE",
    });
  },
};
