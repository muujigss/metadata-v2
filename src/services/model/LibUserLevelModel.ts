import prisma from "@/utils/prisma";

export const getUserLevelModel = async () => {
  try {
    const data = await prisma.lib_user_level.findMany({
      select: { id: true, code: true, name: true },
    });
    return data;
  } catch (error) {
    console.error("Error in getValueTypeModel:", error);
    throw new Error("Failed to fetch forms");
  }
};
