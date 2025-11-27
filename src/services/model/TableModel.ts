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

const getOneTableModelAdmin = async (id: number) => {
  try {
    const Table = await prisma.md_table.findUnique({
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
        indicators: {
          select: {
            id: true,
            code: true,
            name: true,
            generated_date: true,
            frequency_id: true,
            frequency: true,
            is_classification: true,
            is_active: true,
            indicators_classifications: {
              select: {
                id: true,
                indicator_id: true,
                classification_id: true,
                classification: {
                  select: {
                    id: true,
                    code: true,
                    name: true,
                    is_active: true,
                    definition: true,
                    implemented_date: true,
                    classificationCode: true,
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
    return Table;
  } catch (error) {
    console.error("Error in getOneTableModel:", error);
    throw new Error("Failed to fetch forms");
  }
};

const getOneTableModel = async (id: number) => {
  try {
    const Table = await prisma.md_table.findUnique({
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
        indicators: {
          select: {
            id: true,
            code: true,
            name: true,
            generated_date: true,
            frequency_id: true,
            frequency: true,
            is_classification: true,
            is_active: true,
            indicators_classifications: {
              select: {
                id: true,
                indicator_id: true,
                classification_id: true,
                classification: {
                  select: {
                    id: true,
                    code: true,
                    name: true,
                    is_active: true,
                    definition: true,
                    implemented_date: true,
                    // classificationCode: true,
                  },
                  where: {
                    is_active: true,
                  },
                },
              },
            },
          },
          where: {
            is_active: true,
          },
        },
      },
      where: {
        id: id,
        is_active: true,
      },
    });
    return Table;
  } catch (error) {
    console.error("Error in getOneTableModel:", error);
    throw new Error("Failed to fetch forms");
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
      RIGHT JOIN lib_sector d on d.id = c.sector
      WHERE 1 = 1 ${whereStr}
      ) A RIGHT JOIN md_organization d ON d.id = a.org_id
    GROUP BY d.id, d.name
    ORDER BY d.name`;

  let querySector = `SELECT sectorid id, sectorname name, cast(count(a.id) as int) data_count FROM (
    SELECT a.id, a.db_id, a.name, sector, d.id sectorid, d.name sectorname FROM public.md_table a 
        INNER JOIN public.md_database c on c.id = a.db_id
        RIGHT JOIN lib_sector d on d.id = c.sector
          WHERE 1 = 1 ${whereStr1}
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

const createTableModel = async (inputTable: ITable) => {
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const now = new Date();
  const created_date = moment(now).format("YYYY-MM-DDTHH:mm:ssZ"); //now.toISOString();
  const updated_date = moment(now).format("YYYY-MM-DDTHH:mm:ssZ"); //now.toISOString();

  const sourceList = inputTable.source?.map((item: any) => ({ id: item }));
  const securityLevelList = inputTable.security_level?.map((item: any) => ({
    id: item,
  }));
  const {
    id,
    code,
    description,
    name,
    source_other,
    licence_type,
    licence_type_other,
    opendata_licence_url,
    db_id,
    started_date,
    is_active,
    version,
  } = inputTable;

  try {
    if (id) {
      const response = await prisma.md_table.update({
        where: {
          id: id,
        },
        data: {
          code: code,
          description: description,
          name: name,
          source: sourceList,
          source_other: source_other,
          security_level: securityLevelList,
          licence_type: +licence_type,
          licence_type_other: licence_type_other,
          opendata_licence_url: opendata_licence_url,
          started_date: started_date,
          is_active: is_active,
          updated_user: Number(user_id),
          updated_date: updated_date,
          version: version,
        },
      });
      const logTable = await prisma.log_table.create({
        data: {
          type: "UPDATE",
          tbl_id: response.id,
          db_id: response.db_id,
          description: response.description,
          name: response.name,
          source: sourceList,
          source_other: response.source_other,
          security_level: securityLevelList,
          licence_type: response.licence_type,
          licence_type_other: response.licence_type_other,
          opendata_licence_url: response.opendata_licence_url,
          started_date: response.started_date,
          is_active: response.is_active,
          created_user: response.created_user,
          created_date: response.created_date,
          updated_user: response.updated_user,
          updated_date: response.updated_date,
        },
      });

      return response;
    } else {
      const table = await prisma.md_table.create({
        data: {
          db_id,
          form_id: null,
          code,
          description,
          name,
          source: sourceList,
          source_other: source_other,
          security_level: securityLevelList,
          licence_type: +licence_type,
          licence_type_other,
          opendata_licence_url,
          started_date: started_date,
          is_active: is_active,
          version: version,
          created_user: Number(user_id),
          created_date: created_date,
        },
      });
      const logTable = await prisma.log_table.create({
        data: {
          type: "CREATE",
          tbl_id: table.id,
          db_id: table.db_id,
          description: table.description,
          name: table.name,
          source: sourceList,
          source_other: table.source_other,
          security_level: securityLevelList,
          licence_type: table.licence_type,
          licence_type_other: table.licence_type_other,
          opendata_licence_url: table.opendata_licence_url,
          started_date: table.started_date,
          is_active: table.is_active,
          created_user: table.created_user,
          created_date: table.created_date,
          updated_user: table.updated_user,
          updated_date: table.updated_date,
        },
      });
      return table;
    }
  } catch (error) {
    console.error("Error in createTableModel:", error);
    throw new Error("Failed to create table");
  }
};

const getTablesByUserModel = async (org_id: number, db_id: number) => {
  try {
    const tablesbyUser = await prisma.md_table.findMany({
      where: {
        db_id: db_id,
        database: {
          org_id: org_id,
        },
      },
      select: {
        id: true,
        name: true,
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
            name: true,
          },
        },
      },
    });
    return tablesbyUser;
  } catch (error) {
    console.error("Error in getTablesByOrgId:", error);
    throw new Error("Failed to fetch tables");
  }
};
const updateTableModel = async (tbl_id: number, updateTable: ITable) => {
  const now = new Date();
  const updated_date = now.toISOString();
  const {
    description,
    name,
    source,
    source_other,
    security_level,
    licence_type,
    licence_type_other,
    opendata_licence_url,
    db_id,
    started_date,
    is_active,
    version,
  } = updateTable;
  const start_date = started_date;
  try {
    const table = await prisma.md_table.update({
      where: {
        id: tbl_id,
      },
      data: {
        description,
        name,
        source: source?.map((item: any) => ({ id: item })),
        source_other,
        security_level: security_level?.map((item: any) => ({ id: item })),
        // licence_type: opendata_licence_type.toString(),
        // licence_type_other,
        opendata_licence_url,
        started_date: start_date,
        is_active,
        updated_date: updated_date,
        version,
      },
    });
    return table;
  } catch (error) {
    console.error("Error in updateTable:", error);
    throw new Error("Failed to update table");
  }
};
const getTablesByDBModel = async (db_id: number) => {
  try {
    const tablesbyUser = await prisma.md_table.findMany({
      where: {
        db_id: db_id,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return tablesbyUser;
  } catch (error) {
    console.error("Error in getTablesByOrgId:", error);
    throw new Error("Failed to fetch tables");
  }
};
export {
  getOneTableModelAdmin,
  getOneTableModel,
  getTableByFilter,
  getTablesModel,
  createTableModel,
  getTablesByUserModel,
  updateTableModel,
  getTablesByDBModel,
};
