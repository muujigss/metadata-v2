import { createDatabaseAll } from "@/services/model/DatabaseModel";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dt: any = await createDatabaseAll(body);

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
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: true, message: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
