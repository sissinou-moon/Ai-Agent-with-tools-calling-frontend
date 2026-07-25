import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAMES } from "./features/auth/constants";

export function proxy(request: NextRequest) {
    const { nextUrl } = request;
    const hasAccessToken = request.cookies.has(COOKIE_NAMES.ACCESS_TOKEN);
    const hasRefreshToken = request.cookies.has(COOKIE_NAMES.REFRESH_TOKEN);
    const isLoggedOut = request.cookies.get("loggout")?.value === "true";
    const isAuthenticated = (hasAccessToken || hasRefreshToken) && !isLoggedOut;


    const isAuthRoute =
        nextUrl.pathname === "/login" ||
        nextUrl.pathname === "/register" ||
        nextUrl.pathname === "/verify";

    // If authenticated and trying to access auth pages, redirect to dashboard root
    if (isAuthenticated && isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // If not authenticated and trying to access protected pages, redirect to login
    if (!isAuthenticated && !isAuthRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt, and image assets (.png, .jpg, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*$).*)",
    ],
};
