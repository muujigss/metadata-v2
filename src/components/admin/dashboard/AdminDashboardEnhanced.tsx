"use client";
import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import ReactECharts from "echarts-for-react";
import {
  Business,
  Storage,
  TableChart,
  ShowChart,
  Description,
  Category,
} from "@mui/icons-material";
import {
  getCovertDataSource,
  getCovertDataPie,
} from "@/utils/dashboardConvertData";
import TreeViewRadial from "./TreeViewRadial";

interface AdminDashboardProps {
  mainIndicator: any;
  databaseLocations: any;
  allOrg: any;
  duplicateIndicators?: any[];
  technologyStats?: {
    totalSize: number;
    totalRows: number;
  };
}

const AdminDashboardEnhanced: React.FC<AdminDashboardProps> = ({
  mainIndicator,
  databaseLocations,
  allOrg,
  duplicateIndicators = [],
  technologyStats,
}) => {
  const theme = useTheme();
  const orgName = databaseLocations?.orgName;
  const userLevel = databaseLocations?.userLevel;
  const tblData = databaseLocations?.dbTable;
  const dbStatus = databaseLocations?.dbStatus || [];

  // Process Duplicate Data for Top 20 Pie Chart
  const topDuplicates = [...duplicateIndicators]
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
    .map((item) => ({
      name: item.name,
      value: item.count,
    }));

  const duplicatePieOption = {
    title: {
      text: "Хамгийн их давхардсан 20 үзүүлэлт",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      type: "scroll",
      orient: "vertical",
      right: 10,
      top: 20,
      bottom: 20,
      formatter: (name: string) => {
        const item = topDuplicates.find((p) => p.name === name);
        return `${name} - ${item?.value || 0}`;
      },
    },
    series: [
      {
        name: "Давхцал",
        type: "pie",
        radius: "55%",
        center: ["40%", "50%"],
        data: topDuplicates,
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

  // --- Stat Cards Data ---
  const statCards = [
    {
      title: "Өгөгдлийн сан",
      value: mainIndicator?.databases || 0,
      icon: <Storage fontSize="large" />,
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Хүснэгт",
      value: mainIndicator?.tables || 0,
      icon: <TableChart fontSize="large" />,
      color: "linear-gradient(135deg, #2af598 0%, #009efd 100%)",
    },
    {
      title: "Үзүүлэлт",
      value: mainIndicator?.indicators || 0,
      icon: <ShowChart fontSize="large" />,
      color: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
    },
    {
      title: "Маягт",
      value: mainIndicator?.forms || 0,
      icon: <Description fontSize="large" />,
      color: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
    },
    {
      title: "Ангилал",
      value: mainIndicator?.classifications || 0,
      icon: <Category fontSize="large" />,
      color: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
    },
    {
      title: "Нийт хэмжээ (MB)",
      value: technologyStats?.totalSize || 0,
      icon: <Storage fontSize="large" />,
      color: "linear-gradient(120deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
    },
    {
      title: "Нийт бичлэгийн тоо",
      value: technologyStats?.totalRows || 0,
      icon: <TableChart fontSize="large" />,
      color: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
    },
    {
      title: "Нийт хэрэглэгч",
      value: mainIndicator?.users || 0,
      icon: <Business fontSize="large" />,
      color: "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)",
    },
  ];

  // --- Chart Data Preparation ---
  const dbTypeData = getCovertDataSource(databaseLocations?.dataByDbType);
  const dbLocationData = getCovertDataPie(databaseLocations?.dbLocation);
  const dbFrequencyData = getCovertDataSource(databaseLocations?.dbFrequency);

  // --- Chart Options ---

  // 1. DB Types (Bar)
  const dbTypeOption = {
    title: { text: "Өгөгдлийн сангийн төрөл" },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "value" },
    yAxis: {
      type: "category",
      data: dbTypeData.seriesName,
      axisLabel: { width: 100, overflow: "truncate" },
    },
    series: [
      {
        name: "Тоо",
        type: "bar",
        data: dbTypeData.values[1]?.slice(1) || [],
        itemStyle: { color: "#4285F4", borderRadius: [0, 4, 4, 0] },
      },
    ],
  };

  // 2. DB Location (Pie)
  const dbLocationOption = {
    title: { text: "Өгөгдлийн сангийн байршил", left: "center" },
    tooltip: { trigger: "item" },
    legend: { orient: "vertical", left: "left", top: "middle" },
    series: [
      {
        name: "Байршил",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: { show: false, position: "center" },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: "bold" },
        },
        data: dbLocationData.values,
      },
    ],
  };

  // 3. Frequency (Bar)
  const frequencyOption = {
    title: { text: "Үзүүлэлтийн давтамж" },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      data: dbFrequencyData.seriesName,
      axisLabel: { rotate: 45 },
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Тоо",
        type: "bar",
        data: dbFrequencyData.values[1]?.slice(1) || [],
        itemStyle: { color: "#34A853", borderRadius: [4, 4, 0, 0] },
      },
    ],
  };

  // 4. Database Status (Pie)
  const dbStatusOption = {
    title: { text: "Өгөгдлийн сангийн төлөв", left: "center" },
    tooltip: { 
      trigger: "item",
      formatter: "{b}: {c} ({d}%)"
    },
    legend: { 
      orient: "vertical", 
      left: "left", 
      top: "middle" 
    },
    series: [
      {
        name: "Төлөв",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: { show: false, position: "center" },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: "bold" },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        data: dbStatus,
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
        Хяналтын хэсэг
      </Typography>

      {/* Stats Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                background: card.color,
                color: "white",
                boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)" },
                height: "100%",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  height: "100%",
                }}
              >
                <Box sx={{ mb: 1, opacity: 0.9 }}>{card.icon}</Box>
                <Typography variant="h4" fontWeight="bold">
                  {card.value.toLocaleString()}
                </Typography>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 3, height: 400 }}>
            <ReactECharts option={dbTypeOption} style={{ height: "100%" }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 3, height: 400 }}>
            <ReactECharts
              option={dbLocationOption}
              style={{ height: "100%" }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 3, height: 400 }}>
            <ReactECharts option={frequencyOption} style={{ height: "100%" }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, borderRadius: 3, height: 400 }}>
            <ReactECharts option={dbStatusOption} style={{ height: "100%" }} />
          </Paper>
        </Grid>
      </Grid>
      
      {/* Charts Row 2 - Duplicates */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: 3, height: 500 }}>
            <ReactECharts option={duplicatePieOption} style={{ height: "100%" }} />
          </Paper>
        </Grid>
      </Grid>

      {/* Tree View Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: 3, minHeight: 600 }}>
            <Typography variant="h6" gutterBottom sx={{ px: 2, pt: 1 }}>
              Мета өгөгдлийн бүтэц
            </Typography>
            <TreeViewRadial
              data={tblData}
              activeName={orgName?.org_short_name}
              userLevel={userLevel}
              allOrg={allOrg}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardEnhanced;
