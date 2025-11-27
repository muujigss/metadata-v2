import prisma from "@/utils/prisma";

const getSourcesModel = async () => {
  try {
    const sources = await prisma.lib_source.findMany();
    return sources;
  } catch (error) {
    console.error("Error in getSourcesModel:", error);
    throw new Error("Failed to fetch forms");
  }
};
export { getSourcesModel };
