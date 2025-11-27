import ClassificationCode from "@/components/classification/ClassificationCode";
import { IClassification } from "@/interfaces/IClassification";
import { IIndicator } from "@/interfaces/IIndicators";
import { Box, Button, Snackbar, Tooltip, Typography } from "@mui/material";
import { Badge, Modal, ModalBody, ModalHeader } from "flowbite-react";
import moment from "moment";
import { useState } from "react";
import BarcodeBoxLineIcon from "remixicon-react/BarcodeBoxLineIcon";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import EditLineIcon from "remixicon-react/EditLineIcon";
import ClassificationCreate from "./ClassificationCreate";
import { useQuery } from "@tanstack/react-query";
import { getClassificationId } from "@/services/ClassificationService";
import Loader from "@/components/Loader";
import { Alert, alertClasses } from "@mui/material";
import useCurrentUser from "@/utils/useCurrentUser";

const ClassDetailData = ({
  id,
  setOpen,
  indicatorData,
}: {
  id: number;
  setOpen: any;
  indicatorData: IIndicator[];
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const { userInfo } = useCurrentUser();

  const indicatorId: any = indicatorData?.find((ind: any) => {
    return ind?.indicators_classifications?.find((ic: any) => {
      return ic?.classification?.id === id;
    });
  })?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["get classification detail on admin", id],
    queryFn: () => getClassificationId(id),
  });

  const actions = data?.indicators[0]?.indicator?.table?.database?.actions;

  if (isLoading) return <Loader />;
  return (
    <Box sx={{ width: "100%" }}>
      <div className="border-b p-2 flex items-center justify-between ">
        <Typography variant="h6" color="info.dark">
          {data?.name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                  Хагалахад алдаа гарлаа
                </Alert>
              ) : null}
            </Box>
          </Snackbar>
        </Box>
        <span className="justify-end">
          <Tooltip title="Ангилал, кодын жагсаалт харах">
            <Button variant="text" onClick={() => setOpenModal(true)}>
              <BarcodeBoxLineIcon />
            </Button>
          </Tooltip>

          {userInfo?.user_level != 1 && (
            <>
              {userInfo?.user_level == 2 &&
              ((actions?.action_type == 1 && actions?.action_type == 4) ||
                actions == null) ? (
                <>
                  {!sidebarStatus && (
                    <Tooltip title="Ангиллын мэдээлэл засах">
                      <Button
                        variant="text"
                        onClick={() => setSidebarStatus(true)}
                      >
                        <EditLineIcon />
                      </Button>
                    </Tooltip>
                  )}
                </>
              ) : (
                (actions?.action_type == 1 ||
                  actions?.action_type == 4 ||
                  actions == null) && (
                  <>
                    {!sidebarStatus && (
                      <Tooltip title="Ангиллын мэдээлэл засах">
                        <Button
                          variant="text"
                          onClick={() => setSidebarStatus(true)}
                        >
                          <EditLineIcon />
                        </Button>
                      </Tooltip>
                    )}
                  </>
                )
              )}
            </>
          )}
          <Button variant="text" onClick={() => setOpen(false)}>
            <CloseLineIcon />
          </Button>
        </span>
      </div>
      {sidebarStatus ? (
        <ClassificationCreate
          indData={indicatorData}
          indId={indicatorId}
          classData={data}
          sidebarStatus={sidebarStatus}
          setSidebarStatus={setSidebarStatus}
          setAlertMsg={setAlertMsg}
        />
      ) : (
        <Box sx={{ height: 700, overflow: "scroll", px: 2 }}>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              1. Шифр
            </label>
            <p className="py-2 text-justify text-wrap">{data?.code}</p>
          </div>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              2. Тодорхойлолт
            </label>
            <p className="py-2 text-justify text-wrap">{data?.definition}</p>
          </div>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              3. Ангилал, кодыг баталсан эсэх
            </label>
            <span className="flex items-center gap-2 py-2">
              <Badge color="gray">
                <span className="text-text-body-small">
                  {data?.is_confirm ? "Тийм" : "Үгүй"}
                </span>
              </Badge>
            </span>
          </div>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              4. Ангилал, кодыг баталсан байгууллага
            </label>
            <p className="py-2 text-justify text-wrap">
              {data?.confirmed_organization1}
            </p>
          </div>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              5. Маягт нэвтрүүлсэн огноо
            </label>
            <p className="py-2 text-justify text-wrap">
              {moment(data?.implemented_date).format("YYYY-MM-DD")}
            </p>
          </div>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              6. Идэвхтэй эсэх
            </label>
            <span className="flex items-center gap-2 py-2">
              <Badge color={data?.is_active ? "green" : "red"}>
                <span className="text-text-body-small">
                  {data?.is_active ? "Тийм" : "Үгүй"}
                </span>
              </Badge>
            </span>
          </div>
        </Box>
      )}
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        className="overflow-y-auto w-full"
      >
        <ModalHeader className="border-b mt-2"></ModalHeader>
        <ModalBody className="p-4">
          <ClassificationCode
            data={data?.classificationCode}
            name={data?.name}
          />
        </ModalBody>
      </Modal>
    </Box>
  );
};

export default ClassDetailData;
