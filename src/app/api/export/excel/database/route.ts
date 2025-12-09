import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getDatabaseModelList } from "@/services/model/DatabaseModel";

export async function GET() {
    const data = await getDatabaseModelList();
  
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("database");
    sheet.addRow(["№", "Өгөгдлийн сангийн нэр", "Өгөгдлийн сангийн Тайлбар", "Төлөв", "Идэвхтэй эсэх"]);
  
    const txtActionType = {
      1: "Хүсэлт илгээх",
      2: "Хүлээгдэж буй",
      3: "Баталсан",
      4: "Буцаагдсан",
      5: "Өөрчлөлт хийх",
      6: "Ашиглалтаас гарах",
      7: "Өөрчлөх, гарах хүсэлт батлагдсан",
      8: "Өөрчлөх хүсэлт дуусгах",
      9: "Өөрчлөлт буцаагдсан",
      10: "Ашиглалтаас гарсан",
    }

    data.forEach((u) => {
      sheet.addRow([u.id, u.name, u.description, txtActionType[u.actions?.action_type] ? txtActionType[u.actions?.action_type] : '', u.is_active ? 'Тийм' : 'Үгүй']);
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