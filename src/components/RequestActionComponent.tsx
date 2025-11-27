"use client";
import React from "react";
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
} from "@mui/material";
import moment from "moment";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import { useQuery } from "@tanstack/react-query";
import getLibraryService from "@/services/LibLibraryService";
import Loader from "./Loader";

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
      </TableContainer>
    </Box>
  );
};

export default RequestActionComponent;
