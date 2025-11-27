import { getDatabaseTypeModel } from "@/services/model/DatabaseModel";
import { NextResponse } from "next/server";

export async function GET() {
  const dt = await getDatabaseTypeModel();

  return NextResponse.json(dt);
}
