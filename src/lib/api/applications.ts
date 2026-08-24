import { apiClient } from "./client";
import { Application } from "@/types";

export const applicationsApi = {
  getAll: async (params?: {
    status?: string;
    studentId?: string;
    counselorId?: string;
    search?: string;
  }): Promise<Application[]> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.studentId) searchParams.append("studentId", params.studentId);
    if (params?.counselorId) searchParams.append("counselorId", params.counselorId);
    if (params?.search) searchParams.append("search", params.search);

    const query = searchParams.toString();
    return apiClient<Application[]>(`/applications${query ? `?${query}` : ""}`);
  },

  getMyApplications: async (): Promise<Application[]> => {
    return apiClient<Application[]>("/applications/my-applications");
  },

  getById: async (id: string): Promise<Application> => {
    return apiClient<Application>(`/applications/${id}`);
  },

  create: async (data: {
    studentId?: string;
    universityId: string;
    courseId?: string;
    courseName?: string;
    degreeProgram?: string;
    country?: string;
    studyLevel?: string;
    intake?: string;
    notes?: string;
  }): Promise<Application> => {
    return apiClient<Application>("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },


  update: async (id: string, data: Partial<Application>): Promise<Application> => {
    return apiClient<Application>(`/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient<void>(`/applications/${id}`, {
      method: "DELETE",
    });
  },
};
