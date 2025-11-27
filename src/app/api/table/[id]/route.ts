import {
  getOneTableModel,
} from "@/services/model/TableModel";
import { NextResponse } from "next/server";
type Props = {
  params: {
    id: number;
  };
};

export async function GET(request: Request, { params: { id } }: Props) {
  const idCheck = Number(id);
  const dt = await getOneTableModel(idCheck);

  return NextResponse.json(dt);
}
