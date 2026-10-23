"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import "../styles/globals.css";

import { StyledRoot } from "@/components/admin/theme/StyledRoot";
import Footer from "@/components/layout/Footer";
import { Box, CssBaseline } from "@mui/material";
import Header from "./Header";
import UserProvider from "@/components/providers/UserProvider";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <>
      <AppRouterCacheProvider>
        <StyledRoot>
          <QueryClientProvider client={queryClient}>
            <UserProvider>
              <Box
                width={"100%"}
                height={"screen"}
                sx={{ display: "flex", position: "relative", left: 0, top: 0 }}
              >
                <CssBaseline />
                <Header />
                <Box
                  component={"main"}
                  className="admin-content"
                  sx={{
                    position: "relative",
                    top: "64px",
                    padding: "15px",
                    flexGrow: 1,
                    minWidth: 0,
                    minHeight: "calc(100vh - 64px)",
                    // height: "100vh",
                    // overflow: "auto",
                  }}
                >
                  {children}
                </Box>
              </Box>
            </UserProvider>
          </QueryClientProvider>
          {/* <Footer /> */}
        </StyledRoot>
      </AppRouterCacheProvider>
    </>
  );
};

export default AdminLayout;
