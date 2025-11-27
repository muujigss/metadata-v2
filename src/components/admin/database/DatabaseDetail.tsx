"use client";
import ActionType from "@/components/ActionType";
import { getOneDatabase } from "@/services/DatabaseService";
import useCurrentUser from "@/utils/useCurrentUser";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "flowbite-react";
import { Suspense, useState } from "react";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import EditLineIcon from "remixicon-react/EditLineIcon";
import { sidebarTheme } from "../../componentTheme/SidebarTheme";
import Loader from "../../Loader";
import SidebarComponents from "../SideBarComponents";
import CreateDatabase from "./CreateDatabase";
const DatabaseDetail = ({
  id,
  setOpen,
  dbId,
  setAlert,
  setOpenModal,
  userId,
  orgId,
}: {
  id: number;
  setOpen: any;
  dbId: number;
  setAlert?: any;
  setOpenModal?: any;
  userId?: number;
  orgId?: number;
}) => {
  const [sidebarStatus, setSidebarStatus] = useState(false);
  let [loading, setLoading] = useState(false);
  const { userInfo } = useCurrentUser();

  const { data, isLoading } = useQuery({
    queryKey: ["get db detail on admin", dbId],
    queryFn: () => getOneDatabase(dbId),
  });

  if (isLoading) return <Loader />;
  if (loading) return <Loader />;

  return (
    <Sidebar className="w-full bg-white p-2" theme={sidebarTheme}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" color="info.dark">
            Өгөгдлийн сангийн мета мэдээлэл
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          {userInfo?.user_level != 1 && (
            <Box>
              {userInfo?.user_level == 2 &&
              (data?.actions?.action_type == 1 ||
                data?.actions?.action_type == 4 ||
                data?.actions == null) ? (
                <Tooltip title="Засах">
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setSidebarStatus(true)}
                  >
                    <EditLineIcon />
                  </Button>
                </Tooltip>
              ) : (
                (data?.actions?.action_type == 1 ||
                  data?.actions?.action_type == 4 ||
                  data?.actions == null) &&
                userInfo?.roles?.find((role: any) => {
                  return role.id == 3;
                }) && (
                  <Tooltip title="Засах">
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => setSidebarStatus(true)}
                    >
                      <EditLineIcon />
                    </Button>
                  </Tooltip>
                )
              )}
            </Box>
          )}
          <Button variant="text" size="small" onClick={() => setOpen(false)}>
            <CloseLineIcon />
          </Button>
        </Box>
      </Box>

      <Box className="flex flex-col gap-1 justify-start text-text-body-medium2">
        {data?.actions?.action_type != undefined && (
          <ActionType
            user_level={userInfo?.user_level || 0}
            dbId={dbId}
            user_id={data?.actions?.user_id || 0}
            action_type={data?.actions?.action_type}
          />
        )}
        {sidebarStatus ? (
          <CreateDatabase
            setOpen={setOpenModal}
            dbData={data}
            orgId={Number(id)}
            userId={userId}
            setAlert={setAlert}
            sidebarStatus={sidebarStatus}
            setSidebarStatus={setSidebarStatus}
          />
        ) : (
          <Suspense fallback={<Loader />}>
            <SidebarComponents database={data} />
          </Suspense>
        )}
      </Box>
    </Sidebar>
  );
};

export default DatabaseDetail;
