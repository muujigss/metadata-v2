import { IClassification } from "@/interfaces/IClassification";
import { IClassificationCode } from "@/interfaces/IClassificationCode";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";

export const getClassificationModel = async (
  page: number,
  take: number,
  pageNumber: number,
  filter: {
    name?: string;
    sectorId?: string;
    orgId?: string;
  }
) => {
  try {
    let whereObj = {};
    if (filter && Object.keys(filter).length > 0) {
      whereObj = {
        indicators: {
          some: {
            indicator: {
              is_classification: true,
            },
          },
        },

        name:
          filter.name !== "" && filter.name !== undefined
            ? {
                contains: filter.name,
              }
            : {},
        is_active: true,
        AND: [
          {
            indicators: {
              some: {
                indicator: {
                  table: {
                    database: {
                      org_id:
                        filter.orgId !== "" && filter.orgId !== undefined
                          ? Number(filter.orgId)
                          : {},
                    },
                  },
                },
              },
            },
          },
          {
            indicators: {
              some: {
                indicator: {
                  table: {
                    database: {
                      sector:
                        filter.sectorId !== "" && filter.sectorId !== undefined
                          ? Number(filter.sectorId)
                          : {},
                    },
                  },
                },
              },
            },
          },
        ],
      };
    }

    const [classifications, count] = await prisma.$transaction([
      prisma.md_classification.findMany({
        where: whereObj,
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          code: true,
          name: true,
          definition: true,
          confirmed_decree_date: true,
          confirmed_decree_name: true,
          confirmed_decree_num: true,
          confirmed_organization1: true,
          confirmed_organization2: true,
          confirmed_organization3: true,
          is_confirm: true,
          implemented_date: true,
          last_updated_date: true,
          // classificationCode: {
          //   select: {
          //     version_num: true,
          //   },
          // },
          indicators: {
            select: {
              indicator_id: true,
              indicator: {
                select: {
                  tbl_id: true,
                  table: {
                    select: {
                      database: {
                        select: {
                          id: true,
                          org_id: true,
                          sector: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        skip: page,
        take: take,
      }),
      prisma.md_classification.count({
        where: whereObj,
      }),
    ]);

    const data = {
      data: classifications,
      allresults: count,
      currentPage: pageNumber,
      lastPage: Math.ceil(count / take),
      perPage: take,
    };

    return data;
  } catch (error) {
    console.error("Error in getClassificationModel:", error);
    throw new Error("Failed to fetch getClassificationModel");
  }
};

export const getClassificationIdModel = async (id: number) => {
  try {
    const cl = await prisma.md_classification.findUnique({
      select: {
        id: true,
        code: true,
        name: true,
        definition: true,
        is_confirm: true,
        confirmed_decree_name: true,
        confirmed_decree_num: true,
        confirmed_decree_date: true,
        confirmed_organization1: true,
        confirmed_organization2: true,
        confirmed_organization3: true,
        implemented_date: true,
        last_updated_date: true,
        version: true,
        is_active: true,
        classificationCode: true,
        indicators: {
          select: {
            indicator: {
              select: {
                id: true,
                name: true,
                methodology_date: true,
                frequency: true,
                tbl_id: true,
                table: {
                  select: {
                    db_id: true,
                    name: true,
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
                        actions: {
                          select: {
                            id: true,
                            action_type: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id: id,
      },
    });

    return cl;
  } catch (error) {
    console.error("Error in getClassificationIdModel:", error);
    throw new Error("Failed to getClassificationIdModel");
  }
};

export const getClassificationByFilter = async (
  name: string = "",
  sectorId: string = "",
  orgId: string = ""
) => {
  let whereStr = "";
  let whereStr1 = "";
  if (name) {
    whereStr += ` AND a.name like '%${name}%'`;
    whereStr1 += ` AND a.name like '%${name}%'`;
  } else if (sectorId) {
    whereStr += ` AND sector = '${sectorId}'`;
  } else if (orgId) {
    whereStr1 += ` AND org_id = '${orgId}'`;
  }

  let queryOrg = `SELECT d.id, d.name, cast(count(a.id) as int) as data_count FROM (
    SELECT a.id, a.name, sector, e.org_id organization_id FROM public.md_classification a 
       INNER JOIN public.md_indicator_classification b on a.id = b.classification_id
        INNER JOIN public.md_indicator c on c.id = b.indicator_id
        INNER JOIN public.md_table d ON c.tbl_id = d.id
          INNER JOIN public.md_database e ON d.db_id = e.id
          WHERE c.is_classification = true and a.is_active = true
        group by a.id, a.name, sector, e.org_id
    ) A RIGHT JOIN md_organization d ON d.id = a.organization_id
    WHERE 1 = 1 ${whereStr}
      GROUP BY d.id, d.name
      ORDER BY d.name `;

  let querySector = `SELECT  f.id, code, f.name, cast(count(classifiaction_id) as int) as data_count FROM (
          SELECT a.id classifiaction_id, a.name, sector, e.org_id FROM public.md_classification a 
              INNER JOIN public.md_indicator_classification b on a.id = b.classification_id
              INNER JOIN public.md_indicator c on c.id = b.indicator_id
              INNER JOIN public.md_table d ON c.tbl_id = d.id
              INNER JOIN public.md_database e ON d.db_id = e.id
              WHERE c.is_classification = true and a.is_active = true
              group by a.id, a.name, sector, e.org_id
          ) A RIGHT JOIN lib_sector f on f.id = a.sector
        WHERE 1 = 1 ${whereStr1}
      GROUP BY  f.id, code, f.name
      ORDER BY f.name `;
  try {
    const dataByOrg = await prisma.$queryRaw`${Prisma.raw(queryOrg)}`;

    const dataBySector = await prisma.$queryRaw`${Prisma.raw(querySector)}`;

    return { dataByOrg, dataBySector };
  } catch (error) {
    console.error("Error in getClassificationByFilter org and sector:", error);
    throw new Error("Failed to fetch getClassificationByFilter");
  }
};

export const createClassificationModel = async (data: IClassification) => {
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const {
    id,
    code,
    name,
    definition,
    is_confirm,
    confirmed_decree_name,
    confirmed_decree_num,
    confirmed_decree_date,
    confirmed_organization1,
    confirmed_organization2,
    confirmed_organization3,
    implemented_date,
    last_updated_date,
    is_active,
    version,
  } = data;

  const now = new Date();
  const created_date = now.toISOString();
  const updated_date = now.toISOString();
  try {
    if (id) {
      const cl = await prisma.md_classification.update({
        where: {
          id,
        },
        data: {
          code,
          name,
          definition,
          is_confirm,
          confirmed_decree_name,
          confirmed_decree_num,
          confirmed_decree_date: new Date(confirmed_decree_date).toISOString(),
          confirmed_organization1,
          confirmed_organization2,
          confirmed_organization3,
          is_active,
          implemented_date: new Date(implemented_date).toISOString(),
          last_updated_date: new Date(last_updated_date).toISOString(),
          version,
          updated_date: updated_date,
          updated_user: Number(user_id),
        },
      });
      const clLog = await prisma.log_classification.create({
        data: {
          type: "UPDATE",
          class_id: cl.id,
          code: cl.code,
          name: cl.name,
          definition: cl.definition,
          is_confirm: cl.is_confirm,
          confirmed_decree_name: cl.confirmed_decree_name,
          confirmed_decree_num: cl.confirmed_decree_num,
          confirmed_decree_date: cl.confirmed_decree_date,
          confirmed_organization1: cl.confirmed_organization1,
          confirmed_organization2: cl.confirmed_organization2,
          confirmed_organization3: cl.confirmed_organization3,
          is_active: cl.is_active,
          version: cl.version,
          implemented_date: cl.implemented_date,
          last_updated_date: cl.last_updated_date,
          created_date: cl.created_date,
          created_user: cl.created_user,
          updated_date: cl.updated_date,
          updated_user: cl.updated_user,
        },
      });
      return cl;
    } else {
      const cl = await prisma.md_classification.create({
        data: {
          code,
          name,
          definition,
          is_confirm,
          confirmed_decree_name,
          confirmed_decree_num,
          confirmed_decree_date: new Date(confirmed_decree_date).toISOString(),
          confirmed_organization1,
          confirmed_organization2,
          confirmed_organization3,
          is_active,
          version: version,
          implemented_date: new Date(implemented_date).toISOString(),
          last_updated_date: new Date(last_updated_date).toISOString(),
          created_date: created_date,
          created_user: Number(user_id),
        },
      });
      const clLog = await prisma.log_classification.create({
        data: {
          type: "CREATE",
          class_id: cl.id,
          code: cl.code,
          name: cl.name,
          definition: cl.definition,
          is_confirm: cl.is_confirm,
          confirmed_decree_name: cl.confirmed_decree_name,
          confirmed_decree_num: cl.confirmed_decree_num,
          confirmed_decree_date: cl.confirmed_decree_date,
          confirmed_organization1: cl.confirmed_organization1,
          confirmed_organization2: cl.confirmed_organization2,
          confirmed_organization3: cl.confirmed_organization3,
          is_active: cl.is_active,
          version: cl.version,
          implemented_date: cl.implemented_date,
          last_updated_date: cl.last_updated_date,
          created_date: cl.created_date,
          created_user: cl.created_user,
          updated_date: cl.updated_date,
          updated_user: cl.updated_user,
        },
      });
      return cl;
    }
  } catch (error) {
    console.error("Error in createClassificationModel:", error);
    throw new Error("Failed to createClassificationModel");
  }
};

export const updateClassificationModel = async (
  data: IClassification,
  id: number
) => {
  const {
    code,
    name,
    definition,
    is_confirm,
    confirmed_decree_date,
    confirmed_decree_name,
    confirmed_decree_num,
    confirmed_organization1,
    confirmed_organization2,
    confirmed_organization3,
    implemented_date,
    last_updated_date,
    is_active,
    version,
  } = data;

  const now = new Date();
  const updated_date = now.toISOString();
  try {
    const cl = await prisma.md_classification.update({
      where: {
        id,
      },
      data: {
        code,
        name,
        definition,
        is_confirm,
        confirmed_decree_name,
        confirmed_decree_num,
        confirmed_decree_date: new Date(confirmed_decree_date).toISOString(),
        confirmed_organization1,
        confirmed_organization2,
        confirmed_organization3,
        is_active,
        implemented_date: new Date(implemented_date).toISOString(),
        last_updated_date: new Date(last_updated_date).toISOString(),
        version,
        updated_date,
      },
    });
    return cl;
  } catch (error) {
    console.error("Error in updateClassificationModel:", error);
    throw new Error("Failed to updateClassificationModel");
  }
};
export const insertClassificationCodeModel = async (
  data: IClassificationCode[]
) => {
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const now = new Date();
  const created_date = now.toISOString();
  const updated_date = now.toISOString();
  const insertData = data.map((item) => {
    return {
      classification_id: item.classification_id,
      code: String(item.code),
      definition: item.definition,
      created_date,
      updated_date,
    };
  });
  const creteRecords = [];
  try {
    for (const item of data) {
      const record = await prisma.md_classification_code.create({
        data: {
          classification_id: item.classification_id,
          code: String(item.code),
          definition: item.definition,
          created_user: Number(user_id),
          created_date,
        },
      });
      creteRecords.push(record);
    }
    for (const classList of creteRecords) {
      const record = await prisma.log_classification_code.create({
        data: {
          type: "CREATE",
          class_code_id: classList.id,
          classification_id: classList.classification_id,
          code: classList.code,
          definition: classList.definition,
          created_user: classList.created_user,
          created_date: classList.created_date,
        },
      });
    }
    return creteRecords;
  } catch (error) {
    console.error("Error in insertClassificationCodeModel:", error);
    throw new Error("Failed to insertClassificationCodeModel");
  }
};

////////getOrgTablesByIdModel - old - getTableListbyDbId
export const getClassificationByTblId = async (tbl_id: number) => {
  try {
    const table = await prisma.md_table.findUnique({
      select: { id: true, name: true },
      where: {
        id: tbl_id,
      },
    });

    if (!table) return null;

    const indicators = await prisma.md_indicator.findMany({
      select: {
        id: true,
        name: true,
        indicators_classifications: {
          select: {
            classification_id: true,
            classification: true,
          },
        },
      },
      where: {
        tbl_id: table?.id,
      },
    });

    const classifications = Array.from(
      new Set(
        indicators
          ?.filter((fData: any) => fData?.indicators_classifications.length > 0)
          .map(
            (ind: any) => ind.indicators_classifications[0]?.classification_id
          )
      )
    ).map((classification_id) => {
      return (
        classification_id &&
        indicators.find(
          (ind: any) =>
            ind.indicators_classifications[0]?.classification_id ==
            classification_id
        )?.indicators_classifications[0]?.classification
      );
    });

    if (!classifications && !indicators) return null;

    const data = { classifications, table };

    return data;
  } catch (error) {
    console.error("Error in getOrgTablesByIdModel:", error);
    throw new Error("Failed to fetch getOrgTablesByIdModel");
  }
};
