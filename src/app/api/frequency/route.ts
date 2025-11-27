import { getFrequenciesModel } from "@/services/model/LibFrequencyModel";

import { NextResponse } from "next/server";

export async function GET() {
  const dt = await getFrequenciesModel();

  return NextResponse.json(dt);
}
