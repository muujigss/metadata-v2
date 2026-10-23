import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/utils/session";
import { sendMail } from "@/utils/sendMail";

export async function POST(req: Request) {
  const actor = await getAuthenticatedUser();
  if (!actor) return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
  if (actor.user_level !== 1) return NextResponse.json({ status: false, message: "Forbidden" }, { status: 403 });
  try {
    return NextResponse.json(await sendMail(await req.json()));
  } catch {
    console.error("Email delivery failed");
    return NextResponse.json({ status: false, message: "Unable to send email" }, { status: 500 });
  }
}
