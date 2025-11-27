import { NextResponse } from "next/server";
import { createDatabaseModel } from "@/services/model/DatabaseModel";
export async function POST(request: Request) {
  const body = await request.json();
  const dt: any = await createDatabaseModel(body);

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
