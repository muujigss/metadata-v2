"use server";

const getNotifCount = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/notif`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch getNotifCount data");
  }

  return res.json();
};

export { getNotifCount };
