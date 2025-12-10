import { getLibActionTypeModel, getLibChangeActionTypeModel } from "@/services/model/ActionModel";
import { getDatabaseLocationModel, getLicenceModel, getSpecificationModel } from "@/services/model/DatabaseModel";
import { createDynamicModel } from "@/services/model/DynamicModel";
import { getUnitModel } from "@/services/model/LibUnitModel";
import { getUserLevelModel } from "@/services/model/LibUserLevelModel";
import { getUserRoleModel } from "@/services/model/LibUserRoleModel";
import { getValueTypeModel } from "@/services/model/LibValueTypeModel";
import { getSectorModel } from "@/services/model/SectorModel";

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
  } else if (slug == "changeactiontype") {
    dt = await getLibChangeActionTypeModel();
  } else if (slug == 'specification') {
    dt = await getSpecificationModel();
  } else if (slug == 'sector') {
    dt = await getSectorModel();
  } else if (slug == 'database-location') {
    dt = await getDatabaseLocationModel();
  } else if (slug == 'license') {
    dt = await getLicenceModel();
  }

  return NextResponse.json(dt);
}

export async function POST(request: Request, { params: { slug } }: Props) {
  const body = await request.json();
  const result = await createDynamicModel(slug, body);
  return NextResponse.json(result);
}
