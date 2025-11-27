import Loader from "@/components/Loader";
import { ISecurity, ISource } from "@/interfaces/ILib";
import { getTable } from "@/services/TableService";
import {
  useGetLicence,
  useGetSecurityLevels,
  useGetSources,
} from "@/utils/customHooks";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "flowbite-react";
import moment from "moment";
const TableSidebarByUser = ({
  tblId,
  tableCheck,
}: {
  tblId: number;
  tableCheck?: boolean;
}) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["get table sidebar", tblId],
    queryFn: () => getTable(tblId),
  });
  const { data: libSources } = useGetSources();
  const { data: libSecuritys } = useGetSecurityLevels();
  const { data: libLicenses } = useGetLicence();

  if (isLoading) return <Loader />;
  return (
    <div className="w-full px-3">
      <div className="flex flex-col gap-2 justify-start text-text-body-medium2">
        {tableCheck && (
          <div className="border-b py-4">
            <Typography variant="h6" color="info.dark">
              Хүснэгтийн мета мэдээлэл
            </Typography>
          </div>
        )}
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            1. Хүснэгтийн код
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
            3. Анхдагч эх үүсвэр
          </label>
          <span className="flex items-center gap-2 py-2">
            {data?.source?.length > 0 &&
              data?.source.map((item: ISource, i: number) => (
                <Badge key={i} color="gray">
                  <span className="text-text-body-small">
                    {libSources?.find((spec: ISource) => spec?.id == +item?.id)
                      ?.name || item?.id}
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
            4. Нууцын зэрэглэл
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
            5. Хүснэгтийн мэдээлэл нь нээлттэй өгөгдлийг ашиглах лицензийн төрөл
          </label>
          <span className="flex items-center gap-2 py-2">
            <Badge color="gray">
              <span className="text-text-body-small">
                {libLicenses?.find(
                  (spec: ISecurity) => spec.id == +data?.licence_type
                )?.name || data?.licence_type}
              </span>
            </Badge>
          </span>
        </div>
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            6. Тухайн өгөгдлийг нээлттэй өгөгдлийн системээс татан авч үзэж
            болох цахим хуудасны хаяг:
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
            7. Хүснэгт үүсгэсэн огноо
          </label>
          <p className="py-2 text-justify text-wrap">{data?.started_date}</p>
        </div>
      </div>
    </div>
  );
};

export default TableSidebarByUser;
