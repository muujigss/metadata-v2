import { IDatabase } from "@/interfaces/IDatabase";
import { Badge, Card } from "flowbite-react";
import moment from "moment";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import Calendar2LineIcon from "remixicon-react/Calendar2LineIcon";
import CommunityLineIcon from "remixicon-react/CommunityLineIcon";
import Database2FillIcon from "remixicon-react/Database2FillIcon";
import Database2LineIcon from "remixicon-react/Database2LineIcon";
import GridLineIcon from "remixicon-react/GridLineIcon";
import { cardIndicatorTheme } from "../componentTheme/CardTheme";

const DatabaseItem = ({ list }: { list: IDatabase }) => {
  return (
    <Card
      className="flex self-stretch justify-between"
      theme={cardIndicatorTheme}
    >
      <div className="flex items-center space-x-4">
        <div className="shrink-0">
          <Database2LineIcon size={24} color="#03543f" />
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/database/${list?.id}`} className="flow-root">
            <p className="text-text-body-large font-semibold text-secondary-default leading-6">
              {list?.name}
            </p>
          </Link>
          <p className="text-text-body-small text-secondary-default leading-4 list-desc">
            {list?.description}
          </p>
          <div className="flex flex-wrap md:flex-row items-center justify-start text-text-organization-small md:text-text-body-medium2 text-secondary-default opacity-70 gap-4 py-1">
            <span className=" inline-flex items-center ">
              <Calendar2LineIcon size={14} color="#333a3f" />
              <p className="px-1">
                {list?.start_date}
                {/* {list?.start_date && moment(list?.start_date.toString()).format("YYYY")} */}
              </p>
            </span>
            <span className=" inline-flex items-center gap-2 ">
              <CommunityLineIcon size={14} color="#333a3f" />
              <p className="px-1">{list.organization?.name}</p>
            </span>
            <span className=" inline-flex items-center">
              <GridLineIcon size={14} color="#333a3f" />
              <p className="px-1">{list?.table_count}</p>
            </span>
            <span className=" inline-flex items-center">
              <Database2FillIcon size={14} color="green" className="mr-1" />
              <Badge color="success" className="px-1">
                <span className="text-text-body-small">
                  {list.databaseType?.name}
                </span>
              </Badge>
            </span>
            {list?.is_integrated && (
              <a href={`https://data.nso.mn/new-datamart`} target="_blank">
                <span className="inline-flex items-center">
                  <Database2LineIcon size={14} color="blue" className="mr-1" />
                  <Badge color="blue" className="px-1">
                    <span className="text-text-body-small">
                      {list?.is_integrated && "Төрийн нэгдсэн өгөгдлийн сан"}
                    </span>
                  </Badge>
                </span>
              </a>
            )}
          </div>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          <ArrowRightSLineIcon size={26} />
        </div>
      </div>
    </Card>
  );
};

export default DatabaseItem;
