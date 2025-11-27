import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";

export const getFormsModel = async (
  page: number,
  take: number,
  pageNumber: number,
  filter: {
    form_name?: string;
    sectorId?: string;
    orgId?: string;
  }
) => {
  let whereObj = {};
  if (filter && Object.keys(filter).length > 0) {
    whereObj = {
      ...whereObj,
      AND: [
        {
          name:
            filter.form_name !== "" && filter.form_name !== undefined
              ? {
                  contains: filter.form_name,
                }
              : {},
          sector_id:
            filter.sectorId !== "" && filter.sectorId !== undefined
              ? Number(filter.sectorId)
              : {},
        },
        {
          database: {
            organization: {
              id:
                filter.orgId !== "" && filter.orgId !== undefined
                  ? Number(filter.orgId)
                  : {},
            },
          },
        },
        {
          is_active: true,
          database: {
            is_active: true,
            actions: {
              action_type: 3,
            },
          },
        },
      ],
    };
  }
  try {
    const [forms, count] = await prisma.$transaction([
      prisma.md_form.findMany({
        where: {
          ...whereObj,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          db_id: true,
          code: true,
          name: true,
          decree_num: true,
          confirmed_date: true,
          confirmed_org1: true,
          confirmed_org2: true,
          sector_id: true,
          sector_other: true,
          sub_sector: true,
          coorperate_org: true,
          description: true,
          source_id: true,
          source_other: true,
          collection_method_id: true,
          collection_method_other: true,
          frequency_id: true,
          frequency_other: true,
          frequency: {
            select: {
              name: true,
            },
          },
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
        skip: page,
        take: take,
      }),
      prisma.md_form.count({ where: { ...whereObj } }),
    ]);
    const data = {
      data: forms,
      allresults: count,
      currentPage: pageNumber,
      lastPage: Math.ceil(count / take),
      perPage: take,
    };
    return data;
  } catch (error) {
    console.error("Error in getFormsModel:", error);
    throw new Error("Failed to fetch forms");
  }
};

export const getFormByFilter = async (
  form_name: string = "",
  sectorId: string = "",
  orgId: string = ""
) => {
  let whereStr = "";
  let whereStr1 = "";
  if (form_name) {
    whereStr += ` AND a.name like '%${form_name}%'`;
    whereStr1 += ` AND a.name like '%${form_name}%'`;
  } else if (sectorId) {
    whereStr += ` AND sector = '${sectorId}'`;
  } else if (orgId) {
    whereStr1 += ` AND c.org_id = '${orgId}'`;
  }

  let queryOrg = `SELECT  d.id, d.name, cast(count(a.id) as int)as data_count FROM (
    SELECT a.id, a.db_id, a.name, sector_id, d.code sector, c.org_id FROM public.md_form a 
      INNER JOIN public.md_database c ON a.db_id = c.id
      INNER JOIN md_action aa ON c.id = aa.item_id
      RIGHT JOIN lib_sector d on d.id = a.sector_id
      WHERE 1 = 1 and a.is_active = true and c.is_active = true and aa.action_type = 3  ${whereStr}
      ) A RIGHT JOIN md_organization d ON d.id = a.org_id
    GROUP BY d.id, d.name
    ORDER BY d.name `;

  let querySector = `SELECT sectorid as id, sectorcode as code, sectorname name, cast(count(a.id) as int) data_count FROM (
    SELECT a.id, a.db_id, a.name, sector_id, d.id sectorid, d.code sectorcode, d.name sectorname FROM public.md_form a 
        INNER JOIN public.md_database c on c.id = a.db_id
		INNER JOIN md_action as aa on c.id = aa.item_id
        RIGHT JOIN lib_sector d on d.id = a.sector_id
	  WHERE 1 = 1 and a.is_active = true and c.is_active = true and aa.action_type = 3  ${whereStr1}
      ) A
    GROUP BY  sectorid, sectorcode, sectorname
    ORDER BY sectorname
  `;
  try {
    const dataByOrg = await prisma.$queryRaw`${Prisma.raw(queryOrg)}`;

    // const dataBySector = await prisma.$queryRaw`${Prisma.raw(querySector)}`;

    return { dataByOrg };
  } catch (error) {
    console.error("Error in getFormByFilter org and sector:", error);
    throw new Error("Failed to fetch indicator");
  }
};
