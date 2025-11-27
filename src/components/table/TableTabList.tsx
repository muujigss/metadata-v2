import TableDetail from "./TableDetail";
import { ITable } from "@/interfaces/ITable";
import { TabItem, Tabs } from "flowbite-react";
import { IIndicator } from "@/interfaces/IIndicators";
import IndicatorItem from "../indicator/IndicatorItem";
import { tabsTheme } from "../componentTheme/TabsTheme";
import ClassificationItem from "../classification/ClassificationItem";

const TableTabList = ({ data }: { data: ITable }) => {
  const { indicators }: any = data;

  const classificationsMap = new Map();

  indicators?.forEach((ind: any) => {
    ind.indicators_classifications?.forEach((cls: any) => {
      const classification_id = cls.classification_id;
      if (classification_id && !classificationsMap.has(classification_id)) {
        classificationsMap.set(classification_id, cls.classification);
      }
    });
  });
  
  const classifications = Array.from(classificationsMap.entries()).map(
    ([id, classification]) => ({ id, ...classification })
  );

  const indicatorsMap = indicators.filter((e: any) => e.is_active);
  const classificationMap = classifications.filter((e: any) => e.is_active);

  return (
    <Tabs aria-label="Full width tabs" style="fullWidth" theme={tabsTheme}>
      <TabItem title="Хүснэгтийн мета мэдээлэл">
        <TableDetail data={data} />
      </TabItem>
      <TabItem title={`Үзүүлэлтийн жагсаалт (${indicatorsMap?.length})`}>
        <div className="flex flex-col gap-4 self-stretch">
          {indicatorsMap?.map(
            (
              { id, name, methodology_date, frequency, unit }: IIndicator,
              i: number
            ) => (
              <IndicatorItem
                key={i}
                indicator_id={id}
                indicator_name={name}
                methodology_date={methodology_date}
                frequency={frequency}
                unit={unit}
              />
            )
          )}
        </div>
      </TabItem>
      {classificationMap?.length > 0 && (
        <TabItem title={`Ангилалын жагсаалт (${classificationMap?.length})`}>
          <div className="flex flex-col gap-4 self-stretch">
            {classificationMap?.map((list: any, i: any) => (
              <ClassificationItem list={list} key={i} />
            ))}
          </div>
        </TabItem>
      )}
    </Tabs>
  );
};

export default TableTabList;
