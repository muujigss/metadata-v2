import prisma from "@/utils/prisma";

export const getValueTypeModel = async () => {
  try {
    const data = await prisma.lib_value_type.findMany({
      select: { id: true, code: true, name: true },
    });
    return data;
  } catch (error) {
    console.error("Error in getValueTypeModel:", error);
    throw new Error("Failed to fetch forms");
  }
};
