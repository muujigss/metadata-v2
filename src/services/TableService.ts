import { ITable } from "@/interfaces/ITable";

const getTables = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/table`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const getTable = async (id: number) => {
  const res = await fetch(`${process.env.BASE_URL}/api/table/admin/${id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const insertTable = async (data: ITable) => {
  const res = await fetch(`${process.env.BASE_URL}/api/table`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const getTablesByUser = async (org_id: number, db_id: number, type: string) => {
  const res = await fetch(
    `${process.env.BASE_URL}/api/admin?org=${org_id}&db=${db_id}&type=${type}`,
    {
      cache: "no-cache",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
const updateTable = async (data: ITable, tblId: any) => {
  const res = await fetch(`${process.env.BASE_URL}/api/table/admin/${tblId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
const getTablesByDB = async (db_id: number) => {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/admin/tables/${db_id}`,
      {
        cache: "no-cache",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
};
export {
  getTable,
  getTables,
  insertTable,
  getTablesByUser,
  updateTable,
  getTablesByDB,
};
