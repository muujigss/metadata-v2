import { getOrganizationByIdModel } from "@/services/model/OrganizationModel"; //   getOrganizationByIdModel  from "@/services/model/OrganizationModel";
import { NextResponse } from "next/server";
type Props = {
  params: {
    id: number;
  };
};

export async function GET(request: Request, { params: { id } }: Props) {
  const idCheck = Number(id);

  const dt = await getOrganizationByIdModel(idCheck);
  // console.log({ dt });

  return NextResponse.json(dt);
}
