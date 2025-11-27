import { Box, MenuItem, TextField } from "@mui/material";
import * as React from "react";
import { Autocomplete } from "../theme/AutoSelectTheme";

const AutocompleteIntroduction = ({
  options,
  name,
  onchange,
  values,
  errors,
}: {
  options: any;
  name: string;
  onchange: any;
  values: any;
  errors: any;
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
        borderRadius: "8px",
      }}
    >
      <Autocomplete
        id={`select-${name}`}
        isOptionEqualToValue={(option: any, value: any) =>
          option.id === value.id
        }
        value={options?.find((item: any) => item.id === values)}
        defaultValue={options?.find((item: any) => item.id === values)}
        filterSelectedOptions
        onChange={onchange}
        options={options}
        getOptionLabel={(option: any) => option.name}
      />
      {errors && (
        <p className="text-red-600 text-text-body-small mt-2 p-1">{errors}</p>
      )}
    </Box>
  );
};

export default AutocompleteIntroduction;
