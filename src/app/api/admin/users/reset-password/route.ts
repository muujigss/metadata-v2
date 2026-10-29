import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/utils/prisma";
import { getAuthenticatedUser } from "@/utils/session";

export async function POST(request: Request) {
  const actor = await getAuthenticatedUser();
  if (!actor) return NextResponse.json({ message: "Дахин нэвтэрнэ үү." }, { status: 401 });
  if (![1, 2].includes(actor.user_level ?? 0)) return NextResponse.json({ message: "Эрх хүрэлцэхгүй байна." }, { status: 403 });
  if (actor.user_level === 2 && !actor.org_id) return NextResponse.json({ message: "Байгууллагын эрх тодорхойгүй байна." }, { status: 403 });
  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ message: "Хүсэлт буруу байна." }, { status: 400 });
  }
  if (!Number.isSafeInteger(body?.userId) || body.userId <= 0) {
    return NextResponse.json({ message: "Хэрэглэгчийн дугаар буруу байна." }, { status: 400 });
  }
  try {
    // Organization admins may reset only level-3 users in their own organization.
    const scope = actor.user_level === 1
      ? { user_level: { in: [2, 3] } }
      : { user_level: 3, org_id: actor.org_id };
    const target = await prisma.md_users.findFirst({
      where: { id: body.userId, is_active: true, ...scope },
      select: { id: true, email: true },
    });
    if (!target) return NextResponse.json({ message: "Хэрэглэгч олдсонгүй эсвэл эрх хүрэлцэхгүй байна." }, { status: 404 });
    const password = await bcrypt.hash("12345678", 10);
    // Recheck the scope in the write in case permissions changed during hashing.
    const result = await prisma.md_users.updateMany({
      where: { id: target.id, is_active: true, ...scope }, data: { password },
    });
    if (result.count !== 1) return NextResponse.json({ message: "Хэрэглэгчийн төлөв өөрчлөгдсөн байна." }, { status: 409 });
    return NextResponse.json({ success: true, email: target.email }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("Admin password reset failed");
    return NextResponse.json({ message: "Нууц үг шинэчилж чадсангүй." }, { status: 500 });
  }
}
