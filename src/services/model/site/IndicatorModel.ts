import { IIndicator } from "@/interfaces/IIndicators";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";

export const getIndicatorsModel = async (
  page: number,
  take: number,
  pageNumber: number,
  filter: {
    indicator_name?: string;
    sectorId?: string;
    orgId?: string;
  }
) => {
  try {
    let whereObj = {};
    if (filter && Object.keys(filter).length > 0) {
      whereObj = {
        ...whereObj,
        AND: [
          {
            name:
              filter.indicator_name !== "" &&
              filter.indicator_name !== undefined
                ? {
                    contains: filter.indicator_name,
                  }
                : {},
          },
          {
            table: {
              database: {
                organization: {
                  id:
                    filter.orgId !== "" && filter.orgId !== undefined
                      ? Number(filter.orgId)
                      : {},
                },
              },
            },
          },
          {
            table: {
              database: {
                sector:
                  filter.sectorId !== "" && filter.sectorId !== undefined
                    ? Number(filter.sectorId)
                    : {},
              },
            },
          },
          {
            is_active: true,
            table: {
              database: {
                is_active: true,
                actions: {
                  action_type: 3,
                },
              },
            },
          },
        ],
      };
    }
    const [indicators, count] = await prisma.$transaction([
      prisma.md_indicator.findMany({
        where: {
          ...whereObj,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          code: true,
          name: true,
          tbl_id: true,
          frequency_id: true,
          unit_id: true,
          value_type_id: true,
          security_level_id: true,
          is_methodology: true,
          methodology: true,
          is_methodology_confirm: true,
          methodology_decree_num: true,
          methodology_date: true,
          confirmed_organtization: true,
          generated_date: true,
          is_classification: true,
          classification_count: true,
          // frequency_other: true,
          table: {
            select: {
              id: true,
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
                  sectors: {
                    select: {
                      code: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          indicators_classifications: {
            select: {
              id: true,
              indicator_id: true,
              classification_id: true,
              classification: true,
            },
          },
          unit: {
            select: {
              name: true,
            },
          },
          security_level: {
            select: {
              name: true,
            },
          },
          value_type: {
            select: {
              name: true,
            },
          },
          frequency: {
            select: {
              name: true,
            },
          },
        },
        skip: page,
        take: take,
      }),
      prisma.md_indicator.count({ where: { ...whereObj } }),
    ]);
    const data = {
      data: indicators,
      allresults: count,
      currentPage: pageNumber,
      lastPage: Math.ceil(count / take),
      perPage: take,
    };
    return data;
  } catch (error) {
    console.error("Error in getIndicatorsModel:", error);
    throw new Error("Failed to fetch getIndicatorsModel");
  }
};
export const getIndicatorByFilter = async (
  indicator_name: string = "",
  sectorId: string = "",
  orgId: string = ""
) => {
  let whereStr = "";
  let whereStr1 = "";
  if (indicator_name) {
    whereStr += ` AND a.name like '%${indicator_name}%'`;
    whereStr1 += ` AND a.name like '%${indicator_name}%'`;
  } else if (sectorId) {
    whereStr += ` AND sector = '${sectorId}'`;
  } else if (orgId) {
    whereStr1 += ` AND c.org_id = '${orgId}'`;
  }

  let queryOrg = `SELECT  d.id, d.name, cast(count(a.id) as int)as data_count FROM (
    SELECT a.id, a.tbl_id, a.name, sector, org_id FROM public.md_indicator a 
      INNER JOIN public.md_table b ON a.tbl_id = b.id
      INNER JOIN public.md_database c ON b.db_id = c.id
	  INNER JOIN public.md_action aa on c.id = aa.item_id
        WHERE 1 = 1 and a.is_active = true and b.is_active = true and c.is_active = true and aa.action_type = 3
		${whereStr}
      ) A RIGHT JOIN md_organization d ON d.id = a.org_id
    GROUP BY d.id, d.name
    ORDER BY d.name`;

  let querySector = `SELECT sectorid id, sectorname name, cast(count(a.id) as int) data_count FROM (
    SELECT a.id, a.tbl_id, a.name, sector, d.id sectorid, d.name sectorname FROM public.md_indicator a 
        INNER JOIN public.md_table b on a.tbl_id = b.id
        INNER JOIN public.md_database c on b.db_id = c.id
		INNER JOIN public.md_action aa on c.id = aa.item_id
        RIGHT JOIN lib_sector d on d.id = c.sector
        WHERE 1 = 1 and a.is_active = true and b.is_active=true and c.is_active=true and aa.action_type = 3
		${whereStr1}
      ) A
    GROUP BY sectorid, sectorname
    ORDER BY sectorname `;
  try {
    const dataByOrg = await prisma.$queryRaw`${Prisma.raw(queryOrg)}`;

    const dataBySector = await prisma.$queryRaw`${Prisma.raw(querySector)}`;

    return { dataByOrg, dataBySector };
  } catch (error) {
    console.error("Error in getIndicatorByFilter org and sector:", error);
    throw new Error("Failed to fetch indicator");
  }
};
