import { ISecurity, ISource } from "@/interfaces/ILib";
import {
  useGetLicence,
  useGetSecurityLevels,
  useGetSources,
} from "@/utils/customHooks";
import { Button } from "@mui/material";
import { Badge, Sidebar } from "flowbite-react";
import moment from "moment";
import { useState } from "react";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import EditLineIcon from "remixicon-react/EditLineIcon";
import { sidebarTheme } from "../componentTheme/SidebarTheme";
import TableCreate from "./TableCreate";
import { useQuery } from "@tanstack/react-query";
import { getTable } from "@/services/TableService";
import Loader from "../Loader";
const TableDetailByUser = ({
  id,
  open,
  setOpen,
  dbId,
  setAlert,
}: {
  id: number;
  open: boolean;
  setOpen: any;
  dbId: number;
  setAlert?: any;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["get table detail on admin", id],
    queryFn: () => getTable(id),
  });

  const { data: libSources } = useGetSources();
  const { data: libSecuritys } = useGetSecurityLevels();
  const { data: libLicenses } = useGetLicence();
  const [sidebarStatus, setSidebarStatus] = useState(false);

  if (isLoading) return <Loader />;
  return (
    <Sidebar className="w-full bg-white px-4" theme={sidebarTheme}>
      <div className="flex flex-col gap-2 justify-start text-text-body-medium2">
        <div className="border-b py-4 flex justify-between items-center">
          <label
            htmlFor="name"
            className="text-text-title-medium font-medium justify-start"
          >
            {data?.tbl_name}
          </label>
          <div>
            {!sidebarStatus && (
              <Button variant="text" onClick={() => setSidebarStatus(true)}>
                <EditLineIcon />
              </Button>
            )}
            <Button variant="text" onClick={() => setOpen(false)}>
              <CloseLineIcon />
            </Button>
          </div>
        </div>
        {sidebarStatus ? (
          <TableCreate
            dbId={dbId}
            tblId={id}
            setSidebarStatus={setSidebarStatus}
            tblData={data}
            sidebarStatus={sidebarStatus}
            setAlert={setAlert}
          />
        ) : (
          <div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                Тайлбар
              </label>
              <p className="py-2 text-justify text-wrap">
                {data?.table_description}
              </p>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                Анхдагч эх үүсвэр
              </label>
              <span className="flex items-center gap-2 py-2">
                {data?.source?.length > 0 &&
                  data?.source.map((item: ISource, i: number) => (
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
                Анхдагч эх үүсвэр бусад
              </label>
              <p className="py-2 text-justify text-wrap">
                {data?.other_source}
              </p>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                Нууцын зэрэглэл
              </label>
              <span className="flex items-center gap-2 py-2">
                {data?.security_level?.length > 0 &&
                  data?.security_level.map((item: ISecurity, i: number) => (
                    <Badge key={i} color="gray">
                      <span className="text-text-body-small">
                        {libSecuritys?.find(
                          (spec: ISecurity) => spec.id == +item.id
                        )?.name || item.id}
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
                Хүснэгтийн мэдээлэл нь нээлттэй өгөгдлийг ашиглах лицензийн
                төрөл
              </label>
              <span className="flex items-center gap-2 py-2">
                <Badge color="gray">
                  <span className="text-text-body-small">
                    {libLicenses?.find(
                      (spec: ISecurity) =>
                        spec.id == +data?.opendata_licence_type
                    )?.name || data?.opendata_licence_type}
                  </span>
                </Badge>
              </span>
            </div>

            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                Хүснэгтийн мэдээлэл нь нээлттэй өгөгдлийг ашиглах лицензийн
                төрөл бусад{" "}
              </label>
              <p className="py-2 text-justify text-wrap">
                {data?.opendata_licence_type_other}
              </p>
            </div>

            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                Тухайн өгөгдлийг нээлттэй өгөгдлийн системээс татан авч үзэж
                болох цахим хуудасны хаяг
              </label>
              <p className="py-2 text-justify text-wrap">
                {data?.opendata_licence_url}
              </p>
            </div>
            <div className="border-b py-4">
              <label
                htmlFor="name"
                className="text-text-body-large font-medium justify-start"
              >
                Хүснэгт үүсгэсэн огноо
              </label>
              <p className="py-2 text-justify text-wrap">
                {moment(data?.started_date).format("YYYY-MM-DD")}
              </p>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default TableDetailByUser;
