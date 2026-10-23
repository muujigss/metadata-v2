import { cookies } from "next/headers";
import { verifyAccessToken } from "./auth";
import prisma from "./prisma";

// Recheck current permissions so deactivated accounts and changed roles take effect.
export async function getAuthenticatedUser() {
  const store = await cookies();
  const session = await verifyAccessToken(store.get("access-token")?.value || "");
  if (!session) return null;
  return prisma.md_users.findFirst({
    where: { id: session.user_id, is_active: true },
    select: { id: true, user_level: true, org_id: true },
  });
}
