import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-itl_admin" : "itl_admin";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  const passthrough = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return passthrough;
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !isWellFormed(token)) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return passthrough;
}

function isWellFormed(token: string) {
  const parts = token.split(".");
  return parts.length === 4 && parts[0] === "v2";
}

export const config = {
  matcher: ["/admin/:path*"],
};
