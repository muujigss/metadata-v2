import BreadCrumpMenu from "@/components/BreadCrumpMenu";
import Loader from "@/components/Loader";
import ClassificationList from "@/components/classification/ClassificationList";
import ClassificationSidebar from "@/components/classification/ClassificationSideBar";
import { getClassificationByFilter } from "@/services/model/site/ClassificationModel";
// import { getClassificationByFilter } from "@/services/model/ClassificationModel";
import { Suspense } from "react";

type searchParamsProps = {
  query?: string;
  page?: string;
  sector?: string;
  org?: string;
};
const DatabasePage = async ({
  searchParams,
}: {
  searchParams?: searchParamsProps;
}) => {
  const currentPage = Number(searchParams?.page) || 1;

  const searchText = searchParams?.query || "";
  const sectorText = searchParams?.sector || "";
  const orgText = searchParams?.org || "";
  const siderBarData = await getClassificationByFilter(
    searchText,
    sectorText,
    orgText
  );
  return (
    <div className="container m-auto p-6 lg:px-8 flex min-h-screen flex-col items-start justify-start">
      <BreadCrumpMenu menu_name="Ангилал, код" id={5} />
      <div className="container ">
        <div className="flex flex-col md:flex-row items-start self-stretch gap-4">
          <ClassificationSidebar data={siderBarData} />
          <Suspense fallback={<Loader />}>
            <ClassificationList
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
export default DatabasePage;
