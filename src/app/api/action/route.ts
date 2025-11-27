import {
  getActionsModel,
  updateActionsModel,
} from "@/services/model/ActionModel";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // const searchParams = request.nextUrl.searchParams;
  const url = new URL(request.url);

  // const org_id = Number(url.searchParams.get("org")) || 1;
  // const db_id = Number(url.searchParams.get("db")) || 1;

  const dt = await getActionsModel();
  if (!dt) {
    return NextResponse.json("error");
  }

  return NextResponse.json(dt);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // console.log({ body });

  const user_id = Number(body.user_id || 0);
  const db_id = Number(body.item_id || 0);
  const action_type = Number(body.action_type || 0);

  const dt = await updateActionsModel(db_id, action_type, user_id);
  if (!dt) {
    return NextResponse.json("error");
  }

  return NextResponse.json(dt);
}
