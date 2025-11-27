"use client";
import { getTable } from "@/services/TableService";
// import { Button } from "@mui/material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "flowbite-react";
import { useState } from "react";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import EditLineIcon from "remixicon-react/EditLineIcon";
import { sidebarTheme } from "../../componentTheme/SidebarTheme";
import Loader from "../../Loader";
import TableCreate from "./TableCreate";
import TableSidebarByUser from "./TableSidebarByUser";
import useCurrentUser from "@/utils/useCurrentUser";
const TableDetailByUser = ({
  id,
  setOpen,
  dbId,
  setAlert,
  setOpenModal,
}: {
  id: number;
  setOpen: any;
  dbId: number;
  setAlert?: any;
  setOpenModal?: any;
}) => {
  const { userInfo } = useCurrentUser();
  const { data, isLoading } = useQuery({
    queryKey: ["get table detail on admin", id],
    queryFn: () => getTable(id),
  });
  const [sidebarStatus, setSidebarStatus] = useState(false);

  if (isLoading) return <Loader />;
  return (
    <Sidebar className="w-full bg-white px-2" theme={sidebarTheme}>
      <div className="flex items-center justify-between border-b-2 border-b-table-border">
        <Typography variant="h6" color="info.dark">
          {data?.name}
        </Typography>
        <div className="flex items-center justify-end gap-4 p-2">
          {userInfo?.user_level != 1 && (
            <div>
              {userInfo?.user_level == 2 &&
              ((data?.database?.actions?.action_type == 1 &&
                data?.database?.actions?.action_type == 4) ||
                data?.database?.actions == null) ? (
                <div>
                  {!sidebarStatus && (
                    <Tooltip title="Хүснэгтийн мэдээлэл засах">
                      <Button
                        variant="text"
                        onClick={() => setSidebarStatus(true)}
                      >
                        <EditLineIcon />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              ) : (
                (data?.database?.actions?.action_type == 1 ||
                  data?.database?.actions?.action_type == 4 ||
                  data?.database?.actions == null) &&
                userInfo?.roles?.find((role: any) => {
                  return role.id == 3 || role.id == 1;
                }) && (
                  <div>
                    {!sidebarStatus && (
                      <Tooltip title="Хүснэгтийн мэдээлэл засах">
                        <Button
                          variant="text"
                          onClick={() => setSidebarStatus(true)}
                        >
                          <EditLineIcon />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                )
              )}
            </div>
          )}
          <Button variant="text" onClick={() => setOpen(false)}>
            <CloseLineIcon />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-start text-text-body-medium2">
        {sidebarStatus ? (
          <TableCreate
            dbId={dbId}
            tblId={id}
            setSidebarStatus={setSidebarStatus}
            tblData={data}
            sidebarStatus={sidebarStatus}
            setAlert={setAlert}
            setOpen={setOpenModal}
          />
        ) : (
          <div className="">
            <TableSidebarByUser tblId={id} />
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default TableDetailByUser;
