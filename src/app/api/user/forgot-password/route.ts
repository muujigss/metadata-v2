import {
  createUserModel,
  forgotPasswordModel,
  updatePasswordModel,
} from "@/services/model/UserModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const resp = await forgotPasswordModel(body);

    return NextResponse.json(resp);
  } catch (e) {
    console.log(e);
  }
}
