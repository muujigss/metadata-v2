import { getClassificationModel } from "@/services/model/ClassificationModel";
import { NextResponse } from "next/server";

export async function GET() {
  // const dt = await getClassificationModel();

  return NextResponse.json([]);
}
