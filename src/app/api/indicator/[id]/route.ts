import { getIndicatorModel } from "@/services/model/IndicatorModel";
import { NextResponse } from "next/server";
type Props = {
  params: {
    id: number;
  };
};

export async function GET(request: Request, { params: { id } }: Props) {
  const dt = await getIndicatorModel(+id);

  return NextResponse.json(dt);
}
