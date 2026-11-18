import { API_BASE } from "@/utils/apiBase";
const getFrequencies = async () => {
  const res = await fetch(`${API_BASE}/api/frequency`, {
    cache: "default",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export default getFrequencies;
