import prisma from "@/utils/prisma";

export const getLogModel = async (type: number = 1, page: number = 1, limit: number = 10) => {
  try {
    console.log('-----getLogModel-----', type)
    const skip = (page - 1) * limit;
    let data: any = [];
    let total = 0;
    if (type === 1) {
      data = await prisma.log_database.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
          type: true,
          db_id: true,
          org_id: true,
          name: true,
          description: true,
          spec: true,
          spec_other: true,

          db_type: true,
          db_type_other: true,
          sector: true,
          sector_other: true,
          db_location: true,
          db_location_other: true,
          licence_type: true,
          licence_type_other: true,
          opendata_url: true,
          table_count: true,
          start_date: true,
          is_form: true,
          is_integrated: true,
          integrated: true,
          integrated_other: true,
          version: true,

          is_active: true,
          createdDate: true,
          updatedDate: true,
          createdUser: true,
          updatedUser: true,
          md_organization: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              is_active: true,
            },
          },
          md_database: {
            select: {
              id: true,
              name: true,
              is_active: true,
            },
          },
          ld_created_user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              org_id: true,
              department: true,
              position: true,
              is_active: true,
            },
          },
        },
      });
      total = await prisma.log_database.count();
    } else if (type === 2) {
      data = await prisma.log_user_database.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
          type: true,
          ud_id: true,
          database_id: true,
          created_date: true,
          updated_date: true,
          database: {
            select: {
              id: true,
              name: true,
              is_active: true,
            },
          },
          lud_created_user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              org_id: true,
              department: true,
              position: true,
              is_active: true,
              organization: {
                select: {
                  id: true,
                  name: true,
                  is_active: true,
                },
              },
            },
          },
        },
      });
      total = await prisma.log_table.count();
    }
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error in getLogModel:", error);
    throw new Error("Failed to fetch forms");
  }
};
