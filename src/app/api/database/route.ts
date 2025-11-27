import { getDatabaseModel } from "@/services/model/DatabaseModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const id = url.searchParams?.get("org")?.toString();
  const currentPage = 1;
  const take = 30;
  const skip = (currentPage - 1) * take;

  const dt = await getDatabaseModel(+skip, take, 1, {
    orgId: id,
  });

  return NextResponse.json(dt);
}
