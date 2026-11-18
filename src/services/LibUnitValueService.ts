import { API_BASE } from "@/utils/apiBase";
const getUnitValue = async (slug: string) => {
  const res = await fetch(`${API_BASE}/api/library/${slug}`, {
    cache: "default",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export default getUnitValue;
