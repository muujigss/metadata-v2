import prisma from "@/utils/prisma";

const getSectorModel = async () => {
  try {
    const sector = await prisma.lib_sector.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        img_url: true,
        feature: true,
        databases: {
          select: {
            id: true,
            name: true,
            table_count: true,
          },
        },
      },
    });
    return sector;
  } catch (error) {
    console.error("Error in getSectorModel:", error);
    throw new Error("Failed to fetch forms");
  }
};
const getSectorByIdModel = async (id: number) => {
  try {
    const sector = await prisma.lib_sector.findUnique({
      select: {
        id: true,
        code: true,
        name: true,
        img_url: true,
        feature: true,
        databases: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id: id,
      },
    });
    return sector;
  } catch (error) {
    console.error("Error in getSectorByIdModel:", error);
    throw new Error("Failed to fetch forms");
  }
};
export { getSectorModel, getSectorByIdModel };
