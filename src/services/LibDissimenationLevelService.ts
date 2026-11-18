import { API_BASE } from "@/utils/apiBase";
export const getDissimenationLevel = async () => {
  const res = await fetch(`${API_BASE}/api/dissimenation`, {
    cache: "no-cache",
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
