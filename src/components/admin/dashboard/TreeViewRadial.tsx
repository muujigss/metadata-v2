"use client";
import React, { useState } from "react";
import {
  getConvertDataHome,
  getConvertSearchData,
  getConvertTreeView,
} from "@/utils/dashboardConvertData";
import ReactECharts from "echarts-for-react";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { SearchService } from "@/services/SearchService";
import Loader from "@/components/Loader";
import TreeView from "./TreeView";
const TreeViewRadial = ({ data, activeName, userLevel, allOrg }: any) => {
  const [searchValue, setSearchValue] = useState("");
  const levelID = userLevel?.user_level;
  let graphData: any = [];
  if (levelID == 1) {
    graphData = getConvertDataHome(data);
  } else {
    graphData = getConvertTreeView(data);
  }
  const { data: searchData, isLoading } = useQuery({
    queryKey: ["search treeView", searchValue],
    queryFn: () => searchValue != "" && SearchService(searchValue.trim()),
  });

  const indicator: any =
    searchData?.indicator &&
    searchData?.indicator.filter(
      (e: { highlight: { indicator_name: any } }) => e.highlight.indicator_name
    );

  const searchIndicator = getConvertSearchData(indicator, allOrg, levelID);

  const onChartClick = (params: any) => {
    if (!params.data.children || params.data.children.length === 0) {
      setSearchValue(params.data.name);
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
        data: [{ name: "", children: graphData }],
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
        // roam: true,
        initialTreeDepth: 1,
      },
    ],
  };
  if (isLoading) return <Loader />;
  return (
    <Box>
      <ReactECharts
        option={option}
        style={{ width: "100%", height: 750 }}
        onEvents={{ click: onChartClick }}
      />
      {searchValue != "" && (
        <TreeView data={searchIndicator} activeName={searchValue} />
      )}
    </Box>
  );
};

export default TreeViewRadial;
