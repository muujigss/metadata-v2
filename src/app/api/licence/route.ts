import { getLicenceModel } from "@/services/model/DatabaseModel";
import { NextResponse } from "next/server";

export async function GET() {
  const dt = await getLicenceModel();

  return NextResponse.json(dt);
}
