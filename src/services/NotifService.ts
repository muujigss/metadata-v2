"use server";

const getNotifCount = async (user_id: number, user_level: number) => {
  const res = await fetch(`${process.env.BASE_URL}/api/notif/count?user_id=${user_id}&user_level=${user_level}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch getNotifCount data");
  }

  return res.json();
};

const getNotif = async (user_id: number) => {
  const res = await fetch(`${process.env.BASE_URL}/api/notif?user_id=${user_id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch getNotifCount data");
  }

  return res.json();
};

const updateNotif = async (user_id: any, id: any) => {
  const res = await fetch(`${process.env.BASE_URL}/api/notif/${id}?user_id=${user_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

export { getNotif, getNotifCount, updateNotif };
