import prisma from "@/utils/prisma";

export const createDynamicModel = async (tblName: string, data: any) => {
    const {
      id,
      code,
      name,
    } = data;
    console.log('------tblName, data------', tblName, data)
  
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
            updated_user: null, // Number(user_id),
          },
        });
        return cl;
      } else {
        const cl = await model.create({
          data: {
            code,
            name,
            created_date: created_date,
            created_user: null, // Number(user_id),
          },
        });
        return cl;
      }
    } catch (error) {
      console.error("Error in createDynamicModel:", error);
      throw new Error("Failed to createDynamicModel");
    }
  };