import prisma from "@/utils/prisma";
import { getAuthenticatedUser } from "@/utils/session";

export const createDynamicModel = async (tblName: string, data: any) => {
    const actor = await getAuthenticatedUser();
    if (!actor || actor.user_level !== 1) throw new Error("Forbidden");
    const allowedModels = ["lib_specification", "lib_sector", "lib_db_location", "lib_licence_type"];
    if (!allowedModels.includes(tblName)) throw new Error("Invalid reference table");
    const {
      id,
      code,
      name,
    } = data;
  
    const now = new Date();
    const created_date = now.toISOString();
    const updated_date = now.toISOString();
    try {
      const model = (prisma as any)[tblName];
      if (!model) {
        throw new Error("Failed to createDynamicModel -> Model can't be null.");
      }

      if (id) {
        const cl = await model.update({
          where: {
            id,
          },
          data: {
            code,
            name,
            updated_date: updated_date,
            updated_user: actor.id,
          },
        });
        return cl;
      } else {
        const cl = await model.create({
          data: {
            code,
            name,
            created_date: created_date,
            created_user: actor.id,
          },
        });
        return cl;
      }
    } catch (error) {
      console.error("Error in createDynamicModel:", error);
      throw new Error("Failed to createDynamicModel");
    }
  };
