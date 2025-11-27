"use client";
import { getOneDatabaseAdmin } from "@/services/DatabaseService";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { Suspense, useState } from "react";
import AddLineIcon from "remixicon-react/AddLineIcon";
import Loader from "../Loader";
import FormListByUser from "./form/FormListByUser";
import TabComponets from "./TabComponets";
import TableListByUser from "./table/TableListByUser";
import AdminBreadCrumpMenu from "./AdminBreadCrumpMenu";
import useCurrentUser from "@/utils/useCurrentUser";

const ListComponent = ({ orgId, dbId }: { orgId: number; dbId: number }) => {
  const [value, setValue] = useState("1");
  const [alert, setAlert] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const { userInfo } = useCurrentUser();
  const tabTableAndForm = [
    {
      label: "Хүснэгт",
      value: "1",
    },
    {
      label: "Маягт",
      value: "2",
    },
  ];
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["fetch database details by id", dbId],
    queryFn: () => getOneDatabaseAdmin(dbId),
    refetchOnWindowFocus: true,
  });

  const handleClick = () => {
    value == "1" ? setOpenModal(true) : setFormOpen(true);
  };
  if (isLoading) return <Loader />;
  return (
    <Box>
      <Box>
        <AdminBreadCrumpMenu
          type="table"
          menu_name={data?.name}
          submenu_name={value == "1" ? "Хүснэгт" : "Маягт"}
          link="/admin/database"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", fontSize: "20px" }}>
          {data?.name}
        </Typography>

        <span className="justify-center">
          <p className="inline-flex items-center gap-2 text-text-body-small mt-1">
            {userInfo?.user_level != 1 && (
              <Box>
                {userInfo?.user_level == 2 &&
                ((data?.actions?.action_type == 1 &&
                  data?.actions?.action_type == 4) ||
                  data?.actions == null) ? (
                  <Button onClick={handleClick} className="">
                    <AddLineIcon size={16} />
                    {value == "1" ? "Хүснэгт нэмэх" : "Маягт нэмэх"}
                  </Button>
                ) : (
                  (data?.actions?.action_type == 1 ||
                    data?.actions?.action_type == 4 ||
                    data?.actions == null) &&
                  userInfo?.roles?.find((role: any) => {
                    return role.id == 3 || role.id == 1;
                  }) && (
                    <Button onClick={handleClick} className="">
                      <AddLineIcon size={16} />
                      {value == "1" ? "Хүснэгт нэмэх" : "Маягт нэмэх"}
                    </Button>
                  )
                )}
              </Box>
            )}
          </p>
        </span>
      </Box>
      <Paper sx={{ width: "100%" }}>
        <TabComponets
          tabData={tabTableAndForm}
          handleChange={handleChange}
          value={value}
        />
        <Suspense fallback={<Loader />}>
          {value == "1" ? (
            <TableListByUser
              org={orgId}
              db={dbId}
              dbData={data}
              type={"table"}
              setAlert={setAlert}
              openModal={openModal}
              setOpenModal={setOpenModal}
            />
          ) : (
            <FormListByUser
              org={orgId}
              db={dbId}
              dbData={data}
              type={"form"}
              setAlert={setAlert}
              openModal={formOpen}
              setOpenModal={setFormOpen}
            />
          )}
        </Suspense>
      </Paper>
    </Box>
  );
};

export default ListComponent;
