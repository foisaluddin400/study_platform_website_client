import { apiClient } from "./client";
import { Course } from "@/types";

export const coursesApi = {
  getAll: async (params?: {
    country?: string;
    studyLevel?: string;
    subject?: string;
    universityId?: string;
    intake?: string;
    search?: string;
  }): Promise<Course[]> => {
    const searchParams = new URLSearchParams();
    if (params?.country) searchParams.append("country", params.country);
    if (params?.studyLevel) searchParams.append("studyLevel", params.studyLevel);
    if (params?.subject) searchParams.append("subject", params.subject);
    if (params?.universityId) searchParams.append("universityId", params.universityId);
    if (params?.intake) searchParams.append("intake", params.intake);
    if (params?.search) searchParams.append("search", params.search);

    const query = searchParams.toString();
    return apiClient<Course[]>(`/courses${query ? `?${query}` : ""}`);
  },

  getById: async (id: string): Promise<Course> => {
    return apiClient<Course>(`/courses/${id}`);
  },

  create: async (data: Partial<Course> & { universityId: string }): Promise<Course> => {
    return apiClient<Course>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Course>): Promise<Course> => {
    return apiClient<Course>(`/courses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient<void>(`/courses/${id}`, {
      method: "DELETE",
    });
  },
};
