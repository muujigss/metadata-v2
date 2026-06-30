import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import prisma from "@/utils/prisma";

// Public /database хуудасны шүүлттэй excel export
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("query") || "";
  const orgId = searchParams.get("org") || "";
  const sectorId = searchParams.get("sector") || "";
  const dbType = searchParams.get("dbtype") || "";

  const whereObj = {
    AND: [
      { name: name ? { contains: name } : {} },
      { org_id: orgId ? Number(orgId) : {} },
      { sector: sectorId ? Number(sectorId) : {} },
      { db_type: dbType ? Number(dbType) : {} },
      { is_active: true, actions: { action_type: 3 } },
    ],
  };

  const data = await prisma.md_database.findMany({
    where: whereObj as any,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      organization: { select: { name: true } },
      databaseType: { select: { name: true } },
      start_date: true,
    },
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("database");
  sheet.addRow([
    "№",
    "Өгөгдлийн сангийн нэр",
    "Тайлбар",
    "Байгууллага",
    "Төрөл",
    "Эхэлсэн огноо",
  ]);

  data.forEach((u, i) => {
    sheet.addRow([
      i + 1,
      u.name,
      u.description,
      u.organization?.name ?? "",
      u.databaseType?.name ?? "",
      u.start_date ?? "",
    ]);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const today = new Date();
  const currentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Disposition": `attachment; filename=database_${currentDate}.xlsx`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}
