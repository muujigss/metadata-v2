"use client";
import React, { useMemo, useState } from "react";
import {
  getConvertDataHome,
  getConvertTreeView,
} from "@/utils/dashboardConvertData";
import ReactECharts from "echarts-for-react";
import { Box, Typography, TextField, Autocomplete } from "@mui/material";

const TreeViewRadial = ({ data, activeName, userLevel }: any) => {
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [clickTree, setClickTree] = useState(1);
  const [dbSearchValue, setDbSearchValue] = useState<string | null>(null);
  
  const levelID = userLevel?.user_level;
  
  const graphData: any[] = useMemo(() => {
  // Build graphData based on user level
  let graphData: any = [];
  if (levelID == 1) {
    graphData = getConvertDataHome(data || []);
  } else {
    // For org admin, wrap databases in organization node
    const databases = getConvertTreeView(data || []);
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

  return graphData;
  }, [data, levelID, activeName]);

  const orgOptions = graphData.map((org: any) => org.name);
  const selectedOrg: any = graphData.find((org: any) => org.name === searchValue);
  const dbOptions = selectedOrg ? selectedOrg.children?.map((db: any) => db.name) || [] : [];

  // Auto-select organization for non-super admins
  React.useEffect(() => {
    if (levelID != 1 && activeName) {
      setSearchValue(activeName);
      setClickTree(2);
    }
  }, [levelID, activeName]);

  const filteredGraphData = useMemo(() => {
    if (!searchValue) return graphData;

    const filtered = graphData.filter((org: any) =>
      org.name === searchValue
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
  }, [graphData, searchValue, dbSearchValue]);

  const [resetVersion, setResetVersion] = useState(0);
  const selectDepth = (depth: number) => {
    setClickTree(depth);
    setResetVersion(version => version + 1);
  };

  const scope = JSON.stringify([searchValue, dbSearchValue, clickTree, resetVersion]);
  const [expansion, setExpansion] = useState<{
    scope: string; collapsed: Record<string, boolean>; revision: number;
  }>({ scope: "", collapsed: {}, revision: 0 });
  const treeData = useMemo(() => {
    const overrides = expansion.scope === scope ? expansion.collapsed : {};
    const prepare = (node: any, id: string, depth: number): any => ({
      ...node,
      id,
      collapsed: overrides[id] ?? depth >= clickTree,
      children: node.children?.map((child: any, index: number) => prepare(child, `${id}/${index}`, depth + 1)),
    });
    return prepare({ name: "", children: filteredGraphData }, "root", 0);
  }, [filteredGraphData, clickTree, scope, expansion]);
  const onChartClick = (event: any) => {
    const node = event.data;
    if (!node?.children?.length || node.id === "root") return;
    setExpansion(previous => ({
      scope,
      collapsed: { ...(previous.scope === scope ? previous.collapsed : {}), [node.id]: !node.collapsed },
      revision: previous.revision + 1,
    }));
  };

  const option = useMemo(() => ({
    // Rebuild without exit animations: ECharts can retain descendant edges on collapse.
    animation: false,
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
        data: [treeData],
        symbolSize: 8,
        emphasis: {
          focus: "descendant",
        },
        layout: "radial",
        top: "20%",
        bottom: "20%",
        left: "10%",
        right: "10%",
        symbol: "emptyCircle",
        expandAndCollapse: false,
        zoom: 1,
        initialTreeDepth: clickTree,
      },
    ],
  }), [treeData, clickTree]);
  
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          flexWrap: "wrap",
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box sx={{ width: 10, p: 1, bgcolor: "#A5C984" }}></Box>
          <Typography
            component="button"
            type="button"
            variant="body1"
            sx={{
              cursor: "pointer",
              ":hover": { textDecoration: "underline", backgroundColor: "#A5C984" },
            }}
            onClick={() => selectDepth(1)}
          >
            Байгууллага
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box sx={{ width: 10, p: 1, bgcolor: "#408FC9" }}></Box>
          <Typography
            component="button"
            type="button"
            variant="body1"
            sx={{
              cursor: "pointer",
              ":hover": { textDecoration: "underline", backgroundColor: "#408FC9" },
            }}
            onClick={() => selectDepth(2)}
          >
            Өгөгдлийн сан
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box sx={{ width: 10, p: 1, bgcolor: "#B9C5FC" }}></Box>
          <Typography
            component="button"
            type="button"
            variant="body1"
            sx={{
              cursor: "pointer",
              ":hover": { textDecoration: "underline", backgroundColor: "#B9C5FC" },
            }}
            onClick={() => selectDepth(3)}
          >
            Хүснэгт
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box sx={{ width: 10, p: 1, bgcolor: "#F2BE7A" }}></Box>
          <Typography component="button" type="button" variant="body1" onClick={() => selectDepth(4)}>Үзүүлэлт</Typography>
        </Box>
      </Box>
      
      {/* Search Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mb: 2, gap: 2, alignItems: 'center' }}>
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
                sx={{ width: "100%", maxWidth: 400 }}
              />
            )}
            sx={{ width: "100%", maxWidth: 400 }}
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
              sx={{ width: "100%", maxWidth: 400 }}
            />
          )}
          sx={{ width: "100%", maxWidth: 400 }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", width: "100%", height: "100%" }}>
        <div className="w-full">
          <ReactECharts
            key={`${scope}:${expansion.revision}`}
            option={option}
            onEvents={{ click: onChartClick }}
            style={{ 
              width: "100%", 
              height: "100vh",
              minHeight: "500px",
              maxHeight: "1000px"
            }}
          />
        </div>

      </Box>

    </Box>
  );
};

export default TreeViewRadial;
