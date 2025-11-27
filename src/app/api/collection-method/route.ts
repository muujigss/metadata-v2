import { getCollectionMethodsModel } from "@/services/model/LibCollectionMethodModel";

import { NextResponse } from "next/server";

export async function GET() {
  const dt = await getCollectionMethodsModel();

  return NextResponse.json(dt);
}
