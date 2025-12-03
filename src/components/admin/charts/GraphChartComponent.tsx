"use client";
import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import { getConvertDataHome } from "@/utils/dashboardConvertData";
import { useQuery } from "@tanstack/react-query";
import { SearchService } from "@/services/SearchService";
import Loader from "@/components/Loader";
import TreeView from "../dashboard/TreeView";
import { Box, Button, Typography, TextField, Autocomplete } from "@mui/material";

const GraphChartComponent = ({
  dataList,
  allOrg,
}: {
  dataList: any;
  allOrg: any;
}) => {
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [clickTree, setClickTree] = useState(1);
  const [allData, setAllData] = useState(false);
  const [dbSearchValue, setDbSearchValue] = useState<string | null>(null);

  const graphData = getConvertDataHome(dataList);
  const orgOptions = graphData.map((org: any) => org.name);

  const selectedOrg: any = graphData.find((org: any) => org.name === searchValue);
  const dbOptions = selectedOrg ? selectedOrg.children.map((db: any) => db.name) : [];

  // Debounce search value
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue || "");
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const { data, isLoading } = useQuery({
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
        animationDuration: 1000,
        animationDurationUpdate: 1000,
        animationEasing: "cubicOut",
        animationEasingUpdate: "cubicOut",
        zoom: 1,
        initialTreeDepth: clickTree,
      },
    ],
  };

  const onChartClick = (params: any) => {
    if (!params.data.children || params.data.children.length === 0) {
      setSearchValue(params.data.name);
      setAllData(false);
    }
  };

  const indicator: any =
    data?.indicator &&
    data?.indicator.filter(
      (e: { highlight: { indicator_name: any } }) => e.highlight.indicator_name
    );

  const processIndicatorData = (indicator: any[], allOrg: any[]) => {
    if (!indicator) return [];
    return indicator.reduce((acc: any, dt: any) => {
      const indicatorName = dt._source?.indicator_name;
      const tblName = dt._source?.tbl_name;
      const dbName = dt._source?.db_name;
      const orgName = allOrg.find((org: any) => org.db_id === dt._source?.db_id)?.org_name;

      let indicatorNode = acc.find((i: any) => i.name === indicatorName);
      if (!indicatorNode) {
        indicatorNode = {
          name: indicatorName,
          children: [],
          itemStyle: { color: "#D79034" },
          lineStyle: { color: "#F2BE7A", width: 2, type: "solid" },
          label: { show: true, width: 100, overflow: "breakAll", borderRadius: 5, backgroundColor: "#F2BE7A", color: "#000", padding: 5, fontSize: 9 },
        };
        acc.push(indicatorNode);
      }

      let tblNode = indicatorNode.children.find((t: any) => t.name === tblName);
      if (!tblNode) {
        tblNode = {
          name: tblName,
          children: [],
          itemStyle: { color: "#1431AD" },
          lineStyle: { color: "#B9C5FC" },
          label: { show: true, width: 110, overflow: "breakAll", borderRadius: 5, backgroundColor: "#B9C5FC", color: "#000", padding: 5, fontSize: 9 },
        };
        indicatorNode.children.push(tblNode);
      }

      let dbNode = tblNode.children.find((d: any) => d.name === dbName);
      if (!dbNode) {
        dbNode = {
          name: dbName,
          children: [],
          itemStyle: { color: "#1C45F4" },
          lineStyle: { color: "#408FC9" },
          label: { show: true, width: 100, overflow: "breakAll", borderRadius: 5, backgroundColor: "#408FC9", color: "#fff", padding: 5, fontSize: 9 },
        };
        tblNode.children.push(dbNode);
      }

      let orgNode = dbNode.children.find((o: any) => o.name === orgName);
      if (!orgNode) {
        orgNode = {
          name: orgName,
          itemStyle: { color: "#6D9E41" },
          lineStyle: { color: "#A5C984" },
          label: { show: true, width: 150, overflow: "breakAll", borderRadius: 5, backgroundColor: "#A5C984", color: "#000", padding: 5, fontSize: 9 },
        };
        dbNode.children.push(orgNode);
      }

      return acc;
    }, []);
  };

  const allOrgData = processIndicatorData(indicator, allOrg);
  const groupedData = allOrgData.slice(0, 10);

  if (isLoading) return <Loader />;

  return (
    <div>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            opacity: 0.8,
          }}
        >
          <Typography
            variant="h5"
            color="white"
            fontStyle={"inherit"}
            sx={{
              justifyContent: "center",
              py: 0.8,
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            Мета өгөгдлийн дүрслэл
          </Typography>
          <Typography
            variant="body1"
            color="white"
            sx={{
              textAlign: "center",
              p: 1,
            }}
          >
            Төрийн мета өгөгдлийн нэгдсэн санд агуулагдаж буй өгөгдлийн сан,
            түүний хүснэгт, үзүүлэлтийн мета мэдээллийн хоорондын уялдаа,
            холбоог байгууллага, үзүүлэлтийн түвшинд мета өгөгдлийн дүрслэлээр
            сонгон харах боломжтой.
          </Typography>
        </Box>
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
              color="white"
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
              color="white"
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
              color="white"
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
            <Typography variant="body1" color="white">Үзүүлэлт</Typography>
          </Box>
        </Box>
        {/* Search Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, gap: 2, alignItems: 'center' }}>
          <Autocomplete
            options={orgOptions}
            value={searchValue}
            onChange={(event: any, newValue: string | null) => {
              setSearchValue(newValue);
              setDbSearchValue(null); // Reset DB search when Org changes
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
                InputLabelProps={{ style: { color: "black" } }}
                sx={{ 
                  width: 400,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": { borderColor: "white" },
                  },
                  "& .MuiSvgIcon-root": { color: "white" }
                }}
              />
            )}
            sx={{ width: 400 }}
          />
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
                InputLabelProps={{ style: { color: "black" } }}
                sx={{ 
                  width: 400,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": { borderColor: "white" },
                  },
                  "& .MuiSvgIcon-root": { color: "white" }
                }}
              />
            )}
            sx={{ width: 400 }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
        }}
      >
        <div className="w-1/2">
          <ReactECharts
            option={option}
            style={{ height: "800px", width: "100%" }}
            onEvents={{ click: onChartClick }}
          />
        </div>
        <div className="w-1/2 flex flex-col">
          {searchValue && (
            <TreeView data={groupedData} activeName={searchValue} />
          )}
          {searchValue && allOrgData.length > 10 && (
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
        {allData && allOrgData.length > 10 && (
          <TreeView data={allOrgData} activeName={searchValue} />
        )}
      </Box>
    </div>
  );
};

export default GraphChartComponent;
