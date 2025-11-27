import { Badge, Card } from "flowbite-react";
import moment from "moment";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import Calendar2LineIcon from "remixicon-react/Calendar2LineIcon";
import CommunityLineIcon from "remixicon-react/CommunityLineIcon";
import EditBoxFillIcon from "remixicon-react/EditBoxFillIcon";
import { cardIndicatorTheme } from "../componentTheme/CardTheme";

const FormItem = ({
  id,
  name,
  description,
  code,
  confirmed_date,
  org_name,
  frequency,
}: any) => {
  return (
    <Link href={`/form/${id}`} className="flow-root">
      <Card
        className="flex self-stretch justify-between"
        theme={cardIndicatorTheme}
      >
        <div className="flex items-center space-x-4">
          <div className="shrink-0">
            <EditBoxFillIcon size={24} color="#03543f" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-text-body-large font-semibold text-secondary-default leading-6">
              {name} /{code}/
            </p>
            <p className="text-text-body-small text-secondary-default leading-4 list-desc">
              {description}
            </p>
            <div className="flex items-center text-text-body-medium2 text-secondary-default opacity-70 gap-4 py-1">
              <span className=" inline-flex items-center ">
                <Calendar2LineIcon size={14} color="#333a3f" />
                <p className="px-1">
                  {confirmed_date && moment(confirmed_date).format("YYYY")}
                </p>
              </span>
              <span className="inline-flex items-center gap-1">
                <CommunityLineIcon size={14} color="#333a3f" />
                <p>{org_name}</p>
              </span>
              <span className="inline-flex items-center gap-1">
                {frequency && (
                  <Badge color="success">
                    <span className="text-text-body-small">
                      {frequency?.name}
                    </span>
                  </Badge>
                )}
              </span>
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

export default FormItem;
