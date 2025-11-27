import { IDatabase } from "@/interfaces/IDatabase";
import { ISpecification } from "@/interfaces/ISpecification";
import { useGetSpecification } from "@/utils/customHooks";
import { Badge, Sidebar } from "flowbite-react";
import { sidebarTheme } from "../componentTheme/SidebarTheme";
import { Typography } from "@mui/material";

const SidebarComponents = ({ database }: { database: IDatabase }) => {
  const { data: libSpecification } = useGetSpecification();

  return (
    <Sidebar className="w-full h-fit " theme={sidebarTheme}>
      <div className="flex flex-col gap-2 justify-start text-text-body-medium2">
        <div className="border-b ">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            1. Тайлбар
          </label>
          <p className="py-2 text-justify text-wrap">{database?.description}</p>
        </div>
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            2. Зориулалт
          </label>
          <span className="flex items-center gap-2">
            {database?.spec &&
              database?.spec.map((item, i) => (
                <Badge key={i} color="gray">
                  <span className="text-text-body-small">
                    {libSpecification?.find(
                      (spec: ISpecification) => spec.id == +item.id
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
            3. Өгөгдлийн сангийн төрөл
          </label>
          <Badge color="gray" className="py-2 w-fit">
            <p className="p-1 text-text-body-small">
              {database?.databaseType?.name}
            </p>
          </Badge>
        </div>
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            4. Салбар
          </label>
          <Badge color="gray" className="py-2 w-fit">
            <p className="p-1 text-text-body-small">
              {database?.sectors?.name}
            </p>
          </Badge>
        </div>
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            5. Өгөгдлийн сангийн байршил
          </label>
          <Badge color="gray" className="py-2 w-fit">
            <p className="p-1 text-text-body-small">
              {database?.databaseLocation?.name}
            </p>
          </Badge>
        </div>
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            6. Нээлттэй өгөгдлийг ашиглах лицензийн төрөл
          </label>
          <p className="py-2 text-justify text-wrap">
            {database?.licenceType?.name}
          </p>
        </div>
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            7. Тухайн өгөгдлийг нээлттэй өгөгдлийн системээс татан авч үзэж
            болох цахим хуудасны хаяг
          </label>
          <p className="py-2 text-justify text-wrap">
            {database?.opendata_url}
          </p>
        </div>
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            8. Өгөгдлийн санг нэвтрүүлсэн он
          </label>
          <p className="py-2 text-justify text-wrap">{database?.start_date}</p>
        </div>
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            9. Хүснэгтийн тоо
          </label>
          <p className="py-2 text-justify text-wrap">{database?.table_count}</p>
        </div>
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            10. Идэвхтэй эсэх
          </label>
          <p className="py-2 text-justify text-wrap">{database?.is_active}</p>
        </div>
      </div>
    </Sidebar>
  );
};

export default SidebarComponents;
