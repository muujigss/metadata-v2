import BreadCrumpMenu from "@/components/BreadCrumpMenu";
import IndicatorList from "@/components/indicator/IndicatorList";
import IndicatorSidebar from "@/components/indicator/IndicatorSidebar";
import Loader from "@/components/Loader";
import { getIndicatorByFilter } from "@/services/model/site/IndicatorModel";
// import { getIndicatorByFilter } from "@/services/model/IndicatorModel";

import { Suspense } from "react";

type searchParamsProps = {
  query?: string;
  page?: string;
  sector?: string;
  org?: string;
};

const IndicatorPage = async ({
  searchParams,
}: {
  searchParams?: searchParamsProps;
}) => {
  const currentPage = Number(searchParams?.page) || 1;

  const searchText = searchParams?.query || "";
  const sectorText = searchParams?.sector || "";
  const orgText = searchParams?.org || "";
  const siderBarData = await getIndicatorByFilter(
    searchText,
    sectorText,
    orgText
  );

  return (
    <div className="container m-auto p-6 lg:px-8 flex min-h-screen flex-col items-start justify-start ">
      <BreadCrumpMenu menu_name="Үзүүлэлт" id={4} />
      <div className="container">
        <div className="flex flex-col md:flex-row items-start self-stretch gap-4">
          <IndicatorSidebar data={siderBarData} />
          <Suspense fallback={<Loader />}>
            <IndicatorList
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
};

export default IndicatorPage;
