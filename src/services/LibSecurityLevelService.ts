const getSecurityLevels = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/security-level`, {
    cache: "default",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export default getSecurityLevels;
