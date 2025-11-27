import { NextResponse } from "next/server";
import { Client } from "@elastic/elasticsearch";
import { prisma } from "@/utils/prisma";

export async function POST() {
  const client = new Client({
    node: `${process.env.ELASTIC_URL}`,
    auth: {
      username: `${process.env.ELASTIC_USER}`,
      password: `${process.env.ELASTIC_PASSWORD}`,
    },
    tls: { rejectUnauthorized: false },
  });

  try {
    await client.indices.delete({ index: "search-metadata-nso" });
  } catch (error) {
    return NextResponse.json({ response: "Алдаа гарлаа" });
  }

  const databases: any =
    await prisma.$queryRaw`SELECT db_id, db_name from vw_database`;
  const forms: any = await prisma.$queryRaw`SELECT * from vw_formdatabase`;
  const table: any = await prisma.$queryRaw`SELECT * from vw_tabledb`;
  const indicators: any =
    await prisma.$queryRaw`SELECT * from vw_indicatordbtab`;
  const classifications: any =
    await prisma.$queryRaw`SELECT * from vw_classificationdbs`;
  const allData = [
    ...databases.map((data: any) => ({ ...data, _type: "database" })),
    ...forms.map((data: any) => ({ ...data, _type: "form" })),
    ...indicators.map((data: any) => ({ ...data, _type: "indicator" })),
    ...table.map((data: any) => ({ ...data, _type: "table" })),
    ...classifications.map((data: any) => ({
      ...data,
      _type: "classification",
    })),
  ];

  // Index with the bulk helper
  const result = await client.helpers.bulk({
    datasource: allData,
    pipeline: "ent-search-generic-ingestion",
    onDocument: (doc) => ({ index: { _index: "search-metadata-nso" } }),
  });

  return NextResponse.json({ response: result });
}
