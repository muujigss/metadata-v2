import { getIndicatorsModel } from "@/services/model/IndicatorModel";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const pageNumber = Number(url.searchParams.get("page")) || 1;

  if (pageNumber <= 0) {
    throw new Error("page дугаар оруулна уу / error");
  }
  const take = 15;
  const skip = (pageNumber - 1) * take;

  const dt = await getIndicatorsModel(+skip, take, pageNumber, {
    // indicator_name: "тоо",
    // orgId: "1",
    sectorId: "s5",
  });

  return NextResponse.json(dt);
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const pageNumber = Number(url.searchParams.get("page")) || 1;

  if (pageNumber <= 0) {
    throw new Error("page дугаар оруулна уу / error");
  }
  const take = 15;
  const skip = (pageNumber - 1) * take;

  const dt = await getIndicatorsModel(+skip, take, pageNumber, {
    // indicator_name: "тоо",
    // orgId: "1",
    sectorId: "s5",
  });

  return NextResponse.json(dt);
}

// export async function POST(request: NextRequest) {
//   const body = await request.json();

//   const url = new URL(request.url);
//   const pageNumber = Number(url.searchParams.get("page")) || 1;

//   if (pageNumber <= 0) {
//     throw new Error("page дугаар оруулна уу / error");
//   }
//   const take = 15;
//   const skip = (pageNumber - 1) * take;

//   const dt = await getIndicatorsModel(+skip, take, pageNumber, {
//     indicator_name: "мал",
//   });

//   return NextResponse.json(dt);
// }
