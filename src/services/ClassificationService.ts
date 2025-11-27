import { IClassificationCode } from "@/interfaces/IClassificationCode";

const getClassification = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/classification`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const getClassificationId = async (id: number) => {
  const res = await fetch(`${process.env.BASE_URL}/api/classification/${id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const createClassification = async (data: any) => {
  const res = await fetch(`${process.env.BASE_URL}/api/classification/create`, {
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
const insertClassificationCode = async (data: IClassificationCode[]) => {
  const res = await fetch(`${process.env.BASE_URL}/api/classification/code`, {
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

const getClassificationListByTblId = async (id: number) => {
  const res = await fetch(
    `${process.env.BASE_URL}/api/classification/table/${id}`,
    {
      cache: "no-cache",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
export {
  getClassification,
  getClassificationId,
  createClassification,
  insertClassificationCode,
  getClassificationListByTblId,
};
