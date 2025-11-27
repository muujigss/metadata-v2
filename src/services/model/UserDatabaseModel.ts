import { IIndicatorClassification } from "@/interfaces/IIndicatorsClassifications";
import { IUserDatabase } from "@/interfaces/IUserDatabase";
import prisma from "@/utils/prisma";

export const insertUserDatabaseModel = async (data: IUserDatabase) => {
  const { user_id, database_id } = data;
  const now = new Date();
  const created_date = now.toISOString();
  const updated_date = now.toISOString();
  try {
    const ic = await prisma.md_user_database.create({
      data: {
        user_id,
        database_id,
        created_date,
        updated_date,
      },
    });
    return ic;
  } catch (error) {
    console.error("Error in insertUserDatabaseModel:", error);
    throw new Error("Failed to insertUserDatabaseModel");
  }
};
