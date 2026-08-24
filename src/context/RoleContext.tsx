"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserRole } from "@/types";
import { authApi, LoginResponse } from "@/lib/api/auth";
import { getAuthToken, setAuthToken } from "@/lib/api/client";

import { subscriptionsApi } from "@/lib/api/subscriptions";

export interface RoleUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  agencyName: string;
  agencyId?: string;
  branch?: string;
  phone?: string;
}

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: RoleUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<RoleUser>>;
  updateCurrentUser: (updates: Partial<RoleUser>) => void;
  setUserFromAuth: (authData: LoginResponse) => void;
  activateFreeAccess: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  agency: any;
  setAgency: React.Dispatch<React.SetStateAction<any>>;
  subscription: any;
  hasActiveAccess: boolean;
}

const defaultAdminUser: RoleUser = {
  id: "",
  name: "User",
  email: "",
  role: "admin",
  roleTitle: "Staff",
  avatar: "",
  agencyName: "Study Abroad Consultancy",
};

const mapBackendRole = (role: string): UserRole => {
  if (role === "PLATFORM_SUPER_ADMIN" || role === "AGENCY_ADMIN" || role === "admin") return "admin";
  if (role === "COUNSELOR" || role === "counselor") return "counselor";
  return "student";
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("admin");
  const [currentUser, setCurrentUser] = useState<RoleUser>(defaultAdminUser);
  const [agency, setAgency] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [hasActiveAccess, setHasActiveAccess] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  const updateCurrentUser = useCallback((updates: Partial<RoleUser>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  }, []);

  const setUserFromAuth = useCallback((authData: LoginResponse) => {
    const userRole = mapBackendRole(authData.user.role);
    const activeAccess =
      authData.hasActiveAccess ??
      (authData.subscription?.status === "ACTIVE" ||
        authData.user.role === "PLATFORM_SUPER_ADMIN" ||
        userRole === "student" ||
        userRole === "counselor");

    setRoleState(userRole);
    setHasActiveAccess(activeAccess);
    setCurrentUser({
      id: authData.user.id,
      name: authData.user.name,
      email: authData.user.email,
      role: userRole,
      roleTitle:
        authData.user.roleTitle ||
        (userRole === "admin"
          ? "Agency Director"
          : userRole === "counselor"
          ? "Senior Counselor"
          : "Student Applicant"),
      avatar: authData.user.avatar || "",
      agencyName: authData.user.agencyName || authData.agency?.name || "AbroadPath Consulting",
      agencyId: authData.user.agencyId,
      branch: authData.user.branch,
      phone: authData.user.phone,
    });
    setAgency(authData.agency);
    setSubscription(authData.subscription);
    if (authData.token) {
      setAuthToken(authData.token, authData.user.role, activeAccess);
    }
  }, []);

  const activateFreeAccess = async () => {
    setIsLoading(true);
    try {
      const res = await subscriptionsApi.activateFreeAccess();
      setSubscription(res.subscription);
      setHasActiveAccess(true);
      setAuthToken(getAuthToken(), currentUser.role, true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const res = await authApi.getMe();
          setUserFromAuth(res);
          setIsLoading(false);
          return;
        } catch (err) {
          console.warn("Stored session expired or invalid:", err);
          setAuthToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [setUserFromAuth]);

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // ignore
    } finally {
      setAuthToken(null);
      setCurrentUser(defaultAdminUser);
      setRoleState("admin");
      setHasActiveAccess(true);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole: (r) => setRoleState(r),
        currentUser,
        setCurrentUser,
        updateCurrentUser,
        setUserFromAuth,
        activateFreeAccess,
        logout,
        isLoading,
        agency,
        setAgency,
        subscription,
        hasActiveAccess,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
