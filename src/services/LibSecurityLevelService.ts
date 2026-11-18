import { API_BASE } from "@/utils/apiBase";
const getSecurityLevels = async () => {
  const res = await fetch(`${API_BASE}/api/security-level`, {
    cache: "default",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export default getSecurityLevels;
