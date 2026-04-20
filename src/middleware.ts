import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/constants/auth";

/** Admin routes that do NOT require authentication */
const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin/* routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow public admin paths (e.g. login) through without a session
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for a valid session cookie
  const session = request.cookies.get(SESSION_COOKIE_NAME);

  if (!session?.value) {
    const loginUrl = new URL("/admin/login", request.url);
    // Preserve the intended destination (including query string) so we can redirect after login
    const search = request.nextUrl.search;
    loginUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
