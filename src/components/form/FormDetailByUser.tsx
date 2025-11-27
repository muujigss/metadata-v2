import React, { useState } from "react";
import { Badge, Sidebar } from "flowbite-react";
import { sidebarTheme } from "../componentTheme/SidebarTheme";
import { useQuery } from "@tanstack/react-query";
import { getForm } from "@/services/FormService";
import Loader from "../Loader";
import { Button, Tooltip } from "@mui/material";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import EditLineIcon from "remixicon-react/EditLineIcon";
import FormCreate from "./FormCreate";
import moment from "moment";
import { useGetCollectionMethod, useGetSources } from "@/utils/customHooks";
import { ISource } from "@/interfaces/ILib";

const FormDetailByUser = ({
  open,
  setOpen,
  setAlert,
  id,
  dbId,
  setTabStatus,
}: {
  open: boolean;
  setOpen: any;
  setAlert: any;
  id: number;
  dbId: number;
  setTabStatus: any;
}) => {
  const [sidebarStatus, setSidebarStatus] = useState(false);

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
          <label
            htmlFor="name"
            className="text-text-title-medium font-medium justify-start"
          >
            {data?.name}
          </label>
          <div>
            {!sidebarStatus && (
              <Tooltip title="Маягтын мэдээлэл засах">
                <Button variant="text" onClick={() => setSidebarStatus(true)}>
                  <EditLineIcon />
                </Button>
              </Tooltip>
            )}
            <Button variant="text" onClick={() => setOpen(false)}>
              <CloseLineIcon />
            </Button>
          </div>
        </div>
        {sidebarStatus ? (
          <FormCreate
            dbId={dbId}
            form_id={id}
            setTabStatus={setTabStatus}
            sidebarStatus={sidebarStatus}
            setSidebarStatus={setSidebarStatus}
            setAlert={setAlert}
            formData={data}
          />
        ) : (
          <div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                Шифр
              </label>
              <p className="py-2 text-justify text-wrap">{data?.code}</p>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                Тайлбар
              </label>
              <p className="py-2 text-justify text-wrap">{data?.description}</p>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                Тушаалын дугаар
              </label>
              <p className="py-2 text-justify text-wrap">{data?.decree_num}</p>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                Маягт баталсан огноо
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
                Баталсан байгууллага
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
                Салбар
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
                Хамтран гаргадаг байгууллага
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
                Анхан шатны мэдээлэгч/ эх үүсвэр
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
                Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр
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
                Давтамж
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
                Бүрдүүлж эхэлсэн он
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
                Үр дүнг тархаах түвшин буюу үзүүлэлтийн задаргаа
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
                Маягт нэвтрүүлсэн огноо
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
                Маягт шинэчилсэн огноо
              </label>
              <p className="py-2 text-justify text-wrap">
                {data?.form_updated_date}
              </p>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};
export default FormDetailByUser;
