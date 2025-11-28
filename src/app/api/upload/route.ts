import { NextResponse } from "next/server";
import { createFileModel } from "@/services/model/FileModel";

export async function POST(req: Request) {
  const form = await req.formData();
  const created_user = form.get("created_user");
  const file = form.get("file") as File;
  console.log("Received file:", file);
  if (!file) {
    return NextResponse.json({ error: "File missing" }, { status: 400 });
  }
  const dt: any = await createFileModel(file, created_user);

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
