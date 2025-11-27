import { Breadcrumb } from "flowbite-react";
import Database2FillIcon from "remixicon-react/Database2FillIcon";
import GridLineIcon from "remixicon-react/GridLineIcon";
import Home3FillIcon from "remixicon-react/Home3FillIcon";
import PulseLineIcon from "remixicon-react/PulseLineIcon";
import Settings3LineIcon from "remixicon-react/Settings3LineIcon";
import { breadcrumbTheme } from "../componentTheme/BreadCrumpTheme";

const AdminBreadCrumpMenu = ({
  menu_name,
  treesubmenu_name,
  submenu_name,
  link,
  type,
}: any) => {
  return (
    <div>
      <Breadcrumb
        className="pb-3  text-secondary-default text-opacity-20 breadcrumb-list"
        theme={breadcrumbTheme as any}
      >
        <Breadcrumb.Item
          className=" text-secondary-default"
          href="/admin/dashboard"
          icon={Home3FillIcon as any}
        >
          Нүүр
        </Breadcrumb.Item>
        {type == "database" && (
          <>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href={link}
              icon={Database2FillIcon as any}
            >
              {menu_name}
            </Breadcrumb.Item>
          </>
        )}

        {type == "table" && (
          <>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href={"/admin/database"}
              icon={Database2FillIcon as any}
            >
              {menu_name}
            </Breadcrumb.Item>
            {submenu_name && (
              <Breadcrumb.Item
                className=" text-secondary-default"
                icon={GridLineIcon as any}
              >
                {submenu_name}
              </Breadcrumb.Item>
            )}
          </>
        )}

        {type == "indicator" && (
          <>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href={"/admin/database"}
              icon={Database2FillIcon as any}
            >
              {menu_name}
            </Breadcrumb.Item>
            {submenu_name && (
              <Breadcrumb.Item
                className=" text-secondary-default"
                icon={GridLineIcon as any}
                href={link}
              >
                {submenu_name}
              </Breadcrumb.Item>
            )}
            {treesubmenu_name && (
              <Breadcrumb.Item
                className=" text-secondary-default"
                icon={PulseLineIcon as any}
              >
                {treesubmenu_name}
              </Breadcrumb.Item>
            )}

            {type == "user" && (
              <Breadcrumb.Item
                className=" text-secondary-default"
                icon={GridLineIcon as any}
                href={link}
              >
                {submenu_name}
              </Breadcrumb.Item>
            )}
          </>
        )}
        {type == "settings" && (
          <Breadcrumb.Item
            className=" text-secondary-default"
            icon={Settings3LineIcon as any}
            href={link}
          >
            {submenu_name}
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
      {/* <h1 className="text-start uppercase text-text-title-large text-secondary-default">
        Үндэсний Статистикийн Хороо
      </h1> */}
    </div>
  );
};
export default AdminBreadCrumpMenu;
