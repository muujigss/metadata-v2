import LogoPics from "@/components/layout/LogoPics";
import React from "react";
import "../styles/globals.css";

const LoginLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Төрийн мета өгөгдлийн нэгдсэн сан</title>
      </head>
      <body className="m-0 p-0 h-full overflow-hidden bg-[#080812]">
        <div className="relative w-full h-full bg-[#080812] top-glow overflow-hidden">
          <div className="absolute inset-0 -top-[220px] bg-[url('/v2/bg-pattern.png')] bg-cover bg-no-repeat z-0"></div>
          <div className="relative z-10 h-full overflow-y-auto">
            <div className="m-6 flex justify-center">
              <LogoPics />
            </div>
            <div className="flex flex-wrap items-center container mx-auto justify-center self-stretch">
              <div className="flex flex-col items-start justify-between gap-4 w-auto">
                <h1 className="uppercase text-text-title-large bg-gradient-to-t from-primary-default to-tertirary-high bg-clip-text text-transparent">
                  Төрийн мета өгөгдлийн нэгдсэн сан
                </h1>
              </div>
            </div>
            <div>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default LoginLayout;
