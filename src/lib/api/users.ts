import { apiClient } from "./client";
import { TeamMember } from "@/types";

export const usersApi = {
  getTeam: async (): Promise<TeamMember[]> => {
    return apiClient<TeamMember[]>("/users/team");
  },

  inviteTeamMember: async (data: {
    name: string;
    email: string;
    role: string;
    roleTitle?: string;
    branch?: string;
    phone?: string;
    password?: string;
  }): Promise<any> => {
    return apiClient<any>("/users/team", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateTeamMember: async (id: string, data: Partial<TeamMember>): Promise<any> => {
    return apiClient<any>(`/users/team/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  blockTeamMember: async (id: string): Promise<any> => {
    return apiClient<any>(`/users/team/${id}/block`, {
      method: "PATCH",
    });
  },

  unblockTeamMember: async (id: string): Promise<any> => {
    return apiClient<any>(`/users/team/${id}/unblock`, {
      method: "PATCH",
    });
  },

  deleteTeamMember: async (id: string): Promise<void> => {
    return apiClient<void>(`/users/team/${id}`, {
      method: "DELETE",
    });
  },
};
