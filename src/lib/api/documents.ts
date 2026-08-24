import { apiClient } from "./client";
import { DocumentItem } from "@/types";

export const documentsApi = {
  getAll: async (params?: {
    category?: string;
    status?: string;
    studentId?: string;
    search?: string;
  }): Promise<DocumentItem[]> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append("category", params.category);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.studentId) searchParams.append("studentId", params.studentId);
    if (params?.search) searchParams.append("search", params.search);

    const query = searchParams.toString();
    return apiClient<DocumentItem[]>(`/documents${query ? `?${query}` : ""}`);
  },

  getMyDocuments: async (): Promise<DocumentItem[]> => {
    return apiClient<DocumentItem[]>("/documents/my-documents");
  },

  upload: async (formData: FormData): Promise<DocumentItem> => {
    return apiClient<DocumentItem>("/documents/upload", {
      method: "POST",
      body: formData,
    });
  },

  updateStatus: async (
    id: string,
    data: { status: string; reviewNotes?: string }
  ): Promise<DocumentItem> => {
    return apiClient<DocumentItem>(`/documents/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient<void>(`/documents/${id}`, {
      method: "DELETE",
    });
  },
};
