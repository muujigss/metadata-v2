import BreadCrumpMenu from "@/components/BreadCrumpMenu";
import Loader from "@/components/Loader";
import DatabaseSideBar from "@/components/database/DatabaseSideBar";
import DbList from "@/components/database/DbList";
import { getDatabasesByFilter } from "@/services/model/site/DatabaseModel";
// import { getDatabasesByFilter } from "@/services/model/DatabaseModel";
import { Suspense } from "react";

type searchParamsProps = {
  query?: string;
  page?: string;
  sector?: string;
  org?: string;
  dbtype?: string;
};

const DataSet = async ({
  searchParams,
}: {
  searchParams?: searchParamsProps;
}) => {
  const currentPage = Number(searchParams?.page) || 1;

  const searchText = searchParams?.query || "";
  const sectorText = searchParams?.sector || "";
  const orgText = searchParams?.org || "";
  const dbTypeText = searchParams?.dbtype || "";
  const siderBarData = await getDatabasesByFilter(
    searchText,
    sectorText,
    orgText,
    dbTypeText
  );
  return (
    <div className="container m-auto p-6 lg:px-8 flex min-h-screen flex-col items-start justify-start ">
      <BreadCrumpMenu menu_name="Өгөгдлийн сан" id={1} />
      <div className="container">
        <div className="flex flex-col md:flex-row items-start self-stretch gap-4">
          <DatabaseSideBar data={siderBarData} />
          <Suspense fallback={<Loader />}>
            <DbList
              currentPage={currentPage}
              searchText={searchText}
              orgId={orgText}
              sectorId={sectorText}
              dbType={dbTypeText}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
export default DataSet;
