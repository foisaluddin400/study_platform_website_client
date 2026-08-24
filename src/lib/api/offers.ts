import { apiClient } from "./client";
import { Offer } from "@/types";

export const offersApi = {
  getAll: async (params?: {
    offerType?: string;
    acceptanceStatus?: string;
    studentId?: string;
    search?: string;
  }): Promise<Offer[]> => {
    const searchParams = new URLSearchParams();
    if (params?.offerType) searchParams.append("offerType", params.offerType);
    if (params?.acceptanceStatus) searchParams.append("acceptanceStatus", params.acceptanceStatus);
    if (params?.studentId) searchParams.append("studentId", params.studentId);
    if (params?.search) searchParams.append("search", params.search);

    const query = searchParams.toString();
    return apiClient<Offer[]>(`/offers${query ? `?${query}` : ""}`);
  },

  getMyOffers: async (): Promise<Offer[]> => {
    return apiClient<Offer[]>("/offers/my-offers");
  },

  getById: async (id: string): Promise<Offer> => {
    return apiClient<Offer>(`/offers/${id}`);
  },

  create: async (data: (Partial<Offer> & { applicationId: string }) | FormData): Promise<Offer> => {
    return apiClient<Offer>("/offers", {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  respond: async (id: string, status: "Accepted" | "Declined"): Promise<Offer> => {
    return apiClient<Offer>(`/offers/${id}/respond`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  update: async (id: string, data: Partial<Offer> | FormData): Promise<Offer> => {
    return apiClient<Offer>(`/offers/${id}`, {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient<void>(`/offers/${id}`, {
      method: "DELETE",
    });
  },

  getDownloadUrl: (id: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    return `${baseUrl}/offers/${id}/download`;
  },
};
