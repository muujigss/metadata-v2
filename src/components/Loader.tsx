"use client";

import { Spinner } from "flowbite-react";
import { loaderTheme } from "./componentTheme/LoaderTheme";
import { Box } from "@mui/material";

const Loader = () => {
  return (
    <div className="container">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 1,
        }}
      >
        <Spinner
          aria-label="Center-aligned spinner example"
          className="text-center"
          size={"md"}
          color={"#005baa"}
          theme={loaderTheme}
        />
      </Box>
    </div>
  );
};
export default Loader;
