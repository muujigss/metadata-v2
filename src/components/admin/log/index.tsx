"use client";
import React, { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  
} from "@mui/material";
import Loader from "@/components/Loader";
import { getLog } from "@/services/LogService";
import { SelectComponent } from "../form";
import { useGetActionType } from "@/utils/customHooks";
import moment from "moment";
import ArchiveDrawerLineIcon from "remixicon-react/ArchiveDrawerLineIcon";
const AdminLogList = () => {
  const { data: actionType, isLoading: actionTypeLoading } = useGetActionType();
  const [columns, setColumns] = useState([
    { field: "id", headerName: "№", width: 10 },
    { field: "name", headerName: "Байгууллагын нэр", width: 10 },
    { field: "name", headerName: "Өгөгдлийн сан", width: 10 },
    { field: "name", headerName: "Төрөл", width: 10 },
    { field: "name", headerName: "Албан тушаал", width: 10 },
    { field: "name", headerName: "Илгээсэн огноо", width: 10 },
    { field: "name", headerName: "Хүснэгт", width: 10 },
  ]);
  const [type, setType] = useState(1);
  const typeOptions = [
    { name: "Өгөгдлийн сан", id: 1 },
    { name: "Хэрэглэгчийн хүсэлт", id: 2 },
  ];
  // pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["logs", type, page, rowsPerPage],
    queryFn: () => getLog(type, page, rowsPerPage),
    staleTime: 5000, // хуудсалтад тохиромжтой
  });
  console.log("---data---:", data);

  const filteredData = data?.data


  const txtStatusColor = (action_type: number) => {
    return action_type == 1
      ? "primary"
      : action_type == 2 || action_type == 5 || action_type == 6 || action_type == 7 || action_type == 8 || action_type == 9
      ? "warning"
      : action_type == 3
      ? "success"
      : "error";
  }

  const handleChangeType = (e: any, value: any) => {
    setType(value);
    setPage(1); // type өөрчлөгдсөн үед page-г reset хийх
  };

  if (isLoading) return <Loader />;
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
        <Typography variant="h5">Лог жагсаалт</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, py: 1 }}>
          Төрөл:
          <SelectComponent
            options={typeOptions}
            defaultValue={type}
            label="Төрөл"
            name="type"
            onChange={(e: any, value: any) => handleChangeType(e, value)}
          />
        </Box>
      </Box>
      <Suspense fallback={<Loader />}>
        <TableContainer sx={{ maxHeight: 600 }}>
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
              {filteredData?.map((item: any, i: number) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      {
                        type === 1
                          ? item?.md_organization?.name
                          : item?.lud_created_user?.organization?.name
                      }
                    </TableCell>
                    <TableCell>{item?.md_database?.name}
                      {
                        type === 1
                          ? item?.md_database?.name
                          : item?.database?.name
                      }
                    </TableCell>
                    <TableCell>
                      <span className="flex justify-center gap-2 items-center text-center text-text-body-medium">
                        
                        {
                          type === 1
                            ? <Button
                                color={txtStatusColor(item.db_type)}
                                size="small"
                              >
                                { actionType?.find(
                                    (x: any) => x?.id == item?.db_type
                                  )?.name
                                }
                              </Button>
                            : <Button
                                color={item.type === 'CREATE' ? 'primary' : 'success'}
                                size="small"
                              >
                                { item.type === 'CREATE' ? 'Шинэ' : 'Засвар' }
                              </Button>
                        }
                      </span>
                    </TableCell>
                    <TableCell>
                      {
                        type === 1
                          ? item?.ld_created_user?.position + ' ' + `${item?.ld_created_user?.lastname} ${item?.ld_created_user?.firstname}`
                          : item?.lud_created_user?.position + ' ' + `${item?.lud_created_user?.lastname} ${item?.lud_created_user?.firstname}`
                      }
                    </TableCell>
                    <TableCell>{moment(item.createdDate).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/table-form?org=${type === 1 ? item?.md_organization?.id : item?.lud_created_user?.organization?.id}&db=${type === 1 ? item?.db_id : item?.database_id}`}
                      >
                        <Typography
                          sx={{
                            textTransform: "uppercase",
                            color: "#518df9",
                            display: "flex",
                          }}
                        >
                          <ArchiveDrawerLineIcon />
                        </Typography>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={data?.total || 0}
          page={page - 1}
          onPageChange={(e, newPage) => setPage(newPage + 1)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(1);
          }}
        />
      </Suspense>
    </Box>
  );
};

export default AdminLogList;
