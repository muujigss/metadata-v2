import prisma from "@/utils/prisma";

const getFrequenciesModel = async () => {
  try {
    const frequencies = await prisma.lib_frequency.findMany();
    return frequencies;
  } catch (error) {
    console.error("Error in getFrequenciesModel:", error);
    throw new Error("Failed to fetch forms");
  }
};
export { getFrequenciesModel };
