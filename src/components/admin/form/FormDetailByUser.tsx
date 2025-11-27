"use client";
import { ISource } from "@/interfaces/ILib";
import { getForm } from "@/services/FormService";
import { useGetCollectionMethod, useGetSources } from "@/utils/customHooks";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Badge, Sidebar } from "flowbite-react";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import EditLineIcon from "remixicon-react/EditLineIcon";
import { sidebarTheme } from "../../componentTheme/SidebarTheme";
import Loader from "../../Loader";
import FormCreate from "./FormCreate";
import useCurrentUser from "@/utils/useCurrentUser";

const FormDetailByUser = ({
  open,
  setOpen,
  setAlert,
  id,
  dbId,
  setOpenModal,
}: // setTabStatus,
{
  open: boolean;
  setOpen: any;
  setAlert: any;
  id: number;
  dbId: number;
  setOpenModal: any;
  // setTabStatus: any;
}) => {
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { userInfo } = useCurrentUser();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["get form detail on admin", id],
    queryFn: () => getForm(id),
  });
  const { data: libSources } = useGetSources();
  const { data: collectionMethods } = useGetCollectionMethod();

  if (isLoading) return <Loader />;
  if (isError) return <p>Алдаа гарлаа!</p>;

  return (
    <Sidebar
      className="w-full h-fit bg-white px-4 border shadow"
      theme={sidebarTheme}
    >
      <div className="flex flex-col gap-2 justify-start text-text-body-medium2">
        <div className="border-b py-4 flex justify-between items-center">
          <div>
            <Typography variant="h6" color="info.dark">
              {data?.name}
            </Typography>
          </div>
          <Box sx={{ display: "flex", gap: 2 }}>
            {userInfo?.user_level == 2 &&
            (data?.database?.actions?.action_type == 1 ||
              data?.database?.actions?.action_type == 4 ||
              data?.database?.actions == null) ? (
              <div>
                {!sidebarStatus && (
                  <Tooltip title="Маягтын мэдээлэл засах">
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
                  <Tooltip title="Маягтын мэдээллийг хуулбарлах">
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
              </div>
            ) : (
              userInfo?.user_level == 3 &&
              (data?.database?.actions?.action_type == 1 ||
                data?.database?.actions?.action_type == 4 ||
                data?.database?.actions == null) &&
              userInfo?.roles?.find((role: any) => {
                return role.id == 3;
              }) && (
                <div>
                  {!sidebarStatus && (
                    <Tooltip title="Маягтын мэдээлэл засах">
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
                    <Tooltip title="Маягтын мэдээллийг хуулбарлах">
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
                </div>
              )
            )}
            <Button variant="text" onClick={() => setOpen(false)}>
              <CloseLineIcon />
            </Button>
          </Box>
        </div>
        {sidebarStatus ? (
          <FormCreate
            dbId={dbId}
            form_id={id}
            sidebarStatus={sidebarStatus}
            setSidebarStatus={setSidebarStatus}
            setAlert={setAlert}
            formData={data}
            setOpen={setOpenModal}
            isEdit={isEdit}
          />
        ) : (
          <div>
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
                2. Тайлбар
              </label>
              <p className="py-2 text-justify text-wrap">{data?.description}</p>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                3. Тушаалын дугаар
              </label>
              <p className="py-2 text-justify text-wrap">{data?.decree_num}</p>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                4. Маягт баталсан огноо
              </label>
              <p className="py-2 text-justify text-wrap">
                {moment(data?.confirmed_date).format("YYYY-MM-DD")}
              </p>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                5. Баталсан байгууллага
              </label>
              <p className="py-2 text-justify text-wrap">
                {data?.confirmed_org1 || data?.confirmed_org2}
              </p>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                6. Салбар
              </label>
              <span className="flex items-center gap-2 py-2">
                <Badge color="gray">
                  <span className="text-text-body-small">
                    {data?.sector?.name}
                  </span>
                </Badge>
              </span>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                7. Хамтран гаргадаг байгууллага
              </label>
              <p className="py-2 text-justify text-wrap">
                {data?.coorperate_org}
              </p>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                8. Анхан шатны мэдээлэгч/ эх үүсвэр
              </label>
              <span className="flex items-center gap-2 py-2">
                {data?.source_id &&
                  data?.source_id.map((item: any, i: number) => (
                    <Badge key={i} color="gray">
                      <span className="text-text-body-small">
                        {libSources?.find(
                          (spec: ISource) => spec?.id == +item?.id
                        )?.name || item?.id}
                      </span>
                    </Badge>
                  ))}
              </span>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                9. Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр
              </label>
              <span className="flex items-center gap-2 py-2">
                {data?.collection_method_id &&
                  data?.collection_method_id.map((item: any, i: number) => (
                    <Badge key={i} color="gray">
                      <span className="text-text-body-small">
                        {collectionMethods?.find(
                          (spec: ISource) => spec?.id == +item?.id
                        )?.name || item?.id}
                      </span>
                    </Badge>
                  ))}
              </span>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                10. Давтамж
              </label>
              <span className="flex items-center gap-2 py-2">
                <Badge color="gray">
                  <span className="text-text-body-small">
                    {data?.frequency?.name}
                  </span>
                </Badge>
              </span>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                11. Бүрдүүлж эхэлсэн он
              </label>
              <p className="py-2 text-justify text-wrap">
                {data?.collection_started_date}
              </p>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                12. Үр дүнг тархаах түвшин буюу үзүүлэлтийн задаргаа
              </label>
              <span className="flex items-center gap-2 py-2">
                <Badge color="gray">
                  <span className="text-text-body-small">
                    {data?.dissimenation_level?.name}
                  </span>
                </Badge>
              </span>
            </div>

            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                13. Маягт нэвтрүүлсэн огноо
              </label>
              <p className="py-2 text-justify text-wrap">
                {data?.form_generated_date}
              </p>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                14. Маягт шинэчилсэн огноо
              </label>
              <p className="py-2 text-justify text-wrap">
                {data?.form_updated_date}
              </p>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start px-1"
              >
                15. Файл
              </label>
              <Link
                className=" text-primary-high font-bold"
                target="_blank"
                href={data?.files || "#"}
              >
                Маягт татах
              </Link>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                16. Хувилбар
              </label>
              <p className="py-2 text-justify text-wrap">{data?.version}</p>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};
export default FormDetailByUser;
