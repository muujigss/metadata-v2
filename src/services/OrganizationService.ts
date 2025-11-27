export const dynamic = 'force-dynamic';

const getOrganization = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/organization`, {
    cache: "no-store",
    next: { revalidate: 0 }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const getOrganizationById = async (id: any) => {
  const res = await fetch(`${process.env.BASE_URL}/api/organization/${id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
const createOrganization = async (data: any) => {
  const res = await fetch(`${process.env.BASE_URL}/api/organization/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res;
};

export { getOrganization, getOrganizationById, createOrganization };
