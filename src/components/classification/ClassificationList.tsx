import { IClassification } from "@/interfaces/IClassification";
// import { getClassificationModel } from "@/services/model/ClassificationModel";
import Loader from "../Loader";
import PaginationComp from "../PaginationComp";
import ClassificationItem from "./ClassificationItem";
import { getClassificationModel } from "@/services/model/site/ClassificationModel";
export default async function ClassificationList({
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

  const data = await getClassificationModel(+skip, take, currentPage, {
    name: searchText,
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
        {data?.data
          ?.sort((a: any, b: any) => a?.id - b?.id)
          ?.map((list: any, i: number) => {
            return (
              <div key={i}>
                <ClassificationItem list={list} />
              </div>
            );
          })}
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
