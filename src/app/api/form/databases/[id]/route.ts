import {
  getFormListbyDbId,
  getFormsByDbIdModel,
  getOrgDBsByIdModel,
  getOrgFormsByIdModel,
  getOrgTablesByIdModel,
  getTableListbyDbId,
} from "@/services/model/FormModel";
import { NextRequest, NextResponse } from "next/server";
type Props = {
  params: {
    id: number;
  };
};

export async function GET(request: NextRequest, { params: { id } }: Props) {
  try {
    const url = new URL(request.url);
    const form_id = url.searchParams.get("form_id") ?? 0;
    const tbl_id = url.searchParams.get("tbl_id") ?? 0;

    // if (Number(form_id) != 0) {
    //   const dt = await getOrgFormsByIdModel(+id);
    //   return NextResponse.json(dt);
    // }
    if (Number(form_id) != 0) {
      const dt = await getFormListbyDbId(+id);
      return NextResponse.json(dt);
    }

    // if (tbl_id != 0) {
    //   const dt = await getOrgTablesByIdModel(+tbl_id);
    //   return NextResponse.json(dt);
    // }
    else if (tbl_id != 0) {
      const dt = await getTableListbyDbId(+id);
      return NextResponse.json(dt);
    } else {
      if (id != 0) {
        const dt = await getOrgDBsByIdModel(+id);
        return NextResponse.json(dt);
      }
    }
  } catch (error) {
    return NextResponse.json("error GET form/databases/[id]/route");
  }
}
