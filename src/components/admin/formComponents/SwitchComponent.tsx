import { Switch } from "@mui/base/Switch";
import { Box } from "@mui/material";
import React from "react";
import { SwitchRoot } from "../theme/SwitchTheme";

type ISwitchProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  defaultChecked: boolean;
};
const SwitchComponent = ({
  label,
  name,
  defaultChecked,
  onChange,
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
      />
    </Box>
  );
};

export default SwitchComponent;
