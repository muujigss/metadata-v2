import prisma from "@/utils/prisma";

export const getDissimenationLevelModel = async () => {
  try {
    const data = await prisma.lib_dissimenation_level.findMany();
    return data;
  } catch (error) {
    console.error("Error in getDissimenationLevelModel:", error);
    throw new Error("Failed to fetch forms");
  }
};
