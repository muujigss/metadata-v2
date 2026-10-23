import { NextResponse } from "next/server";
import { createFileModel } from "@/services/model/FileModel";
import { InvalidUploadError, validateUpload } from "@/utils/files";
import { getAuthenticatedUser } from "@/utils/session";

export async function POST(req: Request) {
  const actor = await getAuthenticatedUser();
  if (!actor) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    validateUpload(file);
    const data = await createFileModel(file, actor.id);
    return NextResponse.json({ data, message: "Амжилттай хадгаллаа", status: "success" });
  } catch (error) {
    if (error instanceof InvalidUploadError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.error("File upload failed");
    return NextResponse.json({ message: "Unable to upload file" }, { status: 500 });
  }
}
