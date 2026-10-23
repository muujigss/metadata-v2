import { getUserModel, loginUserModel } from "@/services/model/UserModel";
import { signAccessToken } from "@/utils/auth";
import { getAuthenticatedUser } from "@/utils/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }
  if (typeof body?.username !== "string" || typeof body?.password !== "string" ||
      !body.username.trim() || !body.password || body.username.length > 254 || body.password.length > 1024) {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }
  try {
    const user = await loginUserModel(body.username, body.password);
    if (!user || ![1, 2, 3].includes(user.user_level ?? 0) || (user.org_id === null && user.user_level !== 1)) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }
    const { password, ...safeUser } = user;
    const token = await signAccessToken({
      email: user.email,
      firstname: user.firstname,
      user_id: user.id,
      user_level: user.user_level!,
      org_id: user.org_id ?? 0,
      roles: user.roles,
    });
    return NextResponse.json({ user: safeUser, success: true, token });
  } catch (error) {
    console.error("Login failed");
    return NextResponse.json({ success: false, message: "Unable to sign in" }, { status: 500 });
  }
}

export async function GET() {
  const actor = await getAuthenticatedUser();
  if (!actor) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (![1, 2].includes(actor.user_level ?? 0)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const users = await getUserModel(actor.user_level!, actor.org_id!);
  return NextResponse.json(users);
}
