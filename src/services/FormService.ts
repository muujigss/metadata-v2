import { IForm } from "@/interfaces/IForm";

const getForms = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/form`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export default getForms;

const getForm = async (id: number): Promise<IForm> => {
  const res = await fetch(`${process.env.BASE_URL}/api/form/${id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch form detail data");
  }

  return res.json();
};
const getFormsByDbId = async (id: number, form_id: number, tbl_id: number) => {
  const res = await fetch(
    `${process.env.BASE_URL}/api/form/databases/${id}?form_id=${form_id}&tbl_id=${tbl_id}`,
    {
      cache: "no-cache",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const uploadFormFile = async (id: number, data: any) => {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/form/${id}`, {
      method: "POST",
      // cache: "no-cache",
      body: data,
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

const getFormsByNameService = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/form`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const createForm = async (data: any) => {
  const res = await fetch(`${process.env.BASE_URL}/api/form/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to create form");
  }
  return res.json();
};
const updateFrom = async (form_id: number, data: any) => {
  const res = await fetch(`${process.env.BASE_URL}/api/form/${form_id}`, {
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
export {
  getForms,
  getForm,
  getFormsByDbId,
  uploadFormFile,
  getFormsByNameService,
  createForm,
  updateFrom,
};
