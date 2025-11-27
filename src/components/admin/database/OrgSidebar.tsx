import { sidebarTheme } from "@/components/componentTheme/SidebarTheme";
import { IOrganization } from "@/interfaces/IOrganization";
import { Button } from "@mui/material";
import { Badge, Sidebar } from "flowbite-react";
import AddLineIcon from "remixicon-react/AddLineIcon";

interface IOrgSidebarProps {
  org?: IOrganization;
  handleModal: () => void;
}
const OrgSidebar = ({ org, handleModal }: IOrgSidebarProps) => {
  return (
    <Sidebar className="w-full h-fit bg-white" theme={sidebarTheme}>
      <div className="flex flex-col gap-2 justify-start text-text-body-medium2">
        <div className="border-b py-4">
          <p className="text-text-title-medium justify-start">
            Байгууллагын мэдээлэл
          </p>
        </div>
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            Нэр
          </label>
          <p className="py-2 text-justify text-wrap">{org?.name}</p>
        </div>
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            Утас
          </label>
          <Badge color="gray" className="py-2 w-fit">
            <p className="p-1 text-text-body-small">
              <a className="text-blue-500 " href={`tel:${org?.phone}`}>
                {org?.phone}
              </a>
            </p>
          </Badge>
        </div>
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            И-мэйл
          </label>
          <span className="flex items-center gap-2">
            <a className="text-blue-500 " href={`mailto:${org?.email}`}>
              {org?.email}
            </a>
          </span>
        </div>
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            Хаягийн мэдээлэл
          </label>
          <span className="flex items-center gap-2">{org?.address}</span>
        </div>
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            Цахим хуудасны хаяг
          </label>
          <span className="flex items-center gap-2">
            <a className="text-blue-500 " href={`${org?.website}`}>
              {org?.website}
            </a>
          </span>
        </div>
        <div className="border-b py-4">
          <label
            htmlFor="name"
            className="text-text-body-large font-medium justify-start"
          >
            Хаягийн мэдээлэл
          </label>
          <span className="flex items-center gap-2">
            <a className="text-blue-500 " href={`${org?.address}`}>
              {org?.website}
            </a>
          </span>
        </div>
      </div>
    </Sidebar>
  );
};

export default OrgSidebar;
