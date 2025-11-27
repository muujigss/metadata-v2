import { IIndicator } from "@/interfaces/IIndicators";
import { useState } from "react";

import {
  Alert,
  alertClasses,
  Box,
  Button,
  Snackbar,
  Tooltip,
} from "@mui/material";
import AddLineIcon from "remixicon-react/AddLineIcon";
import DataGridComponent from "../DataGridComponent";
import ModalComponent from "../formComponents/ModalComponent";
import TableSidebarByUser from "../table/TableSidebarByUser";
import IndicatorDetail from "./IndicatorDetail";
import Grid from "@mui/material/Grid2";
import useCurrentUser from "@/utils/useCurrentUser";

const IndicatorListByUser = ({
  tblId,
  data,
  setIndId,
  indId,
  openIndicatorModal,
  setIndicatorModal,
}: {
  tblId: number;
  data: any;
  setIndId: any;
  indId: number;
  openIndicatorModal: boolean;
  setIndicatorModal: any;
}) => {
  const [open, setOpen] = useState(false); // sidebar duudah - харуулах indicator info
  const [addClass, setAddClass] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [classInd, setClassInd] = useState(0);
  const { userInfo } = useCurrentUser();
  const handleClick = (id: number) => {
    setOpen(true);
    setIndId(id);
  };
  const handleAddClassClick = (id: number) => {
    setAddClass(true);
    setClassInd(id);
  };

  const columns = [
    { field: "id", headerName: "№", width: 70 },
    { field: "name", headerName: "Үзүүлэлтийн нэр", width: 200 },
    {
      field: "is_active",
      headerName: "Идэвхтэй эсэх",
      width: 20,
    },
    {
      field: "action",
      headerName: "Ангилал, код нэмэх",
      width: 200,
    },
  ];
  const actions = data?.database?.actions;
  const rowData = data?.indicators?.map((item: IIndicator) => {
    return {
      id: item?.id || item?.id,
      name: item?.name || item?.name,
      is_active: item?.is_active || item?.is_active,
      action: (
        <Box>
          {userInfo?.user_level != 1 && (
            <>
              {userInfo?.user_level == 2 &&
              ((actions?.action_type == 1 && actions?.action_type == 4) ||
                actions == null) ? (
                <>
                  {item?.is_classification && (
                    <Tooltip title="Ангилал, код нэмэх">
                      <Button
                        className="text-primary-default inline-flex items-center"
                        onClick={() => handleAddClassClick(item?.id)}
                        size="small"
                      >
                        <AddLineIcon size={20} />
                      </Button>
                    </Tooltip>
                  )}
                </>
              ) : (
                (actions?.action_type == 1 ||
                  actions?.action_type == 4 ||
                  actions == null) &&
                userInfo?.roles?.find((role: any) => {
                  return role.id == 3;
                }) && (
                  <>
                    {item?.is_classification && (
                      <Tooltip title="Ангилал, код нэмэх">
                        <Button
                          className="text-primary-default inline-flex items-center"
                          onClick={() => handleAddClassClick(item?.id)}
                          size="small"
                        >
                          <AddLineIcon size={20} />
                        </Button>
                      </Tooltip>
                    )}
                  </>
                )
              )}
            </>
          )}
        </Box>
      ),
    };
  });

  return (
    <Grid container>
      <Grid size={{ xs: 6, md: 5 }}>
        <Box>
          <Snackbar
            open={alertMsg == "success" || alertMsg == "error" ? true : false}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={() => setAlertMsg("")}
          >
            <Box>
              {alertMsg == "success" ? (
                <Alert
                  severity="success"
                  sx={{
                    width: "100%",
                    [`& .${alertClasses.icon}`]: {
                      top: 0,
                    },
                  }}
                >
                  Амжилттай хадгаллаа
                </Alert>
              ) : alertMsg == "error" ? (
                <Alert
                  severity="error"
                  sx={{
                    width: "100%",
                    [`& .${alertClasses.icon}`]: {
                      top: 0,
                    },
                  }}
                >
                  ERROR
                </Alert>
              ) : null}
            </Box>
          </Snackbar>
          <DataGridComponent
            data={rowData}
            columns={columns}
            handleClick={handleClick}
            listId={indId}
          />
        </Box>
        <ModalComponent
          id={tblId}
          open={openIndicatorModal}
          setOpen={setIndicatorModal}
          type={"indicator"}
          setAlert={setShowAlert}
          data={{}}
          userId={userInfo?.id}
        />
        <ModalComponent
          open={addClass}
          setOpen={setAddClass}
          id={classInd}
          type="classification"
          data={data?.indicators}
          setAlert={setAlertMsg}
          userId={userInfo?.id}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 7 }}>
        <Box sx={{ width: "100%" }}>
          {open ? (
            <IndicatorDetail setOpen={setOpen} indId={indId} />
          ) : (
            <TableSidebarByUser tblId={tblId} tableCheck={true} />
          )}
        </Box>
      </Grid>
    </Grid>
  );
};
export default IndicatorListByUser;
