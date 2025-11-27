import { Switch } from "@mui/base/Switch";
import { Box } from "@mui/material";
import React from "react";
import { SwitchRoot } from "../theme/SwitchTheme";

type ISwitchProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  defaultChecked: boolean;
  desabled?: boolean;
};
const SwitchComponent = ({
  label,
  name,
  defaultChecked,
  onChange,
  desabled,
}: ISwitchProps) => {
  return (
    <Box
      sx={{
        display: "flex-col",
        alignItems: "center",
        justifyContent: "space-between",
        columnSpan: 2,
      }}
    >
      <Switch
        id={`switch-${name}`}
        slots={{
          root: SwitchRoot,
        }}
        checked={defaultChecked}
        onChange={onChange}
        disabled={desabled}
        className={`${desabled && "cursor-not-allowed bg-gray-300"}`}
      />
    </Box>
  );
};

export default SwitchComponent;
