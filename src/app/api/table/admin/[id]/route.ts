import {
  getOneTableModelAdmin,
  updateTableModel,
} from "@/services/model/TableModel";
import { NextResponse } from "next/server";
type Props = {
  params: {
    id: number;
  };
};

export async function GET(request: Request, { params: { id } }: Props) {
  const idCheck = Number(id);
  const dt = await getOneTableModelAdmin(idCheck);

  return NextResponse.json(dt);
}

export async function PUT(request: Request, { params: { id } }: Props) {
  const idCheck = Number(id);
  const body = await request.json();
  const dt = await updateTableModel(idCheck, body);
  if (!dt) {
    return NextResponse.json({
      data: dt,
      message: "Хадгалахад алдаа гарлаа",
      status: "error",
    });
  } else {
    return NextResponse.json({
      data: dt,
      message: "Амжилттай хадгаллаа",
      status: "success",
    });
  }
}
