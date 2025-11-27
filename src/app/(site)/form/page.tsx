import BreadCrumpMenu from "@/components/BreadCrumpMenu";

import Loader from "@/components/Loader";
import FilterSidebar from "@/components/form/FilterSidebar";
import FormList from "@/components/form/FormList";
import { getFormByFilter } from "@/services/model/site/FormModel";
import { Suspense } from "react";
type searchParamsProps = {
  query?: string;
  page?: string;
  sector?: string;
  org?: string;
};

const FormPage = async ({
  searchParams,
}: {
  searchParams?: searchParamsProps;
}) => {
  const currentPage = Number(searchParams?.page) || 1;

  const searchText = searchParams?.query || "";
  const sectorText = searchParams?.sector || "";
  const orgText = searchParams?.org || "";
  const siderBarData = await getFormByFilter(searchText, sectorText, orgText);

  return (
    <div className="container m-auto p-6 indicator_name lg:px-8 indicator_name flex min-h-screen flex-col items-start justify-start ">
      <BreadCrumpMenu menu_name="Маягт" id={3} />
      <div className="container">
        <div className=" w-full flex flex-col md:flex-row items-start self-stretch gap-4">
          <FilterSidebar data={siderBarData} />
          <Suspense fallback={<Loader />}>
            <FormList
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

export default FormPage;
