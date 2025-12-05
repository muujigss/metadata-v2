export const mailTemplateOrgNew = (toMail: string, org_name: string, firstname: string, lastname: string) => {
  return {
    to: toMail,
    subject: "Төрөлжсөн бүртгэлийн нэгдсэн сан - Байгууллагын хүсэлт баталгаажлаа",
    html: `
      <div style="
        width: 100%;
        background: #f9f9f9;
        padding: 20px 0;
        font-family: Arial, sans-serif;
        color: #333;
      ">
      <div style="
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 8px;
        padding: 25px;
        border: 1px solid #e6e6e6;
        text-align: left;
      ">
        <h2 style="color: #1976d2; font-size: 20px; margin-top: 0; margin-bottom: 15px;">
          Төрөлжсөн бүртгэлийн нэгдсэн сан
        </h2>

        <p style="font-size: 15px; line-height: 1.6; margin: 10px 0;">
          <b>${lastname}</b> овогтой <b>${firstname}</b> таны хүсэлтийг хүлээн авлаа.
        </p>

        <div style="
            background: #f1f7ff;
            border-left: 4px solid #1976d2;
            padding: 12px 18px;
            font-size: 15px;
            margin: 20px 0;
            border-radius: 5px;
          ">
          <p style="margin: 0;">
            <b>${org_name}</b> байгууллагын хүсэлт 
            <span style="color: #1976d2;">амжилттай баталгаажлаа.</span>
          </p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; margin: 10px 0;">
          Та байгууллагын хүсэлт баталгаажуулах хүртэл түр хүлээнэ үү.
        </p>

        <p style="font-size: 13px; color: #777; margin-top: 30px;">
          Хүндэтгэсэн,<br/>
          <b>Төрөлжсөн бүртгэлийн нэгдсэн сан</b>
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

        <p style="font-size: 12px; color: #999; margin: 0;">
          Энэ имэйлд хариу бичих шаардлагагүй. Системээс автоматаар илгээгдсэн болно.
        </p>
      </div>
    </div>
    `
  }
};