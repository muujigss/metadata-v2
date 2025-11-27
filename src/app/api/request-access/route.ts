import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import moment from "moment";

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
        { message: "File is required" },
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
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
    const uploadDir = path.join(process.cwd(), "public/uploads/requests");
    
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // ignore if exists
    }

    await writeFile(path.join(uploadDir, filename), buffer);
    const fileUrl = `/uploads/requests/${filename}`;

    // Create Organization (Inactive)
    const now = new Date();
    const created_date = now.toISOString();

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
