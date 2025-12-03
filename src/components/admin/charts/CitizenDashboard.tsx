"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  useTheme,
} from "@mui/material";
import ReactECharts from "echarts-for-react";
import {
  Business,
  Storage,
  TableChart,
  ShowChart,
  FilterList,
} from "@mui/icons-material";

interface DashboardData {
  counts: {
    organizations: number;
    databases: number;
    tables: number;
    indicators: number;
  };
  sectorData: Array<{ name: string; value: number }>;
  topOrgsData: Array<{ name: string; value: number }>;
  trendData: Array<{ month: string; databases: number; indicators: number }>;
}

const CitizenDashboard = () => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      const queryStart = start !== undefined ? start : startDate;
      const queryEnd = end !== undefined ? end : endDate;

      const params = new URLSearchParams();
      if (queryStart) params.append("startDate", queryStart);
      if (queryEnd) params.append("endDate", queryEnd);

      const response = await fetch(`/api/dashboard/citizen?${params}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    fetchData("", "");
  };

  if (loading || !data) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "white" }}>
        <Typography color="white">Мэдээлэл ачааллаж байна...</Typography>
      </Box>
    );
  }



  // 1. Sector Distribution (Donut)
  const sectorOption = {
    title: {
      text: "Салбарын тархалт",
      left: "center",
      textStyle: { fontSize: 14, fontWeight: "bold", color: "white" },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      type: "scroll",
      textStyle: { color: "white" },
    },
    series: [
      {
        name: "Салбар",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
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
            fontSize: 12,
            fontWeight: "bold",
          },
        },
        data: data.sectorData,
      },
    ],
  };

  // 2. Top Organizations (Bar)
  const topOrgsOption = {
    title: {
      text: "Топ 10 Байгууллага (Өгөгдлийн сангаар)",
      left: "center",
      textStyle: { fontSize: 14, fontWeight: "bold", color: "white" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      axisLabel: { color: "white" },
      axisLine: { lineStyle: { color: "white" } },
    },
    yAxis: {
      type: "category",
      data: data.topOrgsData.map((d) => d.name),
      axisLabel: {
        width: 100,
        overflow: "truncate",
        color: "white",
      },
      axisLine: { lineStyle: { color: "white" } },
    },
    series: [
      {
        name: "Өгөгдлийн сан",
        type: "bar",
        data: data.topOrgsData.map((d) => d.value),
        itemStyle: { color: "#4285F4" },
      },
    ],
  };

  // 3. Growth Trend (Line)
  const trendOption = {
    title: {
      text: "Өгөгдлийн өсөлт (Сүүлийн саруудад)",
      left: "center",
      textStyle: { fontSize: 14, fontWeight: "bold", color: "white" },
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Өгөгдлийн сан", "Үзүүлэлт"],
      top: 25,
      textStyle: { color: "white" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.trendData.map((d) => d.month),
      axisLabel: { color: "white" },
      axisLine: { lineStyle: { color: "white" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "white" },
      axisLine: { lineStyle: { color: "white" } },
    },
    series: [
      {
        name: "Өгөгдлийн сан",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: { focus: "series" },
        data: data.trendData.map((d) => d.databases),
        itemStyle: { color: "#34A853" },
      },
      {
        name: "Үзүүлэлт",
        type: "line",
        stack: "Total",
        areaStyle: {},
        emphasis: { focus: "series" },
        data: data.trendData.map((d) => d.indicators),
        itemStyle: { color: "#FBBC04" },
      },
    ],
  };

  // --- Summary Cards Data ---
  const summaryCards = [
    {
      title: "Байгууллага",
      count: data.counts.organizations,
      icon: <Business fontSize="large" />,
      color: "#3D4E6C26",
    },
    {
      title: "Өгөгдлийн сан",
      count: data.counts.databases,
      icon: <Storage fontSize="large" />,
      color: "#3D4E6C26",
    },
    {
      title: "Хүснэгт",
      count: data.counts.tables,
      icon: <TableChart fontSize="large" />,
      color: "#3D4E6C26",
    },
    {
      title: "Үзүүлэлт",
      count: data.counts.indicators,
      icon: <ShowChart fontSize="large" />,
      color: "#3D4E6C26",
    },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: "transparent" }}>
      {/* Header & Filter */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,0.2)",
          bgcolor: "transparent",
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="white">
          📊 Мета өгөгдлийн нэгдсэн самбар
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: { xs: 2, md: 0 } }}>
          <TextField
            label="Эхлэх огноо"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true, style: { color: "white" } }}
            sx={{ 
              input: { 
                color: "black",
                "&::-webkit-calendar-picker-indicator": {
                  cursor: "pointer"
                }
              }, 
              "& .MuiOutlinedInput-root": { 
                bgcolor: "black",
                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" }, 
                "&:hover fieldset": { borderColor: "black" },
                "& .MuiSvgIcon-root": { color: "black" }
              } 
            }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="Дуусах огноо"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true, style: { color: "white" } }}
            sx={{ 
              input: { 
                color: "black",
                "&::-webkit-calendar-picker-indicator": {
                  cursor: "pointer"
                }
              }, 
              "& .MuiOutlinedInput-root": { 
                bgcolor: "black",
                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" }, 
                "&:hover fieldset": { borderColor: "black" },
                "& .MuiSvgIcon-root": { color: "black" }
              } 
            }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button
            variant="contained"
            startIcon={<FilterList />}
            onClick={() => fetchData()}
            sx={{ textTransform: "none" }}
          >
            Шүүх
          </Button>
          <Button
            variant="outlined"
            onClick={handleClear}
            sx={{ textTransform: "none", bgcolor: "white" }}
          >
            Цэвэрлэх
          </Button>

        </Box>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                background: card.color,
                color: "white",
                boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {card.count.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ opacity: 0.8 }}>{card.icon}</Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3, height: 400, bgcolor: "transparent", boxShadow: "none" }}>
            <ReactECharts option={sectorOption} style={{ height: "100%" }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3, height: 400, bgcolor: "transparent", boxShadow: "none" }}>
            <ReactECharts option={topOrgsOption} style={{ height: "100%" }} />
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: 3, height: 400, bgcolor: "transparent", boxShadow: "none" }}>
            <ReactECharts option={trendOption} style={{ height: "100%" }} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CitizenDashboard;
