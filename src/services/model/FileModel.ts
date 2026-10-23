"use server";
import prisma from "@/utils/prisma";
import fs from "fs/promises";
import { access, mkdir } from "fs/promises";
import { randomUUID } from "node:crypto";
import { InvalidUploadError, resolveUploadPath, validateUpload } from "@/utils/files";

const createFileModel = async (file: any, created_user: any) => {
  try {
    validateUpload(file);
    // if (!created_user) throw new Error("created_user is required");
  
    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length !== file.size) throw new InvalidUploadError("Invalid file size");
    const filename = `${randomUUID()}_${file.name}`;
  
    const uploadDir = process.env.UPLOAD_DIR || "public/uploads";
    
    // Ensure directory exists
    try {
      await access(uploadDir);
    } catch {
      await mkdir(uploadDir, { recursive: true });
    }

    const fullPath = resolveUploadPath(uploadDir, filename);
  
    await fs.writeFile(fullPath, bytes, { flag: "wx" });
  
    const fileData = {
      filename: filename,
      type: file?.type,
      path: uploadDir,
      size: file?.size,
      created_user: created_user ? parseInt(created_user) : null
    }

    // Create md_file record
    let fileRecord;
    try {
      fileRecord = await prisma.md_file.create({ data: fileData });
    } catch (error) {
      await fs.unlink(fullPath).catch(() => undefined);
      throw error;
    }
    return { file: fileRecord, status: true, message: "File created successfully" };
  } catch (error) {
    if (error instanceof InvalidUploadError) throw error;
    console.error("Error in createFileModel:", error);
    throw new Error("Failed to createFileModel");
  }
};
const getOneFileModel = async (id: number) => {
  try {
    const data = await prisma.md_file.findUnique({
      where: { id: id },
    });
    return data;
  } catch (error) {
    console.error("Error in getOneFileModel:", error);
    throw new Error("Failed to getOneFileModel");
  }
};

export {
  createFileModel, getOneFileModel,
};
