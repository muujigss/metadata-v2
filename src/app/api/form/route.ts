import {
  getFormModel,
  getFormsByNameModel,
  getFormsModel,
} from "@/services/model/FormModel";
import { NextResponse } from "next/server";

export async function GET() {
  const dt = await getFormsByNameModel();

  return NextResponse.json(dt);
}
