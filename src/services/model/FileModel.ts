"use server";
import prisma from "@/utils/prisma";
import fs from "fs/promises";
import { access, mkdir } from "fs/promises";
import path from "path";

const createFileModel = async (file: any, created_user: any) => {
  try {
    if (!file) throw new Error("File is required");
    // if (!created_user) throw new Error("created_user is required");
  
    const bytes = Buffer.from(await file.arrayBuffer());
    const filename = file.name;
  
    const uploadDir = process.env.UPLOAD_DIR!;
    const fullPath = path.join(uploadDir, filename);
  
    await fs.writeFile(fullPath, bytes);
  
    const fileData = {
      filename: filename,
      type: file?.type,
      path: process.env.UPLOAD_DIR,
      size: file?.size,
      created_user: created_user ? parseInt(created_user) : null
    }

    // Create md_file record
    const fileRecord = await prisma.md_file.create({
      data: fileData
    });
    console.log("fileRecord:", fileRecord);
    return { file: fileRecord, status: true, message: "File created successfully" };
  } catch (error) {
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
