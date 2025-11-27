export const getDissimenationLevel = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/dissimenation`, {
    cache: "no-cache",
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
