"use client";
import { Box } from "@mui/material";

import ReactECharts from "echarts-for-react";
const BarChart = ({
  graphData,
  chartAxis,
}: {
  graphData: any;
  chartAxis: string;
}) => {
  const { names, values, seriesName } = graphData;

  const option = {
    color: ["#1565c0", "#1637c3"],
    xAxis: {
      type: "value",
    },
    grid: {
      top: "10%",
      left: "20%",
      right: "8%",
      bottom: "10%",
    },
    yAxis: {
      type: "category",
      data: seriesName,
    },
    label: {
      show: true,
      position: "right",
      valueAnimation: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    dataset: [
      {
        source: values,
      },
    ],
    series: names.map((name: string) => ({
      type: "bar",
      seriesLayoutBy: "row",
      name: name,
      emphasis: {
        focus: "series",
      },
    })),
  };

  return (
    <Box sx={{ height: "100%" }}>
      <ReactECharts
        option={option}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: 350, width: "100%" }}
      />
    </Box>
  );
};

export default BarChart;
