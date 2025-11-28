import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BASE_DIR = process.env.UPLOAD_DIR;

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const filename = params.id;
  const absolutePath = path.join(BASE_DIR, filename);

  // Check if file exists
  if (!fs.existsSync(absolutePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  try {
    // Stream the file
    const fileBuffer = fs.readFileSync(absolutePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    return new NextResponse("Error reading file", { status: 500 });
  }
}
