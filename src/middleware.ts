import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NextURL } from "next/dist/server/web/next-url";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const encryptedToken = req.cookies.get("access-token")?.value || "";

  const isTokenValid = decodeToken(encryptedToken);

  if (!isTokenValid) {
    if (pathname !== "/login") {
      const loginUrl = new NextURL("/login", origin);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.redirect("/login");
  }

  if (pathname == "/login") {
    const url = new NextURL("/admin/dashboard", origin);
    return NextResponse.redirect(url);
  }

  const userInfo = getUserInfoFromToken(encryptedToken);

  // Perform authorization checks
  const isAuthorized = authorizeUser(userInfo, pathname);

  if (!isAuthorized) {
    //   // Handle unauthorized access (e.g., redirect to access denied page)
    const errorUrl = new NextURL("/access-denied", origin);
    return NextResponse.redirect(errorUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*", // Protect dashboard route and sub-routes
    "/user/:path*",
    "/org",
    "/guide",
    "/juram",
    // "",
  ],
};

// function to decode token validity
function decodeToken(token: string): boolean {
  try {
    const decodedToken = jwt.decode(token) as jwt.JwtPayload;

    if (!decodedToken || !decodedToken.exp) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp > currentTime;
  } catch (err) {
    console.error("Token decoding error:", err);
    return false;
  }
}

export { decodeToken };

// засаж сайжруулна
function authorizeUser(userInfo: any, requestedPath: string): boolean {
  // Define roles required for specific paths
  // checklevels
  const userLevelRequiredForPath: { [key: string]: string[] } = {
    "/dashboard": ["1", "2", "3"],
    "/org": ["1"],
    "/user": ["1", "3"],
    // Add more paths and roles as needed
  };

  const levelsRequired = userLevelRequiredForPath[requestedPath];

  if (levelsRequired && levelsRequired.length > 0) {
    return levelsRequired.includes(userInfo.userLevel.toString());
  }
  return true;
}

//жишээ харах
function getUserInfoFromToken(token: string) {
  // Decrypt the token
  const tokenData = jwt.decode(token) as { sub: string; authorities: string[] };

  return {
    userLevel: tokenData?.user_level,
    userRoles: tokenData?.roles,
  };
}
