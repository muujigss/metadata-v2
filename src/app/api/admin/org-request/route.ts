import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import { sendMail } from "@/services/MailService";

// GET: List all pending requests (inactive organizations)
export async function GET() {
  try {
    const requests = await prisma.md_organization.findMany({
      where: {
        is_active: false,
      },
      include: {
        users: {
          where: {
            is_active: false,
          },
        },
        file: true,
      },
      orderBy: {
        created_date: "desc",
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Approve request
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { org_id, user_id } = body;

    if (!org_id || !user_id) {
      return NextResponse.json(
        { message: "Org ID and User ID are required" },
        { status: 400 }
      );
    }

    // Generate new password
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Activate Organization
    const org = await prisma.md_organization.update({
      where: { id: org_id },
      data: { is_active: true },
    });

    // Activate User and update password
    const user = await prisma.md_users.update({
      where: { id: user_id },
      data: { 
        is_active: true,
        user_level: 2, // Ensure level 2
        password: hashedPassword
      },
    });

    // Send Approval Email
    if (user.email) {
      await sendMail({
        to: user.email,
        subject: "Төрөлжсөн бүртгэлийн нэгдсэн сан - Бүртгэл баталгаажлаа",
        html: `
          <h3>Сайн байна уу, ${user.lastname} овогтой ${user.firstname}</h3>
          <p>Таны <b>${org.name}</b> байгууллагын бүртгэл амжилттай баталгаажлаа.</p>
          <p>Та системд дараах мэдээллээр нэвтэрнэ үү:</p>
          <p><b>Нэвтрэх нэр (Email):</b> ${user.email}</p>
          <p><b>Нууц үг:</b> ${newPassword}</p>
          <br/>
          <a href="${process.env.HOST_BASE_URL}/login">Нэвтрэх</a>
        `
      });
    }

    return NextResponse.json({ success: true, message: "Approved" });
  } catch (error) {
    console.error("Error approving request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Reject request
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { org_id, user_id } = body;

    if (!org_id) {
      return NextResponse.json(
        { message: "Org ID is required" },
        { status: 400 }
      );
    }

    // Get user email before deleting
    let userEmail = "";
    if (user_id) {
      const user = await prisma.md_users.findUnique({ where: { id: user_id } });
      if (user) userEmail = user.email || "";
    }

    // Send Rejection Email
    if (userEmail) {
      await sendMail({
        to: userEmail,
        subject: "Төрөлжсөн бүртгэлийн нэгдсэн сан - Бүртгэл татгалзлаа",
        html: `
          <p>Сайн байна уу,</p>
          <p>Таны байгууллагын бүртгэлийн хүсэлтээс татгалзсан байна.</p>
          <p>Дэлгэрэнгүй мэдээллийг админтай холбогдож авна уу.</p>
        `
      });
    }

    // Delete User first (foreign key constraint)
    if (user_id) {
      await prisma.md_users.delete({
        where: { id: user_id },
      });
    }

    // Delete Organization
    await prisma.md_organization.delete({
      where: { id: org_id },
    });

    return NextResponse.json({ success: true, message: "Rejected and deleted" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
