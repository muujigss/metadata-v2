import { IIndicator } from "@/interfaces/IIndicators";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";

const getIndicatorsModel = async (
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

const getIndicatorModel = async (id: number) => {
  try {
    const indicator = await prisma.md_indicator.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        code: true,
        name: true,
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
        frequency_id: true,
        frequency_other: true,
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
        is_active: true,
        version: true,
        indicators_classifications: {
          select: {
            classification: {
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
                classificationCode: true,
              },
            },
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
    });
    return indicator;
  } catch (error) {
    console.error("Error in getIndicatorModel:", error);
    throw new Error("Failed to fetch indicator");
  }
};

const getIndicatorByFilter = async (
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
        WHERE 1 = 1 ${whereStr}
      ) A RIGHT JOIN md_organization d ON d.id = a.org_id
    GROUP BY d.id, d.name
    ORDER BY d.name`;

  let querySector = `SELECT sectorid id, sectorname name, cast(count(a.id) as int) data_count FROM (
    SELECT a.id, a.tbl_id, a.name, sector, d.id sectorid, d.name sectorname FROM public.md_indicator a 
        INNER JOIN public.md_table b on a.tbl_id = b.id
        INNER JOIN public.md_database c on b.db_id = c.id
        RIGHT JOIN lib_sector d on d.id = c.sector
          WHERE 1 = 1 ${whereStr1}
      ) A
    GROUP BY sectorid, sectorname
    ORDER BY sectorname  `;
  try {
    const dataByOrg = await prisma.$queryRaw`${Prisma.raw(queryOrg)}`;

    const dataBySector = await prisma.$queryRaw`${Prisma.raw(querySector)}`;

    return { dataByOrg, dataBySector };
  } catch (error) {
    console.error("Error in getIndicatorByFilter org and sector:", error);
    throw new Error("Failed to fetch indicator");
  }
};

const createIndicatorModel = async (inputIndicator: IIndicator) => {
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const now = new Date();
  const created_date = now.toISOString();
  const updated_date = now.toISOString();

  const {
    id,
    tbl_id,
    code,
    name,
    frequency_id,
    frequency_other,
    unit_id,
    value_type_id,
    security_level_id,
    is_methodology,
    methodology,
    is_methodology_confirm,
    methodology_decree_num,
    methodology_date,
    confirmed_organtization,
    generated_date,
    is_classification,
    classification_count,
    version,
    is_active,
    created_user,
  }: IIndicator = inputIndicator;

  const methodology_date_var =
    methodology_date != "" ? new Date(methodology_date).toISOString() : null;

  try {
    if (id) {
      const indicator = await prisma.md_indicator.update({
        where: { id },
        data: {
          tbl_id,
          code,
          name,
          frequency_id,
          frequency_other,
          unit_id,
          value_type_id,
          security_level_id,
          is_methodology,
          methodology,
          is_methodology_confirm,
          methodology_decree_num,
          methodology_date: methodology_date_var,
          confirmed_organtization,
          is_classification,
          classification_count: Math.abs(Number(classification_count)),
          generated_date: +generated_date,
          updated_user: Number(user_id),
          version,
          is_active,
          updated_date: updated_date,
        },
      });
      const logIndicator = await prisma.log_indicator.create({
        data: {
          type: "UPDATE",
          ind_id: indicator.id,
          tbl_id: indicator.tbl_id,
          code: indicator.code,
          name: indicator.name,
          frequency_id: indicator.frequency_id,
          frequency_other: indicator.frequency_other,
          unit_id: indicator.unit_id,
          value_type_id: indicator.value_type_id,
          security_level_id: indicator.security_level_id,
          is_methodology: indicator.is_methodology,
          methodology: indicator.methodology,
          is_methodology_confirm: indicator.is_methodology_confirm,
          methodology_decree_num: indicator.methodology_decree_num,
          methodology_date: indicator.methodology_date,
          confirmed_organtization: indicator.confirmed_organtization,
          is_classification: indicator.is_classification,
          classification_count: indicator.classification_count,
          generated_date: indicator.generated_date,
          created_user: indicator.created_user,
          version: indicator.version,
          is_active: indicator.is_active,
          created_date: indicator.created_date,
          updated_date: indicator.updated_date,
          updated_user: indicator.updated_user,
        },
      });
      return indicator;
    } else {
      const indicator = await prisma.md_indicator.create({
        data: {
          tbl_id,
          code,
          name,
          frequency_id,
          frequency_other,
          unit_id,
          value_type_id,
          security_level_id,
          is_methodology,
          methodology,
          is_methodology_confirm,
          methodology_decree_num,
          methodology_date: methodology_date_var,
          confirmed_organtization,
          is_classification,
          classification_count: Math.abs(Number(classification_count)),
          generated_date: +generated_date,
          created_user: Number(user_id),
          version,
          is_active,
          created_date: created_date,
        },
      });
      const logIndicator = await prisma.log_indicator.create({
        data: {
          type: "CREATE",
          ind_id: indicator.id,
          tbl_id: indicator.tbl_id,
          code: indicator.code,
          name: indicator.name,
          frequency_id: indicator.frequency_id,
          frequency_other: indicator.frequency_other,
          unit_id: indicator.unit_id,
          value_type_id: indicator.value_type_id,
          security_level_id: indicator.security_level_id,
          is_methodology: indicator.is_methodology,
          methodology: indicator.methodology,
          is_methodology_confirm: indicator.is_methodology_confirm,
          methodology_decree_num: indicator.methodology_decree_num,
          methodology_date: indicator.methodology_date,
          confirmed_organtization: indicator.confirmed_organtization,
          is_classification: indicator.is_classification,
          classification_count: indicator.classification_count,
          generated_date: indicator.generated_date,
          created_user: indicator.created_user,
          version: indicator.version,
          is_active: indicator.is_active,
          created_date: indicator.created_date,
          updated_date: indicator.updated_date,
          updated_user: indicator.updated_user,
        },
      });
      return indicator;
    }
  } catch (error) {
    console.error("Error in createIndicatorModel:", error);
    throw new Error("Failed to create indicator");
  }
};

////////getOrgTablesByIdModel - old - getTableListbyDbId
const getIndicatorsByTblId = async (tbl_id: number) => {
  try {
    const table = await prisma.md_table.findUnique({
      select: { id: true, name: true },
      where: {
        id: tbl_id,
      },
    });

    if (!table) return null;

    const indicators = await prisma.md_indicator.findMany({
      select: { id: true, name: true },
      where: {
        tbl_id: table?.id,
      },
    });

    if (!indicators) return null;

    const data = { indicators, table };

    return data;
  } catch (error) {
    console.error("Error in getOrgTablesByIdModel:", error);
    throw new Error("Failed to fetch getOrgTablesByIdModel");
  }
};

const getPrevIndicatorByTblId = async (tbl_id: number) => {
  try {
    const table = await prisma.md_table.findUnique({
      select: { id: true, name: true },
      where: {
        id: tbl_id,
      },
    });

    if (!table) return null;

    const indicator = await prisma.md_indicator.findFirst({
      orderBy: { id: "desc" },
      select: { id: true, name: true },
      where: {
        tbl_id: table?.id,
      },
    });

    if (!indicator) return null;

    const data = { indicator, table };

    return data;
  } catch (error) {
    console.error("Error in getOrgTablesByIdModel:", error);
    throw new Error("Failed to fetch getOrgTablesByIdModel");
  }
};
export {
  getIndicatorByFilter,
  getIndicatorModel,
  getIndicatorsModel,
  createIndicatorModel,
  getIndicatorsByTblId,
  getPrevIndicatorByTblId,
};
