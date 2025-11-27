import { getUserModel, loginUserModel } from "@/services/model/UserModel";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
type Props = {
  params: {
    user_level: number;
    org_id: number;
  };
};

export async function POST(request: Request) {
  const body = await request.json();

  const user = await loginUserModel(body.username, body.password);

  if (!user) {
    return NextResponse.json({
      success: false,
      message: "User not found",
    });
  }

  // if (user?.id < 45 && user?.password !== body.password) {
  //   return NextResponse.json({
  //     success: false,
  //     message: "Invalid password",
  //   });
  // }
  const removeProp = "password";
  const { [removeProp]: removePassword, ...rest } = user;

  const JWT_SECRET = process.env.JWT_SECRET;

  if (JWT_SECRET) {
    const token = jwt.sign(
      {
        email: user?.email,
        firstname: user?.firstname,
        user_id: user?.id,
        user_level: user?.user_level,
        org_id: user?.org_id,
        roles: user?.roles,
      },
      JWT_SECRET,
      {
        expiresIn: "30m",
      }
    );

    return NextResponse.json({ user: rest, success: true, token });
  }
}
export async function GET(request: Request) {
  const url = new URL(request.url);
  const user_level = Number(url.searchParams.get("user_level")) || 0;
  const org_id = Number(url.searchParams.get("org_id")) || 0;
  // console.log("🔍 GET /api/user called with:");
  // console.log("user_level:", user_level);
  // console.log("org_id:", org_id);

  const userLevel = Number(user_level);
  const orgId = Number(org_id);
  const dt = await getUserModel(userLevel, orgId);

  return NextResponse.json(dt);
}
