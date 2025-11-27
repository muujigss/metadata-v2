import { getSpecificationModel} from "@/services/model/DatabaseModel";
import { NextResponse } from "next/server";

export async function GET() {
  const dt = await getSpecificationModel();

  return NextResponse.json(dt);
}
