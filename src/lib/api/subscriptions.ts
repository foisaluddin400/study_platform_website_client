import { apiClient } from "./client";

export interface SubscriptionData {
  id?: string;
  agencyId: string;
  plan: "LIFETIME_FREE";
  status: "PENDING_ACTIVATION" | "ACTIVE" | "INACTIVE" | "CANCELLED" | "EXPIRED";
  subscriptionStart?: string;
  subscriptionEnd?: string;
  maxStudents: number;
  maxCounselors: number;
  maxStorageMb: number;
  hasActiveAccess?: boolean;
}

export const subscriptionsApi = {
  getCurrent: async (): Promise<SubscriptionData> => {
    return apiClient<SubscriptionData>("/subscriptions/current");
  },

  activateFreeAccess: async (): Promise<{ subscription: SubscriptionData; hasActiveAccess: boolean }> => {
    return apiClient<{ subscription: SubscriptionData; hasActiveAccess: boolean }>(
      "/subscriptions/activate-free-access",
      {
        method: "POST",
      }
    );
  },

  upgrade: async (plan = "LIFETIME_FREE"): Promise<{ subscription: SubscriptionData; hasActiveAccess: boolean }> => {
    return apiClient<{ subscription: SubscriptionData; hasActiveAccess: boolean }>("/subscriptions/upgrade", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
  },
};
