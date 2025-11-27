import { IIndicatorClassification } from "@/interfaces/IIndicatorsClassifications";

export const insertIndicatorClassification = async (
  data: IIndicatorClassification
) => {
  const res = await fetch(
    `${process.env.BASE_URL}/api/indicator-classification`,
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
