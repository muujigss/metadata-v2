import { getDissimenationLevelModel } from "@/services/model/LibDissimenationLevelModel";
import { NextResponse } from "next/server";

export async function GET() {
  const dt = await getDissimenationLevelModel();
  if (!dt) {
    return NextResponse.json({
      data: dt,
      error: "Алдаа гарлаа",
      message: "error",
      status: "error",
    });
  } else {
    return NextResponse.json({
      data: dt,
      message: "Амжилттай...",
      status: "success",
    });
  }
  // return NextResponse.json(dt);
}
