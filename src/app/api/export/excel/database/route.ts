import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getDatabaseModelList } from "@/services/model/DatabaseModel";

export async function GET() {
    const data = await getDatabaseModelList();
  
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("database");
    sheet.addRow(["№", "Өгөгдлийн сангийн нэр", "Өгөгдлийн сангийн Тайлбар"]);
  
    data.forEach((u) => {
      sheet.addRow([u.id, u.name, u.description]);
    });
  
    const buffer = await workbook.xlsx.writeBuffer();

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const currentDate = `${yyyy}-${mm}-${dd}`;
    const filename = `database_${currentDate}.xlsx`;
  
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename=${filename}`,
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  }