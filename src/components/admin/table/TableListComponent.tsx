"use client";
import React, { useState } from "react";
import TabComponents from "../TabComponets";
import { useQuery } from "@tanstack/react-query";
import { getTable } from "@/services/TableService";
import Loader from "@/components/Loader";
import ClassificationListByUser from "@/components/admin/classification/ClassificationListByUser";
import IndicatorListByUser from "@/components/admin/indicator/IndicatorListByUser";
import { Box, Button, Paper, Typography } from "@mui/material";
import AddLineIcon from "remixicon-react/AddLineIcon";
import AdminBreadCrumpMenu from "../AdminBreadCrumpMenu";
import useCurrentUser from "@/utils/useCurrentUser";

const TableDetailList = ({ tblId }: { tblId: number }) => {
  const [value, setValue] = useState("1");
  const [indId, setIndId] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false); // uzuuleltiin modal-iig neene
  const { userInfo } = useCurrentUser();

  const tabIndicatorAndClass = [
    {
      label: "Үзүүлэлт",
      value: "1",
    },
    {
      label: "Ангилал, код",
      value: "2",
    },
  ];
  const { data, isError, isLoading } = useQuery({
    queryKey: ["get table detail user", tblId],
    queryFn: () => getTable(tblId),
  });

  const actions = data?.database?.actions;
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleClick = () => {
    setOpenModal(!openModal);
    value == "1" && console.log("indicator");
  };
  if (isLoading) return <Loader />;
  if (isError) return <p>Алдаа гарлаа ...</p>;

  return (
    <Box>
      <Box>
        <AdminBreadCrumpMenu
          type="indicator"
          menu_name={data?.database?.name}
          submenu_name={data?.name}
          treesubmenu_name={value == "1" ? "Үзүүлэлт" : "Ангилал, код"}
          link={`/admin/table-form?org=${data?.database?.organization?.id}&db=${data?.database?.id}`}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          gap: 2,
        }}
      >
        <Typography variant="h6">{data?.name}</Typography>
        {value == "1" && (
          <Box>
            {userInfo?.user_level != 1 && (
              <Box>
                {userInfo?.user_level == 2 &&
                ((actions?.action_type == 1 && actions?.action_type == 4) ||
                  actions == null) ? (
                  <Button
                    className="text-primary-default inline-flex items-center"
                    onClick={handleClick}
                  >
                    <AddLineIcon size={16} />
                    Үзүүлэлт нэмэх
                  </Button>
                ) : (
                  (actions?.action_type == 1 ||
                    actions?.action_type == 4 ||
                    actions == null) &&
                  userInfo?.roles?.find((role: any) => {
                    return role.id == 3 || role.id == 1;
                  }) && (
                    <Button
                      className="text-primary-default inline-flex items-center"
                      onClick={handleClick}
                    >
                      <AddLineIcon size={16} />
                      Үзүүлэлт нэмэх
                    </Button>
                  )
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Paper sx={{ width: "100%" }}>
        <TabComponents
          tabData={tabIndicatorAndClass}
          value={value}
          handleChange={handleChange}
        />
        {value == "1" ? (
          <IndicatorListByUser
            tblId={tblId}
            data={data}
            setIndId={setIndId}
            indId={indId}
            openIndicatorModal={openModal}
            setIndicatorModal={setOpenModal}
          />
        ) : (
          <ClassificationListByUser tblId={tblId} data={data?.indicators} />
        )}
      </Paper>
    </Box>
  );
};
export default TableDetailList;
