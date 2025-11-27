import { Breadcrumb } from "flowbite-react";
import Home3FillIcon from "remixicon-react/Home3FillIcon";
import Database2FillIcon from "remixicon-react/Database2FillIcon";
import GridLineIcon from "remixicon-react/GridLineIcon";
import EditBoxFillIcon from "remixicon-react/EditBoxFillIcon";
import BarcodeBoxLineIcon from "remixicon-react/BarcodeBoxLineIcon";
import { breadcrumbTheme } from "./componentTheme/BreadCrumpTheme";
import PulseLineIcon from "remixicon-react/PulseLineIcon";
import CommunityLineIcon from "remixicon-react/CommunityLineIcon";
import ListSettingsLineIcon from "remixicon-react/ListSettingsLineIcon";

const BreadCrumpMenu = ({ menu_name, id, submenu_id, submenu_name }: any) => {
  return (
    <div>
      <Breadcrumb
        // aria-label="Default breadcrumb example"
        className="pb-3  text-secondary-default text-opacity-20 breadcrumb-list"
        theme={breadcrumbTheme as any}
      >
        <Breadcrumb.Item
          className=" text-secondary-default"
          href="/"
          icon={Home3FillIcon as any}
        >
          Нүүр
        </Breadcrumb.Item>
        {id == 1 && (
          <>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href="/database"
              icon={Database2FillIcon as any}
            >
              Өгөгдлийн сан
            </Breadcrumb.Item>
            {submenu_id !== undefined && (
              <Breadcrumb.Item
                className=" text-secondary-default"
                href={`/database/${submenu_id}`}
              >
                {submenu_name}
              </Breadcrumb.Item>
            )}
          </>
        )}
        {id == 3 && (
          <>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href="/form"
              icon={EditBoxFillIcon as any}
            >
              {menu_name}
            </Breadcrumb.Item>
            {submenu_id !== undefined && (
              <Breadcrumb.Item
                className=" text-secondary-default"
                href={`/form/${submenu_id}`}
              >
                {submenu_name}
              </Breadcrumb.Item>
            )}
          </>
        )}
        {id == 2 && (
          <>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href="/table"
              icon={GridLineIcon as any}
            >
              {menu_name}
            </Breadcrumb.Item>
            {submenu_id !== undefined && (
              <Breadcrumb.Item
                className=" text-secondary-default"
                href={`/table/${submenu_id}`}
              >
                {submenu_name}
              </Breadcrumb.Item>
            )}
          </>
        )}
        {id == 5 && (
          <>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href="/classification"
              icon={BarcodeBoxLineIcon as any}
            >
              {menu_name}
            </Breadcrumb.Item>
            {submenu_id !== undefined && (
              <Breadcrumb.Item
                className=" text-secondary-default"
                href={`/classification/${submenu_id}`}
              >
                {submenu_name}
              </Breadcrumb.Item>
            )}
          </>
        )}
        {id == 4 && (
          <>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href="/indicator"
              icon={PulseLineIcon as any}
            >
              {menu_name}
            </Breadcrumb.Item>
            {submenu_id !== undefined && (
              <Breadcrumb.Item
                className=" text-secondary-default"
                href={`/classification/${submenu_id}`}
              >
                {submenu_name}
              </Breadcrumb.Item>
            )}
          </>
        )}
        {id == 6 && (
          <>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href="/organization"
              icon={CommunityLineIcon as any}
            >
              {menu_name}
            </Breadcrumb.Item>
            {submenu_id !== undefined && (
              <Breadcrumb.Item
                className=" text-secondary-default"
                href={`/classification/${submenu_id}`}
              >
                {submenu_name}
              </Breadcrumb.Item>
            )}
          </>
        )}
        {id == 7 && (
          <>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href="/sector"
              icon={ListSettingsLineIcon as any}
            >
              {menu_name}
            </Breadcrumb.Item>
            {submenu_id !== undefined && (
              <Breadcrumb.Item
                className=" text-secondary-default"
                href={`/classification/${submenu_id}`}
              >
                {submenu_name}
              </Breadcrumb.Item>
            )}
          </>
        )}
      </Breadcrumb>
      {/* <h1 className="text-start uppercase text-text-title-large text-secondary-default">
        Үндэсний Статистикийн Хороо
      </h1> */}
    </div>
  );
};
export default BreadCrumpMenu;
