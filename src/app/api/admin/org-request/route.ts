import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import { sendMail } from "@/utils/sendMail";
import { getAuthenticatedUser } from "@/utils/session";
import { randomBytes } from "node:crypto";
import { mailTemplateOrgConfirm } from "@/utils/helper-mail";

// GET: List only pending (unresolved) registration requests
export async function GET() {
  const actor = await getAuthenticatedUser();
  if (!actor) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (actor.user_level !== 1) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  try {
    const requests = await prisma.md_organization.findMany({
      where: {
        // Зөвхөн шийдэгдээгүй хүсэлт (approved/rejected харагдахгүй)
        type: "new",
        is_active: false,
      },
      include: {
        users: { select: { id: true, email: true, firstname: true, lastname: true, phone_number: true, department: true, position: true, is_active: true } },
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
  const actor = await getAuthenticatedUser();
  if (!actor) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (actor.user_level !== 1) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
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
    const targetUser = await prisma.md_users.findFirst({ where: { id: user_id, org_id } });
    if (!targetUser) return NextResponse.json({ message: "User does not belong to organization" }, { status: 400 });
    const newPassword = randomBytes(18).toString("base64url");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Activate Organization
    const org = await prisma.md_organization.update({
      where: { id: org_id },
      data: { 
        is_active: true,
        type: "approved",
        status: "approved"
      },
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

    // Send Approval Email (мэйл унасан ч approve-ийг блоклохгүй)
    if (user.email) {
      try {
        const template = await mailTemplateOrgConfirm(user.email, org.name || "", user.firstname || "", user.lastname || "", newPassword, process.env.HOST_BASE_URL || process.env.BASE_URL || "")
        await sendMail(template)
      } catch (mailErr) {
        console.error("Approval mail failed (approve continued):", mailErr)
      }
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

// DELETE: Reject request (Soft Delete / Update Status)
export async function DELETE(request: Request) {
  const actor = await getAuthenticatedUser();
  if (!actor) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (actor.user_level !== 1) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  try {
    const body = await request.json();
    const { org_id, user_id, status } = body;

    if (!org_id) {
      return NextResponse.json(
        { message: "Org ID is required" },
        { status: 400 }
      );
    }

    // Get user email
    let userEmail = "";
    if (user_id) {
      const user = await prisma.md_users.findUnique({ where: { id: user_id } });
      if (user) userEmail = user.email || "";
    }

    // Send Rejection Email (мэйл унасан ч татгалзахыг блоклохгүй)
    if (userEmail) {
      try {
        await sendMail({
          to: userEmail,
          subject: "Төрөлжсөн бүртгэлийн нэгдсэн сан - Бүртгэл татгалзлаа",
          html: `
            <p>Сайн байна уу,</p>
            <p>Таны байгууллагын бүртгэлийн хүсэлтээс татгалзсан байна.</p>
            <p>Шалтгаан: ${status || "Тодорхойгүй"}</p>
            <p>Дэлгэрэнгүй мэдээллийг админтай холбогдож авна уу.</p>
          `
        });
      } catch (mailErr) {
        console.error("Rejection mail failed (reject continued):", mailErr)
      }
    }

    /* 
       Instead of deleting, we update the status to "rejected".
       The user also remains inactive.
    */
    
    // Update Organization
    await prisma.md_organization.update({
      where: { id: org_id },
      data: {
        type: "rejected",
        status: status || "Rejected",
        is_active: false
      }
    });

    return NextResponse.json({ success: true, message: "Rejected" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
