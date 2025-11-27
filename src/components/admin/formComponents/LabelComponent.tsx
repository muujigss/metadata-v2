import { Typography } from "@mui/material";
import React from "react";
const LabelComponent = ({ label }: { label: string }) => {
  return (
    <Typography
      variant="body2"
      className="text-text-body-medium2 text-secondary-default"
    >
      {label}
    </Typography>
  );
};

export default LabelComponent;
