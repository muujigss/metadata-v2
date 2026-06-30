// import { getDatabaseModel } from "@/services/model/DatabaseModel";
import { getDatabaseModel } from "@/services/model/site/DatabaseModel";
import Loader from "../Loader";
import PaginationComp from "../PaginationComp";
import DatabaseItem from "./DatabaseItem";
import ExcelDownloadButton from "./ExcelDownloadButton";

const DbList = async ({
  currentPage,
  searchText,
  orgId,
  sectorId,
  dbType,
}: {
  currentPage: number;
  searchText: string;
  orgId: string;
  sectorId: string;
  dbType: string;
}) => {
  const take = 15;
  const skip = (currentPage - 1) * take;

  const data = await getDatabaseModel(+skip, take, currentPage, {
    name: searchText,
    orgId,
    sectorId,
    dbType,
  });


  if (!data) return <Loader />;
  if (data?.data?.length == 0) return <p className="text-white">Өгөгдлийн сан байхгүй байна ...</p>;

  return (
    <div className={"w-full h-full"}>
      <div className="flex items-center justify-between pb-6 pt-2">
        {/* Зүүн талд "Нийт" */}
        <div className="flex items-center gap-2 text-white italic">
          Нийт:
          <span className="text-white text-text-title-medium">
            {data?.allresults}
          </span>
        </div>

        {/* Баруун талд "Эксел татах" товч */}
        <ExcelDownloadButton
          searchText={searchText}
          orgId={orgId}
          sectorId={sectorId}
          dbType={dbType}
        />
      </div>
      <div className="flex flex-col gap-4 self-stretch">
        {data?.data?.map((list: any, i: number) => {
          // console.log("data", data);
          return <DatabaseItem list={list} key={i} />;
        })}
      </div>
      {data?.data?.length > 14 && (
        <PaginationComp
          currentPage={currentPage}
          totalPages={data?.allresults}
          perPage={data?.perPage}
          lastPage={data?.lastPage}
        />
      )}
    </div>
  );
};
export default DbList;
