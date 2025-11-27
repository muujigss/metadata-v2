import { IDatabase } from "@/interfaces/IDatabase";
import { IUserDatabase } from "@/interfaces/IUserDatabase";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { stat } from "fs";
import moment from "moment";

const getDatabaseModel = async (
  page: number,
  take: number,
  pageNumber: number,
  filter: {
    userId?: string;
    name?: string;
    sectorId?: string;
    orgId?: string;
    dbType?: string;
  }
) => {
  let org_id: number | undefined = 0;
  let user_level: number | undefined = 0;
  let dbs: any = [{} as IUserDatabase];

  if (filter.userId) {
    dbs = await prisma.md_user_database.findMany({
      where: {
        user_id: Number(filter.userId),
      },
      select: {
        user_id: true,
        database_id: true,
      },
    });

    const user = await prisma.md_users.findUnique({
      where: {
        id: Number(filter.userId),
      },
    });

    org_id = user?.org_id;
    user_level = user?.user_level;
  }

  // console.log({ dbs });
  // console.log({ org_id, user_level });

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
              user_level == 2
                ? org_id
                : filter.orgId !== "" && filter.orgId !== undefined
                ? Number(filter.orgId)
                : org_id !== 0 &&
                  org_id !== undefined &&
                  user_level !== 1 &&
                  user_level !== 2
                ? org_id
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
            id:
              user_level == 2
                ? undefined
                : !filter.userId
                ? undefined
                : user_level == 3 || user_level == 2
                ? {
                    in: dbs.map((item: any) => item.database_id),
                  }
                : undefined,
          },
          {
            is_active: filter.userId ? undefined : true,
          },
        ],
      };
    }

    const [databases, count] = await prisma.$transaction([
      prisma.md_database.findMany({
        where: {
          ...whereObj,
        },
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
          actions: {
            select: {
              action_type: true,
            },
          },
        },
        skip: page,
        take: take,
      }),

      prisma.md_database.count({
        where: { ...whereObj },
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

const getOneDatabaseModelAdmin = async (id: number) => {
  try {
    const databases = await prisma.md_database.findUnique({
      select: {
        id: true,
        org_id: true,
        name: true,
        description: true,
        db_location_other: true,
        db_type_other: true,
        spec_other: true,
        licence_type_other: true,
        opendata_url: true,
        sector_other: true,
        table_count: true,
        is_form: true,
        start_date: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        databaseType: {
          select: {
            id: true,
            name: true,
          },
        },
        spec: true,
        sectors: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        databaseLocation: {
          select: {
            id: true,
            name: true,
          },
        },
        licenceType: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        tables: {
          select: {
            id: true,
            name: true,
            description: true,
            started_date: true,
            source: true,
            is_active: true,
            database: {
              select: {
                id: true,
                name: true,
                actions: {
                  select: {
                    action_type: true,
                    user_id: true,
                  },
                },
              },
            },
          },
        },
        actions: {
          select: {
            action_type: true,
            user_id: true,
          },
        },
        forms: {
          select: {
            id: true,
            name: true,
            code: true,
            source_id: true,
            description: true,
            confirmed_date: true,
            confirmed_org1: true,
            is_active: true,
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
      },
      where: {
        id: id,
      },
    });
    return databases;
  } catch (error) {
    console.error("Error in getOneDatabaseModel:", error);
    throw new Error("Failed to fetch forms");
  }
};
const getOneDatabaseModel = async (id: number) => {
  try {
    const databases = await prisma.md_database.findUnique({
      select: {
        id: true,
        org_id: true,
        name: true,
        description: true,
        db_location_other: true,
        db_type_other: true,
        spec_other: true,
        licence_type_other: true,
        opendata_url: true,
        sector_other: true,
        table_count: true,
        is_form: true,
        start_date: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        databaseType: {
          select: {
            id: true,
            name: true,
          },
        },
        spec: true,
        sectors: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        databaseLocation: {
          select: {
            id: true,
            name: true,
          },
        },
        licenceType: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        tables: {
          select: {
            id: true,
            name: true,
            description: true,
            started_date: true,
            source: true,
            is_active: true,
            database: {
              select: {
                id: true,
                name: true,
                actions: {
                  select: {
                    action_type: true,
                    user_id: true,
                  },
                },
              },
            },
          },
          where: {
            is_active: true,
          },
        },
        actions: {
          select: {
            action_type: true,
            user_id: true,
          },
        },
        forms: {
          select: {
            id: true,
            name: true,
            code: true,
            source_id: true,
            description: true,
            confirmed_date: true,
            confirmed_org1: true,
            is_active: true,
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
      },
      where: {
        id: id,
      },
    });
    return databases;
  } catch (error) {
    console.error("Error in getOneDatabaseModel:", error);
    throw new Error("Failed to fetch forms");
  }
};

const getSpecificationModel = async () => {
  try {
    const specification = await prisma.lib_specification.findMany();
    return specification;
  } catch (error) {
    console.error("Error in getSpecificationModel:", error);
    throw new Error("Failed to fetch forms");
  }
};

const getDatabaseTypeModel = async () => {
  try {
    const database_type = await prisma.lib_db_type.findMany();
    return database_type;
  } catch (error) {
    console.error("Error in getDatabaseTypeModel:", error);
    throw new Error("Failed to fetch forms");
  }
};

const getDatabaseLocationModel = async () => {
  try {
    const database_location = await prisma.lib_db_location.findMany();
    return database_location;
  } catch (error) {
    console.error("Error in getDatabaseLocationModel:", error);
    throw new Error("Failed to fetch forms");
  }
};
const getLicenceModel = async () => {
  try {
    const licence = await prisma.lib_licence_type.findMany();
    return licence;
  } catch (error) {
    console.error("Error in getLicenceModel:", error);
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
   SELECT a.id, a.org_id, a.name, sector, b.name as org_name from public.md_database a
    RIGHT JOIN md_organization b ON b.id = a.org_id
    WHERE 1 = 1 and a.is_active = true  ${whereStr}
  ) A 
  GROUP BY org_id, org_name
  ORDER BY org_name `;

  let querySector = `SELECT f.id, code, f.name,  cast(count(a.id) as int)as data_count FROM (
        SELECT id, org_id, name, sector from public.md_database a
        WHERE 1 = 1 and a.is_active = true ${whereStr1}
      ) A  RIGHT JOIN lib_sector f on f.id = a.sector
      GROUP BY  f.id, code, f.name
      ORDER BY f.name`;

  let queryDbType = `SELECT b.id, b.name,  cast(count(a.id) as int)as data_count FROM (
        SELECT id, org_id, name, sector, db_type from public.md_database a
        WHERE 1 = 1 and a.is_active = true  AND a.name like '%${name}%' ${whereStr2}
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
const createDatabaseModel = async (data: IDatabase) => {
  const {
    org_id,
    id,
    name,
    description,
    spec,
    spec_other,
    db_type,
    db_type_other,
    sector,
    sector_other,
    db_location,
    db_location_other,
    licence_type,
    licence_type_other,
    opendata_url,
    table_count,
    is_form,
    is_active,
    start_date,
    createdUser,
    version,
  } = data;

  const now = new Date();
  const created_date = moment(now).format("YYYY-MM-DDTHH:mm:ssZ"); //now.toISOString();
  const updated_date = moment(now).format("YYYY-MM-DDTHH:mm:ssZ"); //now.toISOString();

  const specList = spec?.map((item: any) => {
    return { id: item };
  });

  try {
    if (id) {
      const database = await prisma.md_database.update({
        where: { id },
        data: {
          org_id,
          name,
          description,
          spec: specList,
          spec_other,
          db_type,
          db_type_other,
          sector: Number(sector),
          sector_other,
          db_location,
          db_location_other,
          licence_type: Number(licence_type),
          licence_type_other,
          opendata_url,
          table_count: Math.abs(Number(table_count)),
          is_form,
          is_active,
          is_integrated: false,
          start_date: Number(start_date),
          updatedDate: updated_date,
          createdUser: +createdUser,
          updatedUser: +createdUser,
          version,
        },
      });
      const logDataBase = await prisma.log_database.create({
        data: {
          type: "UPDATE",
          db_id: database.id,
          org_id: database.org_id,
          name: database.name,
          description: database.description,
          spec: specList,
          spec_other: database.spec_other,
          db_type: database.db_type,
          db_type_other: database.db_type_other,
          sector: database.sector,
          sector_other: database.sector_other,
          db_location: database.db_location,
          db_location_other: database.db_location_other,
          licence_type: database.licence_type,
          licence_type_other: database.licence_type_other,
          opendata_url: database.opendata_url,
          table_count: database.table_count,
          is_form: database.is_form,
          is_active: database.is_active,
          is_integrated: database.is_integrated,
          start_date: database.start_date,
          createdDate: database.createdDate,
          updatedDate: database.updatedDate,
          createdUser: database.createdUser,
          updatedUser: database.updatedUser,
          version: database.version,
        },
      });

      return database;
    } else {
      const database = await prisma.md_database.create({
        data: {
          org_id,
          name,
          description,
          spec: specList,
          spec_other,
          db_type,
          db_type_other,
          sector: Number(sector),
          sector_other,
          db_location,
          db_location_other,
          licence_type: Number(licence_type),
          licence_type_other,
          opendata_url,
          table_count: Math.abs(Number(table_count)),
          is_form,
          is_active,
          is_integrated: false,
          start_date: Number(start_date),
          createdDate: created_date,
          updatedDate: updated_date,
          createdUser: +createdUser,
          updatedUser: +createdUser,
          version,
        },
      });
      const logDataBase = await prisma.log_database.create({
        data: {
          type: "CREATE",
          db_id: database.id,
          org_id: database.org_id,
          name: database.name,
          description: database.description,
          spec: specList,
          spec_other: database.spec_other,
          db_type: database.db_type,
          db_type_other: database.db_type_other,
          sector: database.sector,
          sector_other: database.sector_other,
          db_location: database.db_location,
          db_location_other: database.db_location_other,
          licence_type: database.licence_type,
          licence_type_other: database.licence_type_other,
          opendata_url: database.opendata_url,
          table_count: database.table_count,
          is_form: database.is_form,
          is_active: database.is_active,
          is_integrated: database.is_integrated,
          start_date: database.start_date,
          createdDate: database.createdDate,
          updatedDate: database.updatedDate,
          createdUser: database.createdUser,
          updatedUser: database.updatedUser,
          version: database.version,
        },
      });
      if (database) {
        const userDatabase = await prisma.md_user_database.create({
          data: {
            user_id: +createdUser,
            database_id: database.id,
            created_date: created_date,
            created_user: +createdUser,
          },
        });
        const logUserDatabase = await prisma.log_user_database.create({
          data: {
            type: "CREATE",
            ud_id: userDatabase.id,
            user_id: userDatabase.user_id,
            database_id: userDatabase.database_id,
            created_date: userDatabase.created_date,
            updated_date: userDatabase.updated_date,
            created_user: userDatabase.created_user,
            updated_user: userDatabase.updated_user,
          },
        });
      }

      if (database) {
        const md_action = await prisma.md_action.create({
          data: {
            user_id: +createdUser,
            action_type: 1,
            item_id: database.id,
            item_type: "db",

            created_date: created_date,
            created_user: +createdUser,
          },
        });
        const log_md_action = await prisma.log_action.create({
          data: {
            log_type: "CREATE",
            action_id: md_action.id,
            user_id: md_action.user_id,
            action_type: md_action.action_type,
            item_id: md_action.item_id,
            item_type: md_action.item_type,
            updated_date: created_date,
            updated_user: +createdUser,
          },
        });
      }

      return database;
    }
  } catch (error) {
    console.error("Error in createDatabaseModel:", error);
    throw new Error("Failed to create database");
  }
};
// Update action ued duudah func

const checkStatusMetadata = async (dbId?: number) => {
  try {
    const dbCount = await prisma.md_database.count({
      where: {
        id: dbId,
        is_active: true,
      },
    });

    // console.log({ dbCount });

    if (dbCount == 0) {
      return {
        status: false,
        message: "Идэвхитэй өгөгдлийн сан байхгүй байна. Идэвхитэй болгоно уу",
      };
    }

    const tableCount = await prisma.md_table.findMany({
      where: {
        db_id: Number(dbId),
        is_active: true,
      },
      select: {
        id: true,
      },
    });
    // console.log({ tableCount });

    if (tableCount.length == 0) {
      return {
        status: false,
        message:
          "Идэвхитэй хүснэгт байхгүй байна. Хүснэгтээ идэвхитэй болгоно уу. ",
      };
    }

    const indicatorCount = await prisma.md_indicator.findMany({
      where: {
        tbl_id: {
          in: tableCount.map((item) => item.id),
        },
        is_active: true,
      },
      select: {
        id: true,
      },
    });

    // console.log({ indicatorCount });

    if (indicatorCount.length == 0) {
      return {
        status: false,
        message:
          "Идэвхитэй үзүүлэлт байхгүй байна. Үзүүлэлт идэвхитэй болгоно уу. ",
      };
    }
    // console.log({ indicatorCount });

    return { status: true, message: "success" };
  } catch (error) {
    console.error("Error in checkDatabaseModel:", error);
    throw new Error("Failed to checkDatabaseModel");
  }
};

export {
  createDatabaseModel,
  getDatabaseLocationModel,
  getDatabaseModel,
  getDatabasesByFilter,
  getDatabaseTypeModel,
  getLicenceModel,
  getOneDatabaseModel,
  getOneDatabaseModelAdmin,
  getSpecificationModel,
  checkStatusMetadata,
};
