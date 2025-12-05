import { getNotifCount } from "@/services/model/NotifModel";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const data = await getNotifCount();
  return NextResponse.json(data);
}
