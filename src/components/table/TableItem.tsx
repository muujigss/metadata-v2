"use client";
import { ISource } from "@/interfaces/ILib";
import { ITable } from "@/interfaces/ITable";
import { useGetSources } from "@/utils/customHooks";
import { Badge, Card } from "flowbite-react";
import moment from "moment";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import Calendar2LineIcon from "remixicon-react/Calendar2LineIcon";
import GridLineIcon from "remixicon-react/GridLineIcon";
import OpenSourceLineIcon from "remixicon-react/OpenSourceLineIcon";
import { cardIndicatorTheme } from "../componentTheme/CardTheme";

const TableItem = ({ list }: { list: ITable }) => {
  // const { data: dataSources, isLoading, isError } = useGetSources();

  // if (isLoading) return <Loader />;
  // if (isError) return <p>Алдаа гарлаа!</p>;

  return (
    <Link href={`/table/${list?.id}`} className="flow-root">
      <Card
        className="flex self-stretch justify-between"
        theme={cardIndicatorTheme}
      >
        <div className="flex items-center space-x-4">
          <div className="shrink-0">
            <GridLineIcon size={24} color="#03543f" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-text-body-large font-semibold text-secondary-default leading-6">
              {list?.name}
            </p>
            <p className="text-text-body-small text-secondary-default leading-4 list-desc pb-1">
              {list?.description}
            </p>
            <div className="flex items-center text-text-body-medium2 text-secondary-default opacity-70 gap-4">
              <span className=" inline-flex items-center ">
                <Calendar2LineIcon size={14} color="#333a3f" />
                <p className="px-1">
                  {list?.started_date &&
                    moment(list?.started_date).format("YYYY")}
                </p>
              </span>
              {/* <span className="inline-flex items-center gap-1">
                <OpenSourceLineIcon size={14} color="#333a3f" />
                {list?.source?.map((item, i) => (
                  <Badge key={i} color="gray">
                    <span className="text-text-body-small">
                      {dataSources?.find((spec: ISource) => spec.id == +item.id)
                        ?.name || item.id}
                    </span>
                  </Badge>
                ))}
              </span> */}
            </div>
          </div>

          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
            <ArrowRightSLineIcon size={26} />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default TableItem;
