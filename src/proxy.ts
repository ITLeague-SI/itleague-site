import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "itl_admin";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !isWellFormed(token)) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

function isWellFormed(token: string) {
  const parts = token.split(".");
  return parts.length === 3 && parts[0] === "v1";
}

export const config = {
  matcher: ["/admin/:path*"],
};
