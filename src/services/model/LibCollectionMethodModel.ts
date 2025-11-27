import prisma from "@/utils/prisma";

const getCollectionMethodsModel = async () => {
  try {
    const collectionMethods = await prisma.lib_collection_method.findMany();
    return collectionMethods;
  } catch (error) {
    console.error("Error in getCollectionMethodsModel:", error);
    throw new Error("Failed to fetch forms");
  }
};
export { getCollectionMethodsModel };
