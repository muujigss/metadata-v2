import { IIndicatorClassification } from "@/interfaces/IIndicatorsClassifications";
import prisma from "@/utils/prisma";

export const insertIndicatorClassificationModel = async (
  data: IIndicatorClassification
) => {
  const { indicator_id, classification_id, created_user } = data;
  const now = new Date();
  const created_date = now.toISOString();
  const updated_date = now.toISOString();
  try {
    const ic = await prisma.md_indicator_classification.create({
      data: {
        indicator_id,
        classification_id,
        created_date,
        created_user: Number(created_user),
        updated_date,
      },
    });
    const iic = await prisma.log_indicator_classification.create({
      data: {
        indicator_classification_id: ic.id,
        type: "CREATE",
        indicator_id: ic.indicator_id,
        classification_id: ic.classification_id,
        version: ic.version,
        created_date: ic.created_date,
        created_user: ic.created_user,
        updated_date: ic.updated_date,
        updated_user: ic.updated_user,
      },
    });
    return ic;
  } catch (error) {
    console.error("Error in insertIndicatorClassificationModel:", error);
    throw new Error("Failed to insertIndicatorClassificationModel");
  }
};
