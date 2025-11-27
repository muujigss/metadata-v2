import { createOrganizationModel } from "@/services/model/OrganizationModel"; //   getOrganizationByIdModel  from "@/services/model/OrganizationModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const dt: any = await createOrganizationModel(body);

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
