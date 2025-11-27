import { getClassificationByTblId } from "@/services/model/ClassificationModel";
import { getIndicatorsByTblId } from "@/services/model/IndicatorModel";
import { NextRequest, NextResponse } from "next/server";
type Props = {
  params: {
    id: number;
  };
};

export async function GET(request: NextRequest, { params: { id } }: Props) {
  try {
    if (id != 0) {
      const dt = await getClassificationByTblId(+id);
      return NextResponse.json(dt);
    }
  } catch (error) {
    return NextResponse.json("error GET classification/table/[id]/route");
  }
}
