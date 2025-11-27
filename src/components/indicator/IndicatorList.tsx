// import { getIndicatorsModel } from "@/services/model/IndicatorModel";
import { getIndicatorsModel } from "@/services/model/site/IndicatorModel";
import Loader from "../Loader";
import PaginationComp from "../PaginationComp";
import IndicatorItem from "./IndicatorItem";

export default async function IndicatorList({
  currentPage,
  searchText,
  orgId,
  sectorId,
}: {
  currentPage: number;
  searchText: string;
  orgId: string;
  sectorId: string;
}) {
  const take = 15;
  const skip = (currentPage - 1) * take;

  const data = await getIndicatorsModel(+skip, take, currentPage, {
    indicator_name: searchText,
    orgId,
    sectorId,
  });

  if (!data) return <Loader />;
  if (data?.data?.length == 0) return <p>Хайлтын үр дүнд олдсонгүй ...</p>;

  return (
    <div className={"w-full h-full"}>
      <div className="flex items-center gap-2 justify-start pb-6 pt-2">
        Нийт:
        <span className="text-primary-default text-text-title-medium">
          {data?.allresults}
        </span>
      </div>
      <div className="flex flex-col gap-4 self-stretch">
        {data?.data?.map(
          ({ id, name, methodology_date, frequency, unit }: any, i: any) => (
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
      <PaginationComp
        currentPage={currentPage}
        totalPages={data?.allresults}
        perPage={data?.perPage}
        lastPage={data?.lastPage}
      />
    </div>
  );
}
