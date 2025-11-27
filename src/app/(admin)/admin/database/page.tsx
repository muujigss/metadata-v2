import DBList from "@/components/admin/database/List";
import Loader from "@/components/Loader";
import PaginationComp from "@/components/PaginationComp";
import { getDatabaseModel } from "@/services/model/DatabaseModel";
import { Box } from "@mui/material";
import { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";

type searchParamsProps = {
  query?: string;
  page?: string;
  org?: string;
};

const DatabaseAdminPage = async ({
  searchParams,
}: {
  searchParams?: searchParamsProps;
}) => {
  const currentPage = Number(searchParams?.page) || 1;
  const take = 15;
  const skip = (currentPage - 1) * take;
  const orgText = searchParams?.org || "";

  const cookieStore = cookies();
  let userId = cookieStore.get("user_id")?.value;
  let user_level = cookieStore.get("user_level")?.value;
  let orgId = user_level == "1" ? orgText : cookieStore.get("org_id")?.value;

  const data: any = await getDatabaseModel(+skip, take, currentPage, {
    userId: userId,
    orgId: orgText,
  });

  if (!data) return <Loader />;

  return (
    <>
      <Box>
        <Suspense fallback={<Loader />}>
          <DBList
            userId={Number(userId)}
            orgId={Number(orgId)}
            data={data?.data}
            total={data?.allresults}
          />
          {data?.data?.length > 14 && (
            <Box className="flex justify-items-start">
              <PaginationComp
                currentPage={currentPage}
                totalPages={data?.allresults}
                perPage={data?.perPage}
                lastPage={data?.lastPage}
              />
            </Box>
          )}
        </Suspense>
      </Box>
    </>
  );
};

export default DatabaseAdminPage;
