import { useContext, useEffect } from "react";
import CurrentUserContext, { ICurrentUserContext } from "./context";

const useCurrentUser = () => {
  const { userInfo, setUserInfo } = useContext(
    CurrentUserContext
  ) as ICurrentUserContext;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userObj: any = {
      firstname: localStorage.getItem("firstname"),
      lastname: localStorage.getItem("lastname"),
      user_level: localStorage.getItem("user_level"),
      org_id: localStorage.getItem("org_id"),
      email: localStorage.getItem("email"),
      id: localStorage.getItem("user_id"),
      organization: {
        name: localStorage.getItem("org_name"),
      },
      roles:
        localStorage.getItem("roles") !== "null" &&
        localStorage.getItem("roles") !== undefined
          ? JSON.parse(localStorage.getItem("roles")!)
          : null,
    };

    // Only update once
    if (!userInfo) {
      setUserInfo(userObj);
    }
  }, [userInfo, setUserInfo]); // runs after render

  return { userInfo, setUserInfo };
};

export default useCurrentUser;
