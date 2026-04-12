import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "silo_access_token";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!accessToken && request.nextUrl.pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};