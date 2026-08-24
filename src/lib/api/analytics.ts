import { apiClient } from "./client";
import { Lead, Application, Appointment, TaskItem } from "@/types";

export interface DashboardStats {
  totalLeads: number;
  totalStudents: number;
  activeApplications: number;
  visaApproved: number;
  totalOffers: number;
  pendingDocuments: number;
  pendingTasks: number;
  upcomingAppointmentsCount: number;
  totalRevenue: number;
  expectedCommission: number;
  receivedCommission: number;
  conversionRate: string;
}

export interface DashboardAnalyticsResponse {
  stats: DashboardStats;
  stages: Record<string, number>;
  recentLeads: Lead[];
  recentApplications: Application[];
  upcomingAppointments: Appointment[];
  recentTasks: TaskItem[];
}

export interface ReportsAnalyticsResponse {
  countryDistribution: Array<{ _id: string; count: number }>;
  counselorStats: Array<{
    id: string;
    name: string;
    role: string;
    assignedStudents: number;
    activeApplications: number;
    visasApproved: number;
    conversionRate: string;
  }>;
}

export const analyticsApi = {
  getDashboard: async (): Promise<DashboardAnalyticsResponse> => {
    return apiClient<DashboardAnalyticsResponse>("/analytics/dashboard");
  },

  getReports: async (): Promise<ReportsAnalyticsResponse> => {
    return apiClient<ReportsAnalyticsResponse>("/analytics/reports");
  },
};
