import { apiClient, setAuthToken } from "./client";

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    roleTitle?: string;
    avatar?: string;
    agencyId?: string;
    agencyName?: string;
    branch?: string;
    phone?: string;
  };
  agency?: any;
  subscription?: any;
  hasActiveAccess?: boolean;
}

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const res = await apiClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (res.token) {
      setAuthToken(res.token, res.user.role);
    }
    return res;
  },

  registerAgency: async (data: {
    agencyName: string;
    country?: string;
    teamSize?: string;
    adminName: string;
    adminEmail: string;
    password: string;
    plan?: string;
  }): Promise<LoginResponse> => {
    const res = await apiClient<LoginResponse>("/auth/register-agency", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.token) {
      setAuthToken(res.token, res.user.role);
    }
    return res;
  },

  getMe: async (): Promise<LoginResponse> => {
    return apiClient<LoginResponse>("/auth/me");
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<any> => {
    return apiClient<any>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateProfile: async (
    data: { name?: string; phone?: string; avatar?: string } | FormData
  ): Promise<any> => {
    return apiClient<any>("/auth/update-profile", {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient("/auth/logout", { method: "POST" });
    } finally {
      setAuthToken(null);
    }
  },
};
