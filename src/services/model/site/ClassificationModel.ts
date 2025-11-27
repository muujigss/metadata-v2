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
              table: {
                database: {
                  actions: {
                    action_type: 3,
                  },
                },
              },
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
		INNER JOIN public.md_action aa on e.id = aa.item_id
		WHERE c.is_classification = true and a.is_active = true and c.is_active = true 
		and d.is_active = true and e.is_active =true and aa.action_type = 3
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
      INNER JOIN public.md_action aa on e.id = aa.item_id
      WHERE c.is_classification = true and a.is_active = true and c.is_active = true and d.is_active 
      and e.is_active and aa.action_type = 3
      group by a.id, a.name, sector, e.org_id
    ) A RIGHT JOIN lib_sector f on f.id = a.sector
  WHERE 1 = 1 ${whereStr1}
  GROUP BY  f.id, code, f.name
  ORDER BY f.name`;
  try {
    const dataByOrg = await prisma.$queryRaw`${Prisma.raw(queryOrg)}`;

    const dataBySector = await prisma.$queryRaw`${Prisma.raw(querySector)}`;

    return { dataByOrg, dataBySector };
  } catch (error) {
    console.error("Error in getClassificationByFilter org and sector:", error);
    throw new Error("Failed to fetch getClassificationByFilter");
  }
};
