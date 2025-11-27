import prisma from "@/utils/prisma";

export const getOrganizationModel = async () => {
  try {
    const organizations = await prisma.md_organization.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        org_short_name: true,
        address: true,
        website: true,
        email: true,
        phone: true,
        img_url: true,
        is_active: true,
        databases: {
          select: {
            id: true,
            name: true,
            is_active: true,
            is_form: true,
          },
        },
      },
    });
    return organizations;
  } catch (error) {
    console.error("Error in getOrganizationModel:", error);
    throw new Error("Failed to fetch forms");
  }
};

export const getOrganizationByIdModel = async (id: number) => {
  try {
    const orgList = await prisma.md_organization.findUnique({
      select: {
        id: true,
        name: true,
        address: true,
        website: true,
        email: true,
        phone: true,
        img_url: true,
        is_active: true,
        databases: {
          select: {
            id: true,
            name: true,
            start_date: true,
            table_count: true,
            databaseType: true,
            organization: true,
            actions: true,
          },
        },
      },
      where: {
        id: id,
      },
    });

    return orgList;
  } catch (error) {
    console.error("Error in getOrganizationByIdModel:", error);
    throw new Error("Failed to fetch forms");
  }
};
export const createOrganizationModel = async (data: any) => {
  const {
    org_name,
    phone,
    email,
    address,
    img_url,
    enabled,
    org_short_name,
    website,
  } = data;

  const now = new Date();
  const created_date = now.toISOString();
  const updated_date = now.toISOString();

  try {
    const organization = await prisma.md_organization.create({
      data: {
        name: org_name,
        phone,
        email,
        img_url,
        address,
        is_active: enabled,
        website,
        org_short_name,
        created_date,
        updated_date,
      },
    });
    return organization;
  } catch (error) {
    console.error("Error in createOrganizationModel:", error);
    throw new Error("Failed to fetch forms");
  }
};
