import {
  createUserModel,
  updatePasswordModel,
} from "@/services/model/UserModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resp = await updatePasswordModel(body);

    return NextResponse.json(resp);
  } catch (e) {
    console.error("Password change failed");
    return NextResponse.json({ status: false, message: "Нууц үг солиход алдаа гарлаа." }, { status: 500 });
  }
}
