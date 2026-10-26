import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const AUTH_COOKIE_NAME = "ufy_admin_session";


const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || "ufy-default-insecure-secret-please-change-in-env-file-2026";
  return new TextEncoder().encode(secret);
};

export async function middleware(request: any) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = getSecretKey();
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete(AUTH_COOKIE_NAME);
      return res;
    }
  }

  // If already logged in and visiting /admin/login, redirect to /admin/overview
  if (pathname === "/admin/login") {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
      try {
        const secret = getSecretKey();
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL("/admin/overview", request.url));
      } catch {
        // Token invalid, allow login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
