// import { getTablesModel } from "@/services/model/TableModel";
import { createTableModel, getTablesModel } from "@/services/model/TableModel";
import { log } from "console";
import { NextResponse } from "next/server";

export async function GET() {
  // const dt = await getTablesModel();
  return NextResponse.json([]);
}

export async function POST(request: Request) {
  const body = await request.json();

  const dt: any = await createTableModel(body);

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
