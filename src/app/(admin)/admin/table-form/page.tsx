import React from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
const ListComponent = dynamic(
  () => import("@/components/admin/ListComponent"),
  {
    ssr: false,
  }
);

type searchParamsProps = {
  org?: string;
  db?: string;
  type?: string;
};

const AdminPage = ({ searchParams }: { searchParams?: searchParamsProps }) => {
  const orgId = Number(searchParams?.org) || 1;
  const dbId = Number(searchParams?.db) || 1;

  return (
    <Box sx={{ width: "100%" }}>
      <ListComponent orgId={orgId} dbId={dbId} />
    </Box>
  );
};
export default AdminPage;
