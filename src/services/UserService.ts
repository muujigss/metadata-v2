"use server";
import { IUser } from "@/interfaces/IUser";
import { cookies } from "next/headers";

const loginWithUser = async (username: string, password: string) => {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    const { user, token, success, message } = data;

    if (!success) {
      throw new Error("Error in login test: " + message);
    } else {
      const cookieStore = cookies();

      cookieStore.set("access-token", token);
      cookieStore.set("firstname", user.firstname);
      cookieStore.set("org_id", user.org_id);
      cookieStore.set("org_name", user.org_name);
      cookieStore.set("user_id", user.id);
      cookieStore.set("roles", user.roles);
      cookieStore.set("user_level", user.user_level);

      return { user, status: success };
    }
  } catch (error) {
    console.log({ error });
    return { success: false };
  }
};

const logOutUser = async () => {
  const cookieStore = cookies();
  cookieStore.delete("access-token");
  cookieStore.delete("firstname");
  cookieStore.delete("org_id");
  cookieStore.delete("org_name");
  cookieStore.delete("user_id");
  cookieStore.delete("roles");
  cookieStore.delete("user_level");

  return { success: true };
};

const createUserService = async (data: IUser) => {
  const res = await fetch(`${process.env.BASE_URL}/api/user/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create user data");
  }

  return res.json();
};

const changePasswordService = async (data: any) => {
  const res = await fetch(`${process.env.BASE_URL}/api/user/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to changePasswordService user data");
  }

  return res.json();
};
const forgotPasswordService = async (data: any) => {
  const res = await fetch(`${process.env.BASE_URL}/api/user/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to forgorPasswordService user data");
  }

  return res.json();
};

const getUserService = async (user_level: number, org_id: number) => {
  // console.log("getUserService",`${process.env.BASE_URL}/api/user?user_level=${user_level}&org_id=${org_id}`)
  const res = await fetch(
    `${process.env.BASE_URL}/api/user?user_level=${user_level}&org_id=${org_id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }

  return res.json();
};

const getUserDetailService = async (id: number) => {
  // console.log("fetch",`${process.env.BASE_URL}/api/user/${id}`);
  const res = await fetch(`${process.env.BASE_URL}/api/user/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user detail data");
  }

  return res.json();
};

const deleteUserDetailService = async (id: number) => {
  const res = await fetch(`${process.env.BASE_URL}/api/user/${id}`, {
    headers: {
      method: "DELETE",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user detail data");
  }

  return res.json();
};

export {
  deleteUserDetailService,
  loginWithUser,
  logOutUser,
  createUserService,
  getUserService,
  getUserDetailService,
  changePasswordService,
  forgotPasswordService,
};
