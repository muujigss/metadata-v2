import React from "react";
import { Box, Tab, Tabs } from "@mui/material";

interface TabComponetsProps {
  tabData: any;
  value: string;
  handleChange: any;
}
const TabComponets = ({ tabData, value, handleChange }: TabComponetsProps) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={value} onChange={handleChange}>
        {tabData.map((item: any, index: number) => {
          return <Tab key={index} label={item.label} value={item.value} />;
        })}
      </Tabs>
    </Box>
  );
};
export default TabComponets;
