import { getSecurityLevelsModel } from "@/services/model/LibSecurityLevel";

import { NextResponse } from "next/server";

export async function GET() {
  const dt = await getSecurityLevelsModel();

  return NextResponse.json(dt);
}
