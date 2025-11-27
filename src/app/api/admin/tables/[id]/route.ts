import { getTablesByDBModel } from "@/services/model/TableModel";
import { NextResponse } from "next/server";

type Props = {
  params: {
    id: number;
  };
};

export async function GET(request: Request, { params: { id } }: Props) {
  const dt = await getTablesByDBModel(+id);

  return NextResponse.json(dt);
}
