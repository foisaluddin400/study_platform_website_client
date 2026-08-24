const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://study-platform-website-backend.vercel.app/api/v1";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export class ApiError extends Error {
  public statusCode: number;
  public errors?: any[];

  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Cookie helpers for client-side
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("abroadpath_auth_token") || getCookie("abroadpath_auth_token");
};

export const setAuthToken = (token: string | null, role?: string, hasActiveAccess?: boolean): void => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("abroadpath_auth_token", token);
    setCookie("abroadpath_auth_token", token, 7);
    if (role) {
      localStorage.setItem("abroadpath_user_role", role);
      setCookie("abroadpath_user_role", role, 7);
    }
    if (hasActiveAccess !== undefined) {
      const activeStr = hasActiveAccess ? "true" : "false";
      localStorage.setItem("abroadpath_access_active", activeStr);
      setCookie("abroadpath_access_active", activeStr, 7);
    }
  } else {
    localStorage.removeItem("abroadpath_auth_token");
    localStorage.removeItem("abroadpath_user_role");
    localStorage.removeItem("abroadpath_access_active");
    deleteCookie("abroadpath_auth_token");
    deleteCookie("abroadpath_user_role");
    deleteCookie("abroadpath_access_active");
    deleteCookie("accessToken");
  }
};

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    let data: ApiResponse<T>;
    try {
      data = await response.json();
    } catch {
      if (!response.ok) {
        throw new ApiError(`HTTP Error: ${response.statusText}`, response.status);
      }
      return {} as T;
    }

    if (!response.ok || !data.success) {
      if (response.status === 401) {
        // If unauthenticated, clear local session token
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const isPublic = [
            "/login",
            "/register",
            "/forgot-password",
            "/",
            "/about",
            "/pricing",
            "/contact",
            "/features",
            "/how-it-works",
          ].includes(currentPath);

          if (!isPublic && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/me")) {
            setAuthToken(null);
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        }
      }
      throw new ApiError(data.message || "An error occurred", response.status, data.errors);
    }

    return (data.data !== undefined ? data.data : data) as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || "Network communication failed", 500);
  }
}
