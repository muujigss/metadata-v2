import { getSourcesModel } from "@/services/model/LibSourceModel";

import { NextResponse } from "next/server";

export async function GET() {
  const dt = await getSourcesModel();

  return NextResponse.json(dt);
}
