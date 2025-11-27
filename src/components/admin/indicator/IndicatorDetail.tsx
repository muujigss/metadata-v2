import Loader from "@/components/Loader";
import { IIndicator } from "@/interfaces/IIndicators";
import { getIndicator } from "@/services/IndicatorService";
import {
  Alert,
  alertClasses,
  Box,
  Button,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "flowbite-react";
import moment from "moment";
import { useState } from "react";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import EditLineIcon from "remixicon-react/EditLineIcon";
import CreateIndicator from "./CreateIndicator";
import useCurrentUser from "@/utils/useCurrentUser";
interface IndicatorDetailProps {
  setOpen: any;
  indId: number;
}
const IndicatorDetail = ({ indId, setOpen }: IndicatorDetailProps) => {
  const [alertMsg, setAlertMsg] = useState("");
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { userInfo } = useCurrentUser();

  const { data, isLoading } = useQuery<IIndicator>({
    queryKey: ["get indicator detail on admin", indId],
    queryFn: () => getIndicator(indId),
  });

  if (isLoading) return <Loader />;
  if (!data) return <p>Алдаа гарлаа ...</p>;
  const actions = data?.table?.database?.actions;

  return (
    <Box sx={{ width: "100%" }}>
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          justifyContent: "space-between",
          borderBottom: "1px solid #E0E0E0",
          p: 2.8,
        }}
      >
        <Typography
          variant="h6"
          color="info.dark"
          sx={{ justifyContent: "flex-start" }}
        >
          {data?.name}
        </Typography>
        <Box sx={{ justifyContent: "flex-end" }}>
          {userInfo?.user_level != 1 && (
            <>
              {userInfo?.user_level == 2 &&
              (actions?.action_type == 1 ||
                actions?.action_type == 4 ||
                actions == null) ? (
                <>
                  {!sidebarStatus && (
                    <Tooltip title="Үзүүлэлтийн мэдээлэл засах">
                      <Button
                        variant="text"
                        onClick={() => {
                          setSidebarStatus(true);
                          setIsEdit(true);
                        }}
                      >
                        <EditLineIcon />
                      </Button>
                    </Tooltip>
                  )}
                  {!sidebarStatus && (
                    <Tooltip title="Үзүүлэлтийн мэдээлэл хуулбарлах">
                      <Button
                        variant="text"
                        onClick={() => {
                          setSidebarStatus(true);
                          setIsEdit(false);
                        }}
                      >
                        Copy
                      </Button>
                    </Tooltip>
                  )}
                </>
              ) : (
                (actions?.action_type == 1 ||
                  actions?.action_type == 4 ||
                  actions == null) &&
                userInfo?.roles?.find((role: any) => {
                  return role.id == 3 || role.id == 1;
                }) && (
                  <>
                    {!sidebarStatus && (
                      <Tooltip title="Үзүүлэлтийн мэдээлэл засах">
                        <Button
                          variant="text"
                          onClick={() => {
                            setSidebarStatus(true);
                            setIsEdit(true);
                          }}
                        >
                          <EditLineIcon />
                        </Button>
                      </Tooltip>
                    )}
                    {!sidebarStatus && (
                      <Tooltip title="Үзүүлэлтийн мэдээлэл хуулбарлах">
                        <Button
                          variant="text"
                          onClick={() => {
                            setSidebarStatus(true);
                            setIsEdit(false);
                          }}
                        >
                          Copy
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
        </Box>
      </Box>
      {sidebarStatus ? (
        <CreateIndicator
          tblId={data?.tbl_id}
          indId={indId}
          inData={data}
          setAlert={setAlertMsg}
          setOpen={setOpen}
          isEdit={isEdit}
        />
      ) : (
        <Box sx={{ width: "100%", px: 2, height: 600, overflow: "scroll" }}>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              1. Шифр, дугаар
            </label>
            <p className="py-2 text-justify text-wrap">{data?.code}</p>
          </div>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              2. Үзүүлэлт (талбар/асуулт)-ийн тооцох давтамж
            </label>
            <p className="py-2 text-justify text-wrap">
              {data?.frequency_id && data?.frequency?.name}
            </p>
          </div>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              3. Үзүүлэлт (талбар/асуулт)-ийн тооцох давтамж Бусад /бичих/
            </label>
            <span className="flex items-center gap-2 py-2">
              <Badge color="gray">
                <span className="text-text-body-small">
                  {data?.frequency_other ? "Тийм" : "Үгүй"}
                </span>
              </Badge>
            </span>
          </div>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              4. Хэмжих нэгж
            </label>
            <p className="py-2 text-justify text-wrap">
              {data.unit_id && data?.unit?.name}
            </p>
          </div>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              5. Утгын төрөл
            </label>
            <p className="py-2 text-justify text-wrap">
              {data.value_type_id && data?.value_type?.name}
            </p>
          </div>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              6. Нууцын зэрэглэл
            </label>
            <p className="py-2 text-justify text-wrap">
              {data.security_level_id && data?.security_level?.name}
            </p>
          </div>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              7. Аргачлал, арга зүй байгаа эсэх
            </label>
            <span className="flex items-center gap-2 py-2">
              <Badge color={data?.is_methodology ? "green" : "red"}>
                <span className="text-text-body-small">
                  {data?.is_methodology ? "Тийм" : "Үгүй"}
                </span>
              </Badge>
            </span>
          </div>

          {data?.is_methodology && (
            <>
              <div className="border-b py-4">
                <label
                  htmlFor="name"
                  className="text-text-body-large font-medium justify-start"
                >
                  7.1. Аргачлал, арга зүйн нэр
                </label>
                <p className="py-2 text-justify text-wrap">
                  {data.methodology}
                </p>
              </div>
              <div className="border-b py-4">
                <label
                  htmlFor="name"
                  className="text-text-body-large font-medium justify-start"
                >
                  7.2. Аргачлал, арга зүйг баталсан эсэх
                </label>
                <span className="flex items-center gap-2 py-2">
                  <Badge color={data?.is_methodology_confirm ? "green" : "red"}>
                    <span className="text-text-body-small">
                      {data?.is_methodology_confirm ? "Тийм" : "Үгүй"}
                    </span>
                  </Badge>
                </span>
              </div>
              {data?.is_methodology_confirm && (
                <>
                  <div className="border-b py-4">
                    <label
                      htmlFor="name"
                      className="text-text-body-large font-medium justify-start"
                    >
                      7.3. Аргачлал, арга зүйг баталсан тушаалын дугаар
                    </label>
                    <p className="py-2 text-justify text-wrap">
                      {data.methodology_decree_num}
                    </p>
                  </div>
                  <div className="border-b py-4">
                    <label
                      htmlFor="name"
                      className="text-text-body-large font-medium justify-start"
                    >
                      7.4. Аргачлал, арга зүйг баталсан огноо
                    </label>
                    <p className="py-2 text-justify text-wrap">
                      {moment(data?.methodology_date).format("YYYY-MM-DD")}
                    </p>
                  </div>

                  <div className="border-b py-4">
                    <label
                      htmlFor="name"
                      className="text-text-body-large font-medium justify-start"
                    >
                      7.5. Аргачлал, арга зүйг баталсан байгууллага
                    </label>
                    <p className="py-2 text-justify text-wrap">
                      {data.confirmed_organtization}
                    </p>
                  </div>
                </>
              )}
            </>
          )}

          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              8. Үзүүлэлт (талбар/асуулт)-ийг үүсгэсэн он
            </label>
            <p className="py-2 text-justify text-wrap">
              {data?.generated_date}
            </p>
          </div>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              9. Ангилал, код байгаа эсэх
            </label>
            <span className="flex items-center gap-2 py-2">
              <Badge color={data?.is_classification ? "green" : "red"}>
                <span className="text-text-body-small">
                  {data?.is_classification ? "Тийм" : "Үгүй"}
                </span>
              </Badge>
            </span>
          </div>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              10. Идэвхтэй эсэх
            </label>
            <span className="flex items-center gap-2 py-2">
              <Badge color={data?.is_active ? "green" : "red"}>
                <span className="text-text-body-small">
                  {data?.is_active ? "Тийм" : "Үгүй"}
                </span>
              </Badge>
            </span>
          </div>
          <div className="border-b py-4">
            <label
              htmlFor="name"
              className="text-text-body-large font-medium justify-start"
            >
              11. Хувилбар
            </label>
            <p className="py-2 text-justify text-wrap">{data.version}</p>
          </div>
        </Box>
      )}
    </Box>
  );
};

export default IndicatorDetail;
