import LogoPics from "@/components/layout/LogoPics";
import React from "react";
import "../styles/globals.css";

const LoginLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="mn">
      <head>
        <title>Төрөлжсөн бүртгэлийн нэгдсэн сан</title>
      </head>

      <body>
        <div className={` container max-w-lg mx-auto`}>
          <main>
            <div className=" m-6 flex justify-center">
              <LogoPics />
            </div>
            <div className=" flex flex-wrap items-center container mx-auto justify-center self-stretch">
              <div className="flex flex-col items-start justify-between gap-4 w-auto">
                <h1 className="uppercase text-text-title-large text-white">
                  Төрөлжсөн бүртгэлийн нэгдсэн сан
                </h1>
              </div>
            </div>
            <div> {children}</div>
          </main>
        </div>
      </body>
    </html>
  );
};

export default LoginLayout;
