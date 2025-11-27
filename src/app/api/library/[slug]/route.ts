import { getLibActionTypeModel } from "@/services/model/ActionModel";
import { getSourcesModel } from "@/services/model/LibSourceModel";
import { getUnitModel } from "@/services/model/LibUnitModel";
import { getUserLevelModel } from "@/services/model/LibUserLevelModel";
import { getUserRoleModel } from "@/services/model/LibUserRoleModel";
import { getValueTypeModel } from "@/services/model/LibValueTypeModel";

import { NextResponse } from "next/server";

type Props = {
  params: {
    slug: string;
  };
};

export async function GET(request: Request, { params: { slug } }: Props) {
  let dt;
  if (slug == "unit") {
    dt = await getUnitModel();
  } else if (slug == "value") {
    dt = await getValueTypeModel();
  } else if (slug == "userrole") {
    dt = await getUserRoleModel();
  } else if (slug == "userlevel") {
    dt = await getUserLevelModel();
  } else if (slug == "actiontype") {
    dt = await getLibActionTypeModel();
  }

  return NextResponse.json(dt);
}
