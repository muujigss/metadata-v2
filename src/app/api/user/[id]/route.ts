import { deleteUserInfoModel, getUserInfoModel } from "@/services/model/UserModel";
import { getAuthenticatedUser } from "@/utils/session";
import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

type Props = { params: Promise<{ id: string }> };

async function authorize(id: string, deleting: boolean) {
  const actor = await getAuthenticatedUser();
  if (!actor) return new NextResponse("Unauthorized", { status: 401 });
  const userId = Number(id);
  if (!Number.isSafeInteger(userId) || userId <= 0) return new NextResponse("Invalid user ID", { status: 400 });
  if (deleting && ![1, 2].includes(actor.user_level)) return new NextResponse("Forbidden", { status: 403 });
  const target = await prisma.md_users.findUnique({ where: { id: userId }, select: { org_id: true, user_level: true } });
  if (!target) return new NextResponse("Not found", { status: 404 });
  if (actor.user_level !== 1 && !(actor.id === userId ||
      (actor.user_level === 2 && actor.org_id && target.org_id === actor.org_id && target.user_level !== 1))) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  return userId;
}

export async function GET(request: Request, { params }: Props) {
  const allowed = await authorize((await params).id, false);
  if (typeof allowed !== "number") return allowed;
  return NextResponse.json(await getUserInfoModel(allowed));
}

export async function DELETE(request: Request, { params }: Props) {
  const allowed = await authorize((await params).id, true);
  if (typeof allowed !== "number") return allowed;
  return NextResponse.json(await deleteUserInfoModel(allowed));
}
