import prisma from "@/utils/prisma";

export const getUnitModel = async () => {
  try {
    const data = await prisma.lib_unit.findMany({
      select: { id: true, code: true, name: true },
    });
    return data;
  } catch (error) {
    console.error("Error in getUnitModel:", error);
    throw new Error("Failed to fetch forms");
  }
};
