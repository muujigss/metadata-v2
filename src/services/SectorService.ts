const getSector = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/sector`, {
    cache: "no-cache",
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const getSectorId = async (id: number) => {
  const res = await fetch(`${process.env.BASE_URL}/api/sector/${id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export { getSector, getSectorId };
