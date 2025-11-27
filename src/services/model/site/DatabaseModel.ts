import { IUserDatabase } from "@/interfaces/IUserDatabase";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
const getDatabaseModel = async (
  page: number,
  take: number,
  pageNumber: number,
  filter: {
    name?: string;
    sectorId?: string;
    orgId?: string;
    dbType?: string;
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
              filter.name !== "" && filter.name !== undefined
                ? {
                    contains: filter.name,
                  }
                : {},
          },
          {
            org_id:
              filter.orgId !== "" && filter.orgId !== undefined
                ? Number(filter.orgId)
                : {},
          },
          {
            sector:
              filter.sectorId !== "" && filter.sectorId !== undefined
                ? Number(filter.sectorId)
                : {},
          },
          {
            db_type:
              filter.dbType !== "" && filter.dbType !== undefined
                ? Number(filter.dbType)
                : {},
          },
          {
            is_active: true,
            actions: {
              action_type: 3,
            },
          },
        ],
      };
    }

    const [databases, count] = await prisma.$transaction([
      prisma.md_database.findMany({
        where: whereObj,
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          org_id: true,
          description: true,
          spec: true,
          spec_other: true,
          db_type: true,
          db_location: true,
          licence_type: true,
          licence_type_other: true,
          opendata_url: true,
          sector: true,
          sector_other: true,
          table_count: true,
          is_form: true,
          start_date: true,
          organization: true,
          databaseType: true,
          is_active: true,
          is_integrated: true,
        },
        skip: page,
        take: take,
      }),

      prisma.md_database.count({
        where: {
          ...whereObj,
        },
      }),
    ]);
    const data = {
      data: databases,
      allresults: count,
      currentPage: pageNumber,
      lastPage: Math.ceil(count / take),
      perPage: take,
    };
    return data;
  } catch (error) {
    console.error("Error in getDatabaseModel:", error);
    throw new Error("Failed to fetch forms");
  }
};

const getDatabasesByFilter = async (
  name: string = "",
  sectorId: string = "",
  orgId: string = "",
  dbType: string = ""
) => {
  let whereStr = "";
  let whereStr1 = "";
  let whereStr2 = "";
  if (name) {
    whereStr += ` AND a.name like '%${name}%'`;
    whereStr1 += ` AND a.name like '%${name}%'`;
  } else if (sectorId) {
    whereStr += ` AND sector = '${sectorId}'`;
    whereStr2 += ` AND sector = '${sectorId}'`;
  } else if (orgId) {
    whereStr1 += ` AND org_id = '${orgId}'`;
    whereStr2 += ` AND org_id = '${orgId}'`;
  } else if (dbType) {
    whereStr += ` AND db_type = ${dbType}`;
    whereStr1 += ` AND db_type = ${dbType}`;
    whereStr2 += ` AND db_type = ${dbType}`;
  }

  let queryOrg = `SELECT org_id as id, org_name as name, cast(count(id) as int)as data_count FROM (
   SELECT a.id, a.org_id, a.name, sector, b.name as org_name 
	from public.md_database a
	inner join md_action as c on a.id = c.item_id
    RIGHT JOIN md_organization b ON b.id = a.org_id
    WHERE 1 = 1 and a.is_active = true and c.action_type = 3 ${whereStr}
  ) A 
  GROUP BY org_id, org_name
  ORDER BY org_name `;

  let querySector = `SELECT f.id, code, f.name,  cast(count(a.id) as int)as data_count FROM (
        SELECT a.id, org_id, name, sector from public.md_database a
		    inner join md_action as c on a.id = c.item_id
        WHERE 1 = 1 and a.is_active = true and c.action_type = 3 ${whereStr1}
      ) A  RIGHT JOIN lib_sector f on f.id = a.sector
      GROUP BY  f.id, code, f.name
      ORDER BY f.name`;

  let queryDbType = `SELECT b.id, b.name,  cast(count(a.id) as int)as data_count FROM (
        SELECT a.id, org_id, name, sector, db_type from public.md_database a
		    inner join md_action as c on a.id = c.item_id
        WHERE 1 = 1 and a.is_active = true and c.action_type = 3 AND a.name like '%${name}%' ${whereStr2}
      ) A  RIGHT JOIN lib_db_type b on b.id = a.db_type
       GROUP BY  b.id, b.name
      ORDER BY b.name`;
  try {
    const dataByOrg = await prisma.$queryRaw`${Prisma.raw(queryOrg)}`;

    const dataBySector = await prisma.$queryRaw`${Prisma.raw(querySector)}`;

    const dataByDbType = await prisma.$queryRaw`${Prisma.raw(queryDbType)}`;

    return { dataByOrg, dataBySector, dataByDbType };
  } catch (error) {
    console.error("Error in getIndicatorByFilter org and sector:", error);
    throw new Error("Failed to fetch indicator");
  }
};

export { getDatabaseModel, getDatabasesByFilter };
