import { Badge, Card } from "flowbite-react";
import moment from "moment";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import BarcodeBoxLineIcon from "remixicon-react/BarcodeBoxLineIcon";
import Calendar2LineIcon from "remixicon-react/Calendar2LineIcon";
import OrganizationChartIcon from "remixicon-react/OrganizationChartIcon";
import PriceTag3LineIcon from "remixicon-react/PriceTag3LineIcon";
import { cardIndicatorTheme } from "../componentTheme/CardTheme";
import { IClassification } from "@/interfaces/IClassification";

const ClassificationItem = ({ list }: { list: IClassification }) => {
  return (
    <Link href={`/classification/${list?.id}`} className="flow-root">
      <Card
        className="flex self-stretch justify-between"
        theme={cardIndicatorTheme}
      >
        <div className="flex items-center space-x-4">
          <div className="shrink-0">
            <BarcodeBoxLineIcon size={24} color="#03543f" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-text-body-large font-semibold text-secondary-default leading-6">
              {list?.name}
            </p>
            <p className="text-text-body-small text-secondary-default leading-4 list-desc">
              {list?.definition}
            </p>
            <div className="flex flex-wrap md:flex-row items-center text-text-body-medium2 text-secondary-default opacity-70 gap-4 py-1">
              {list?.confirmed_decree_date && (
                <span className=" inline-flex items-center ">
                  <Calendar2LineIcon size={14} color="#333a3f" />
                  <p className="px-1">
                    {moment(list?.confirmed_decree_date).format("YYYY-MM-DD")}
                  </p>
                </span>
              )}
              {/* <span className=" inline-flex items-center">
                <PriceTag3LineIcon size={14} color="#333a3f" />
                <Badge color="success" className="px-1">
                  <span className="text-text-body-small">
                    {list?.classificationCode?.[0]?.version_num}
                  </span>
                </Badge>
              </span> */}
              {list?.confirmed_organization1 && (
                <span className=" inline-flex items-center ">
                  <OrganizationChartIcon size={14} color="#03543f" />
                  <Badge color="success" className="px-1">
                    <span className="text-text-body-medium2">
                      {list?.confirmed_organization1}
                    </span>
                  </Badge>
                </span>
              )}
              {list?.confirmed_organization2 && (
                <span className=" inline-flex items-center ">
                  <OrganizationChartIcon size={14} color="#42389d" />
                  <Badge color="indigo" className="px-1">
                    <span className="text-text-body-medium2">
                      {list?.confirmed_organization2}
                    </span>
                  </Badge>
                </span>
              )}
              {list?.confirmed_organization3 && (
                <span className=" inline-flex items-center ">
                  <OrganizationChartIcon size={14} color="#5521b5" />
                  <Badge color="purple" className="px-1">
                    <span className="text-text-body-medium2">
                      {list?.confirmed_organization3}
                    </span>
                  </Badge>
                </span>
              )}
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

export default ClassificationItem;
