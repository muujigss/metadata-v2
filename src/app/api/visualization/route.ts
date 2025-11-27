import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET() {
  try {
    // 1. Overview Counts
    const orgCount = await prisma.md_organization.count({
      where: { is_active: true },
    });
    const dbCount = await prisma.md_database.count({
      where: { is_active: true },
    });
    const formCount = await prisma.md_form.count({
      where: { is_active: true },
    });
    const indicatorCount = await prisma.md_indicator.count({
      where: { is_active: true },
    });

    // 2. Databases by Sector
    const dbBySectorRaw = await prisma.md_database.groupBy({
      by: ["sector"],
      _count: {
        id: true,
      },
      where: { is_active: true },
    });

    // Fetch sector names
    const sectors = await prisma.lib_sector.findMany();
    const dbBySector = dbBySectorRaw.map((item) => {
      const sector = sectors.find((s) => s.id === item.sector);
      return {
        name: sector?.name || "Тодорхойгүй",
        value: item._count.id,
      };
    }).filter(item => item.value > 0);

    // 3. Databases by Organization (Top 10)
    const dbByOrgRaw = await prisma.md_database.groupBy({
      by: ["org_id"],
      _count: {
        id: true,
      },
      where: { is_active: true },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10,
    });

    // Fetch org names
    const orgs = await prisma.md_organization.findMany({
      where: {
        id: {
          in: dbByOrgRaw.map((o) => o.org_id),
        },
      },
    });

    const dbByOrg = dbByOrgRaw.map((item) => {
      const org = orgs.find((o) => o.id === item.org_id);
      return {
        name: org?.name || "Тодорхойгүй",
        value: item._count.id,
      };
    });

    // 4. Databases by Type
    const dbByTypeRaw = await prisma.md_database.groupBy({
      by: ["db_type"],
      _count: {
        id: true,
      },
      where: { is_active: true },
    });

    // Fetch types
    const types = await prisma.lib_db_type.findMany();
    const dbByType = dbByTypeRaw.map((item) => {
      const type = types.find((t) => t.id === item.db_type);
      return {
        name: type?.name || "Тодорхойгүй",
        value: item._count.id,
      };
    });

    return NextResponse.json({
      counts: {
        orgCount,
        dbCount,
        formCount,
        indicatorCount,
      },
      charts: {
        dbBySector,
        dbByOrg,
        dbByType,
      },
    });
  } catch (error) {
    console.error("Visualization API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
