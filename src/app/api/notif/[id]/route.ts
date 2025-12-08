import { updateNotif } from "@/services/model/NotifModel";
import { NextResponse } from "next/server";
type Props = {
  params: {
    id: number;
  };
};

export async function POST(request: Request, { params: { id } }: Props) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");
  const idCheck = Number(id);
  const dt = await updateNotif(idCheck, Number(user_id));
  if (!dt) {
    return NextResponse.json({
      data: dt,
      error: "Хадгалахад алдаа гарлаа",
      message: "error",
    });
  } else {
    return NextResponse.json({
      data: dt,
      message: "Амжилттай хадгаллаа",
    });
  }
}
