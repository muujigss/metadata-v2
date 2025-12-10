const getDynamicService = async (slug: string) => {
  const res = await fetch(`${process.env.BASE_URL}/api/dynamic/${slug}`, {
    cache: "default",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const createDynamicModel = async (mName: string, body: any) => {
  const res = await fetch(`${process.env.BASE_URL}/api/dynamic/${mName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
};
  
export { getDynamicService, createDynamicModel };