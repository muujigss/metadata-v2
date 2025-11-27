import { Box } from "@mui/material";
import React from "react";

const FormBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        width: "100%",
        py: 2,
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #E0E0E0",
      }}
    >
      {children}
    </Box>
  );
};

export default FormBox;
