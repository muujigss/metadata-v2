import { getDatabaseCategoryModel } from "@/services/model/DatabaseModel";
import { NextResponse } from "next/server";

export async function GET() {
  const dt = await getDatabaseCategoryModel();

  return NextResponse.json(dt);
}
