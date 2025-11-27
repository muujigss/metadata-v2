"use client";
import { Box, Typography } from "@mui/material";
import ReactECharts from "echarts-for-react";

const PieChart = ({ graphData }: { graphData: any }) => {
  const { names, values, seriesName } = graphData;

  const option = {
    color: ["#1565c0", "#1637c3", "#3475a6", "#6d9c40", "#d48e33"],
    tooltip: {
      trigger: "item",
    },
    dataset: [
      {
        source: values,
      },
    ],
    legend: {
      top: "top",
    },
    series: [
      {
        type: "pie",
        z: 10,
        radius: ["40%", "70%"],
        // center: ["67%", "50%"],
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          show: true,
          textStyle: {
            // width: 300,
            rich: {
              fw300: {
                fontWeight: 500,
              },
            },
            fontSize: 13,
          },
          formatter: function (params: any) {
            return params.value.value;
          },
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <ReactECharts option={option} style={{ height: 350, width: "100%" }} />
    </Box>
  );
};

export default PieChart;
