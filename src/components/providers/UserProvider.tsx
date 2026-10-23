"use client";
import CurrentUserContext from "@/utils/context";
import React, { useState } from "react";
import type { IUser } from "@/interfaces/IUser";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<IUser | null>(null);

  return (
    <CurrentUserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default UserProvider;
