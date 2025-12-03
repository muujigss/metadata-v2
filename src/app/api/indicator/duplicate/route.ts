import { getDuplicateIndicatorsModel } from "@/services/model/IndicatorModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getDuplicateIndicatorsModel();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch duplicate indicators" },
      { status: 500 }
    );
  }
}
