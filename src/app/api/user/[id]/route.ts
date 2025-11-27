import {
  deleteUserInfoModel,
  getUserInfoModel,
} from "@/services/model/UserModel";
import { NextResponse } from "next/server";
type Props = {
  params: {
    id: number;
  };
};

export async function GET(request: Request, { params: { id } }: Props) {
  const user_id = Number(id);
  const dt = await getUserInfoModel(user_id);
  return NextResponse.json(dt);
}

export async function DELETE(request: Request, { params: { id } }: Props) {
  const user_id = Number(id);
  const dt = await deleteUserInfoModel(user_id);
  return NextResponse.json(dt);
}
