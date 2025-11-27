import React from "react";
import { Box, Grid2 } from "@mui/material";
import DashboardCard from "./DashBoardCard";
import BarChart from "./BarChart";
import {
  getCovertDataSource,
  getCovertDataPie,
  getCovertLineSource,
} from "@/utils/dashboardConvertData";
import PieChart from "./PieChart";
import LineChart from "./LineChart";

const ChartList = ({
  data,
  filterData,
  title,
  subtitle,
  chartType,
  chartAxis,
}: {
  data: any;
  filterData: any;
  title: string;
  subtitle: string;
  chartType: string;
  chartAxis: string;
}) => {
  const graphData =
    chartType == "bar" || chartType == "line"
      ? getCovertDataSource(data)
      : // : chartType == "line"
        // ? getCovertLineSource(data)
        getCovertDataPie(data);

  return (
    <Grid2 size={{ xs: 12, md: 4 }}>
      <DashboardCard title={title} subtitle={subtitle}>
        {chartType == "bar" ? (
          <BarChart graphData={graphData} chartAxis={chartAxis} />
        ) : (
          <PieChart graphData={graphData} />
        )}
      </DashboardCard>
    </Grid2>
  );
};

export default ChartList;
