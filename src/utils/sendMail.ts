import "server-only";
import nodemailer from "nodemailer";

export interface MailMessage { to: string; subject: string; html: string }

export async function sendMail({ to, subject, html }: MailMessage) {
  if (typeof to !== "string" || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(to) ||
      typeof subject !== "string" || /[\r\n]/.test(subject) || subject.length > 200 ||
      typeof html !== "string" || html.length > 100_000) throw new Error("Invalid mail message");
  const host = process.env.EMAIL_HOST;
  const user = process.env.METADATA_INFO_EMAIL || process.env.EMAIL_HOST_USER;
  const pass = process.env.METADATA_INFO_PASSWORD || process.env.EMAIL_HOST_PASSWORD;
  if (!host || !user || !pass) throw new Error("SMTP is not configured");
  const port = Number(process.env.EMAIL_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host, port, secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
  });
  await transporter.sendMail({ from: `"Төрөлжсөн бүртгэлийн нэгдсэн сан" <${user}>`, to, subject, html });
  return { status: true, message: "Email sent successfully" };
}
