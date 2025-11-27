import { getClassificationIdModel } from "@/services/model/ClassificationModel";
import { NextResponse } from "next/server";

type Props = {
  params: {
    id: number;
  };
};

export async function GET(request: Request, { params: { id } }: Props) {
  const idCheck = Number(id);
  const dt = await getClassificationIdModel(idCheck);

  return NextResponse.json(dt);
}
