const getDatabase = async (orgId: number) => {
  const res = await fetch(`${process.env.BASE_URL}/api/database?org=${orgId}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const getOneDatabaseAdmin = async (id: number) => {
  const res = await fetch(`${process.env.BASE_URL}/api/database/admin/${id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const getOneDatabase = async (id: number) => {
  const res = await fetch(`${process.env.BASE_URL}/api/database/${id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const getSpecification = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/specification`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
const getDatabaseType = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/database-type`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const getDatabaseLocation = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/database-location`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
const getLicence = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/licence`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const createDatabase = async (data: any) => {
  const res = await fetch(`${process.env.BASE_URL}/api/database/create`, {
    method: "POST",
    cache: "no-cache",
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
  getDatabase,
  getOneDatabase,
  getOneDatabaseAdmin,
  getSpecification,
  getDatabaseType,
  getDatabaseLocation,
  getLicence,
  createDatabase,
};
