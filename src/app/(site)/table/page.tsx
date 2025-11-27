import BreadCrumpMenu from "@/components/BreadCrumpMenu";
import Loader from "@/components/Loader";
import TList from "@/components/table/TList";
import TableSidebar from "@/components/table/TableSidebar";
import { getTableByFilter } from "@/services/model/site/TableModel";
import { Suspense } from "react";

type searchParamsProps = {
  query?: string;
  page?: string;
  sector?: string;
  org?: string;
};
export default async function Page({
  searchParams,
}: {
  searchParams?: searchParamsProps;
}) {
  const currentPage = Number(searchParams?.page) || 1;

  const searchText = searchParams?.query || "";
  const sectorText = searchParams?.sector || "";
  const orgText = searchParams?.org || "";
  const siderBarData = await getTableByFilter(searchText, sectorText, orgText);

  return (
    <div className="container m-auto p-6 lg:px-8 flex min-h-screen flex-col items-start justify-start ">
      <BreadCrumpMenu menu_name="Хүснэгт" id={2} />
      <div className="container ">
        <div className="flex flex-col md:flex-row items-start self-stretch gap-4">
          <TableSidebar data={siderBarData} />
          <Suspense fallback={<Loader />}>
            <TList
              currentPage={currentPage}
              searchText={searchText}
              orgId={orgText}
              sectorId={sectorText}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
