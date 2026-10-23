import { jwtVerify, SignJWT, type JWTPayload } from "jose";

export interface AccessTokenPayload extends JWTPayload {
  user_id: number;
  user_level: number;
  org_id: number;
}

export const ACCESS_TOKEN_MAX_AGE = 24 * 60 * 60;

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret || !token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
      requiredClaims: ["exp", "user_id", "user_level", "org_id"],
    });
    if (!Number.isSafeInteger(payload.user_id) || Number(payload.user_id) <= 0 ||
        ![1, 2, 3].includes(Number(payload.user_level)) || typeof payload.user_level !== "number" ||
        !Number.isSafeInteger(payload.org_id) || Number(payload.org_id) < 0) return null;
    return payload as AccessTokenPayload;
  } catch {
    return null;
  }
}

export async function signAccessToken(payload: AccessTokenPayload): Promise<string> {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_MAX_AGE}s`)
    .sign(new TextEncoder().encode(secret));
}

const matchesPath = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export function canAccessPath(level: number, pathname: string): boolean {
  if (![1, 2, 3].includes(level)) return false;
  if (matchesPath(pathname, "/admin/user/change-password")) return true;
  const adminOnly = ["/admin/org", "/admin/org-request", "/admin/request", "/admin/log", "/admin/duplicate", "/admin/reference", "/org"];
  if (adminOnly.some((route) => matchesPath(pathname, route))) return level === 1;
  if (["/admin/user", "/user"].some((route) => matchesPath(pathname, route))) return level === 1 || level === 2;
  return true;
}
