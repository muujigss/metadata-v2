import prisma from "@/utils/prisma";
export const getMainIndicatorModel = async (is_active: boolean | undefined) => {
  try {
    const organizations = await prisma.md_organization?.count({
      where: {
        is_active
      },
    });

    const forms = await prisma.md_form?.count({
      where: {
        is_active,
        database: {
          is_active,
          actions: {
            action_type: 3,
          },
        },
      },
    });
    const tables = await prisma.md_table?.count({
      where: {
        is_active,
        database: {
          is_active,
          actions: {
            action_type: 3,
          },
        },
      },
    });
    const indicators = await prisma.md_indicator?.count({
      where: {
        is_active,
        table: {
          is_active,
          database: {
            is_active,
            actions: {
              action_type: 3,
            },
          },
        },
      },
    });
    const databases = await prisma.md_database?.count({
      where: {
        is_active: true,
        actions: {
          action_type: 3,
        },
      },
    });
    const classifications = await prisma.md_classification?.count({
      where: {
        is_active,
        indicators: {
          some: {
            indicator: {
              is_classification: true,
              is_active,
              table: {
                is_active,
                database: {
                  is_active,
                  actions: {
                    action_type: 3,
                  },
                },
              },
            },
          },
        },
      },
    });
    const sectors = await prisma.lib_sector?.count();

    const data = {
      organizations,
      forms,
      tables,
      indicators,
      databases,
      classifications,
      sectors,
    };
    return data;
  } catch (error) {
    console.error(`Error in getMainIndicatorModel:${error}`);
    throw new Error("Failed to fetch forms");
  }
};
