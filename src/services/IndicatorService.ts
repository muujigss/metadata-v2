import { IIndicator } from "@/interfaces/IIndicators";

const getIndicators = async (page: number) => {
  const res = await fetch(
    `${process.env.BASE_URL}/api/indicator?page=${page}`,
    {
      cache: "no-cache",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const getIndicator = async (id: number): Promise<IIndicator> => {
  const res = await fetch(`${process.env.BASE_URL}/api/indicator/${id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch indicator detail data");
  }

  return res.json();
};

// const getFormsByDbId = async (id: number, form_id: number, tbl_id: number) => {
//   const res = await fetch(
//     `${process.env.BASE_URL}/api/form/databases/${id}?form_id=${form_id}&tbl_id=${tbl_id}`,
//     {
//       cache: "no-cache",
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch data");
//   }

//   return res.json();
// };

const createIndicatorService = async (data: IIndicator) => {
  const res = await fetch(`${process.env.BASE_URL}/api/indicator/create`, {
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

const getIndicatorListByTblId = async (id: number) => {
  const res = await fetch(`${process.env.BASE_URL}/api/indicator/table/${id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
const getPrevIndicator = async (id: number) => {
  const res = await fetch(
    `${process.env.BASE_URL}/api/indicator/table/prev/${id}`,
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
  createIndicatorService,
  getIndicator,
  getIndicatorListByTblId,
  getIndicators,
  getPrevIndicator,
};
