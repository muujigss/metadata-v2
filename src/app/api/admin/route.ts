import { getTablesByUserModel } from "@/services/model/TableModel";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // const searchParams = request.nextUrl.searchParams;
  const url = new URL(request.url);

  const org_id = Number(url.searchParams.get("org")) || 1;
  const db_id = Number(url.searchParams.get("db")) || 1;

  const dt = await getTablesByUserModel(+org_id, +db_id);

  if (!dt) {
    return NextResponse.json("error");
  }

  return NextResponse.json(dt);
}
