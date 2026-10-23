"use server";
import { cookies } from "next/headers";

const createFileService = async (data: any) => {
  const res = await fetch(`${process.env.BASE_URL}/api/upload`, {
    method: "POST",
    headers: { Cookie: (await cookies()).toString() },
    body: data,
  });

  if (!res.ok) {
    throw new Error("Failed to file upload");
  }

  return res.json();
};

export {
  createFileService,
};
