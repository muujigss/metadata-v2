"use client";
import React, { useState } from "react";
import { IAction } from "@/interfaces/IAction";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button,
} from "@mui/material";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import { useQuery } from "@tanstack/react-query";
import getLibraryService from "@/services/LibLibraryService";
import Loader from "./Loader";
import ModalComponent from "./admin/formComponents/ModalComponent";

const RequestActionComponent = ({
  columns,
  data,
}: {
  columns: any;
  data: any;
}) => {
  // const actionType = await getLibraryService("actiontype");
  const { data: actionType, isLoading } = useQuery({
    queryKey: ["actiontype for admin"],
    queryFn: () => getLibraryService("actiontype"),
  });

  const [openModal, setOpenModal] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  const [selected, setSelected] = useState<IAction | null>(null);

  const handleViewDetail = (item: any) => {
    console.log("view detail", item);
    setSelected(item)
    setOpenModal(true);
  };

  
  const viewActionType = (action_type: number) => {
    const txtStatusColor =
      action_type == 1
        ? "primary"
        : action_type == 2 || action_type == 5 || action_type == 6 || action_type == 7 || action_type == 8 || action_type == 9
        ? "warning"
        : action_type == 3
        ? "success"
        : "error";
    return <Typography
      color={txtStatusColor}
      sx={{
        display: "flex",
      }}
    >
      {
        actionType?.find((x: any) => x.id === action_type)
          ?.name
      }
    </Typography>;
  }

  if (isLoading) return <Loader />;
  return (
    <Box>
      <TableContainer sx={{ maxHeight: 700 }}>
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
                    {item?.databases[0]?.organization?.img_url ? (
                      <img 
                        src={item?.databases[0]?.organization?.img_url} 
                        alt="Logo" 
                        className="w-12 h-12 object-contain rounded border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                        No logo
                      </div>
                    )}
                  </TableCell>
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
                    {viewActionType(item.action_type)}
                  </TableCell>
                  <TableCell>
                    {moment(item.updated_date).format("YYYY-MM-DD HH:mm:ss")}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex justify-center gap-2">
                       <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDetail(item)}
                      >
                        Харах
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      { openModal && selected && 
          <ModalComponent
            userId={selected?.user_id}
            id={Number(selected?.id)}
            open={openModal}
            type={"DatabaseChangeRequest"}
            data={selected?.databases[0]}
            status={"view"}
            file={selected?.file}
            setOpen={setOpenModal}
            setAlert={setShowAlert}
          />
      }
    </Box>
  );
};

export default RequestActionComponent;
