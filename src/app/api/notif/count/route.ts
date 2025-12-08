import { getNotifCount } from "@/services/model/NotifModel";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");
  const user_level = searchParams.get("user_level");
  const data = await getNotifCount(user_id, user_level);
  return NextResponse.json(data);
}
