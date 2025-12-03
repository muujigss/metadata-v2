import { getDuplicateIndicatorDetailsModel } from "@/services/model/IndicatorModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const name = decodeURIComponent(params.name);
    const data = await getDuplicateIndicatorDetailsModel(name);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch duplicate indicator details" },
      { status: 500 }
    );
  }
}
