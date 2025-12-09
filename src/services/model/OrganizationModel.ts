import prisma from "@/utils/prisma";

/**
 * @from:        src/app/api/organization
 * @params:      -
 * @return:      Array
 * @description: Идэвхтэй болон зөвшөөрөгдсэн байгууллагуудын жагсаалт авах
 */
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
        type: true,
        databases: {
          select: {
            id: true,
            name: true,
            is_active: true,
            is_form: true,
          },
        },
      } as any,
      where: {
        OR: [
          { is_active: true },
          { type: "approved" }
        ]
      } as any,
    });
    return organizations;
  } catch (error) {
    console.error("Error in getOrganizationModel:", error);
    throw new Error("Failed to fetch forms");
  }
};

/**
 * @from:        src/app/api/organization/[id]
 * @params:      id
 * @return:      Object
 * @description: Байгууллагын мэдээллийг ID-гаар авах
 */
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
/**
 * @from:        src/app/api/organization/create
 * @params:      data
 * @return:      Object
 * @description: Шинэ байгууллага үүсгэх
 */
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
/**
 * @from:        src/app/api/organization/role-count/[id]
 * @params:      org_id
 * @return:      Array
 * @description: Байгууллагын хэрэглэгчдийн тоог үүргээр нь авах
 */
export const getOrgRoleCount = async (org_id: number) => {
  try {
    const result = await prisma.$queryRaw<{
      org_id: number;
      user_level: string;
      user_count: bigint;
    }[]>`
      SELECT org_id, user_level, COUNT(*) AS user_count
      FROM md_users
      WHERE org_id = ${org_id} AND is_active = true
      GROUP BY org_id, user_level;
    `;

    const data = result.map(row => ({
      ...row,
      user_count: Number(row.user_count),
    }));
    
    return data;
  } catch (error) {
    console.error("Error in getOrgRoleCount:", error);
    throw new Error("Failed to fetch getOrgRoleCount");
  }
};
