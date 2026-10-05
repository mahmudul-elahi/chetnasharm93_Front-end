import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = "admin" | "teacher" | "student";

const ROLE_ROUTES: Record<string, Role[]> = {
  // Admin only
  "/dashboard/classes": ["admin"],
  "/dashboard/batches": ["admin"],
  "/dashboard/payments": ["admin"],
  "/dashboard/free-resources": ["admin"],
  "/dashboard/students": ["admin"],
  "/dashboard/waiting-list": ["admin"],
  "/dashboard/users": ["admin"],
  "/dashboard/notifications": ["admin"],
  "/dashboard/revenue": ["admin"],
  "/dashboard/teachers": ["admin"],

  // Teacher only
  "/dashboard/my-assigned-batches": ["teacher"],
  "/dashboard/my-students": ["teacher"],
  "/dashboard/assignments": ["teacher"],

  // Admin and Teacher
  "/dashboard/availability": ["admin", "teacher"],
  "/dashboard/attendance": ["admin", "teacher"],

  // Student only
  "/dashboard/transactions": ["student"],
  "/dashboard/my-enrolled-batches": ["student"],
  "/dashboard/my-assignments": ["student"],
  "/dashboard/my-wishlist": ["student"],

  // Common authenticated routes
  "/dashboard/settings": ["admin", "teacher", "student"],
  "/dashboard/profile": ["admin", "teacher", "student"],
  "/dashboard": ["admin", "teacher", "student"],
};

const getRequiredRoles = (pathname: string): Role[] | null => {
  const match = Object.keys(ROLE_ROUTES)
    .filter((route) => pathname === route || pathname.startsWith(route + "/"))
    .sort((a, b) => b.length - a.length)[0];
  return match ? ROLE_ROUTES[match] : null;
};

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // If user is already authenticated and visits login or register, redirect to dashboard
  if (pathname === "/login" || pathname === "/register") {
    const token = request.cookies.get("authToken")?.value;
    if (token && token !== "undefined" && token !== "null") {
      const redirectParam = request.nextUrl.searchParams.get("redirect");
      const dest =
        redirectParam && !redirectParam.startsWith("/login") && !redirectParam.startsWith("/register")
          ? redirectParam
          : "/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  // All dashboard routes require authentication
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("authToken")?.value;

    if (!token || token === "undefined" || token === "null") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    const rawRole = request.cookies.get("userRole")?.value;
    const userRole = (rawRole?.toLowerCase() as Role | undefined) || "student";
    const requiredRoles = getRequiredRoles(pathname) || [
      "admin",
      "teacher",
      "student",
    ];

    if (!requiredRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)",
  ],
};
