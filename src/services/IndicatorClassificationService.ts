import { API_BASE } from "@/utils/apiBase";
import { IIndicatorClassification } from "@/interfaces/IIndicatorsClassifications";

export const insertIndicatorClassification = async (
  data: IIndicatorClassification
) => {
  const res = await fetch(
    `${API_BASE}/api/indicator-classification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
