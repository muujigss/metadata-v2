import { getDatabaseTypeSystemModel } from "@/services/model/DatabaseModel";
import { NextResponse } from "next/server";

export async function GET() {
  const dt = await getDatabaseTypeSystemModel();

  return NextResponse.json(dt);
}
