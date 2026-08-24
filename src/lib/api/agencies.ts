import { apiClient } from "./client";

export interface BranchItem {
  id: string;
  name: string;
  type: string;
  address: string;
  staffCount: number;
  activeStudents: number;
}

export interface AgencyProfile {
  id: string;
  name: string;
  displayName: string;
  email: string;
  phone: string;
  address?: string;
  website?: string;
  logo?: string;
  country?: string;
  baseCurrency: string;
  operatingCountries?: string[];
  branches: BranchItem[];
  notificationsConfig: {
    offerLetterAlert: boolean;
    documentCorrectionAlert: boolean;
    biometricsReminder: boolean;
  };
}

export const agenciesApi = {
  getProfile: async (): Promise<AgencyProfile> => {
    return apiClient<AgencyProfile>("/agencies/profile");
  },

  updateProfile: async (data: Partial<AgencyProfile> | FormData): Promise<AgencyProfile> => {
    return apiClient<AgencyProfile>("/agencies/profile", {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  updateOperatingCountries: async (operatingCountries: string[]): Promise<string[]> => {
    return apiClient<string[]>("/agencies/operating-countries", {
      method: "PATCH",
      body: JSON.stringify({ operatingCountries }),
    });
  },

  getBranches: async (): Promise<BranchItem[]> => {
    return apiClient<BranchItem[]>("/agencies/branches");
  },

  addBranch: async (data: Partial<BranchItem>): Promise<BranchItem[]> => {
    return apiClient<BranchItem[]>("/agencies/branches", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateNotificationsConfig: async (data: {
    offerLetterAlert?: boolean;
    documentCorrectionAlert?: boolean;
    biometricsReminder?: boolean;
  }): Promise<any> => {
    return apiClient<any>("/agencies/notifications-config", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
