"use client";
const SearchService = async (value: any) => {
  try {
    const response = await fetch(`/api/elastic`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: value }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    const search = JSON.parse(data.response);

    const groupedData = search.hits.hits.reduce((acc: any, item: any) => {
      if (item.highlight) {
        const key = item._source._type;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
      }
      return acc;
    }, {});

    return groupedData;
  } catch (error) {
    console.log("error:", error);
  }
};

export { SearchService };
