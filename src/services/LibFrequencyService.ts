const getFrequencies = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/frequency`, {
    cache: "default",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export default getFrequencies;
