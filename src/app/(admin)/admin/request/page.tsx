import AdminBreadCrumpMenu from "@/components/admin/AdminBreadCrumpMenu";
import Loader from "@/components/Loader";
import RequestActionComponent from "@/components/RequestActionComponent";
import { getActionsModel } from "@/services/model/ActionModel";
import { Box, Typography } from "@mui/material";

import React, { Suspense } from "react";
import ClientSearch from "../database/search";

export const dynamic = "force-dynamic";

const RequestActionPage = async ({
  searchParams,
}: {
  searchParams?: any;
}) => {
  const columns = [
    { field: "id", headerName: "№", width: 10 },
    { field: "img_url", headerName: "Зураг", width: 10 },
    { field: "name", headerName: "Байгууллагын нэр", width: 10 },
    {
      field: "org_short_name",
      headerName: "Өгөгдлийн сангийн нэр",
      width: 10,
    },
    { field: "user_id", headerName: "Хэрэглэгчийн нэр", width: 10 },
    { field: "department", headerName: "Хэлтсийн нэр", width: 10 },
    { field: "position", headerName: "Албан тушаал", width: 10 },
    { field: "action_type", headerName: "Төлөв", width: 10 },
    { field: "updated_date", headerName: "Илгээсэн огноо", width: 10 },
    { field: "created_date", headerName: "Хугацаа", width: 10 },
    { field: "action", headerName: "", width: 10 },
  ];

  const queryText = searchParams?.query ?? "";
  const data = await getActionsModel(queryText);

  if (!data) return <Loader />;

  return (
    <Box>
      {/* <Box sx={{ p: 2 }}>
        <AdminBreadCrumpMenu
          type="request"
          menu_name="Хүсэлтийн жагсаалт"
          link="/*"
        />
      </Box> */}
      <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, pb: 2 }}>
        <Typography variant="h5"> Хүсэлт (Сан)</Typography>
      </Box>
      
      <ClientSearch placeholder="Хайлт..." />

      <Suspense fallback={<Loader />}>
        <RequestActionComponent columns={columns} data={data} />
      </Suspense>
    </Box>
  );
};

export default RequestActionPage;
