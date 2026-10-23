"use server";
import { sendMail as sendSmtpMail, type MailMessage } from "@/utils/sendMail";
import { getAuthenticatedUser } from "@/utils/session";

export async function sendMail(data: MailMessage) {
  const actor = await getAuthenticatedUser();
  if (!actor || actor.user_level !== 1) throw new Error("Forbidden");
  return sendSmtpMail(data);
}
