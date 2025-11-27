"use client";
import { Box, Typography } from "@mui/material";

import ReactECharts from "echarts-for-react";

const TreeView = ({ data, activeName }: any) => {
  const option = {
    color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
      formatter: (params: any) => {
        return params.data.name;
      },
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        type: "tree",
        data: [
          {
            name: activeName,
            children: data,
            symbolSize: 16,
            symbol: "circle",
            itemStyle: {
              color: "#AD546F",
            },
            label: {
              show: true,
              formatter: (params: any) => {
                return params.data.name;
              },
              width: 100,
              overflow: "breakAll",
              fontSize: 10,
              borderColor: "#D79034",
              borderWidth: 2,
              borderRadius: 10,
              padding: 4,
              color: "#fff",
              backgroundColor: "#AD546F",
            },
          },
        ],
        symbolSize: 8,
        lineStyle: {
          color: "#ccc",
          width: 1,
          type: "solid",
        },
        emphasis: {
          focus: "descendant",
        },
        layout: "orthogonal",
        top: "5%",
        bottom: "5%",
        symbol: "emptyCircle",
        zoom: 1,
        roam: "move",
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
        initialTreeDepth: 4,
      },
    ],
  };
  return (
    <Box>
      <ReactECharts
        option={option}
        style={{ width: "100%", height: "800px" }}
      />
    </Box>
  );
};

export default TreeView;
