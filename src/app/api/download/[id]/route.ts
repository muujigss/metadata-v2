import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BASE_DIR = process.env.UPLOAD_DIR;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("BASE_DIR PATH:", BASE_DIR);
  console.log("params:", params);
  
  const uploadDir = process.env.UPLOAD_DIR || "public/uploads";
  
  if (!uploadDir) {
    console.error("UPLOAD_DIR is not defined and fallback failed");
    return new NextResponse("Server configuration error", { status: 500 });
  }

  const filename = decodeURIComponent(params.id);
  const absolutePath = path.join(uploadDir, filename);
  console.log("DOWNLOAD PATH:", absolutePath);

  // Check if file exists
  if (!fs.existsSync(absolutePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  try {
    // Stream the file
    const fileBuffer = fs.readFileSync(absolutePath);

    return new NextResponse(new Uint8Array(fileBuffer), {
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
