"use client";
import React, { useState } from "react";
import {
  getConvertDataHome,
  getConvertSearchData,
  getConvertTreeView,
} from "@/utils/dashboardConvertData";
import ReactECharts from "echarts-for-react";
import { Box, Button, Typography, TextField, Autocomplete } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { SearchService } from "@/services/SearchService";
import Loader from "@/components/Loader";
import TreeView from "./TreeView";

const TreeViewRadial = ({ data, activeName, userLevel, allOrg }: any) => {
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [clickTree, setClickTree] = useState(1);
  const [allData, setAllData] = useState(false);
  const [dbSearchValue, setDbSearchValue] = useState<string | null>(null);
  
  const levelID = userLevel?.user_level;
  
  // Build graphData based on user level
  let graphData: any = [];
  if (levelID == 1) {
    graphData = getConvertDataHome(data);
  } else {
    // For org admin, wrap databases in organization node
    const databases = getConvertTreeView(data);
    graphData = [{
      name: activeName || "Байгууллага",
      children: databases,
      itemStyle: {
        color: "#6D9E41",
      },
      lineStyle: {
        color: "#A5C984",
      },
      label: {
        show: true,
        width: 150,
        overflow: "breakAll",
        borderRadius: 5,
        backgroundColor: "#A5C984",
        color: "#000",
        padding: 5,
        fontSize: 9,
      },
    }];
  }

  const orgOptions = graphData.map((org: any) => org.name);
  const selectedOrg: any = graphData.find((org: any) => org.name === searchValue);
  const dbOptions = selectedOrg ? selectedOrg.children?.map((db: any) => db.name) || [] : [];

  // Debounce search value
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue || "");
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Auto-select organization for non-super admins
  React.useEffect(() => {
    if (levelID != 1 && activeName) {
      setSearchValue(activeName);
      setClickTree(2);
    }
  }, [levelID, activeName]);

  const { data: searchData, isLoading } = useQuery({
    queryKey: ["search treeView", debouncedSearchValue],
    queryFn: () => debouncedSearchValue != "" && SearchService(debouncedSearchValue.trim()),
  });

  const getFilteredData = () => {
    if (!debouncedSearchValue) return graphData;
    const lowerSearch = debouncedSearchValue.toLowerCase();

    const filtered = graphData.filter((org: any) =>
      org.name.toLowerCase().includes(lowerSearch)
    );

    return filtered.map((org: any) => {
      const isSelectedOrg = org.name === searchValue;
      let children = org.children;

      if (isSelectedOrg && dbSearchValue) {
        children = org.children.filter((db: any) => db.name === dbSearchValue);
      }

      return {
        ...org,
        children: children,
        label: {
          rotate: 0,
          position: "inside",
          verticalAlign: "middle",
          align: "center",
          fontSize: 10,
          fontWeight: "bold",
          backgroundColor: "#A5C984",
          padding: [4, 8],
          borderRadius: 4,
          color: "#000",
        },
      };
    });
  };

  const filteredGraphData = getFilteredData();

  const indicator: any =
    searchData?.indicator &&
    searchData?.indicator.filter(
      (e: { highlight: { indicator_name: any } }) => e.highlight.indicator_name
    );

  const searchIndicator = getConvertSearchData(indicator, allOrg, levelID);
  const groupedData = searchIndicator ? searchIndicator.slice(0, 10) : [];

  const onChartClick = (params: any) => {
    if (!params.data.children || params.data.children.length === 0) {
      setSearchValue(params.data.name);
      setAllData(false);
    }
  };

  const option = {
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
        data: [{ name: "", children: filteredGraphData }],
        symbolSize: 8,
        emphasis: {
          focus: "descendant",
        },
        layout: "radial",
        top: "20%",
        bottom: "20%",
        left: "20%",
        right: "20%",
        symbol: "emptyCircle",
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
        zoom: 1,
        initialTreeDepth: clickTree,
      },
    ],
  };
  
  if (isLoading) return <Loader />;
  
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box sx={{ width: 10, p: 1, bgcolor: "#A5C984" }}></Box>
          <Typography
            variant="body1"
            sx={{
              cursor: "pointer",
              ":hover": { textDecoration: "underline", backgroundColor: "#A5C984" },
            }}
            onClick={() => setClickTree(1)}
          >
            Байгууллага
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box sx={{ width: 10, p: 1, bgcolor: "#408FC9" }}></Box>
          <Typography
            variant="body1"
            sx={{
              cursor: "pointer",
              ":hover": { textDecoration: "underline", backgroundColor: "#408FC9" },
            }}
            onClick={() => setClickTree(2)}
          >
            Өгөгдлийн сан
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box sx={{ width: 10, p: 1, bgcolor: "#B9C5FC" }}></Box>
          <Typography
            variant="body1"
            sx={{
              cursor: "pointer",
              ":hover": { textDecoration: "underline", backgroundColor: "#B9C5FC" },
            }}
            onClick={() => setClickTree(3)}
          >
            Хүснэгт
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box sx={{ width: 10, p: 1, bgcolor: "#F2BE7A" }}></Box>
          <Typography variant="body1">Үзүүлэлт</Typography>
        </Box>
      </Box>
      
      {/* Search Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, gap: 2, alignItems: 'center' }}>
        {levelID == 1 && (
          <Autocomplete
            options={orgOptions}
            value={searchValue}
            onChange={(event: any, newValue: string | null) => {
              setSearchValue(newValue);
              setDbSearchValue(null);
              if (newValue) {
                setClickTree(2);
              } else {
                setClickTree(1);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Байгууллага хайх"
                size="small"
                sx={{ width: 400 }}
              />
            )}
            sx={{ width: 400 }}
          />
        )}
        <Autocomplete
          options={dbOptions}
          value={dbSearchValue}
          disabled={!searchValue}
          onChange={(event: any, newValue: string | null) => {
            setDbSearchValue(newValue);
            if (newValue) {
              setClickTree(3);
            } else {
              setClickTree(2);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Өгөгдлийн сан хайх"
              size="small"
              sx={{ width: 400 }}
            />
          )}
          sx={{ width: 400 }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", width: "100%", height: "100%" }}>
        <div className="w-1/2">
          <ReactECharts
            option={option}
            style={{ width: "100%", height: 750 }}
            onEvents={{ click: onChartClick }}
          />
        </div>
        <div className="w-1/2 flex flex-col">
          {searchValue && (
            <TreeView data={groupedData} activeName={searchValue} />
          )}
          {searchValue && searchIndicator && searchIndicator.length > 10 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
                justifyContent: "center",
                gap: 1,
                px: 2,
              }}
            >
              <Button
                variant="contained"
                color={"info"}
                size="small"
                onClick={() => {
                  setAllData(true);
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: "lowercase",
                    ":first-letter": {
                      textTransform: "capitalize",
                    },
                  }}
                >
                  Бүх үзүүлэлт харах
                </Typography>
              </Button>
            </Box>
          )}
        </div>
      </Box>
      <Box>
        {allData && searchIndicator && searchIndicator.length > 10 && (
          <TreeView data={searchIndicator} activeName={searchValue} />
        )}
      </Box>
    </Box>
  );
};

export default TreeViewRadial;
