"use client";
import CurrentUserContext from "@/utils/context";
import React, { useState } from "react";

import "@/app/styles/globals.css";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <html lang="mn">
      <body>
        <CurrentUserContext.Provider value={{ userInfo, setUserInfo }}>
          {children}
        </CurrentUserContext.Provider>
      </body>
    </html>
  );
};

export default Layout;
