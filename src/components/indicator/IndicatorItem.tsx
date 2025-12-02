import { Badge, Card } from "flowbite-react";
import moment from "moment";
import Link from "next/link";
import ArrowRightSLineIcon from "remixicon-react/ArrowRightSLineIcon";
import Calendar2LineIcon from "remixicon-react/Calendar2LineIcon";
import PencilRuler2LineIcon from "remixicon-react/PencilRuler2LineIcon";
import PulseLineIcon from "remixicon-react/PulseLineIcon";
import Timer2LineIcon from "remixicon-react/Timer2LineIcon";
import { cardIndicatorTheme } from "../componentTheme/CardTheme";

const IndicatorItem = ({
  indicator_id,
  indicator_name,
  methodology_date,
  frequency,
  unit,
}: any) => {
  return (
    <Link href={`/indicator/${indicator_id}`} className="flow-root">
      <Card
        className="flex self-stretch justify-between bg-[#3D4E6C26] border-none"
        theme={cardIndicatorTheme}
      >
        <div className="flex items-center space-x-4">
          <div className="shrink-0">
            <PulseLineIcon size={24} color="white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className=" text-text-body-large font-semibold text-white leading-6 pb-1">
              {indicator_name}
            </p>
            <div className="flex items-center text-text-body-medium2 text-white opacity-70 gap-4">
              {unit && (
                <span className="inline-flex items-center gap-1">
                  <PencilRuler2LineIcon size={14} />
                  <Badge color="gray">
                    <span className="text-text-body-small">{unit?.name}</span>
                  </Badge>
                </span>
              )}
              {methodology_date && (
                <span className=" inline-flex items-center ">
                  <Calendar2LineIcon size={14} color="white" />
                  <p className="px-1">
                    {moment(methodology_date).format("YYYY")}
                  </p>
                </span>
              )}
              {frequency && frequency != null && (
                <span className="inline-flex items-center gap-1">
                  <Timer2LineIcon size={14} color="green" />
                  <Badge color="success">
                    <span className="text-text-body-small">
                      {frequency?.name}
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

export default IndicatorItem;
