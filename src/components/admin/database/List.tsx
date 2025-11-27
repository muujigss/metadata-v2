"use client";

import Loader from "@/components/Loader";
import { IDatabase } from "@/interfaces/IDatabase";
import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Badge } from "flowbite-react";
import Link from "next/link";
import { Suspense, use, useState } from "react";
import AddLineIcon from "remixicon-react/AddLineIcon";
import GridLineIcon from "remixicon-react/GridLineIcon";
import DataGridComponent from "../DataGridComponent";
import ModalComponent from "../formComponents/ModalComponent";
import DatabaseDetail from "./DatabaseDetail";
import OrgSidebar from "./OrgSidebar";

import { useGetOrgInfo } from "@/utils/customHooks";
import AdminBreadCrumpMenu from "../AdminBreadCrumpMenu";
import useCurrentUser from "@/utils/useCurrentUser";

const DBList = ({
  userId,
  data,
  total,
  orgId,
}: {
  userId: number;
  data: IDatabase[];
  total?: number;
  orgId?: number;
}) => {
  const { data: orgInfo } = useGetOrgInfo(Number(orgId));

  const columns = [
    { field: "id", headerName: "№", width: 10 },
    { field: "name", headerName: "Өгөгдлийн сангийн нэр", width: 400 },
    {
      field: "actions",
      headerName: "Төлөв",
      width: 10,
    },
    { field: "is_active", headerName: "Идэвхтэй эсэх", width: 10 },
    {
      field: "action",
      headerName: "Хүснэгт харах",
      width: 200,
    },
  ];

  const rowData = data?.map((item: IDatabase) => {
    return {
      id: item?.id,
      name: item?.name,
      is_active: item?.is_active,
      actions:
        item?.actions == null && item?.actions == undefined
          ? 1
          : item?.actions?.action_type,
      action: (
        <Tooltip title="Хүснэгтийн жагсаалт харах">
          <Link
            className="text-blue-500 hover:text-blue-700"
            href={`/admin/table-form?org=1&db=${item?.id}`}
          >
            <GridLineIcon />{" "}
          </Link>
        </Tooltip>
      ),
    };
  });
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  const [selectedDbId, setSelectedDbId] = useState<number>(0);
  const { userInfo } = useCurrentUser();

  const handleClick = (id: number) => {
    setSelectedDbId(id);
    setOpen(true);
  };

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  return (
    <Box>
      {/* <Box sx={{ p: 1 }}> */}
      <AdminBreadCrumpMenu
        type="database"
        menu_name="Өгөгдлийн сан"
        link="/admin/database"
      />
      {/* </Box> */}
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        <span className="flex items-center justify-start gap-2">
          <Typography variant="h6" sx={{ marginBottom: 1, p: 1 }}>
            Өгөгдлийн сангийн жагсаалт
          </Typography>

          <Badge color={"blue"}>
            <span className="text-text-body-small">{total}</span>
          </Badge>
        </span>
        {userInfo?.user_level != 1 && (
          <Box>
            {userInfo?.user_level == 2 ? (
              <Button
                className="border border-secondary-medium"
                onClick={handleModal}
              >
                <AddLineIcon size={24} />
                Өгөгдлийн сан
              </Button>
            ) : (
              userInfo?.roles?.find((role: any) => {
                return role.id == 3 || role.id == 1;
              }) && (
                <Button
                  className="border border-secondary-medium"
                  onClick={handleModal}
                >
                  <AddLineIcon size={24} />
                  Өгөгдлийн сан
                </Button>
              )
            )}
          </Box>
        )}
      </Box>
      <Grid container spacing={4}>
        <Grid size={{ xs: 6, md: 5 }}>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <DataGridComponent
              data={rowData}
              columns={columns}
              handleClick={handleClick}
              listId={selectedDbId}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 7 }}>
          <Paper>
            <Box
              sx={{
                height: 700,
                width: "100%",
                overflow: "scroll",
              }}
            >
              {!open ? (
                <OrgSidebar
                  handleModal={handleModal}
                  org={orgInfo && orgInfo}
                />
              ) : (
                <Suspense fallback={<Loader />}>
                  <DatabaseDetail
                    id={Number(orgId)}
                    orgId={orgId}
                    userId={+userId}
                    setOpen={setOpen}
                    dbId={selectedDbId}
                    setOpenModal={setOpenModal}
                  />
                </Suspense>
              )}
              <ModalComponent
                userId={userId}
                id={Number(orgId)}
                open={openModal}
                setOpen={setOpenModal}
                type={"database"}
                setAlert={setShowAlert}
                data={{}}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DBList;
