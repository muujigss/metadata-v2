"use client";
import { Box } from "@mui/material";

import ReactECharts from "echarts-for-react";
import { min } from "moment";
const LineChart = ({
  graphData,
  chartAxis,
}: {
  graphData: any;
  chartAxis: string;
}) => {
  const { names, values, seriesName } = graphData;

  const data = values[1].map((item: any) => item);

  const val = data.slice(1, 22);
  const option = {
    color: ["#1565c0"],
    xAxis: {
      type: "category",
      data: seriesName,
    },
    grid: {
      top: "10%",
      left: "8%",
      right: "0%",
      bottom: "10%",
    },
    yAxis: {
      type: "value",
    },
    label: {
      show: true,
      position: "top",
      valueAnimation: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true },
      },
    },
    dataset: [
      {
        source: values,
      },
    ],
    series: names.map((name: string) => ({
      type: "line",
      name: name,
      smooth: true,
      emphasis: {
        focus: "series",
      },
      data: val,
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

export default LineChart;
