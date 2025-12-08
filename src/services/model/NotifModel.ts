import prisma from "@/utils/prisma";
import moment from "moment";

export const getNotifCount = async (user_id: number, user_level: number) => {
  try {
    const filter = { is_view_admin: false }
    if (Number(user_level) !== 1 && user_id) {
      filter.created_user = Number(user_id)
    }
    const count = await prisma.md_notif.count({
      where: filter
    })
    
    return { count };
  } catch (error) {
    console.error("Error in getNotifCount:", error);
    throw new Error("Failed to fetch getNotifCount");
  }
};

export const getNotif = async (user_id: number) => {
  try {
    const mdUser = await prisma.md_users.findUnique({
      where: {
        id: user_id,
      },
    })
    const filter = {}
    if (mdUser && mdUser?.user_level !== 1) {
      filter.created_user = mdUser.id
    }
    const data = await prisma.md_notif.findMany({
      where: filter,
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        database_id: true,
        org_id: true,
        action_id: true,
        type: true,
        text: true,
        description: true,
        icon: true,
        is_view_admin: true,
        is_view_user: true,

        created_date: true,
        created_user: true,
        updated_date: true,
        updated_user: true,
        database: {
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
    })
    
    return data;
  } catch (error) {
    console.error("Error in getNotifCount:", error);
    throw new Error("Failed to fetch getNotifCount");
  }
};

export const updateNotif = async (id: number, user_id: number) => {
  try {
    const now = new Date();
    const updated_date = moment(now).format("YYYY-MM-DDTHH:mm:ssZ");
    const data = await prisma.md_notif.update({
      where: {
        id: id,
      },
      data: {
        is_view_admin: true,
        updated_user: user_id,
        updated_date: updated_date,
      },
    });
    return data;
  } catch (error) {
    console.error("Error in getNotifCount:", error);
    throw new Error("Failed to fetch getNotifCount");
  }
};