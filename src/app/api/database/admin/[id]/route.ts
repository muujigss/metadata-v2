import { getOneDatabaseModelAdmin } from "@/services/model/DatabaseModel";
import { NextResponse } from "next/server";
type Props = {
  params: {
    id: number;
  };
};

export async function GET(request: Request, { params: { id } }: Props) {
  const idCheck = Number(id);
  const dt = await getOneDatabaseModelAdmin(idCheck);

  return NextResponse.json(dt);
}
