import BreadCrumpMenu from "@/components/BreadCrumpMenu";
import DatabaseSideBar from "@/components/database/DatabaseSideBar";
import DbList from "@/components/database/DbList";
import Loader from "@/components/Loader";
import OrgDetail from "@/components/organization/OrgDetail";
import { getDatabasesByFilter } from "@/services/model/DatabaseModel";
import { getOrganizationById } from "@/services/OrganizationService";
import { Suspense } from "react";

type searchParamsProps = {
  query?: string;
  page?: string;
  sector?: string;
  org?: string;
  dbtype?: string;
};

const OrgIdPage = async ({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams?: searchParamsProps;
}) => {
  const id = { params }.params.id;
  const data = await getOrganizationById({ id });

  const currentPage = Number(searchParams?.page) || 1;

  const searchText = searchParams?.query || "";
  const sectorText = searchParams?.sector || "";
  const orgText = data?.org_id; //searchParams?.org || "";
  const dbTypeText = searchParams?.dbtype || "";
  const siderBarData = await getDatabasesByFilter(
    searchText,
    sectorText,
    orgText,
    dbTypeText
  );
  return (
    <div className="container m-auto p-6 lg:px-8 flex min-h-screen flex-col items-start justify-start">
      {/* <OrgDetail id={id} /> */}
      <BreadCrumpMenu menu_name="Өгөгдлийн сан" id={1} />
      <div className="container py-8">
        <div className="flex flex-row items-start self-stretch gap-4">
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
export default OrgIdPage;
