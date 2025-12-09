import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getOrganizationModel } from "@/services/model/OrganizationModel";

export async function GET() {
    const data = await getOrganizationModel();
  
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("organization");
    sheet.addRow(["№", "Байгууллагын нэр", "Товчилсон нэр", "И-мэйл хаяг", "Цахим хуудас", "Утасны дугаар"]);
  
    data.forEach((u) => {
      sheet.addRow([u.id, u.name, u.org_short_name, u.email, u.website, u.phone_number]);
    });
  
    const buffer = await workbook.xlsx.writeBuffer();

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const currentDate = `${yyyy}-${mm}-${dd}`;
    const filename = `organization_${currentDate}.xlsx`;
  
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename=${filename}`,
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  }