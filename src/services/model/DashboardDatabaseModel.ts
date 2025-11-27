import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";

const getMainIndicatorsModel = async () => {
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const orgId = cookieStore.get("org_id")?.value;
  try {
    const userLevel = await prisma.md_users.findUnique({
      where: {
        id: Number(user_id),
      },
      select: {
        user_level: true,
      },
    });

    if (userLevel?.user_level == 3 || userLevel?.user_level == 2) {
      const databases = await prisma.md_database.count({
        where: {
          org_id: Number(orgId),
        },
      });
      const forms = await prisma.md_form.count({
        where: {
          database: {
            org_id: Number(orgId),
          },
        },
      });

      const tables = await prisma.md_table.count({
        where: {
          database: {
            org_id: Number(orgId),
          },
        },
      });

      const indicators = await prisma.md_indicator?.count({
        where: {
          table: {
            database: {
              org_id: Number(orgId),
            },
          },
        },
      });
      const classifications = await prisma.md_classification?.count({
        where: {
          indicators: {
            some: {
              indicator: {
                is_classification: true,
                table: {
                  database: {
                    org_id: Number(orgId),
                  },
                },
              },
            },
          },
        },
      });
      return {
        databases,
        forms,
        tables,
        indicators,
        classifications,
      };
    } else {
      const databases = await prisma.md_database.count({
        where: {
          is_active: true,
        },
      });
      const forms = await prisma.md_form.count({
        where: {
          is_active: true,
          database: {
            is_active: true,
            actions: {
              action_type: 3,
            },
          },
        },
      });

      const tables = await prisma.md_table.count({
        where: {
          is_active: true,
          database: {
            is_active: true,
            actions: {
              action_type: 3,
            },
          },
        },
      });

      const indicators = await prisma.md_indicator?.count({
        where: {
          is_active: true,
          table: {
            is_active: true,
            database: {
              is_active: true,
              actions: {
                action_type: 3,
              },
            },
          },
        },
      });
      const classifications = await prisma.md_classification?.count({
        where: {
          is_active: true,
          indicators: {
            some: {
              indicator: {
                is_classification: true,
                table: {
                  is_active: true,
                  database: {
                    is_active: true,
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
      return {
        databases,
        forms,
        tables,
        indicators,
        classifications,
      };
    }
  } catch (error) {
    console.error("Error in getMainIndicatorsModel:", error);
    throw new Error("Failed to fetch forms");
  }
};

const getDashboardDatabaseModel = async () => {
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const orgId = cookieStore.get("org_id")?.value;

  const orgName = await prisma.md_organization.findUnique({
    where: {
      id: Number(orgId),
    },
    select: {
      org_short_name: true,
    },
  });
  const userLevel = await prisma.md_users.findUnique({
    where: {
      id: Number(user_id),
    },
    select: {
      user_level: true,
    },
  });

  let queryDbType = "";
  let dbLocationType = "";
  let licenceType = "";
  let frenquencyType = "";
  let indicatoTreeData = "";
  let dbTblType = "";
  let dbStartDate = "";
  if (userLevel?.user_level == 3 || userLevel?.user_level == 2) {
    queryDbType = `Select * From (
      SELECT b.id, b.name,  cast(count(a.id) as int)as data_count FROM (
      SELECT a.id, a.org_id, name, sector, db_type from public.md_database a
        WHERE 1 = 1 and a.org_id = ${orgId}
      GROUP BY a.id, a.org_id, name, sector, db_type
      ) A  RIGHT JOIN lib_db_type b on b.id = a.db_type
      GROUP BY  b.id, b.name
      ORDER BY b.name
    ) as a 
    WHERE a. data_count > 0`;
    dbLocationType = `Select * From (
        SELECT b.id, b.name,  cast(count(a.id) as int)as data_count FROM (
        SELECT a.id, a.org_id, name, sector, db_location 
          from public.md_database a
          WHERE 1 = 1 and a.org_id = ${orgId}
          GROUP BY a.id, a.org_id, name, sector, db_location
        ) A  RIGHT JOIN lib_db_location b on b.id = a.db_location
        GROUP BY  b.id, b.name
        ORDER BY b.name
      ) as a 
      WHERE a. data_count > 0`;
    licenceType = `Select * From (
      SELECT b.id, b.name,  cast(count(a.id) as int)as data_count FROM (
          SELECT id, org_id, name, sector, licence_type from public.md_database a
          WHERE 1 = 1 and a.org_id = ${orgId}
        ) A  RIGHT JOIN lib_licence_type b on b.id = a.licence_type
        GROUP BY  b.id, b.name
        ORDER BY b.name
      ) as a 
      WHERE a. data_count > 0`;
    frenquencyType = `Select * From (
      SELECT i.frequency_id as id, f.name, cast(count(i.id) as int) as data_count
      FROM public.md_indicator as i
      INNER JOIN (
        SELECT a.id as tb_id, a.org_id, b.id 
        from public.md_database a
        inner join md_table b on a.id = b.db_id
        WHERE 1 = 1 and a.org_id = ${orgId}
      ) as t on i.tbl_id = t.id
      inner join lib_frequency as f on f.id = frequency_id
      GROUP BY i.frequency_id, f.name
      ORDER BY f.name
    ) as a
    WHERE a. data_count > 0`;
    indicatoTreeData = `Select * 
      From (
        SELECT i.code as id, i.name, t.name as tbl_name, d.name as db_name,
          cast(count(i.id) as int) as data_count 
        FROM public.md_indicator as i
        inner join md_table as t on t.id = i.tbl_id
        inner join md_database as d on t.db_id = d.id
        GROUP BY i.code, i.name, t.name, d.name 
        )as a 
      WHERE a.data_count > 2
      Order by data_count desc`;
    dbTblType = `SELECT a.id,a.name, t.id as tbl_id, t.name as tbl_name, i.id as indicator_id, i.name as indicator_name,
    cast(count(i.id) as int) as data_count
    from public.md_database a 
    inner join md_table as t on a.id = t.db_id	
    inner join md_indicator as i on t.id = i.tbl_id
    WHERE 1 = 1 and a.org_id = ${orgId}
    GROUP BY a.id,a.name, t.id, t.name, i.id, i.name`;

    dbStartDate = `SELECT a.start_date as name, cast(count(a.id) as int)as data_count 
    from public.md_database a
    WHERE 1 = 1 and a.is_active = true
    GROUP BY start_date
    ORDER BY start_date`;
  } else {
    queryDbType = `Select * From (
      SELECT b.id, b.name,  cast(count(a.id) as int)as data_count FROM (
      SELECT a.id, a.org_id, name, sector, db_type from public.md_database a
        WHERE 1 = 1 and a.is_active = true
      GROUP BY a.id, a.org_id, name, sector, db_type
      ) A  RIGHT JOIN lib_db_type b on b.id = a.db_type
      GROUP BY  b.id, b.name
      ORDER BY b.name
    ) as a 
    WHERE a. data_count > 0`;
    dbLocationType = `Select * From (
        SELECT b.id, b.name,  cast(count(a.id) as int)as data_count FROM (
        SELECT a.id, a.org_id, name, sector, db_location 
          from public.md_database a
          WHERE 1 = 1 and a.is_active = true
          GROUP BY a.id, a.org_id, name, sector, db_location
        ) A  RIGHT JOIN lib_db_location b on b.id = a.db_location
        GROUP BY  b.id, b.name
        ORDER BY b.name
      ) as a 
      WHERE a. data_count > 0`;
    frenquencyType = `Select * From (
        SELECT i.frequency_id as id, f.name, cast(count(i.id) as int) as data_count
        FROM public.md_indicator as i
        INNER JOIN (
          SELECT a.id as tb_id, a.org_id, b.id 
          from public.md_database a
          inner join md_table b on a.id = b.db_id
          WHERE 1 = 1 and a.is_active = true
        ) as t on i.tbl_id = t.id
        inner join lib_frequency as f on f.id = frequency_id
        GROUP BY i.frequency_id, f.name
        ORDER BY f.name
      ) as a
      WHERE a. data_count > 0`;
    dbTblType = `SELECT o.id as org_id, o.name as org_name, a.id as db_id, a.name as db_name, 
      t.id as tbl_id, t.name as tbl_name, i.id as indicator_id, i.name as indicator_name
    from public.md_database a 
    inner join md_organization as o on a.org_id = o.id
    inner join md_table as t on a.id = t.db_id
    inner join md_indicator as i on t.id = i.tbl_id 
    WHERE 1 = 1 and a.is_active = true and t.is_active = true and i.is_active
    GROUP BY o.id, o.name, a.id, a.name, t.id, t.name, i.id, i.name
    order by o.id, a.id, t.id, i.id `;
  }

  try {
    const dataByDbType = await prisma.$queryRaw`${Prisma.raw(queryDbType)}`;

    const dbLocation = await prisma.$queryRaw`${Prisma.raw(dbLocationType)}`;

    const dbLicence = await prisma.$queryRaw`${Prisma.raw(licenceType)}`;

    const dbFrequency = await prisma.$queryRaw`${Prisma.raw(frenquencyType)}`;

    const dbIndicator = await prisma.$queryRaw`${Prisma.raw(indicatoTreeData)}`;

    const dbTable = await prisma.$queryRaw`${Prisma.raw(dbTblType)}`;

    const dbDate = await prisma.$queryRaw`${Prisma.raw(dbStartDate)}`;
    return {
      dataByDbType,
      dbLocation,
      dbLicence,
      dbFrequency,
      dbIndicator,
      dbTable,
      orgName,
      dbDate,
      userLevel,
    };
  } catch (error) {
    console.error("Error getDashboardDatabaseModel:", error);
    throw new Error("Failed to fetch indicator");
  }
};

const getAlldata = async () => {
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const orgId = cookieStore.get("org_id")?.value;
  const userLevel = await prisma.md_users.findUnique({
    where: {
      id: Number(user_id),
    },
    select: {
      user_level: true,
    },
  });
  try {
    let allDataType = `SELECT o.id as org_id, o.name as org_name, a.id as db_id, a.name as db_name, 
      t.id as tbl_id, t.name as tbl_name, i.id as indicator_id, i.name as indicator_name
    from public.md_database a 
    inner join md_organization as o on a.org_id = o.id
    inner join md_table as t on a.id = t.db_id
    inner join md_indicator as i on t.id = i.tbl_id 
    WHERE 1 = 1 and a.is_active = true and t.is_active = true 
    GROUP BY o.id, o.name, a.id, a.name, t.id, t.name, i.id, i.name
    order by o.id, a.id, t.id, i.id `;
    let allOrgType;
    if (userLevel?.user_level == 1) {
      allOrgType = `SELECT o.id as org_id, o.name as org_name, a.id as db_id, a.name as db_name
      from public.md_database a 
      inner join md_organization as o on a.org_id = o.id
      WHERE 1 = 1 and a.is_active = true
      GROUP BY o.id, o.name, a.id, a.name
      order by o.id,  a.id`;
    } else {
      allOrgType = `SELECT o.id as org_id, o.name as org_name, a.id as db_id, a.name as db_name
      from public.md_database a 
      inner join md_organization as o on a.org_id = o.id
      WHERE 1 = 1 and a.is_active = true and o.id = ${orgId}
      GROUP BY o.id, o.name, a.id, a.name
      order by o.id,  a.id`;
    }
    const allOrg = await prisma.$queryRaw`${Prisma.raw(allOrgType)}`;
    return { allDataType, allOrg };
  } catch (error) {
    console.error("Error getAlldata:", error);
    throw new Error("Failed to fetch indicator");
  }
};
const getDashboardDatabaseType = async (org_id: number) => {
  try {
    const data = await prisma.md_database.groupBy({
      by: ["db_type"],
      _count: {
        id: true,
      },
      where: {
        org_id: org_id,
      },
    });

    return data;
  } catch (error) {
    console.error("Error in getDashboardDatabaseType:", error);
    throw new Error("Failed to fetch forms");
  }
};

const getAllOrgs = async () => {
  try {
    let allDataType = `SELECT o.id as org_id, o.name as org_name, a.id as db_id, a.name as db_name, 
      t.id as tbl_id, t.name as tbl_name, i.id as indicator_id, i.name as indicator_name
    from public.md_database a 
    inner join md_organization as o on a.org_id = o.id
    inner join md_table as t on a.id = t.db_id
    inner join md_indicator as i on t.id = i.tbl_id 
    WHERE 1 = 1 and a.is_active = true and t.is_active = true and i.is_active = true
    GROUP BY o.id, o.name, a.id, a.name, t.id, t.name, i.id, i.name
    order by o.id, a.id, t.id, i.id `;
    let allOrgType = `SELECT o.id as org_id, o.name as org_name, a.id as db_id, a.name as db_name
    from public.md_database a 
    inner join md_organization as o on a.org_id = o.id
    WHERE 1 = 1 and a.is_active = true
    GROUP BY o.id, o.name, a.id, a.name
    order by o.id,  a.id`;
    const allOrgDatabase = await prisma.$queryRaw`${Prisma.raw(allDataType)}`;
    const allOrg = await prisma.$queryRaw`${Prisma.raw(allOrgType)}`;
    return { allOrgDatabase, allOrg };
  } catch (error: any) {
    console.error("Error in getAllOrgs:", error);
    throw new Error(`Failed to fetch forms: ${error.message}`);
  }
};
export {
  getDashboardDatabaseModel,
  getDashboardDatabaseType,
  getMainIndicatorsModel,
  getAlldata,
  getAllOrgs,
};
