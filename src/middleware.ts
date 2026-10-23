import { NextResponse, type NextRequest } from "next/server";
import { canAccessPath, verifyAccessToken } from "@/utils/auth";

export async function middleware(req: NextRequest) {
  const session = await verifyAccessToken(req.cookies.get("access-token")?.value || "");
  if (!session) return NextResponse.redirect(new URL("/login", req.url));
  if (!canAccessPath(session.user_level, req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/access-denied", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/org/:path*", "/guide/:path*", "/juram/:path*"],
};
