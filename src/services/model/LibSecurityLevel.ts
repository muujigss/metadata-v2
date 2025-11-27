import prisma from "@/utils/prisma";

const getSecurityLevelsModel = async () => {
  try {
    const securityLevels = await prisma.lib_security_level.findMany();
    return securityLevels;
  } catch (error) {
    console.error("Error in getSecurityLevelsModel:", error);
    throw new Error("Failed to getSecurityLevelsModel");
  }
};
export { getSecurityLevelsModel };
