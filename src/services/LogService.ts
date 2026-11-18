import { API_BASE } from "@/utils/apiBase";
export const dynamic = 'force-dynamic';

const getLog = async (type: number = 1, page: number = 1, limit: number = 10) => {
  const res = await fetch(`${API_BASE}/api/log?type=${type}&page=${page}&limit=${limit}`, {
    cache: "no-store",
    next: { revalidate: 0 }
  });

  if (!res.ok) {
    throw new Error("getLog Failed to fetch data");
  }

  return res.json();
};

export { getLog };
