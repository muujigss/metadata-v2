import { API_BASE } from "@/utils/apiBase";
const getCollectionMethods = async () => {
  const res = await fetch(`${API_BASE}/api/collection-method`, {
    cache: "default",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export default getCollectionMethods;
