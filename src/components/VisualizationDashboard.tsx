"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import StorageIcon from "@mui/icons-material/Storage";
import DescriptionIcon from "@mui/icons-material/Description";
import AssessmentIcon from "@mui/icons-material/Assessment";

interface VisualizationDashboardProps {
  counts: {
    orgCount: number;
    dbCount: number;
    formCount: number;
    indicatorCount: number;
  };
  charts: {
    dbBySector: { name: string; value: number }[];
    dbByOrg: { name: string; value: number }[];
    dbByType: { name: string; value: number }[];
  };
}

const VisualizationDashboard: React.FC<VisualizationDashboardProps> = ({
  counts,
  charts,
}) => {
  // Chart Options
  const sectorOption = {
    title: {
      text: "Салбараар",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Өгөгдлийн сан",
        type: "pie",
        radius: "50%",
        data: charts.dbBySector,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  const typeOption = {
    title: {
      text: "Төрлөөр",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Төрөл",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: charts.dbByType,
      },
    ],
  };

  const orgOption = {
    title: {
      text: "Топ 10 Байгууллага (Өгөгдлийн тоогоор)",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: charts.dbByOrg.map((item: any) => item.name),
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
            rotate: 45,
            interval: 0,
            formatter: function (value: string) {
                return value.length > 15 ? value.substring(0, 15) + '...' : value;
            }
        }
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "Өгөгдлийн сан",
        type: "bar",
        barWidth: "60%",
        data: charts.dbByOrg.map((item: any) => item.value),
        itemStyle: {
            color: '#5470c6'
        }
      },
    ],
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card elevation={0} className="border h-full hover:shadow-md transition-shadow">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <Typography variant="subtitle1" className="text-gray-500 font-medium uppercase mb-1">
            {title}
          </Typography>
          <Typography variant="h4" className="font-bold text-gray-800">
            {value}
          </Typography>
        </div>
        <Box className={`p-3 rounded-full bg-${color}-50 text-${color}-500`}>
          {icon}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" className="py-8">
      <Typography variant="h4" className="mb-8 font-bold text-gray-800 text-center">
        Мета өгөгдлийн дүрслэл
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} className="mb-8">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Байгууллага"
            value={counts.orgCount}
            icon={<BusinessIcon fontSize="large" />}
            color="blue"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Өгөгдлийн сан"
            value={counts.dbCount}
            icon={<StorageIcon fontSize="large" />}
            color="green"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Маягт"
            value={counts.formCount}
            icon={<DescriptionIcon fontSize="large" />}
            color="purple"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Үзүүлэлт"
            value={counts.indicatorCount}
            icon={<AssessmentIcon fontSize="large" />}
            color="orange"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} className="p-6 border rounded-lg h-full">
            <ReactECharts option={sectorOption} style={{ height: "400px" }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} className="p-6 border rounded-lg h-full">
            <ReactECharts option={typeOption} style={{ height: "400px" }} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={0} className="p-6 border rounded-lg">
            <ReactECharts option={orgOption} style={{ height: "500px" }} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VisualizationDashboard;
