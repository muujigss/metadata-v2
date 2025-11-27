import {
  getIndicatorsByTblId,
  getPrevIndicatorByTblId,
} from "@/services/model/IndicatorModel";
import { NextRequest, NextResponse } from "next/server";
type Props = {
  params: {
    id: number;
  };
};

export async function GET(request: NextRequest, { params: { id } }: Props) {
  try {
    if (id != 0) {
      const dt = await getPrevIndicatorByTblId(+id);
      return NextResponse.json(dt);
    }
  } catch (error) {
    return NextResponse.json("error GET indicator/table/prev/[id]/route");
  }
}
