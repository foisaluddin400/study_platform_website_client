import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken =
    request.cookies.get("abroadpath_auth_token")?.value ||
    request.cookies.get("accessToken")?.value;

  const userRole = request.cookies.get("abroadpath_user_role")?.value?.toUpperCase();
  const accessActive = request.cookies.get("abroadpath_access_active")?.value;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isFreeAccessPage = pathname === "/free-access";
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isStudentPage = pathname.startsWith("/student");

  // 1. Authenticated users trying to access login or register -> redirect to appropriate workspace
  if (isAuthPage && authToken) {
    if (userRole === "STUDENT") {
      return NextResponse.redirect(new URL("/student", request.url));
    }
    if ((userRole === "ADMIN" || userRole === "AGENCY_ADMIN") && accessActive === "false") {
      return NextResponse.redirect(new URL("/free-access", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Unauthenticated access to protected routes -> redirect to login
  if ((isDashboardPage || isStudentPage || isFreeAccessPage) && !authToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Free Access Page & Dashboard Gating for Admin
  if (authToken) {
    if ((userRole === "ADMIN" || userRole === "AGENCY_ADMIN") && accessActive === "false" && isDashboardPage) {
      return NextResponse.redirect(new URL("/free-access", request.url));
    }

    if ((userRole === "ADMIN" || userRole === "AGENCY_ADMIN") && accessActive === "true" && isFreeAccessPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 4. Role-Based Access Controls
  if (authToken && userRole) {
    // A. Student trying to access Agency Dashboard or Free Access page
    if ((isDashboardPage || isFreeAccessPage) && userRole === "STUDENT") {
      return NextResponse.redirect(new URL("/student", request.url));
    }

    // B. Counselor trying to access Admin-only modules (Team management, Commissions)
    if (userRole === "COUNSELOR") {
      const adminOnlyPaths = ["/dashboard/team", "/dashboard/commissions"];
      if (adminOnlyPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
        return NextResponse.redirect(new URL("/403", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/student/:path*",
    "/free-access",
    "/login",
    "/register",
  ],
};
