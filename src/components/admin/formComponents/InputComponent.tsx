import React from "react";
import { Box } from "@mui/material";
import { StyledInput } from "../theme/InputTheme";
const InputComponent = ({
  type,
  name,
  label,
  value,
  onChange,
  errors,
}: {
  type: string;
  name: string;
  label: string;
  value?: any;
  onChange: any;
  errors?: any;
}) => {
  return (
    <Box
      sx={{
        display: "flex-col",
        alignItems: "center",
        justifyContent: "space-between",
        columnSpan: 2,
        "& > :not(style)": {
          width: "100%",
        },
      }}
    >
      <StyledInput
        name={name}
        className={"input"}
        id={`outlined-${name}`}
        type={type}
        defaultValue={value}
        onChange={onChange}
        placeholder={label}
      />

      {errors && (
        <p className="text-red-600 text-text-body-small mt-2 p-1">{errors}</p>
      )}
    </Box>
  );
};

export default InputComponent;
