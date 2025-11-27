import AdminBreadCrumpMenu from "@/components/admin/AdminBreadCrumpMenu";
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
        {/* <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns?.map((column: any, i: number) => {
                  return (
                    <TableCell
                      key={i}
                      scope="col"
                      sx={{
                        textAlign: "center",
                        width: column?.width,
                        background: "#518df9",
                        color: "white",
                      }}
                    >
                      {column?.headerName}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((item: IAction, i: number) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/database?org=${item?.databases[0]?.organization?.id}`}
                      >
                        <Typography
                          sx={{
                            textTransform: "uppercase",
                            color: "#518df9",
                            display: "flex",
                          }}
                        >
                          {item?.databases[0]?.organization?.name}
                          <ArrowRightSLineIcon />
                        </Typography>
                      </Link>
                    </TableCell>
                    <TableCell>{item.databases[0]?.name}</TableCell>
                    <TableCell> {item.user?.firstname}</TableCell>
                    <TableCell> {item.user?.department}</TableCell>
                    <TableCell> {item.user?.position}</TableCell>
                    <TableCell>
                      {
                        actionType?.find((x: any) => x.id === item.action_type)
                          ?.name
                      }
                    </TableCell>
                    <TableCell>
                      {moment(item.updated_date).format("YYYY-MM-DD HH:mm:ss")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer> */}
        <RequestActionComponent columns={columns} data={data} />
      </Suspense>
    </Box>
  );
};

export default RequestActionPage;
