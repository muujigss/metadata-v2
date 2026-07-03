import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { to, subject, html } = await req.json();

  try {
    const host = process.env.EMAIL_HOST;
    const port = Number(process.env.EMAIL_PORT) || 587;
    const user = process.env.METADATA_INFO_EMAIL;
    const pass = process.env.METADATA_INFO_PASSWORD;

    // Mock sending if credentials are missing
    if (!host || !user || !pass) {
      console.log("---------------------------------------------------");
      console.log("MOCK EMAIL SENDING (Missing Config)");
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log("Body:", html);
      console.log("---------------------------------------------------");
      return NextResponse.json({
        status: true,
        message: "Mock email sent successfully!",
      });
    }

    // Configure the transporter
    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: port === 465, // Use true for port 465, false for others
      auth: {
        user: user,
        pass: pass,
      },
      // SMTP гацахаас сэргийлэх timeout-ууд
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    // Send the email
    const info = await transporter.sendMail({
      from: `"Төрөлжсөн бүртгэлийн нэгдсэн сан" <${user}>`, // Sender address
      to, // Recipient address
      subject, // Subject line
      html, // HTML body
    });

    return NextResponse.json({
      status: true,
      message: "Email sent successfully!",
      info,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: false,
      message: "Email failed to send.",
      error,
    });
  }
}
