import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";

/**
 * @from:        src/app/api/form
 * @params:      page, take, pageNumber, filter
 * @return:      Object
 * @description: Маягтын жагсаалтыг шүүлтүүртэйгээр авах
 */
const getFormsModel = async (
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
/**
 * @from:        src/app/api/form/[id]
 * @params:      id
 * @return:      Object
 * @description: Маягтын дэлгэрэнгүй мэдээллийг ID-гаар авах
 */
const getFormModel = async (id: number) => {
  try {
    const form = await prisma.md_form.findUnique({
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
        collection_started_date: true,
        dissimenation_level_id: true,
        is_form_guide: true,
        form_guide_decree_num: true,
        collected_officer: true,
        security_level_id: true,
        owner_department: true,
        owner_email: true,
        owner_phone: true,
        form_generated_date: true,
        form_updated_date: true,
        form_table_count: true,
        keywords: true,
        estimated_indicators: true,
        files: true,
        is_active: true,
        version: true,
        sector: {
          select: {
            name: true,
          },
        },
        frequency: {
          select: {
            name: true,
          },
        },
        dissimenation_level: {
          select: {
            name: true,
          },
        },
        database: {
          select: {
            id: true,
            name: true,
            actions: {
              select: {
                action_type: true,
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
        // security_level: {
        //   select: {
        //     name: true,
        //   },
        // },
      },
      where: {
        id: id,
      },
    });
    return form;
  } catch (error) {
    console.error("Error in getFormModel:", error);
    throw new Error("Failed to fetch form");
  }
};

/**
 * @from:        src/app/api/form/databases/[id]
 * @params:      org_id
 * @return:      Array
 * @description: Байгууллагын идэвхтэй батлагдсан өгөгдлийн сангуудыг авах
 */
const getOrgDBsByIdModel = async (org_id: number) => {
  try {
    const org = await prisma.md_database.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        org_id: org_id,
        is_active: true,
        actions: {
          action_type: 3,
        },
      },
    });
    return org;
  } catch (error) {
    console.error("Error in getOrgDBsByIdModel:", error);
    throw new Error("Failed to fetch getOrgDBsByIdModel");
  }
};

/**
 * @from:        src/app/api/form/databases/[id]
 * @params:      tbl_id
 * @return:      Object
 * @description: Хүснэгтийн ID-гаар харьяалагдах байгууллага болон өгөгдлийн сангийн бүтцийг авах
 */
const getOrgTablesByIdModel = async (tbl_id: number) => {
  try {
    const table = await prisma.md_table.findUnique({
      select: { form_id: true, db_id: true },
      where: {
        id: tbl_id,
      },
    });

    if (!table) return null;

    const db = await prisma.md_database.findUnique({
      select: { id: true, org_id: true },
      where: {
        id: table?.db_id,
      },
    });

    if (!db) return null;
    const org = await prisma.md_organization.findUnique({
      select: {
        id: true,
        name: true,
        databases: {
          select: {
            id: true,
            name: true,
            is_active: true,
            tables: {
              select: {
                id: true,
                name: true,
                is_active: true,
                indicators: {
                  select: {
                    id: true,
                    name: true,
                    indicators_classifications: {
                      select: {
                        // id: true,
                        indicator_id: true,
                        classification_id: true,
                        classification: {
                          select: {
                            id: true,
                            name: true,
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
        id: db?.org_id,
      },
    });
    return org;
  } catch (error) {
    console.error("Error in getOrgTablesByIdModel:", error);
    throw new Error("Failed to fetch getOrgTablesByIdModel");
  }
};
////////getOrgTablesByIdModel - old - getTableListbyDbId
/**
 * @from:        src/app/api/form/databases/[id]
 * @params:      id
 * @return:      Object
 * @description: Өгөгдлийн сангийн ID-гаар хүснэгтүүдийн жагсаалтыг авах
 */
const getTableListbyDbId = async (id: number) => {
  try {
    const db = await prisma.md_database.findUnique({
      select: { id: true, name: true, org_id: true },
      where: {
        id: id,
      },
    });
    if (!db) return null;

    const tables = await prisma.md_table.findMany({
      select: {
        id: true,
        name: true,
        is_active: true,
      },
      where: {
        db_id: db.id,
        is_active: true,
      },
    });

    const data = { tables, db };

    return data;
  } catch (error) {
    console.error("Error in getOrgTablesByIdModel:", error);
    throw new Error("Failed to fetch getOrgTablesByIdModel");
  }
};

/**
 * @from:        src/app/api/form/databases/[id]
 * @params:      form_id
 * @return:      Object
 * @description: Маягтын ID-гаар харьяалагдах байгууллага болон маягтуудын бүтцийг авах
 */
const getOrgFormsByIdModel = async (form_id: number) => {
  try {
    const form = await prisma.md_form.findUnique({
      select: { id: true, db_id: true },
      where: {
        id: Number(form_id),
      },
    });
    if (!form) return null;
    const db = await prisma.md_database.findUnique({
      select: { id: true, org_id: true },
      where: {
        id: form?.db_id,
      },
    });
    if (!db) return null;

    const formByOrg = await prisma.md_organization.findUnique({
      select: {
        id: true,
        name: true,
        databases: {
          select: {
            id: true,
            name: true,
            is_active: true,
            forms: {
              select: {
                id: true,
                name: true,
                is_active: true,
              },
            },
          },
        },
      },
      where: {
        id: db?.org_id,
      },
    });
    return formByOrg;
  } catch (error) {
    console.error("Error in getOrgFormsByIdModel:", error);
    throw new Error("Failed to fetch getOrgFormsByIdModel");
  }
};

////////getOrgTablesByIdModel - old - getTableListbyDbId
/**
 * @from:        src/app/api/form/databases/[id]
 * @params:      id
 * @return:      Object
 * @description: Өгөгдлийн сангийн ID-гаар маягтуудын жагсаалтыг авах
 */
const getFormListbyDbId = async (id: number) => {
  try {
    const db = await prisma.md_database.findUnique({
      select: { id: true, name: true, org_id: true },
      where: {
        id: id,
      },
    });

    if (!db) return null;
    const forms = await prisma.md_form.findMany({
      select: {
        id: true,
        name: true,
        is_active: true,
      },
      where: {
        db_id: db.id,
      },
    });

    const data = { forms, db };

    return data;
  } catch (error) {
    console.error("Error in getOrgTablesByIdModel:", error);
    throw new Error("Failed to fetch getOrgTablesByIdModel");
  }
};
/**
 * @from:        src/app/api/form/databases/[id]
 * @params:      db_id, tbl_id, form_id
 * @return:      Object
 * @description: Өгөгдлийн сан, хүснэгт эсвэл маягтын ID-гаар байгууллагын бүтцийг авах
 */
const getFormsByDbIdModel = async (
  db_id: number = 0,
  tbl_id: number = 0,
  form_id: number = 0
) => {
  try {
    const form = await prisma.md_form.findUnique({
      select: { id: true, db_id: true },
      where: {
        id: form_id,
      },
    });

    const table = await prisma.md_table.findUnique({
      select: { form_id: true, db_id: true },
      where: {
        id: tbl_id,
      },
    });

    const db = await prisma.md_database.findUnique({
      select: { id: true, org_id: true },
      where: {
        id: db_id == 0 ? (form_id == 0 ? table?.db_id : form?.db_id) : db_id,
      },
    });

    const org = await prisma.md_organization.findUnique({
      select: {
        id: true,
        name: true,
        databases: {
          select: {
            id: true,
            name: true,
            forms: {
              select: {
                id: true,
                name: true,
              },
            },
            tables: {
              select: {
                id: true,
                name: true,
                indicators: {
                  select: {
                    id: true,
                    name: true,
                    indicators_classifications: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id: db?.org_id,
      },
    });

    return org;
  } catch (error) {
    console.error("Error in getFormsByOrgId:", error);
    throw new Error("Failed to fetch forms");
  }
};

/**
 * @from:        src/app/api/form/[id]
 * @params:      form_id, updateForm
 * @return:      Object
 * @description: Маягтын мэдээллийг шинэчлэх
 */
const updateFormModel = async (form_id: number, updateForm: any) => {
  const {
    db_id,
    name,
    code,
    description,
    confirmed_date,
    decree_num,
    confirmed_org1,
    confirmed_org2,
    sector_id,
    sector_other,
    sub_sector,
    coorperate_org,
    source_id,
    source_other,
    collection_method_id,
    collection_method_other,
    frequency_id,
    frequency_other,
    collection_started_date,
    dissimenation_level_id,
    is_form_guide,
    form_guide_decree_num,
    collected_officer,
    security_level_id,
    owner_department,
    owner_email,
    owner_phone,
    form_generated_date,
    form_updated_date,
    form_table_count,
    estimated_indicators,
    keywords,
    files,
    is_active,
    version,
  } = updateForm;
  const source = source_id?.map((item: any) => {
    return { id: item };
  });
  const collection_method = collection_method_id?.map((item: any) => {
    return { id: item };
  });
  const now = new Date();
  const updated_date = now.toISOString();
  const confirmedDate = confirmed_date
    ? new Date(confirmed_date).toISOString()
    : null;

  const form = await prisma.md_form.update({
    where: {
      id: form_id,
    },
    data: {
      db_id,
      name,
      code,
      description,
      decree_num,
      confirmed_org1,
      confirmed_org2,
      sector_id,
      sector_other,
      sub_sector,
      coorperate_org,
      source_id: source,
      source_other,
      collection_method_id: collection_method,
      collection_method_other,
      frequency_id,
      frequency_other,
      collection_started_date: Number(collection_started_date),
      dissimenation_level_id,
      is_form_guide,
      form_guide_decree_num,
      collected_officer,
      security_level_id,
      owner_department,
      owner_email,
      owner_phone,
      form_generated_date: form_generated_date,
      form_updated_date: form_updated_date,
      estimated_indicators,
      keywords,
      form_table_count: Number(form_table_count),
      confirmed_date: confirmedDate,
      files,
      is_active,
      version: version,
      updated_date,
    },
  });

  return form;
};

/**
 * @from:        src/app/api/form
 * @params:      -
 * @return:      Array
 * @description: Маягтуудын жагсаалтыг авах (файлгүй)
 */
const getFormsByNameModel = async () => {
  try {
    const forms = await prisma.md_form.findMany({
      where: {
        files: {
          equals: null,
        },
      },
      select: {
        id: true,
        db_id: true,
        code: true,
        name: true,
        decree_num: true,
        files: true,
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
    });

    return forms;
  } catch (error) {
    console.error("Error in getFormsByNameModel:", error);
    throw new Error("Failed to fetch forms");
  }
};

/**
 * @from:        src/app/(site)/form/page.tsx
 * @params:      form_name, sectorId, orgId
 * @return:      Object
 * @description: Маягтыг шүүлтүүрээр хайх (байгууллага болон салбараар)
 */
const getFormByFilter = async (
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
      RIGHT JOIN lib_sector d on d.id = a.sector_id
      WHERE 1 = 1 and a.is_active = true  ${whereStr}
      ) A RIGHT JOIN md_organization d ON d.id = a.org_id
    GROUP BY d.id, d.name
    ORDER BY d.name  `;

  let querySector = `SELECT sectorid as id, sectorcode as code, sectorname name, cast(count(a.id) as int) data_count FROM (
    SELECT a.id, a.db_id, a.name, sector_id, d.id sectorid, d.code sectorcode, d.name sectorname FROM public.md_form a 
        INNER JOIN public.md_database c on c.id = a.db_id
        RIGHT JOIN lib_sector d on d.id = a.sector_id
          WHERE 1 = 1 and a.is_active = true ${whereStr1}
      ) A
    GROUP BY  sectorid, sectorcode, sectorname
    ORDER BY sectorname
 `;
  try {
    const dataByOrg = await prisma.$queryRaw`${Prisma.raw(queryOrg)}`;

    const dataBySector = await prisma.$queryRaw`${Prisma.raw(querySector)}`;

    return { dataByOrg, dataBySector };
  } catch (error) {
    console.error("Error in getFormByFilter org and sector:", error);
    throw new Error("Failed to fetch indicator");
  }
};

/**
 * @from:        src/app/api/form/create
 * @params:      data
 * @return:      Object
 * @description: Шинэ маягт үүсгэх эсвэл шинэчлэх
 */
const createFormModel = async (data: any) => {
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;

  const {
    id,
    db_id,
    name,
    code,
    description,
    confirmed_date,
    decree_num,
    confirmed_org1,
    confirmed_org2,
    sector_id,
    sector_other,
    sub_sector,
    coorperate_org,
    source_id,
    source_other,
    collection_method_id,
    collection_method_other,
    frequency_id,
    frequency_other,
    collection_started_date,
    dissimenation_level_id,
    is_form_guide,
    form_guide_decree_num,
    collected_officer,
    security_level_id,
    owner_department,
    owner_email,
    owner_phone,
    form_generated_date,
    form_updated_date,
    form_table_count,
    estimated_indicators,
    keywords,
    files,
    is_active,
    version,
  } = data;
  const source = source_id?.map((item: any) => {
    return { id: item };
  });
  const collection_method = collection_method_id?.map((item: any) => {
    return { id: item };
  });
  const now = new Date();
  const created_date = now.toISOString();
  const updated_date = now.toISOString();
  const confirmedDate = confirmed_date
    ? new Date(confirmed_date).toISOString()
    : null;
  try {
    if (id) {
      const form = await prisma.md_form.update({
        where: {
          id: id,
        },
        data: {
          db_id,
          name,
          code,
          description,
          decree_num,
          confirmed_org1,
          confirmed_org2,
          sector_id,
          sector_other,
          sub_sector,
          coorperate_org,
          source_id: source,
          source_other,
          collection_method_id: collection_method,
          collection_method_other,
          frequency_id,
          frequency_other,
          collection_started_date: Number(collection_started_date),
          dissimenation_level_id,
          is_form_guide,
          form_guide_decree_num,
          collected_officer,
          security_level_id,
          owner_department,
          owner_email,
          owner_phone,
          form_generated_date: form_generated_date,
          form_updated_date: form_updated_date,
          estimated_indicators,
          keywords,
          form_table_count: Math.abs(Number(form_table_count)),
          confirmed_date: confirmedDate,
          files,
          is_active,
          version: version,
          updated_date: updated_date,
          updated_user: Number(user_id),
        },
      });
      const logForm = await prisma.log_form.create({
        data: {
          type: "UPDATE",
          form_id: form.id,
          db_id: form.db_id,
          name: form.name,
          code: form.code,
          description: form.description,
          decree_num: form.decree_num,
          confirmed_org1: form.confirmed_org1,
          confirmed_org2: form.confirmed_org2,
          sector_id: form.sector_id,
          sector_other: form.sector_other,
          sub_sector: form.sub_sector,
          coorperate_org: form.coorperate_org,
          source_id: source,
          source_other: form.source_other,
          collection_method_id: collection_method,
          collection_method_other: form.collection_method_other,
          frequency_id: form.frequency_id,
          frequency_other: form.frequency_other,
          collection_started_date: form.collection_started_date,
          dissimenation_level_id: form.dissimenation_level_id,
          is_form_guide: form.is_form_guide,
          form_guide_decree_num: form.form_guide_decree_num,
          collected_officer: form.collected_officer,
          security_level_id: form.security_level_id,
          owner_department: form.owner_department,
          owner_email: form.owner_email,
          owner_phone: form.owner_phone,
          form_generated_date: form.form_generated_date,
          form_updated_date: form.form_updated_date,
          estimated_indicators: form.estimated_indicators,
          keywords: form.keywords,
          form_table_count: form.form_table_count,
          confirmed_date: form.confirmed_date,
          files: form.files,
          is_active: form.is_active,
          version: form.version,
          created_date: form.created_date,
          created_user: form.created_user,
          updated_date: form.updated_date,
          updated_user: form.updated_user,
        },
      });
      return form;
    } else {
      const form = await prisma.md_form.create({
        data: {
          db_id,
          name,
          code,
          description,
          decree_num,
          confirmed_org1,
          confirmed_org2,
          sector_id,
          sector_other,
          sub_sector,
          coorperate_org,
          source_id: source,
          source_other,
          collection_method_id: collection_method,
          collection_method_other,
          frequency_id,
          frequency_other,
          collection_started_date: Number(collection_started_date),
          dissimenation_level_id,
          is_form_guide,
          form_guide_decree_num,
          collected_officer,
          security_level_id,
          owner_department,
          owner_email,
          owner_phone,
          form_generated_date: form_generated_date,
          form_updated_date: form_updated_date,
          estimated_indicators,
          keywords,
          form_table_count: Number(form_table_count),
          confirmed_date: confirmedDate,
          files,
          is_active,
          version: version,
          created_date: created_date,
          created_user: Number(user_id),
        },
      });
      const logForm = await prisma.log_form.create({
        data: {
          type: "CREATE",
          form_id: form.id,
          db_id: form.db_id,
          name: form.name,
          code: form.code,
          description: form.description,
          decree_num: form.decree_num,
          confirmed_org1: form.confirmed_org1,
          confirmed_org2: form.confirmed_org2,
          sector_id: form.sector_id,
          sector_other: form.sector_other,
          sub_sector: form.sub_sector,
          coorperate_org: form.coorperate_org,
          source_id: source,
          source_other: form.source_other,
          collection_method_id: collection_method,
          collection_method_other: form.collection_method_other,
          frequency_id: form.frequency_id,
          frequency_other: form.frequency_other,
          collection_started_date: form.collection_started_date,
          dissimenation_level_id: form.dissimenation_level_id,
          is_form_guide: form.is_form_guide,
          form_guide_decree_num: form.form_guide_decree_num,
          collected_officer: form.collected_officer,
          security_level_id: form.security_level_id,
          owner_department: form.owner_department,
          owner_email: form.owner_email,
          owner_phone: form.owner_phone,
          form_generated_date: form.form_generated_date,
          form_updated_date: form.form_updated_date,
          estimated_indicators: form.estimated_indicators,
          keywords: form.keywords,
          form_table_count: form.form_table_count,
          confirmed_date: form.confirmed_date,
          files: form.files,
          is_active: form.is_active,
          version: form.version,
          created_date: form.created_date,
          created_user: form.created_user,
          updated_date: form.updated_date,
          updated_user: form.updated_user,
        },
      });
      return form;
    }
  } catch (error) {
    console.error("Error in createFormModel:", error);
    throw new Error("Failed to create form");
  }
};

export {
  createFormModel,
  getFormByFilter,
  getFormListbyDbId,
  getFormModel,
  getFormsByDbIdModel,
  getFormsByNameModel,
  getFormsModel,
  getOrgDBsByIdModel,
  getOrgFormsByIdModel,
  getOrgTablesByIdModel,
  getTableListbyDbId,
  updateFormModel,
};
