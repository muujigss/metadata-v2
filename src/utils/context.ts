import { IUser } from "@/interfaces/IUser";
import React, { createContext } from "react";

export interface ICurrentUserContext {
  userInfo: IUser | null;
  setUserInfo: React.Dispatch<React.SetStateAction<IUser | null>>;
}

const CurrentUserContext = createContext<ICurrentUserContext | null>(null);
export default CurrentUserContext;
