import { getSectorModel } from "@/services/model/SectorModel";
import { NextResponse } from "next/server";

export async function GET() {
  const dt = await getSectorModel();

  return NextResponse.json(dt);
}
