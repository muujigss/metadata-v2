import React from "react";
import GraphChartComponent from "@/components/admin/charts/GraphChartComponent";
import CitizenDashboard from "@/components/admin/charts/CitizenDashboard";
import { getAllOrgs } from "@/services/model/DashboardDatabaseModel";
import { Typography } from "@mui/material";

const ChartPage = async () => {
  const allData = await getAllOrgs();
  const dataList: any = allData.allOrgDatabase;
  const allOrg = allData.allOrg;

  return (
    <div className="flex min-h-screen flex-col items-start justify-start ">
      <div className=" w-full h-full">
        <CitizenDashboard />
        <GraphChartComponent dataList={dataList} allOrg={allOrg} />
      </div>
    </div>
  );
};

export default ChartPage;

