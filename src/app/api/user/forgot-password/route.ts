import {
  createUserModel,
  forgotPasswordModel,
  updatePasswordModel,
} from "@/services/model/UserModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body) || body.length > 254) {
      return NextResponse.json({ status: false, message: "Invalid email" }, { status: 400 });
    }
    const resp = await forgotPasswordModel(body);

    return NextResponse.json(resp);
  } catch (e) {
    console.error("Password recovery failed");
    return NextResponse.json({ status: false, message: "Unable to recover password" }, { status: 500 });
  }
}
