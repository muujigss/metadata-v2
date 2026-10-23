import type { Metadata } from "next";
import UserProvider from "@/components/providers/UserProvider";
import "@/app/styles/globals.css";

export const metadata: Metadata = {
  title: "Төрөлжсөн бүртгэлийн нэгдсэн сан",
  description: "Байгууллагын өгөгдлийн сан, хүснэгт, үзүүлэлт, ангилал болон маягтын мэдээлэл",
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn">
      <body><UserProvider>{children}</UserProvider></body>
    </html>
  );
}
