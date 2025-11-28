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
  desabled,
}: {
  type: string;
  name: string;
  label: string;
  value?: any;
  onChange: any;
  errors?: any;
  desabled?: boolean;
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
        // className={"input"}
        disabled={desabled}
        className={`${desabled && "cursor-not-allowed bg-gray-300"} input`}
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
