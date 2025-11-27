import { Badge, Card } from "flowbite-react";
import moment from "moment";
import Calendar2LineIcon from "remixicon-react/Calendar2LineIcon";
import PriceTag3LineIcon from "remixicon-react/PriceTag3LineIcon";

import { IClassification } from "@/interfaces/IClassification";
import { TabItem, Tabs } from "flowbite-react";
import BreadCrumpSubMenu from "../BreadCrumpSubMenu";
import { tabsTheme } from "../componentTheme/TabsTheme";
import IndicatorItem from "../indicator/IndicatorItem";
import ClassificationCode from "./ClassificationCode";
import ClassificationDetail from "./ClassificationDetail";
import ClassificationDetailSideBar from "./ClassificationDetailSideBar";

const ClassificationTabList = ({ data }: { data: IClassification }) => {
  const fieldData: IClassification = data;

  return (
    <div className="flex min-h-screen flex-col items-start justify-start">
      <BreadCrumpSubMenu data={data} />
      <div className="container py-6 flex overflow-x-auto gap-4">
        <div className="w-1/3 bg-white rounded-lg border">
          {fieldData.indicators && fieldData.indicators.length > 0 && (
            <ClassificationDetailSideBar
              parent_id={fieldData?.indicators[0]?.indicator?.table?.db_id}
              tbl_id={fieldData.indicators[0].indicator.tbl_id}
              ind_id={fieldData?.id}
            />
          )}
        </div>
        <div className="w-2/3">
          <Card className="mx-auto flex self-stretch justify-between">
            <div className="relative overflow-x-auto ">
              <div
                className="text-black mb-2 font-bold"
                style={{ fontSize: 24 }}
              >
                {fieldData?.name}
              </div>
              <span className="text-text-body-medium2 text-secondary-default opacity-50 inline-flex items-center px-2 pb-4">
                <Calendar2LineIcon size={14} color="#333a3f" />
                <p className="px-2">
                  {fieldData?.confirmed_decree_date &&
                    moment(fieldData?.confirmed_decree_date).format(
                      "YYYY-MM-DD"
                    )}
                </p>
              </span>
              <span className=" inline-flex items-center px-2">
                <PriceTag3LineIcon className="w-4 h-4 mr-1" />
                <Badge color="success" className="px-1">
                  {fieldData?.version}
                </Badge>
              </span>
            </div>
            <Tabs
              aria-label="Full width tabs"
              style="fullWidth"
              theme={tabsTheme}
            >
              <TabItem title="Ерөнхий мэдээлэл">
                <ClassificationDetail fieldData={fieldData} />
              </TabItem>
              <TabItem title="Ангилал, кодын мета мэдээлэл">
                <ClassificationCode
                  data={fieldData.classificationCode}
                  name={fieldData?.name}
                />
              </TabItem>
              <TabItem
                title={`Үзүүлэлтийн жагсаалт (${fieldData?.indicators?.length})`}
              >
                <div className="flex flex-col gap-4 self-stretch">
                  {fieldData?.indicators?.map((indicator: any, i: number) => {
                    return (
                      <IndicatorItem
                        key={i}
                        indicator_id={indicator?.indicator?.id}
                        indicator_name={indicator?.indicator?.name}
                        methodology_date={
                          indicator?.indicator?.methodology_date
                        }
                        frequency={indicator?.indicator?.frequency}
                        unit={indicator?.indicator?.unit}
                      />
                    );
                  })}
                </div>
              </TabItem>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClassificationTabList;
