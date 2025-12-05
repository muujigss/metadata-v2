import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import { createFileModel } from "@/services/model/FileModel";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Organization fields
    const org_name = formData.get("org_name") as string;
    const org_short_name = formData.get("org_short_name") as string;
    const org_email = formData.get("org_email") as string;
    const org_phone = formData.get("org_phone") as string;
    const org_address = formData.get("org_address") as string;
    const org_website = formData.get("org_website") as string;

    // User fields
    const lastname = formData.get("lastname") as string;
    const firstname = formData.get("firstname") as string;
    const user_email = formData.get("user_email") as string;
    const user_phone = formData.get("user_phone") as string;
    const department = formData.get("department") as string;
    const position = formData.get("position") as string;

    // File
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json(
        { message: "Файл утга шаардана." },
        { status: 400 }
      );
    }

    // Check if user email already exists
    const existingUser = await prisma.md_users.findFirst({
      where: { email: user_email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Хэрэглэгчийн и-мэйл бүртгэлтэй байна." },
        { status: 400 }
      );
    }

    // Check if organization name or email already exists
    const existingOrg = await prisma.md_organization.findFirst({
      where: {
        OR: [
          { name: org_name },
          { email: org_email }
        ]
      }
    });

    if (existingOrg) {
      return NextResponse.json(
        { message: "Байгууллагын нэр эсвэл и-мэйл бүртгэлтэй байна." },
        { status: 400 }
      );
    }

    // Save file
    const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
    const dt: any = await createFileModel(file, null);
  
    if (!dt) {
      return NextResponse.json({
        data: dt,
        error: "Файл хадгалахад алдаа гарлаа",
        message: "error",
        status: "error",
      });
    }
    const uploadDir = process.env.UPLOAD_DIR!;
    const fileUrl = `${uploadDir}/${filename}`;

    // Create Organization (Inactive)
    const now = new Date();

    const organization = await prisma.md_organization.create({
      data: {
        name: org_name,
        org_short_name: org_short_name,
        email: org_email,
        phone: org_phone,
        address: org_address,
        website: org_website,
        is_active: false, // Inactive
        created_date: now,
        updated_date: now,
      },
    });

    // Create User (Inactive) linked to Organization
    // Generate a random password for now, though they can't login yet.
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.md_users.create({
      data: {
        org_id: organization.id,
        user_level: 2, // Data Admin
        lastname,
        firstname,
        email: user_email,
        phone_number: user_phone,
        department,
        position,
        password: hashedPassword,
        is_active: false, // Inactive
        created_date: now,
        updated_date: now,
        last_login_date: now, // Required field
      },
    });
    
    // Update organization with file url in img_url
    await prisma.md_organization.update({
        where: { id: organization.id },
        data: { img_url: fileUrl }
    });

    return NextResponse.json({ success: true, message: "Request received" });

  } catch (error) {
    console.error("Request access error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
