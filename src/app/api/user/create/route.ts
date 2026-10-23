import { createUserModel } from "@/services/model/UserModel";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/utils/session";

export async function POST(request: Request) {
  const actor = await getAuthenticatedUser();
  if (!actor) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (![1, 2].includes(actor.user_level)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const resp = await createUserModel(body);

    return NextResponse.json(resp);
  } catch (e) {
    console.error("User creation failed");
    return NextResponse.json({ status: false, message: "Unable to save user" }, { status: 500 });
  }
}
