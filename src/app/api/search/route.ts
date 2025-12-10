import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({
      databases: [],
      tables: [],
      indicators: [],
      classifications: [],
      forms: [],
    });
  }

  try {
    const [databases, tables, indicators, classifications, forms] =
      await Promise.all([
        prisma.md_database.findMany({
          where: {
            is_active: true,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          select: { id: true, name: true, description: true },
          take: 5,
        }),
        prisma.md_table.findMany({
          where: {
            is_active: true,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { code: { contains: query, mode: "insensitive" } },
            ],
          },
          select: { id: true, name: true, description: true, code: true },
          take: 5,
        }),
        prisma.md_indicator.findMany({
          where: {
            is_active: true,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { code: { contains: query, mode: "insensitive" } },
            ],
          },
          select: { id: true, name: true, code: true },
          take: 5,
        }),
        prisma.md_classification.findMany({
          where: {
            is_active: true,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { code: { contains: query, mode: "insensitive" } },
            ],
          },
          select: { id: true, name: true, code: true },
          take: 5,
        }),
        prisma.md_form.findMany({
          where: {
            is_active: true,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { code: { contains: query, mode: "insensitive" } },
            ],
          },
          select: { id: true, name: true, code: true },
          take: 5,
        }),
      ]);

    return NextResponse.json({
      databases,
      tables,
      indicators,
      classifications,
      forms,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
