import prisma from "@/utils/prisma";
import moment from "moment";

const getLibActionTypeModel = async () => {
  const lib_action = await prisma.lib_action_type.findMany();
  return lib_action;
};
const getActionsModel = async () => {
  try {
    const md_action = await prisma.md_action.findMany({
      where: {
        action_type: {
          in: [2],
        },
      },
      select: {
        id: true,
        item_id: true,
        item_type: true,
        action_type: true,
        user_id: true,
        created_date: true,
        updated_date: true,
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            department: true,
            position: true,
          },
        },
        databases: {
          select: {
            id: true,
            name: true,
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return md_action;
  } catch (error) {
    console.error("Error in getActionsModel:", error);
    throw new Error("Failed to getActionsModel");
  }
};

const updateActionsModel = async (
  db_id: number,
  action_type: number,
  user_id: number
) => {
  try {
    const now = new Date();
    const created_date = moment(now).format("YYYY-MM-DDTHH:mm:ssZ"); //now.toISOString();
    const updated_date = moment(now).format("YYYY-MM-DDTHH:mm:ssZ"); //now.toISOString();

    const md_action = await prisma.md_action.update({
      where: {
        item_id: db_id,
      },
      data: {
        action_type: action_type,
        updated_date,
        updated_user: user_id,
      },
    });

    const log_md_action = await prisma.log_action.create({
      data: {
        log_type: "UPDATE",
        action_id: md_action.id,
        user_id: md_action.user_id,
        action_type: md_action.action_type,
        item_id: md_action.item_id,
        item_type: md_action.item_type,
        updated_user: user_id,
        updated_date: created_date,
      },
    });
    return md_action;
  } catch (error) {
    console.error("Error in updateActions Model:", error);
    throw new Error("Failed to updateActions Model");
  }
};
export { getActionsModel, updateActionsModel, getLibActionTypeModel };
