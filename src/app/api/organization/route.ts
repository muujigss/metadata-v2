import { getOrganizationModel } from "@/services/model/OrganizationModel";
import { NextResponse } from "next/server";

// ✅ Add this to disable static caching
export const dynamic = "force-dynamic";

export async function GET() {
  const dt = await getOrganizationModel();

  return NextResponse.json(dt, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
