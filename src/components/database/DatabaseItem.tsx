"use client";
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
    <Link href={`/database/${list?.id}`} className="block">
      <Card
        className="flex self-stretch justify-between border-0 bg-[#3D4E6C26] cursor-pointer hover:bg-[#3D4E6C40]"
        theme={cardIndicatorTheme}
      >
        <div className="flex items-center space-x-4">
          <div className="min-w-0 flex-1">
            <p className="text-text-body-large font-semibold text-white leading-6 hover:underline">
              {list?.name}
            </p>
            <p className="text-text-body-small text-white leading-4 list-desc">
              {list?.description}
            </p>
            <div className="flex flex-wrap md:flex-row items-center justify-start text-text-organization-small md:text-text-body-medium2 text-white opacity-70 gap-4 py-1">
              <span className=" inline-flex items-center ">
                <Calendar2LineIcon size={14} color="white" />
                <p className="px-1">{list?.start_date}</p>
              </span>
              <span className=" inline-flex items-center gap-2 ">
                <CommunityLineIcon size={14} color="white" />
                <p className="px-1">{list.organization?.name}</p>
              </span>

              {/* Table count removed as requested */}

              <span className=" inline-flex items-center">
                <Database2FillIcon size={14} color="white" className="mr-1" />
                {/* badge background removed (transparent) */}
                <Badge className="px-1 bg-transparent border-0 shadow-none">
                  <span className="text-text-body-small text-white">
                    {list.databaseType?.name}
                  </span>
                </Badge>
              </span>
              {list?.is_integrated && (
                <span
                  role="link"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open("https://data.nso.mn/new-datamart", "_blank");
                  }}
                  className="inline-flex items-center cursor-pointer"
                >
                  <Database2LineIcon size={14} color="blue" className="mr-1" />
                  <Badge color="blue" className="px-1">
                    <span className="text-text-body-small">
                      Төрийн нэгдсэн өгөгдлийн сан
                    </span>
                  </Badge>
                </span>
              )}
            </div>
          </div>
          <div className="inline-flex items-center text-base font-semibold text-white">
            <ArrowRightSLineIcon size={26} />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default DatabaseItem;
