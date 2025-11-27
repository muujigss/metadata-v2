import { getSectorByIdModel } from "@/services/model/SectorModel"; //   getOrganizationByIdModel  from "@/services/model/OrganizationModel";
import { NextResponse } from "next/server";
type Props = {
  params: {
    id: number;
  };
};

export async function GET(request: Request, { params: { id } }: Props) {
  const idCheck = Number(id);

  const dt = await getSectorByIdModel(idCheck);
  return NextResponse.json(dt);
}
