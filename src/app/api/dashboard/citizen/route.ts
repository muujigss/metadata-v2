import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build date filters
    // Note: md_database uses createdDate, others use created_date
    const dateFilterStandard: any = {};
    const dateFilterCamel: any = {};

    if (startDate) {
      dateFilterStandard.gte = new Date(startDate);
      dateFilterCamel.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilterStandard.lte = new Date(endDate);
      dateFilterCamel.lte = new Date(endDate);
    }

    const whereClauseStandard = {
      is_active: true,
      ...(Object.keys(dateFilterStandard).length > 0 && { created_date: dateFilterStandard }),
    };

    const whereClauseCamel = {
      is_active: true,
      ...(Object.keys(dateFilterCamel).length > 0 && { createdDate: dateFilterCamel }),
    };

    // 1. Summary Counts
    const [orgCount, dbCount, tableCount, indicatorCount] = await Promise.all([
      prisma.md_organization.count({ where: whereClauseStandard }),
      prisma.md_database.count({ where: whereClauseCamel }),
      prisma.md_table.count({ where: whereClauseStandard }),
      prisma.md_indicator.count({ where: whereClauseStandard }),
    ]);

    // 2. Databases by Sector (Pie Chart)
    const dbBySector = await prisma.md_database.groupBy({
      by: ["sector"],
      where: whereClauseCamel,
      _count: {
        id: true,
      },
    });

    const sectorIds = dbBySector.map((item) => item.sector).filter((id): id is number => id !== null);
    const sectors = await prisma.lib_sector.findMany({
      where: { id: { in: sectorIds } },
      select: { id: true, name: true },
    });

    const sectorData = dbBySector.map((item) => ({
      name:
        sectors.find((s) => s.id === item.sector)?.name ||
        "Тодорхойгүй",
      value: item._count.id,
    }));

    // 3. Top Organizations (Bar Chart)
    const dbByOrg = await prisma.md_database.groupBy({
      by: ["org_id"],
      where: whereClauseCamel,
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10,
    });

    const orgIds = dbByOrg.map((item) => item.org_id);
    const organizations = await prisma.md_organization.findMany({
      where: { id: { in: orgIds } },
      select: { id: true, name: true },
    });

    const topOrgsData = dbByOrg.map((item) => ({
      name:
        organizations.find((o) => o.id === item.org_id)?.name ||
        "Unknown",
      value: item._count.id,
    }));

    // 4. Growth Trend (Line Chart)
    const trendDatabases = await prisma.md_database.findMany({
        where: whereClauseCamel,
        select: { createdDate: true }
    });

    const trendIndicators = await prisma.md_indicator.findMany({
        where: whereClauseStandard,
        select: { created_date: true }
    });

    const groupByMonth = (dates: any[], dateField: string) => {
        const counts: {[key: string]: number} = {};
        dates.forEach(d => {
            const dateVal = d[dateField];
            if(dateVal) {
                const month = new Date(dateVal).toISOString().slice(0, 7); // YYYY-MM
                counts[month] = (counts[month] || 0) + 1;
            }
        });
        return counts;
    };

    const dbTrend = groupByMonth(trendDatabases, 'createdDate');
    const indTrend = groupByMonth(trendIndicators, 'created_date');

    // Merge keys and sort
    const allMonths = Array.from(new Set([...Object.keys(dbTrend), ...Object.keys(indTrend)])).sort();
    
    const trendData = allMonths.map(month => ({
        month,
        databases: dbTrend[month] || 0,
        indicators: indTrend[month] || 0
    }));

    return NextResponse.json({
      counts: {
        organizations: orgCount,
        databases: dbCount,
        tables: tableCount,
        indicators: indicatorCount,
      },
      sectorData,
      topOrgsData,
      trendData,
    });
  } catch (error) {
    console.error("Citizen Dashboard API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
