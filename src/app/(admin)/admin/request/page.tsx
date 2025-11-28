import AdminBreadCrumpMenu from "@/components/admin/AdminBreadCrumpMenu";
import ModalComponent from "@/components/admin/formComponents/ModalComponent";
import Loader from "@/components/Loader";
import RequestActionComponent from "@/components/RequestActionComponent";
import { getActionsModel } from "@/services/model/ActionModel";
import { Box, Typography } from "@mui/material";

import React, { Suspense } from "react";
const RequestActionPage = async () => {
  const columns = [
    { field: "id", headerName: "№", width: 10 },
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
    { field: "action", headerName: "", width: 10 },
  ];

  const data = await getActionsModel();

  if (!data) return <Loader />;

  return (
    <Box>
      <Box sx={{ p: 2 }}>
        <AdminBreadCrumpMenu
          type="request"
          menu_name="Хүсэлтийн жагсаалт"
          link="/*"
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
        <Typography variant="h5"> Хүсэлтийн жагсаалт</Typography>
      </Box>

      <Suspense fallback={<Loader />}>
        <RequestActionComponent columns={columns} data={data} />
      </Suspense>
    </Box>
  );
};

export default RequestActionPage;
