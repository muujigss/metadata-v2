// import { getDatabaseModel } from "@/services/model/DatabaseModel";
import { getDatabaseModel } from "@/services/model/site/DatabaseModel";
import Loader from "../Loader";
import PaginationComp from "../PaginationComp";
import DatabaseItem from "./DatabaseItem";
import { log } from "console";

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
  if (data?.data?.length == 0) return <p>Өгөгдлийн сан байхгүй байна ...</p>;

  return (
    <div className={"w-full h-full"}>
  <div className="flex items-center justify-between pb-6 pt-2">
  {/* Зүүн талд "Нийт" */}
  <div className="flex items-center gap-2">
    Нийт:
    <span className="text-primary-default text-text-title-medium">
      {data?.allresults}
    </span>
  </div>

  {/* Баруун талд "Эксел татах" товч */}
  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
    Эксел татах
  </button>
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
