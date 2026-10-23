import { NextRequest, NextResponse } from "next/server";
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { InvalidUploadError, resolveUploadPath } from "@/utils/files";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: filename } = await params;
    const uploadDir = process.env.UPLOAD_DIR || "public/uploads";
    const target = resolveUploadPath(uploadDir, filename);
    const [root, actualPath] = await Promise.all([realpath(uploadDir), realpath(target)]);
    // Do not follow a symlink outside the upload directory.
    if (path.dirname(actualPath) !== root) return new NextResponse("File not found", { status: 404 });
    const buffer = await readFile(actualPath);
    const imageTypes: Record<string, string> = {
      ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
      ".gif": "image/gif", ".webp": "image/webp",
    };
    const imageType = imageTypes[path.extname(filename).toLowerCase()];
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": imageType || "application/octet-stream",
        "Content-Disposition": `${imageType ? "inline" : "attachment"}; filename="download"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof InvalidUploadError) return new NextResponse("Invalid filename", { status: 400 });
    if (["ENOENT", "ENOTDIR", "EISDIR"].includes((error as NodeJS.ErrnoException).code || "")) {
      return new NextResponse("File not found", { status: 404 });
    }
    console.error("Download failed");
    return new NextResponse("Unable to download file", { status: 500 });
  }
}
