import { ITable } from "@/interfaces/ITable";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import moment from "moment";
import { cookies } from "next/headers";
const getTablesModel = async (
  page: number,
  take: number,
  pageNumber: number,
  filter: {
    tbl_name?: string;
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
              filter.tbl_name !== "" && filter.tbl_name !== undefined
                ? {
                    contains: filter.tbl_name,
                  }
                : {},
          },
          {
            database: {
              is_active: true,
              actions: {
                action_type: 3,
              },
              organization: {
                id:
                  filter.orgId !== "" && filter.orgId !== undefined
                    ? Number(filter.orgId)
                    : {},
              },
            },
          },
          {
            database: {
              is_active: true,
              actions: {
                action_type: 3,
              },
              sector:
                filter.sectorId !== "" && filter.sectorId !== undefined
                  ? Number(filter.sectorId)
                  : {},
            },
          },
          {
            is_active: true,
          },
        ],
      };
    }

    const [tables, count] = await prisma.$transaction([
      prisma.md_table.findMany({
        orderBy: {
          name: "asc",
        },
        where: {
          ...whereObj,
        },
        select: {
          id: true,
          db_id: true,
          name: true,
          form_id: true,
          code: true,
          description: true,
          source: true,
          source_other: true,
          security_level: true,
          licence_type: true,
          licence_type_other: true,
          opendata_licence_url: true,
          started_date: true,
          database: {
            select: {
              id: true,
              name: true,
              sectors: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              },
              organization: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        skip: page,
        take: take,
      }),
      prisma.md_table.count({
        where: {
          ...whereObj,
        },
      }),
    ]);
    const data = {
      data: tables,
      allresults: count,
      currentPage: pageNumber,
      lastPage: Math.ceil(count / take),
      perPage: take,
    };
    return data;
  } catch (error) {
    console.error("Error in getTablesModel:", error);
    throw new Error("Failed to fetch getTablesModel");
  }
};
const getTableByFilter = async (
  tbl_name: string = "",
  sectorId: string = "",
  orgId: string = ""
) => {
  let whereStr = "";
  let whereStr1 = "";
  if (tbl_name) {
    whereStr += ` AND a.name like '%${tbl_name}%'`;
    whereStr1 += ` AND a.name like '%${tbl_name}%'`;
  } else if (sectorId) {
    whereStr += ` AND sector = '${sectorId}'`;
  } else if (orgId) {
    whereStr1 += ` AND c.org_id = '${orgId}'`;
  }

  let queryOrg = `SELECT  d.id, d.name, cast(count(a.id) as int)as data_count FROM (
      SELECT a.id, a.db_id, a.name, sector, d.code sectorid, org_id FROM public.md_table a 
      INNER JOIN public.md_database c ON a.db_id = c.id
	    INNER JOIN md_action as aa on c.id = aa.item_id
      RIGHT JOIN lib_sector d on d.id = c.sector
      WHERE 1 = 1 and c.is_active and a.is_active = true and aa.action_type = 3 ${whereStr}
      ) A RIGHT JOIN md_organization d ON d.id = a.org_id
    GROUP BY d.id, d.name
    ORDER BY d.name`;

  let querySector = `SELECT sectorid id, sectorname name, cast(count(a.id) as int) data_count FROM (
      SELECT a.id, a.db_id, a.name, sector, d.id sectorid, d.name sectorname FROM public.md_table a 
      INNER JOIN public.md_database c on c.id = a.db_id
		  INNER JOIN md_action as aa on c.id = aa.item_id
        RIGHT JOIN lib_sector d on d.id = c.sector
          WHERE 1 = 1 and c.is_active = true and a.is_active = true and aa.action_type = 3 ${whereStr1}
      ) A
    GROUP BY sectorid, sectorname
    ORDER BY sectorname `;
  try {
    const dataByOrg = await prisma.$queryRaw`${Prisma.raw(queryOrg)}`;

    const dataBySector = await prisma.$queryRaw`${Prisma.raw(querySector)}`;

    return { dataByOrg, dataBySector };
  } catch (error) {
    console.error("Error in getTableByFilter org and sector:", error);
    throw new Error("Failed to fetch indicator");
  }
};

export { getTablesModel, getTableByFilter };
