import React from "react";
import TableDetailList from "../../../../components/admin/table/TableListComponent";
import { Box } from "@mui/material";
type searchParamsProps = {
  tbl?: string;
};
const InicatorClassAdminPage = ({
  searchParams,
}: {
  searchParams?: searchParamsProps;
}) => {
  const tblId = Number(searchParams?.tbl) || 1;
  return (
    <Box sx={{ width: "100%" }}>
      <TableDetailList tblId={tblId} />
    </Box>
  );
};

export default InicatorClassAdminPage;
