import { API_BASE } from "@/utils/apiBase";
const getSources = async () => {
  const res = await fetch(`${API_BASE}/api/source`, {
    cache: "default",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export default getSources;
