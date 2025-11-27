import { NextResponse } from "next/server";
import { insertIndicatorClassificationModel } from "@/services/model/IndicatorClassificatonModel";

export async function POST(request: Request) {
  const body = await request.json();
  const dt: any = await insertIndicatorClassificationModel(body);

  if (!dt) {
    return NextResponse.json({
      data: dt,
      error: "Хадгалахад алдаа гарлаа",
      message: "error",
      status: "error",
    });
  } else {
    return NextResponse.json({
      data: dt,
      message: "Амжилттай хадгаллаа",
      status: "success",
    });
  }
}
