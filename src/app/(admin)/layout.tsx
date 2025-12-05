"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import "../styles/globals.css";

import { StyledRoot } from "@/components/admin/theme/StyledRoot";
import Footer from "@/components/layout/Footer";
import { Box, CssBaseline } from "@mui/material";
import Header from "./Header";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <html lang="en">
      <head>
        <title>Төрөлжсөн бүртгэлийн нэгдсэн сан</title>
      </head>
      <body>
        <AppRouterCacheProvider>
          <StyledRoot>
            <QueryClientProvider client={queryClient}>
              <Box
                width={"100%"}
                height={"screen"}
                sx={{ display: "flex", position: "relative", left: 0, top: 0 }}
              >
                <CssBaseline />
                <Header />
                <Box
                  component={"main"}
                  sx={{
                    position: "relative",
                    top: "64px",
                    padding: "15px",
                    flexGrow: 1,
                    // height: "100vh",
                    // overflow: "auto",
                  }}
                >
                  {children}
                </Box>
              </Box>
            </QueryClientProvider>
            {/* <Footer /> */}
          </StyledRoot>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default AdminLayout;
