import prisma from "@/utils/prisma";

export const getNotifCount = async () => {
  try {
    const count = await prisma.md_notif.count({})
    
    return { count };
  } catch (error) {
    console.error("Error in getNotifCount:", error);
    throw new Error("Failed to fetch getNotifCount");
  }
};