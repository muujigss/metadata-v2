import { getDatabaseLocationModel } from "@/services/model/DatabaseModel";
import { NextResponse } from "next/server";

export async function GET() {
  const dt = await getDatabaseLocationModel();

  return NextResponse.json(dt);
}
