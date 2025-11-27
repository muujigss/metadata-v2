import React from "react";
import { Breadcrumb } from "flowbite-react";
import Home3FillIcon from "remixicon-react/Home3FillIcon";
import Database2FillIcon from "remixicon-react/Database2FillIcon";
import GridLineIcon from "remixicon-react/GridLineIcon";
import { usePathname } from "next/navigation";
import PulseLineIcon from "remixicon-react/PulseLineIcon";
import BarcodeBoxLineIcon from "remixicon-react/BarcodeBoxLineIcon";
import EditBoxFillIcon from "remixicon-react/EditBoxFillIcon";

const BreadCrumpSubMenu = ({ data }: { data: any }) => {
  const pathname = usePathname();
  const replace = pathname.replace("/", "").replace(/\/\d+/g, "");

  return (
    <div className="">
      <h1 className="text-start uppercase text-text-body-medium md:text-text-title-large text-secondary-default pb-2">
        {replace == "database" && data?.organization?.name}
        {replace == "table" && data?.database?.organization?.name}
        {replace == "indicator" && data?.table?.database?.organization?.name}
        {replace == "classification" &&
          data?.indicators[0]?.indicator?.table?.database?.organization?.name}
        {replace == "form" && data?.database?.organization?.name}
      </h1>
      <Breadcrumb
        // aria-label="Default breadcrumb example"
        className="pb-3text-opacity-20 breadcrumb-list"
        // theme={breadcrumbTheme as any}
      >
        <Breadcrumb.Item
          className=" text-secondary-default text-text-organization-small md:text-text-body-medium"
          href="/"
          icon={Home3FillIcon as any}
        >
          Нүүр
        </Breadcrumb.Item>
        {replace == "database" && (
          <>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href="/database"
              icon={Database2FillIcon as any}
            >
              Өгөгдлийн сан
              {/* {data?.db_name} */}
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className=" text-secondary-default"
              // href={`/database/${submenu_id}`}
            >
              {data?.name}
            </Breadcrumb.Item>
          </>
        )}

        {replace == "table" && (
          <>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href={`/database/${data?.database?.id}`}
              icon={Database2FillIcon as any}
            >
              {data?.database?.name}
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className=" text-secondary-default"
              // href={`/table`}
              icon={GridLineIcon as any}
            >
              {data?.name}
            </Breadcrumb.Item>
          </>
        )}
        {replace == "indicator" && (
          <>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href={`/database/${data?.table?.db_id}`}
              icon={Database2FillIcon as any}
            >
              {data?.table?.database?.name}
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href={`/table/${data?.tbl_id}`}
              icon={GridLineIcon as any}
            >
              {data?.table?.name}
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className=" text-secondary-default"
              // href={`/table/${data?.tbl_id}`}
              icon={PulseLineIcon as any}
            >
              {data?.name}
            </Breadcrumb.Item>
          </>
        )}

        {replace == "classification" && (
          <>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href={`/database/${data?.indicators[0]?.indicator?.table?.db_id}`}
              icon={Database2FillIcon as any}
            >
              {data?.indicators[0]?.indicator?.table?.database?.name}
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href={`/table/${data?.indicators[0]?.indicator?.tbl_id}`}
              icon={GridLineIcon as any}
            >
              {data?.indicators[0]?.indicator?.table?.name}
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href={`/indicator/${data?.indicators[0]?.indicator?.id}`}
              icon={PulseLineIcon as any}
            >
              {data?.indicators[0]?.indicator?.name}
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className=" text-secondary-default"
              // href={`/indicator/${data?.indicators[0]?.indicator_id}`}
              icon={BarcodeBoxLineIcon as any}
            >
              {data?.name}
            </Breadcrumb.Item>
          </>
        )}
        {replace == "form" && (
          <>
            <Breadcrumb.Item
              className=" text-secondary-default"
              href={`/database/${data?.database?.id}`}
              icon={Database2FillIcon as any}
            >
              {data?.database?.name}
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className=" text-secondary-default"
              // href={`/table`}
              icon={EditBoxFillIcon as any}
            >
              {data?.name}
            </Breadcrumb.Item>
          </>
        )}
      </Breadcrumb>
    </div>
  );
};
export default BreadCrumpSubMenu;
