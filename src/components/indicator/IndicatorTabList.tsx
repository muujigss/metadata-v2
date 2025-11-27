import { IIndicator } from "@/interfaces/IIndicators";
import { TabItem, Tabs } from "flowbite-react";
import ClassificationCode from "../classification/ClassificationCode";
import ClassificationDetail from "../classification/ClassificationDetail";
import { tabsTheme } from "../componentTheme/TabsTheme";
import IndicatorDetail from "./IndicatorDetail";
import ClassificationItem from "../classification/ClassificationItem";

const IndicatorTabList = ({ data }: { data: IIndicator }) => {
  const fieldData: any =
    data.indicators_classifications &&
    data.indicators_classifications.length > 0 &&
    data.indicators_classifications[0];

  const classificationList =
    data?.indicators_classifications?.length > 1 &&
    data?.indicators_classifications?.map((item: any) => {
      return item?.classification;
    });
  return (
    <Tabs aria-label="Full width tabs" style="fullWidth" theme={tabsTheme}>
      <TabItem title="Үзүүлэлтийн мета мэдээлэл">
        <IndicatorDetail data={data} />
      </TabItem>
      {classificationList && (
        <TabItem title={`Ангилалын жагсаалт (${classificationList?.length})`}>
          <div className="flex flex-col gap-4 self-stretch">
            {classificationList?.map((list: any, i: number) => {
              return <ClassificationItem list={list} key={i} />;
            })}
          </div>
        </TabItem>
      )}
      {data.indicators_classifications &&
        data.indicators_classifications.length == 1 && (
          <TabItem title="Ангилалын мэдээлэл">
            <ClassificationDetail fieldData={fieldData?.classification} />;
          </TabItem>
        )}
      {data.indicators_classifications &&
        data.indicators_classifications.length == 1 && (
          <TabItem title="Ангилал, кодын мэдээлэл">
            <ClassificationCode
              data={fieldData?.classification.classificationCode}
              name={fieldData?.classification?.classification_name}
            />
          </TabItem>
        )}
    </Tabs>
  );
};

export default IndicatorTabList;
