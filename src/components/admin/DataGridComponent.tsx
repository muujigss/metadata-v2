"use client";
import { useGetActionType } from "@/utils/customHooks";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Badge } from "flowbite-react";
import Loader from "../Loader";

const DataGridComponent = ({
  data,
  columns,
  listId,
  handleClick,
  libList,
}: {
  data: any;
  columns: any;
  listId?: number;
  handleClick?: any;
  libList?: any;
}) => {
  const { data: actionType, isLoading: actionTypeLoading } = useGetActionType();
  if (actionTypeLoading) return <Loader />;
  return (
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
        <TableBody sx={{}}>
          {data
            ?.sort((a: any, b: any) => a?.id - b?.id)
            ?.map((item: any, i: number) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={i}
                  sx={{
                    background: listId == item?.id ? "#f3f4f6" : "",
                  }}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="tbl_name">
                    <Button onClick={() => handleClick(item?.id)}>
                      <Typography
                        variant="body1"
                        sx={{
                          textTransform: "none",
                          textAlign: "justify",
                          fontSize: 14,
                        }}
                      >
                        {item?.name}
                      </Typography>
                    </Button>
                  </TableCell>
                  {!!item?.actions && (
                    <TableCell>
                      {item?.actions > 1 && (
                        <span className="flex justify-center gap-2 items-center text-center text-text-body-medium">
                          <Badge
                            key={i}
                            size="sm"
                            color={
                              item?.actions == 1
                                ? "primary"
                                : item?.actions == 2
                                ? "warning"
                                : item?.actions == 3
                                ? "success"
                                : "error"
                            }
                          >
                            <span className="text-text-body-small">
                              {
                                actionType?.find(
                                  (x: any) => x?.id == item?.actions
                                )?.name
                              }
                            </span>
                          </Badge>
                        </span>
                      )}
                    </TableCell>
                  )}

                  {item?.is_active != null && (
                    <TableCell>
                      <span className="flex items-center justify-center gap-2">
                        <Badge
                          key={i}
                          color={item?.is_active ? "green" : "red"}
                        >
                          <span className="text-text-body-small">
                            {item?.is_active ? "Тийм" : "Үгүй"}
                          </span>
                        </Badge>
                      </span>
                    </TableCell>
                  )}
                  {item?.action && <TableCell>{item?.action}</TableCell>}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataGridComponent;
